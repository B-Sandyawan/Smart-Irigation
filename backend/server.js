require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const { calculatePlantScore } = require('./scoring');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: 'Smart Irrigation API is running',
    endpoints: {
      status: '/api/status',
      health: '/api/health',
      plantStatus: '/api/plant-status',
      wateringHistory: '/api/watering-history'
    }
  });
});

const PORT = process.env.PORT || 3000;

const config = {
  supabaseUrl: (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL)?.trim(),

  supabaseKey:
    (process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY)?.trim(),
  supabaseTable: process.env.SUPABASE_TABLE || 'sensor_data',
  mqttBrokerUrl: process.env.MQTT_BROKER_URL || 'mqtts://r7662111.ala.asia-southeast1.emqxsl.com:8883',
  mqttUsername: process.env.MQTT_USERNAME || 'esp_farm',
  mqttPassword: process.env.MQTT_PASSWORD || '123Sija2!',
  mqttTopic: process.env.MQTT_TOPIC || 'farm/sensors/#',
  mqttClientId:
    process.env.MQTT_CLIENT_ID || `smart-irrigation-bridge-${Math.random().toString(16).slice(2, 10)}`,
  mqttQos: Number(process.env.MQTT_QOS || 1),
  reconnectPeriodMs: Number(process.env.MQTT_RECONNECT_PERIOD_MS || 5000),
  connectTimeoutMs: Number(process.env.MQTT_CONNECT_TIMEOUT_MS || 30000),
  keepAliveSeconds: Number(process.env.MQTT_KEEPALIVE_SECONDS || 60),
};

const isSupabaseConfigured = Boolean(config.supabaseUrl && config.supabaseKey);

let mqttClient;
let supabase;

function validateConfig() {
  console.log('[DEBUG] Supabase URL:', config.supabaseUrl ? 'OK' : 'MISSING');
  console.log('[DEBUG] Supabase Key:', config.supabaseKey ? `OK (${config.supabaseKey.length} chars)` : 'MISSING');
  console.log('[DEBUG] SERVICE_ROLE_KEY env:', process.env.SUPABASE_SERVICE_ROLE_KEY ? `OK (${process.env.SUPABASE_SERVICE_ROLE_KEY.length} chars)` : 'MISSING');
  
  if (!isSupabaseConfigured) {
    console.warn(
      '[PERINGATAN] Supabase belum dikonfigurasi. Penyimpanan sensor ke database dinonaktifkan, kontrol aktuator tetap aktif.'
    );
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && config.supabaseKey) {
    console.warn(
      '[PERINGATAN] Bridge berjalan tanpa SUPABASE_SERVICE_ROLE_KEY. Untuk produksi, gunakan SERVICE ROLE KEY.'
    );
  }
}

function parseSensorPayload(rawPayload) {
  let parsed;

  try {
    parsed = JSON.parse(rawPayload);
  } catch (error) {
    throw new Error(`Payload bukan JSON valid: ${error.message}`);
  }

  const suhu = Number(parsed.suhu);
  const kelembaban = Number(parsed.kelembaban ?? parsed.kelembapan);
  const soil = Number(parsed.soil);
  const tds = Number(parsed.tds);
  const ldr = Number(parsed.ldr);

  const hasInvalidValue = [suhu, kelembaban, soil, tds, ldr].some((value) => Number.isNaN(value));
  if (hasInvalidValue) {
    throw new Error('Nilai sensor tidak lengkap atau bukan angka.');
  }

  return {
    suhu,
    kelembaban,
    soil,
    tds,
    ldr,
  };
}

let tempSensorData = {
  suhu: 25,
  kelembaban: 60,
  soil: 0,
  tds: 0,
  ldr: 0
};
let saveSensorTimeout = null;

async function processAccumulatedSensors(supabase) {
  const row = { ...tempSensorData };
  
  try {
    const result = calculatePlantScore(row);
    row.plant_score = result.score;
    row.health_status = result.health_status;
    row.created_at = new Date().toISOString(); // Tambahkan created_at agar frontend tidak error Date

    if (supabase) {
      // 1. Kirim ke Web dulu via Supabase Broadcast (Real-time seketika)
      supabase.channel('realtime_sensor').send({
        type: 'broadcast',
        event: 'sensor_update',
        payload: row
      });

      // 2. Terus insert DB
      await insertSensorData(supabase, row);
      console.log(
        `[BRIDGE] Data tersimpan: suhu=${row.suhu}, kelembaban=${row.kelembaban}, soil=${row.soil}, tds=${row.tds}, ldr=${row.ldr} | SKOR: ${row.plant_score} (${row.health_status})`
      );
    } else {
      console.log(
        `[BRIDGE] Data sensor diterima (tanpa simpan DB): suhu=${row.suhu}, kelembaban=${row.kelembaban}, soil=${row.soil}, tds=${row.tds}, ldr=${row.ldr} | SKOR: ${row.plant_score} (${row.health_status})`
      );
    }
  } catch (error) {
    console.error(`[BRIDGE] Gagal memproses data sensor:`, error.message);
  }
}


async function insertSensorData(supabase, row) {
  const { error } = await supabase.from(config.supabaseTable).insert([row]);

  if (error) {
    console.log('[DEBUG] Insert Error Details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      status: error.status
    });
    throw new Error(`Gagal insert ke Supabase: ${error.message}`);
  }
}

function publishControlCommand(topic, value, retain = false) {
  return new Promise((resolve, reject) => {
    if (!mqttClient) {
      reject(new Error('MQTT client belum terhubung'));
      return;
    }

    mqttClient.publish(
      topic,
      String(value),
      { qos: config.mqttQos, retain },
      (error) => {
        if (error) {
          console.error(`[PUBLISH] Gagal publish ke ${topic}:`, error.message);
          reject(error);
        } else {
          console.log(`[PUBLISH] Sukses publish ke ${topic}: ${value}`);
          resolve({ success: true, topic, value });
        }
      }
    );
  });
}

app.post('/api/actuators/pompa', async (req, res) => {
  try {
    const { value, duration = 10 } = req.body;

    if (value !== 0 && value !== 1) {
      return res
        .status(400)
        .json({ error: 'Pompa: value harus 0 (OFF) atau 1 (ON)' });
    }

    if (value === 1) {
      // Publish langsung command ON ke ESP tanpa retain
      await publishControlCommand('farm/command/pompa', 'ON', false);

      // Catat ke riwayat penyiraman (Krisna)
      if (supabase) {
        supabase.from('watering_history').insert([{
          duration_seconds: duration,
          triggered_by: 'manual',
        }]).then(({ error }) => {
          if (error) console.error('[RIWAYAT] Gagal simpan riwayat penyiraman:', error.message);
          else console.log(`[RIWAYAT] Penyiraman tercatat (${duration}s)`);
        });
      }
    }

    return res.json({
      success: true,
      message: value === 1 ? `Pompa NYALA (${duration}s)` : 'Pompa diabaikan (karena ESP auto OFF timer)',
      actuator: 'pompa',
      value,
    });
  } catch (error) {
    console.error('[POMPA] Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/actuators/lampu', async (req, res) => {
  try {
    const { value } = req.body;

    if (value !== 0 && value !== 1) {
      return res
        .status(400)
        .json({ error: 'Lampu: value harus 0 (OFF) atau 1 (ON)' });
    }

    await publishControlCommand('farm/sensors/ldr', value === 1 ? 4000 : 1000);

    return res.json({
      success: true,
      message: value === 1 ? 'Lampu NYALA' : 'Lampu OFF',
      actuator: 'lampu',
      value,
    });
  } catch (error) {
    console.error('[LAMPU] Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/actuators/servo', async (req, res) => {
  try {
    const { value } = req.body;

    if (value !== 0 && value !== 1) {
      return res
        .status(400)
        .json({ error: 'Servo: value harus 0 (TUTUP) atau 1 (BUKA)' });
    }

    if (value === 1) {
      // Publish langsung command ON ke ESP tanpa retain
      await publishControlCommand('farm/command/servo', 'ON', false);
    }

    return res.json({
      success: true,
      message: value === 1 ? 'Servo BUKA - Ventilasi aktif (30 detik)' : 'Servo diabaikan (karena ESP auto tutup)',
      actuator: 'servo',
      value,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[SERVO] Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/plant-status — Data sensor terbaru + skor pantau tanaman (Krisna)
app.get('/api/plant-status', async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: 'Supabase belum dikonfigurasi.' });
  }

  try {
    const { data, error } = await supabase
      .from('sensor_data')
      .select('suhu, kelembaban, soil, tds, ldr, plant_score, health_status, created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    // Hitung ulang detail skor agar frontend dapat breakdown per-parameter
    const scoring = calculatePlantScore(data);

    return res.json({
      ...data,
      plant_score: scoring.score,
      health_status: scoring.health_status,
      detail: scoring.detail,
    });
  } catch (error) {
    console.error('[PLANT-STATUS] Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/watering-history — Riwayat penyiraman (Krisna)
app.get('/api/watering-history', async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: 'Supabase belum dikonfigurasi.' });
  }

  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const deviceId = req.query.device_id || 'esp1';

    const { data, error } = await supabase
      .from('watering_history')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return res.json(data);
  } catch (error) {
    console.error('[WATERING-HISTORY] Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/status', (req, res) => {
  return res.json({
    mqtt: {
      connected: mqttClient ? mqttClient.connected : false,
      broker: config.mqttBrokerUrl,
      clientId: config.mqttClientId,
    },
    server: {
      status: 'online',
      port: PORT,
      timestamp: new Date().toISOString(),
    },
  });
});

app.get('/api/health', (req, res) => {
  return res.json({ status: 'OK' });
});

async function bootstrap() {
  validateConfig();

  supabase = isSupabaseConfigured
    ? createClient(config.supabaseUrl, config.supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        fetch: fetch,
      },
      realtime: {
        transport: WebSocket,
      }
    })
    : null;

  mqttClient = mqtt.connect(config.mqttBrokerUrl, {
    username: config.mqttUsername,
    password: config.mqttPassword,
    clientId: config.mqttClientId,
    reconnectPeriod: config.reconnectPeriodMs,
    connectTimeout: config.connectTimeoutMs,
    keepalive: config.keepAliveSeconds,
    clean: true,
  });

  mqttClient.on('connect', () => {
    console.log(`[MQTT] Terhubung ke broker sebagai ${config.mqttClientId}`);

    mqttClient.subscribe(config.mqttTopic, { qos: config.mqttQos }, (error) => {
      if (error) {
        console.error(`[MQTT] Gagal subscribe ke topic ${config.mqttTopic}:`, error.message);
        return;
      }

      console.log(`[MQTT] Subscribe sukses ke topic: ${config.mqttTopic}`);
    });
  });

  mqttClient.on('reconnect', () => {
    console.warn('[MQTT] Koneksi terputus. Mencoba reconnect otomatis...');
  });

  mqttClient.on('offline', () => {
    console.warn('[MQTT] Client offline. Menunggu jaringan pulih...');
  });

  mqttClient.on('close', () => {
    console.warn('[MQTT] Koneksi ditutup.');
  });

  mqttClient.on('error', (error) => {

    console.error('[MQTT] Error client:', error.message);
  });

  mqttClient.on('message', async (topic, messageBuffer) => {
    const rawPayload = messageBuffer.toString('utf-8');

    // Parse single payload JSON (legacy mode if topic is the main topic)
    if (topic === 'farm/sensors/esp1_data') {
      try {
        const row = parseSensorPayload(rawPayload);
        Object.assign(tempSensorData, row);
        if (saveSensorTimeout) clearTimeout(saveSensorTimeout);
        await processAccumulatedSensors(supabase);
      } catch (error) {
        console.error(`[BRIDGE] Gagal memproses JSON dari ${topic}:`, error.message);
      }
      return;
    }

    // Process individual topics support
    const val = Number(rawPayload);
    let updated = true;
    if (topic.endsWith('/suhu')) tempSensorData.suhu = val;
    else if (topic.endsWith('/kelembaban')) tempSensorData.kelembaban = val;
    else if (topic.endsWith('/soil')) tempSensorData.soil = val;
    else if (topic.endsWith('/tds')) tempSensorData.tds = val;
    else if (topic.endsWith('/ldr')) tempSensorData.ldr = val;
    else updated = false;

    if (updated) {
      if (saveSensorTimeout) clearTimeout(saveSensorTimeout);
      saveSensorTimeout = setTimeout(async () => {
        await processAccumulatedSensors(supabase);
      }, 500); // Tunggu setengah detik untuk data sensor lainnya
    }
  });

  const server = app.listen(PORT, () => {
    console.log(`[SERVER] Express berjalan di http://localhost:${PORT}`);
    console.log('[SERVER] Endpoints:');
    console.log('  POST /api/actuators/pompa - Kontrol pompa');
    console.log('  POST /api/actuators/lampu - Kontrol lampu');
    console.log('  POST /api/actuators/servo - Kontrol servo');
    console.log('  GET  /api/status - Status server & MQTT');
    console.log('  GET  /api/health - Health check');
  });

  const shutdown = (signal) => {
    console.log(`[SYSTEM] Menerima ${signal}. Menutup koneksi...`);

    mqttClient.end(true, () => {
      console.log('[SYSTEM] MQTT disconnected.');
    });

    server.close(() => {
      console.log('[SYSTEM] Server closed.');
      process.exit(0);
    });

    setTimeout(() => process.exit(1), 5000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason) => {
    console.error('[SYSTEM] Unhandled rejection:', reason);
  });
  process.on('uncaughtException', (error) => {
    console.error('[SYSTEM] Uncaught exception:', error);
  });
}

bootstrap().catch((error) => {
  console.error('[FATAL] Bridge gagal start:', error.message);
  process.exit(1);
});