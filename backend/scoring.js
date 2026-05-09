// scoring.js
// Kalkulasi skor kesehatan tanaman Kangkung
// Rumus: skor_akhir = (tanah + suhu + udara + cahaya) / 4

// ─── Skor per kondisi ────────────────────────────────────────────────────────

function getSkorTanah(soil) {
  if (soil >= 60 && soil <= 80) return { skor: 100, kondisi: 'Ideal' };
  if (soil >= 40 && soil < 60) return { skor: 70, kondisi: 'Cukup' };
  if (soil > 80) return { skor: 60, kondisi: 'Terlalu Basah' };
  // soil < 40
  return { skor: 30, kondisi: 'Kering' };
}

function getSkorSuhu(suhu) {
  if (suhu >= 25 && suhu <= 32) return { skor: 100, kondisi: 'Ideal' };
  if (suhu >= 20 && suhu < 25) return { skor: 70, kondisi: 'Cukup' };
  if (suhu > 32) return { skor: 60, kondisi: 'Terlalu Panas' };
  // suhu < 20
  return { skor: 40, kondisi: 'Terlalu Dingin' };
}

function getSkorUdara(kelembaban) {
  if (kelembaban >= 70 && kelembaban <= 90) return { skor: 100, kondisi: 'Ideal' };
  if (kelembaban >= 50 && kelembaban < 70) return { skor: 80, kondisi: 'Cukup' };
  if (kelembaban > 90) return { skor: 70, kondisi: 'Terlalu Lembab' };
  // kelembaban < 50
  return { skor: 50, kondisi: 'Kering' };
}

function getSkorCahaya(ldr) {
  // LDR ADC: nilai tinggi = gelap, nilai rendah = terang
  if (ldr < 200) return { skor: 100, kondisi: 'Sangat Terang' };
  if (ldr >= 200 && ldr < 500) return { skor: 90, kondisi: 'Terang' };
  if (ldr >= 500 && ldr <= 800) return { skor: 70, kondisi: 'Cukup' };
  // ldr > 800
  return { skor: 40, kondisi: 'Gelap' };
}

// ─── Status kondisi tanaman berdasarkan skor akhir ───────────────────────────

function getHealthStatus(skorAkhir) {
  if (skorAkhir >= 91) return 'Optimal';
  if (skorAkhir >= 76) return 'Baik';
  if (skorAkhir >= 51) return 'Cukup';
  return 'Buruk';
}

// ─── Fungsi utama ─────────────────────────────────────────────────────────────

/**
 * Menghitung skor kesehatan tanaman berdasarkan 4 parameter sensor.
 *
 * @param {object} sensorData - { suhu, kelembaban, soil, ldr }
 * @returns {{ score: number, health_status: string, detail: object }}
 */
function calculatePlantScore(sensorData) {
  const tanah = getSkorTanah(sensorData.soil);
  const suhu = getSkorSuhu(sensorData.suhu);
  const udara = getSkorUdara(sensorData.kelembaban);
  const cahaya = getSkorCahaya(sensorData.ldr);

  const skorAkhir = Math.round(
    (tanah.skor + suhu.skor + udara.skor + cahaya.skor) / 4
  );

  return {
    score: skorAkhir,
    health_status: getHealthStatus(skorAkhir),
    detail: {
      tanah: { score: tanah.skor, kondisi: tanah.kondisi },
      suhu: { score: suhu.skor, kondisi: suhu.kondisi },
      udara: { score: udara.skor, kondisi: udara.kondisi },
      cahaya: { score: cahaya.skor, kondisi: cahaya.kondisi },
    },
  };
}

module.exports = { calculatePlantScore };