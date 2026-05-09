/*
  ============================================
   Smart Indoor Greenhouse — ESP2 Aktuator
   Aktuator : 4 Servo, Lampu, Pompa
   MQTT     : HiveMQ Cloud (TLS)
   Logika   :
     - Servo : buka (90°) jika suhu >= 33°C, tutup (0°) jika < 33°C
     - Lampu : ON jika LDR gelap (raw > 3000), OFF jika terang
     - Pompa : ON jika soil < 30%, OFF jika soil > 40%
  ============================================
*/

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ESP32Servo.h>

// ─────────────────────────────────────────
//  KONFIGURASI WIFI & MQTT
// ─────────────────────────────────────────
const char* ssid        = "laper";
const char* password    = "dzakigay";
const char* mqtt_server = "7fe5f3aa1f3041a08f73f408d5f32f99.s1.eu.hivemq.cloud";
const int   mqtt_port   = 8883;
const char* mqtt_user   = "esp_farm";
const char* mqtt_pass   = "123Sija2!";
const char* CLIENT_ID   = "ESP2_Aktuator";

// ─────────────────────────────────────────
//  PIN
// ─────────────────────────────────────────
#define SERVO1_PIN  4
#define SERVO2_PIN  16
#define SERVO3_PIN  17
#define SERVO4_PIN  5
#define LAMPU_PIN   18
#define POMPA_PIN   13

// ─────────────────────────────────────────
//  KONFIGURASI
// ─────────────────────────────────────────
#define SUHU_BUKA   33.0  // servo buka jika suhu >= 33°C
#define SOIL_BUKA   80    // servo buka jika soil > 80% (WET detection)
#define HUMID_BUKA  90    // servo buka jika kelembaban > 90%
#define SERVO_TUTUP 0     // derajat tutup
#define SERVO_BUKA  90    // derajat buka
#define SOIL_POMPA_ON_PCT  30
#define SOIL_POMPA_OFF_PCT 40

// ─────────────────────────────────────────
//  TOPIC MQTT
// ─────────────────────────────────────────
#define TOPIC_SUHU      "farm/sensors/suhu"
#define TOPIC_LDR       "farm/sensors/ldr"
#define TOPIC_SOIL      "farm/sensors/soil"
#define TOPIC_KELEMBABAN "farm/sensors/kelembaban"
#define TOPIC_STATUS    "farm/status/esp2"
#define TOPIC_SERVO     "farm/sensors/servo"   // Command servo dari backend

// ─────────────────────────────────────────
//  OBJEK & GLOBAL STATE
// ─────────────────────────────────────────
Servo servo[4];
int servoPins[4] = {SERVO1_PIN, SERVO2_PIN, SERVO3_PIN, SERVO4_PIN};

WiFiClientSecure espClient;
PubSubClient client(espClient);
bool pompaNyala = false;

// Simpan sensor values untuk servo logic
float sensorSuhu = 0.0f;
int sensorSoil = 0;
int sensorKelembaban = 0;
bool servoAktif = false;

// ─────────────────────────────────────────
//  FUNGSI SERVO
// ─────────────────────────────────────────
void bukaServo() {
  if (servoAktif) return;  // Sudah buka, skip
  for (int i = 0; i < 4; i++) servo[i].write(SERVO_BUKA);
  servoAktif = true;
  Serial.println("Servo: BUKA (90°) - ventilasi aktif");
  client.publish(TOPIC_STATUS, "servo:BUKA", true);
}

void tutupServo() {
  if (!servoAktif) return;  // Sudah tutup, skip
  for (int i = 0; i < 4; i++) servo[i].write(SERVO_TUTUP);
  servoAktif = false;
  Serial.println("Servo: TUTUP (0°) - ventilasi tutup");
  client.publish(TOPIC_STATUS, "servo:TUTUP", true);
}

// ─────────────────────────────────────────
//  FUNGSI CHECK SERVO LOGIC
// ─────────────────────────────────────────
void updateServoLogic() {
  // Servo BUKA jika: suhu > 33 OR soil > 80 (wet) OR kelembaban > 90
  bool shouldOpen = (sensorSuhu >= SUHU_BUKA) || 
                    (sensorSoil > SOIL_BUKA) || 
                    (sensorKelembaban > HUMID_BUKA);
  
  if (shouldOpen) {
    bukaServo();
  } else {
    tutupServo();
  }
  
  Serial.print("[SERVO DEBUG] Suhu=");
  Serial.print(sensorSuhu, 1);
  Serial.print(" Soil=");
  Serial.print(sensorSoil);
  Serial.print("% Humid=");
  Serial.print(sensorKelembaban);
  Serial.print("% -> ");
  Serial.println(shouldOpen ? "BUKA" : "TUTUP");
}

// ─────────────────────────────────────────
//  FUNGSI LAMPU
// ─────────────────────────────────────────
void nyalakanLampu() {
  digitalWrite(LAMPU_PIN, LOW);
  Serial.println("Lampu: ON");
  client.publish(TOPIC_STATUS, "lampu:ON", true);
}

void matikanLampu() {   // FIX: nama fungsi tidak lagi duplikat
  digitalWrite(LAMPU_PIN, HIGH);
  Serial.println("Lampu: OFF");
  client.publish(TOPIC_STATUS, "lampu:OFF", true);
}

// ─────────────────────────────────────────
//  FUNGSI POMPA
// ─────────────────────────────────────────
void nyalakanPompa() {
  digitalWrite(POMPA_PIN, LOW);
  pompaNyala = true;
  Serial.println("Pompa: ON");
  client.publish(TOPIC_STATUS, "pompa:ON", true);
}

void matikanPompa() {   // FIX: nama fungsi diperbaiki (bukan matikanLampu)
  digitalWrite(POMPA_PIN, HIGH);
  pompaNyala = false;
  Serial.println("Pompa: OFF");
  client.publish(TOPIC_STATUS, "pompa:OFF", true);
}

// ─────────────────────────────────────────
//  CALLBACK MQTT
// ─────────────────────────────────────────
void callback(char* topic, byte* payload, unsigned int length) {
  String msg = "";
  for (int i = 0; i < length; i++) msg += (char)payload[i];
  String topicStr = String(topic);

  Serial.println("Pesan [" + topicStr + "]: " + msg);

  // ── Data Suhu dari ESP1 ─────────────
  if (topicStr == TOPIC_SUHU) {
    sensorSuhu = msg.toFloat();
    Serial.println("Suhu: " + String(sensorSuhu, 1) + " °C");
    updateServoLogic();
  }

  // ── Data LDR dari ESP1 ──────────────
  if (topicStr == TOPIC_LDR) {
    int ldrRaw = msg.toInt();
    Serial.println("LDR raw: " + String(ldrRaw));

    if (ldrRaw > 3000) {
      nyalakanLampu();
    } else {
      matikanLampu();
    }
  }

  // ── Data Soil dari ESP1 ─────────────
  if (topicStr == TOPIC_SOIL) {
    sensorSoil = msg.toInt();
    Serial.println("Soil: " + String(sensorSoil) + "%");
    
    // Update servo logic (bisa buka kalo wet)
    updateServoLogic();

    // Pompa logic (independent dari servo)
    if (!pompaNyala && sensorSoil < SOIL_POMPA_ON_PCT) {
      nyalakanPompa();
    } else if (pompaNyala && sensorSoil > SOIL_POMPA_OFF_PCT) {
      matikanPompa();
    }
  }

  // ── Data Kelembaban dari ESP1 ───────
  if (topicStr == TOPIC_KELEMBABAN) {
    sensorKelembaban = msg.toInt();
    Serial.println("Kelembaban: " + String(sensorKelembaban) + "%");
    updateServoLogic();  // Update servo jika lembab
  }

  // ── Command Servo dari Backend ──────
  if (topicStr == TOPIC_SERVO) {
    if (msg == "1" || msg == "BUKA") {
      bukaServo();
    } else if (msg == "0" || msg == "TUTUP") {
      tutupServo();
    }
  }

}  // ← penutup   callback() — posisi benar

// ─────────────────────────────────────────
//  CONNECT MQTT
// ─────────────────────────────────────────
void connectMQTT() {
  while (!client.connected()) {
    Serial.print("Connecting MQTT...");
    if (client.connect(CLIENT_ID, mqtt_user, mqtt_pass)) {
      Serial.println("OK!");
      client.subscribe(TOPIC_SUHU);
      client.subscribe(TOPIC_LDR);
      client.subscribe(TOPIC_SOIL);
      client.subscribe(TOPIC_KELEMBABAN);
      client.subscribe(TOPIC_SERVO);  // Subscribe command servo dari backend
      client.publish(TOPIC_STATUS, "ESP2 online", true);
    } else {
      Serial.print("Gagal rc=");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

// ─────────────────────────────────────────
//  SETUP
// ─────────────────────────────────────────
void setup() {
  Serial.begin(115200);

  // Pin lampu & pompa
  pinMode(LAMPU_PIN, OUTPUT);
  pinMode(POMPA_PIN, OUTPUT);
  digitalWrite(LAMPU_PIN, HIGH);  // aktif LOW → mulai OFF
  digitalWrite(POMPA_PIN, HIGH);  // aktif LOW → mulai OFF

  // Attach servo + posisi awal tutup
  for (int i = 0; i < 4; i++) {
    servo[i].attach(servoPins[i], 500, 2400);
    servo[i].write(SERVO_TUTUP);
    Serial.println("Servo " + String(i + 1) + " attached, posisi tutup");
  }
  delay(1000);

  // WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nWiFi OK: " + WiFi.localIP().toString());

  // MQTT
  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  connectMQTT();

  Serial.println("============================================");
  Serial.println("  Smart Indoor Greenhouse — ESP2 Aktuator");
  Serial.println("============================================");
}

// ─────────────────────────────────────────
//  LOOP
// ─────────────────────────────────────────
void loop() {
  if (!client.connected()) connectMQTT();
  client.loop();
}
