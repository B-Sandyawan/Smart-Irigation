require('dotenv').config();

const mqtt = require('mqtt');
const { createClient } = require('@supabase/supabase-js');

const { calculatePlantScore } = require('./scoring');

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

function validateConfig() {
  const required = [
    ['SUPABASE_URL atau VITE_SUPABASE_URL', config.supabaseUrl],
    ['SUPABASE_SERVICE_ROLE_KEY (disarankan)', process.env.SUPABASE_SERVICE_ROLE_KEY],
    ['MQTT_BROKER_URL', config.mqttBrokerUrl],
    ['MQTT_TOPIC', config.mqttTopic],
  ];

  const missing = required.filter(([, value]) => !value).map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Konfigurasi .env belum lengkap: ${missing.join(', ')}`);
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

async function bootstrap() {
  validateConfig();

  const supabase = createClient(config.supabaseUrl, config.supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const mqttClient = mqtt.connect(config.mqttBrokerUrl, {
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

      await insertSensorData(supabase, row);

      // Update log terminal untuk menampilkan skor 
      console.log(
        `[BRIDGE] Data tersimpan dari topic ${topic}: suhu=${row.suhu}, kelembaban=${row.kelembaban}, soil=${row.soil}, tds=${row.tds}, ldr=${row.ldr} | SKOR: ${row.plant_score} (${row.health_status})`
      );
    } catch (error) {
      console.error(`[BRIDGE] Gagal memproses message dari topic ${topic}:`, error.message);
    }
  });

  const shutdown = (signal) => {
    console.log(`[SYSTEM] Menerima ${signal}. Menutup koneksi MQTT...`);

    mqttClient.end(true, () => {
      console.log('[SYSTEM] Bridge berhenti dengan aman.');
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