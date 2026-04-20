const SCORE_SANGAT_BAIK = 20;
const SCORE_BAIK = 15;
const SCORE_CUKUP = 10;
const SCORE_BURUK = 5;

const PLANT_THRESHOLDS = {
  KANGKUNG: {
    // 1. Suhu (°C)
    suhu: {
      sangat_baik: { min: 25, max: 30 },
      baik: { min: 20, max: 24.9 },       
      cukup: { min: 15, max: 19.9 },      
      // Jika di luar semua ini, otomatis masuk 'buruk'
    },
    // 2. Kelembaban Udara (%)
    kelembaban: {
      sangat_baik: { min: 60, max: 80 },
      baik: { min: 50, max: 59.9 },
      cukup: { min: 40, max: 49.9 },
    },
    // 3. Kelembaban Tanah / Soil (%)
    soil: {
      sangat_baik: { min: 60, max: 80 },
      baik: { min: 50, max: 59.9 },
      cukup: { min: 40, max: 49.9 },
    },
    // 4. TDS 
    tds: {
      sangat_baik: { min: 800, max: 1200 },
      baik: { min: 600, max: 799 },
      cukup: { min: 400, max: 599 },
    },
    // 5. LDR / Intensitas Cahaya
    ldr: {
      sangat_baik: { min: 400, max: 800 },
      baik: { min: 300, max: 399 },
      cukup: { min: 200, max: 299 },
    }
  }
};

/**
 * Cek kategori nilai sensor dan kembalikan poinnya
 */
function getPointsForMetric(value, thresholds) {
  // Pastikan data valid
  if (value === undefined || value === null || isNaN(value)) return 0;

  if (value >= thresholds.sangat_baik.min && value <= thresholds.sangat_baik.max) {
    return SCORE_SANGAT_BAIK;
  } else if (value >= thresholds.baik.min && value <= thresholds.baik.max) {
    return SCORE_BAIK;
  } else if (value >= thresholds.cukup.min && value <= thresholds.cukup.max) {
    return SCORE_CUKUP;
  } else {
    // Jika tidak masuk Sangat Baik, Baik, atau Cukup, berarti Buruk
    return SCORE_BURUK;
  }
}

/**
 * Fungsi utama untuk menghitung skor
 */
function calculatePlantScore(sensorData, plantType = 'KANGKUNG') {
  const threshold = PLANT_THRESHOLDS[plantType.toUpperCase()];
  if (!threshold) return { score: 0, status: 'Tidak Diketahui' };

  let totalPoints = 0;
  const metrics = ['suhu', 'kelembaban', 'soil', 'tds', 'ldr'];

  // Hitung poin untuk masing-masing sensor
  metrics.forEach(metric => {
    totalPoints += getPointsForMetric(sensorData[metric], threshold[metric]);
  });

  // Deskripsi
  let status = 'Sangat Baik'; 
  
  if (totalPoints >= 85) {
    status = 'Sangat Sesuai / Ideal'; 
  } else if (totalPoints >= 65) {
    status = 'Sesuai / Baik';        
  } else if (totalPoints >= 45) {
    status = 'Kurang Sesuai / Cukup'; 
  } else {
    status = 'Tidak Sesuai / Buruk';  
  }

  return { score: totalPoints, status };
}

module.exports = { calculatePlantScore };