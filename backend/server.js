const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env'), quiet: true });
dotenv.config({ quiet: true });

const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const { calculatePlantScore } = require('./scoring');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = Number(process.env.PORT || 3000);
const SENSOR_TOPICS = {
  'farm/sensors/suhu': 'suhu',
  'farm/sensors/kelembaban': 'kelembaban',
  'farm/sensors/kelembapan': 'kelembaban',
  'farm/sensors/soil': 'soil',
  'farm/sensors/tds': 'tds',
  'farm/sensors/ldr': 'ldr',
};
const REQUIRED_SENSOR_KEYS = ['suhu', 'kelembaban', 'soil', 'tds', 'ldr'];

function env(name, fallback = '') {
  const value = process.env[name];
  if (value === undefined || value === null || String(value).trim() === '') return fallback;
  return String(value).trim().replace(/^["']|["']$/g, '');
}

const config = {
  supabaseUrl: env('SUPABASE_URL', env('VITE_SUPABASE_URL')),
  supabaseKey: env(
    'SUPABASE_SECRET_KEY',
    env(
      'SUPABASE_SERVICE_ROLE_KEY',
      env('SUPABASE_PUBLISHABLE_KEY', env('SUPABASE_ANON_KEY', env('VITE_SUPABASE_PUBLISHABLE_KEY', env('VITE_SUPABASE_ANON_KEY'))))
    )
  ),
  supabaseTable: env('SUPABASE_TABLE', 'sensor_data'),
  mqttBrokerUrl: env('MQTT_BROKER_URL', 'mqtts://r7662111.ala.asia-southeast1.emqxsl.com:8883'),
  mqttUsername: env('MQTT_USERNAME', 'esp_farm'),
  mqttPassword: env('MQTT_PASSWORD', '123Sija2!'),
  mqttTopic: env('MQTT_TOPIC', 'farm/sensors/#'),
  mqttClientId: env('MQTT_CLIENT_ID', `smart-irrigation-web-${Math.random().toString(16).slice(2, 10)}`),
  mqttQos: Number(env('MQTT_QOS', '1')),
  reconnectPeriodMs: Number(env('MQTT_RECONNECT_PERIOD_MS', '5000')),
  connectTimeoutMs: Number(env('MQTT_CONNECT_TIMEOUT_MS', '30000')),
  keepAliveSeconds: Number(env('MQTT_KEEPALIVE_SECONDS', '60')),
};

const isSupabaseConfigured = Boolean(config.supabaseUrl && config.supabaseKey);
const supabaseKeyKind = config.supabaseKey.startsWith('sb_secret_')
  ? 'secret'
  : config.supabaseKey.startsWith('sb_publishable_')
    ? 'publishable'
    : env('SUPABASE_SERVICE_ROLE_KEY')
      ? 'service_role_jwt'
      : env('SUPABASE_ANON_KEY') || env('VITE_SUPABASE_ANON_KEY')
        ? 'anon_jwt'
        : 'unknown';
const hasPrivilegedSupabaseKey = supabaseKeyKind === 'secret' || supabaseKeyKind === 'service_role_jwt';

let mqttClient;
let supabase;
let sensorRealtimeChannel;
let wsServer;

const sensorState = {
  latest: {},
  receivedKeys: new Set(),
  flushTimer: null,
};

const runtimeStatus = {
  mqttConnected: false,
  mqttSubscribed: false,
  mqttLastMessageAt: null,
  mqttLastTopic: null,
  sensorLastUpdateAt: null,
  dbLastInsertAt: null,
  dbLastError: null,
  supabaseKeyValid: null,
  broadcastLastAt: null,
  broadcastLastError: null,
};

function logConfig() {
  console.log('[CONFIG] Backend .env:', path.join(__dirname, '.env'));
  console.log(`[CONFIG] PORT=${PORT}`);
  console.log(`[CONFIG] MQTT broker=${config.mqttBrokerUrl}`);
  console.log(`[CONFIG] MQTT topic=${config.mqttTopic}`);
  console.log(`[CONFIG] MQTT clientId=${config.mqttClientId}`);
  console.log(`[CONFIG] Supabase URL=${config.supabaseUrl ? 'OK' : 'MISSING'}`);
  console.log(`[CONFIG] Supabase key=${config.supabaseKey ? `OK (${config.supabaseKey.length} chars, ${supabaseKeyKind})` : 'MISSING'}`);

  if (!isSupabaseConfigured) {
    console.warn('[CONFIG] Supabase belum lengkap. Data tetap masuk web realtime, tapi insert DB dinonaktifkan.');
  } else if (!hasPrivilegedSupabaseKey) {
    console.warn('[CONFIG] Backend tidak memakai SUPABASE_SECRET_KEY / SUPABASE_SERVICE_ROLE_KEY. Insert DB bisa gagal kalau RLS menolak publishable/anon key.');
  }
}

function sanitizeNumber(value, digits = 1) {
  return Number(Number(value).toFixed(digits));
}

function buildSensorRow(source = sensorState.latest) {
  return {
    suhu: sanitizeNumber(source.suhu),
    kelembaban: sanitizeNumber(source.kelembaban),
    soil: Math.round(Number(source.soil)),
    tds: sanitizeNumber(source.tds),
    ldr: Math.round(Number(source.ldr)),
  };
}

function parseJsonSensorPayload(rawPayload) {
  let parsed;

  try {
    parsed = JSON.parse(rawPayload);
  } catch (error) {
    throw new Error(`Payload JSON tidak valid: ${error.message}`);
  }

  const row = {
    suhu: Number(parsed.suhu),
    kelembaban: Number(parsed.kelembaban ?? parsed.kelembapan),
    soil: Number(parsed.soil ?? parsed.soilPct),
    tds: Number(parsed.tds ?? parsed.tdsPpm),
    ldr: Number(parsed.ldr ?? parsed.ldrRaw),
  };

  const invalidKeys = REQUIRED_SENSOR_KEYS.filter((key) => !Number.isFinite(row[key]));
  if (invalidKeys.length > 0) {
    throw new Error(`Field sensor tidak valid: ${invalidKeys.join(', ')}`);
  }

  return row;
}

function enrichSensorRow(row) {
  const scoring = calculatePlantScore(row);
  return {
    ...row,
    plant_score: scoring.score,
    health_status: scoring.health_status,
    device_id: 'esp1',
    created_at: new Date().toISOString(),
  };
}

function getConnectedWebClients() {
  if (!wsServer) return 0;
  return [...wsServer.clients].filter((client) => client.readyState === WebSocket.OPEN).length;
}

async function broadcastSensorToWeb(row) {
  const payload = {
    type: 'sensor_update',
    payload: row,
  };
  const serialized = JSON.stringify(payload);
  let wsCount = 0;

  if (wsServer) {
    wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(serialized);
        wsCount += 1;
      }
    });
  }

  try {
    if (sensorRealtimeChannel) {
      const status = await sensorRealtimeChannel.send({
        type: 'broadcast',
        event: 'sensor_update',
        payload: row,
      });
      if (status !== 'ok') {
        runtimeStatus.broadcastLastError = `Supabase broadcast status: ${status}`;
      } else {
        runtimeStatus.broadcastLastError = null;
      }
      console.log(`[REALTIME] WebSocket clients=${wsCount}, Supabase broadcast=${status}`);
    } else {
      console.log(`[REALTIME] WebSocket clients=${wsCount}, Supabase broadcast=disabled`);
      runtimeStatus.broadcastLastError = null;
    }
    runtimeStatus.broadcastLastAt = row.created_at;
  } catch (error) {
    runtimeStatus.broadcastLastError = error.message;
    console.error(`[REALTIME] Broadcast Supabase gagal, WebSocket tetap dikirim ke ${wsCount} client: ${error.message}`);
  }
}

async function insertSensorData(row) {
  if (!supabase) {
    console.warn('[DB] Supabase belum configured. Insert dilewati.');
    return;
  }

  if (runtimeStatus.supabaseKeyValid === false) {
    runtimeStatus.dbLastError = 'Supabase API key invalid. Regenerate anon/service_role key di Supabase lalu update .env.';
    console.error(`[DB] Insert dilewati: ${runtimeStatus.dbLastError}`);
    return;
  }

  const { error } = await supabase.from(config.supabaseTable).insert([row]);

  if (error) {
    runtimeStatus.dbLastError = error.message;
    if (error.message === 'Invalid API key') runtimeStatus.supabaseKeyValid = false;
    console.error('[DB] Insert Supabase gagal:', {
      table: config.supabaseTable,
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    throw new Error(error.message);
  }

  runtimeStatus.dbLastInsertAt = row.created_at;
  runtimeStatus.dbLastError = null;
  console.log(
    `[DB] Insert OK ${config.supabaseTable}: suhu=${row.suhu}, kelembaban=${row.kelembaban}, soil=${row.soil}, tds=${row.tds}, ldr=${row.ldr}, skor=${row.plant_score} (${row.health_status})`
  );
}

async function processSensorSnapshot(reason) {
  const missingKeys = REQUIRED_SENSOR_KEYS.filter((key) => !sensorState.receivedKeys.has(key));
  if (missingKeys.length > 0) {
    console.warn(`[SENSOR] Belum insert. Menunggu topic: ${missingKeys.join(', ')}`);
    return;
  }

  const row = enrichSensorRow(buildSensorRow());
  runtimeStatus.sensorLastUpdateAt = row.created_at;

  console.log(`[SENSOR] Snapshot lengkap dari MQTT (${reason}). Kirim ke web dulu, lalu insert DB.`);
  await broadcastSensorToWeb(row);
  await insertSensorData(row);
}

function scheduleSensorFlush(topic) {
  if (sensorState.flushTimer) clearTimeout(sensorState.flushTimer);
  sensorState.flushTimer = setTimeout(() => {
    sensorState.flushTimer = null;
    processSensorSnapshot(`batch topic terakhir: ${topic}`).catch((error) => {
      console.error(`[SENSOR] Gagal proses snapshot: ${error.message}`);
    });
  }, 250);
}

function handleSensorMessage(topic, rawPayload) {
  runtimeStatus.mqttLastMessageAt = new Date().toISOString();
  runtimeStatus.mqttLastTopic = topic;

  if (topic === 'farm/sensors/esp1_data') {
    const row = parseJsonSensorPayload(rawPayload);
    Object.assign(sensorState.latest, row);
    REQUIRED_SENSOR_KEYS.forEach((key) => sensorState.receivedKeys.add(key));
    console.log(`[MQTT] JSON sensor diterima dari ${topic}: ${rawPayload}`);
    return processSensorSnapshot('payload JSON esp1_data');
  }

  const key = SENSOR_TOPICS[topic];
  if (!key) {
    console.warn(`[MQTT] Topic diabaikan: ${topic} payload="${rawPayload}"`);
    return Promise.resolve();
  }

  const value = Number(rawPayload);
  if (!Number.isFinite(value)) {
    console.warn(`[MQTT] Payload bukan angka. topic=${topic}, payload="${rawPayload}"`);
    return Promise.resolve();
  }

  sensorState.latest[key] = value;
  sensorState.receivedKeys.add(key);
  console.log(`[MQTT] Pesan sensor: ${topic} -> ${key}=${value}`);
  scheduleSensorFlush(topic);
  return Promise.resolve();
}

function publishControlCommand(topic, value, retain = false) {
  return new Promise((resolve, reject) => {
    if (!mqttClient || !mqttClient.connected) {
      reject(new Error('MQTT belum connected. Cek /api/status atau log [MQTT].'));
      return;
    }

    mqttClient.publish(topic, String(value), { qos: config.mqttQos, retain }, (error) => {
      if (error) {
        console.error(`[PUBLISH] Gagal publish ${topic}: ${error.message}`);
        reject(error);
        return;
      }

      console.log(`[PUBLISH] OK ${topic}: ${value}`);
      resolve({ success: true, topic, value });
    });
  });
}

app.get('/', (req, res) => {
  res.json({
    message: 'Smart Irrigation API is running',
    endpoints: {
      status: '/api/status',
      health: '/api/health',
      plantStatus: '/api/plant-status',
      wateringHistory: '/api/watering-history',
      realtime: 'ws://localhost:3000/realtime',
    },
  });
});

app.post('/api/actuators/pompa', async (req, res) => {
  try {
    const { value, duration = 10 } = req.body;

    if (value !== 0 && value !== 1) {
      return res.status(400).json({ error: 'Pompa: value harus 0 (OFF) atau 1 (ON)' });
    }

    if (value === 1) {
      await publishControlCommand('farm/command/pompa', 'ON', false);

      if (supabase) {
        supabase
          .from('watering_history')
          .insert([{ duration_seconds: duration, triggered_by: 'manual', device_id: 'esp1' }])
          .then(({ error }) => {
            if (error) console.error('[RIWAYAT] Gagal simpan watering_history:', error.message);
            else console.log(`[RIWAYAT] Penyiraman tercatat (${duration}s)`);
          });
      }
    }

    return res.json({
      success: true,
      message: value === 1 ? `Pompa ON (${duration}s)` : 'Pompa OFF diabaikan karena ESP auto OFF timer',
      actuator: 'pompa',
      value,
    });
  } catch (error) {
    console.error(`[POMPA] ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/actuators/lampu', async (req, res) => {
  return res.status(501).json({
    error: 'ESP1 saat ini tidak punya topic command lampu. Tambahkan topic command lampu di firmware jika ingin kontrol lampu.',
  });
});

app.post('/api/actuators/servo', async (req, res) => {
  try {
    const { value } = req.body;

    if (value !== 0 && value !== 1) {
      return res.status(400).json({ error: 'Servo: value harus 0 (TUTUP) atau 1 (BUKA)' });
    }

    if (value === 1) {
      await publishControlCommand('farm/command/servo', 'ON', false);
    }

    return res.json({
      success: true,
      message: value === 1 ? 'Servo BUKA - ventilasi aktif 30 detik' : 'Servo OFF diabaikan karena ESP auto tutup',
      actuator: 'servo',
      value,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`[SERVO] ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/plant-status', async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: 'Supabase belum dikonfigurasi.' });
  }

  try {
    const { data, error } = await supabase
      .from(config.supabaseTable)
      .select('suhu, kelembaban, soil, tds, ldr, plant_score, health_status, created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    const scoring = calculatePlantScore(data);
    return res.json({
      ...data,
      plant_score: scoring.score,
      health_status: scoring.health_status,
      detail: scoring.detail,
    });
  } catch (error) {
    console.error(`[PLANT-STATUS] ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

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
    console.error(`[WATERING-HISTORY] ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/status', (req, res) => {
  const now = Date.now();
  const lastMessageMs = runtimeStatus.mqttLastMessageAt
    ? now - new Date(runtimeStatus.mqttLastMessageAt).getTime()
    : null;

  return res.json({
    mqtt: {
      connected: Boolean(mqttClient && mqttClient.connected),
      subscribed: runtimeStatus.mqttSubscribed,
      broker: config.mqttBrokerUrl,
      topic: config.mqttTopic,
      clientId: config.mqttClientId,
      lastMessageAt: runtimeStatus.mqttLastMessageAt,
      lastTopic: runtimeStatus.mqttLastTopic,
      secondsSinceLastMessage: lastMessageMs === null ? null : Math.round(lastMessageMs / 1000),
    },
    realtime: {
      webSocketClients: getConnectedWebClients(),
      lastBroadcastAt: runtimeStatus.broadcastLastAt,
      lastError: runtimeStatus.broadcastLastError,
    },
    database: {
      configured: Boolean(supabase),
      table: config.supabaseTable,
      keyKind: supabaseKeyKind,
      hasPrivilegedKey: hasPrivilegedSupabaseKey,
      lastInsertAt: runtimeStatus.dbLastInsertAt,
      lastError: runtimeStatus.dbLastError,
      keyValid: runtimeStatus.supabaseKeyValid,
    },
    sensor: {
      receivedKeys: [...sensorState.receivedKeys],
      missingKeys: REQUIRED_SENSOR_KEYS.filter((key) => !sensorState.receivedKeys.has(key)),
      latest: sensorState.latest,
      lastUpdateAt: runtimeStatus.sensorLastUpdateAt,
    },
    server: {
      status: 'online',
      port: PORT,
      timestamp: new Date().toISOString(),
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

async function setupSupabase() {
  if (!isSupabaseConfigured) return null;

  const client = createClient(config.supabaseUrl, config.supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch,
    },
    realtime: {
      transport: WebSocket,
    },
  });

  try {
    const response = await fetch(`${config.supabaseUrl}/rest/v1/${config.supabaseTable}?select=id&limit=1`, {
      headers: {
        apikey: config.supabaseKey,
        Authorization: `Bearer ${config.supabaseKey}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      const body = await response.text();
      runtimeStatus.supabaseKeyValid = false;
      runtimeStatus.dbLastError = 'Invalid API key';
      console.error(`[DB] Supabase key ditolak (${response.status}). Insert DB tidak akan berhasil sampai key diganti. Detail: ${body}`);
    } else {
      runtimeStatus.supabaseKeyValid = true;
      console.log(`[DB] Supabase key diterima. REST check status=${response.status}`);
    }
  } catch (error) {
    runtimeStatus.supabaseKeyValid = null;
    runtimeStatus.dbLastError = `Gagal cek Supabase key: ${error.message}`;
    console.error(`[DB] Gagal cek Supabase key: ${error.message}`);
  }

  sensorRealtimeChannel = client.channel('realtime_sensor');
  sensorRealtimeChannel.subscribe((status) => {
    console.log(`[REALTIME] Supabase channel realtime_sensor: ${status}`);
  });

  return client;
}

function setupMqtt() {
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
    runtimeStatus.mqttConnected = true;
    console.log(`[MQTT] Connected ke broker sebagai ${config.mqttClientId}`);

    mqttClient.subscribe(config.mqttTopic, { qos: config.mqttQos }, (error, granted) => {
      if (error) {
        runtimeStatus.mqttSubscribed = false;
        console.error(`[MQTT] Subscribe gagal topic=${config.mqttTopic}: ${error.message}`);
        return;
      }

      runtimeStatus.mqttSubscribed = true;
      console.log(`[MQTT] Subscribe OK: ${granted.map((item) => `${item.topic} qos=${item.qos}`).join(', ')}`);
    });
  });

  mqttClient.on('reconnect', () => {
    console.warn('[MQTT] Reconnect otomatis berjalan...');
  });

  mqttClient.on('offline', () => {
    runtimeStatus.mqttConnected = false;
    console.warn('[MQTT] Offline. Cek internet, broker EMQX, username/password, atau sertifikat TLS.');
  });

  mqttClient.on('close', () => {
    runtimeStatus.mqttConnected = false;
    runtimeStatus.mqttSubscribed = false;
    console.warn('[MQTT] Koneksi ditutup.');
  });

  mqttClient.on('error', (error) => {
    console.error(`[MQTT] Error client: ${error.message}`);
  });

  mqttClient.on('message', (topic, messageBuffer) => {
    const rawPayload = messageBuffer.toString('utf-8').trim();
    handleSensorMessage(topic, rawPayload).catch((error) => {
      console.error(`[MQTT] Gagal proses pesan topic=${topic}, payload="${rawPayload}": ${error.message}`);
    });
  });
}

function setupNoMessageMonitor() {
  setInterval(() => {
    if (!mqttClient || !mqttClient.connected) {
      console.warn('[MONITOR] MQTT belum connected. Web tidak akan menerima data sensor baru.');
      return;
    }

    if (!runtimeStatus.mqttLastMessageAt) {
      console.warn(`[MONITOR] MQTT connected dan subscribe ${config.mqttTopic}, tapi belum ada pesan sensor masuk.`);
      return;
    }

    const ageSeconds = Math.round((Date.now() - new Date(runtimeStatus.mqttLastMessageAt).getTime()) / 1000);
    if (ageSeconds > 180) {
      console.warn(`[MONITOR] MQTT connected, tapi tidak ada pesan sensor selama ${ageSeconds}s. Cek ESP1 publish dan topic farm/sensors/*.`);
    }
  }, 30000).unref();
}

async function bootstrap() {
  logConfig();
  supabase = await setupSupabase();
  setupMqtt();

  const server = app.listen(PORT, () => {
    console.log(`[SERVER] Express berjalan di http://localhost:${PORT}`);
    console.log('[SERVER] Realtime WebSocket: ws://localhost:' + PORT + '/realtime');
    console.log('[SERVER] Endpoints: POST /api/actuators/pompa, POST /api/actuators/servo, GET /api/status');
  });

  wsServer = new WebSocket.Server({ server, path: '/realtime' });
  wsServer.on('connection', (socket) => {
    console.log(`[REALTIME] Web client connected. total=${getConnectedWebClients()}`);
    socket.send(JSON.stringify({ type: 'hello', payload: { latest: sensorState.latest } }));
    socket.on('close', () => {
      console.log(`[REALTIME] Web client disconnected. total=${getConnectedWebClients()}`);
    });
  });

  setupNoMessageMonitor();

  const shutdown = (signal) => {
    console.log(`[SYSTEM] Menerima ${signal}. Menutup koneksi...`);

    if (sensorState.flushTimer) clearTimeout(sensorState.flushTimer);
    if (mqttClient) mqttClient.end(true, () => console.log('[SYSTEM] MQTT disconnected.'));
    if (sensorRealtimeChannel && supabase) supabase.removeChannel(sensorRealtimeChannel);
    if (wsServer) wsServer.close();

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
  console.error(`[FATAL] Bridge gagal start: ${error.message}`);
  process.exit(1);
});
