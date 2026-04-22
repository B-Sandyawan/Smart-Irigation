require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const { createClient } = require('@supabase/supabase-js');

const { calculatePlantScore } = require('./scoring');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

const config = {
  supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  
  supabaseKey:
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY,
  supabaseTable: process.env.SUPABASE_TABLE || 'sensor_data',
  mqttBrokerUrl: process.env.MQTT_BROKER_URL,
  mqttUsername: process.env.MQTT_USERNAME,
  mqttPassword: process.env.MQTT_PASSWORD,
  mqttTopic: process.env.MQTT_TOPIC || 'farm/sensors/esp1_data',
  mqttClientId:
    process.env.MQTT_CLIENT_ID || `smart-irrigation-bridge-${Math.random().toString(16).slice(2, 10)}`,
  mqttQos: Number(process.env.MQTT_QOS || 1),
  reconnectPeriodMs: Number(process.env.MQTT_RECONNECT_PERIOD_MS || 5000),
  connectTimeoutMs: Number(process.env.MQTT_CONNECT_TIMEOUT_MS || 30000),
  keepAliveSeconds: Number(process.env.MQTT_KEEPALIVE_SECONDS || 60),
};

const isSupabaseConfigured = Boolean(config.supabaseUrl && config.supabaseKey);

let mqttClient;

function validateConfig() {
  const required = [
    ['MQTT_BROKER_URL', config.mqttBrokerUrl],
    ['MQTT_TOPIC', config.mqttTopic],
  ];

  const missing = required.filter(([, value]) => !value).map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Konfigurasi .env belum lengkap: ${missing.join(', ')}`);
  }

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

async function insertSensorData(supabase, row) {
  const { error } = await supabase.from(config.supabaseTable).insert([row]);

  if (error) {
    throw new Error(`Gagal insert ke Supabase: ${error.message}`);
  }
}

function publishControlCommand(topic, value) {
  return new Promise((resolve, reject) => {
    if (!mqttClient) {
      reject(new Error('MQTT client belum terhubung'));
      return;
    }

    mqttClient.publish(
      topic,
      String(value),
      { qos: config.mqttQos },
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

    // Pakai topic yang sudah dibaca firmware ESP lama.
    await publishControlCommand('farm/sensors/soil', value === 1 ? 0 : 100);

    if (value === 1) {
      setTimeout(() => {
        publishControlCommand('farm/sensors/soil', 100).catch((err) =>
          console.error('[AUTO-OFF] Gagal matikan pompa:', err.message)
        );
      }, duration * 1000);
    }

    return res.json({
      success: true,
      message: value === 1 ? `Pompa NYALA (${duration}s)` : 'Pompa OFF',
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

    await publishControlCommand('farm/sensors/suhu', value === 1 ? 40 : 20);

    return res.json({
      success: true,
      message: value === 1 ? 'Servo BUKA' : 'Servo TUTUP',
      actuator: 'servo',
      value,
    });
  } catch (error) {
    console.error('[SERVO] Error:', error.message);
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

  const supabase = isSupabaseConfigured
    ? createClient(config.supabaseUrl, config.supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
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

    try {
      const row = parseSensorPayload(rawPayload);

      // Proses hitung skor dan status
      const { score, status } = calculatePlantScore(row, 'KANGKUNG');
      
      row.plant_score = score;
      row.health_status = status;

      if (supabase) {
        await insertSensorData(supabase, row);
        console.log(
          `[BRIDGE] Data tersimpan dari topic ${topic}: suhu=${row.suhu}, kelembaban=${row.kelembaban}, soil=${row.soil}, tds=${row.tds}, ldr=${row.ldr} | SKOR: ${row.plant_score} (${row.health_status})`
        );
      } else {
        console.log(
          `[BRIDGE] Data sensor diterima (tanpa simpan DB): suhu=${row.suhu}, kelembaban=${row.kelembaban}, soil=${row.soil}, tds=${row.tds}, ldr=${row.ldr} | SKOR: ${row.plant_score} (${row.health_status})`
        );
      }
    } catch (error) {
      console.error(`[BRIDGE] Gagal memproses message dari topic ${topic}:`, error.message);
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