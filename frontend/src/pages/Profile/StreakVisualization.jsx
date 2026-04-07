import React from 'react';

/**
 * StreakVisualization Component
 * 
 * Menampilkan visualisasi di sisi kiri halaman Profile:
 * - Ilustrasi tanaman kangkung (water spinach) yang detail
 * - Grafik streak/performa dengan data visual yang jelas
 */
const StreakVisualization = () => {
  // ============================================================
  // DUMMY DATA - STREAK/PERFORMA
  // ============================================================
  const streakData = [
    { day: 'Senin', value: 85 },
    { day: 'Selasa', value: 90 },
    { day: 'Rabu', value: 78 },
    { day: 'Kamis', value: 95 },
    { day: 'Jumat', value: 88 },
    { day: 'Sabtu', value: 92 },
    { day: 'Minggu', value: 80 },
  ];

  const maxValue = Math.max(...streakData.map(d => d.value));
  const streakStreak = 7; // Hari berturut-turut
  const totalWatering = 126; // Total penyiraman

  return (
    <div className="flex flex-col gap-8">
      
      {/* ============================================================
          WATER SPINACH VISUALIZATION (KANGKUNG)
          ============================================================ */}
      <div className="bg-[#FFEDD9] rounded-[24px] p-8 shadow-md">
        
        {/* Title */}
        <h3 className="text-[#2D3B2E] text-[18px] font-semibold mb-6">
          Tanaman Kangkung
        </h3>

        {/* SVG Illustration - Water Spinach Plant */}
        <svg
          viewBox="0 0 200 300"
          className="w-full max-w-xs mx-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pot */}
          <path
            d="M 60 220 L 50 280 Q 50 290 60 290 L 140 290 Q 150 290 150 280 L 140 220 Z"
            fill="#C4A584"
            stroke="#8B6F47"
            strokeWidth="2"
          />
          <ellipse cx="100" cy="220" rx="40" ry="12" fill="#D4B896" stroke="#8B6F47" strokeWidth="2" />

          {/* Soil */}
          <ellipse cx="100" cy="225" rx="35" ry="8" fill="#8B7355" opacity="0.6" />

          {/* Main Stem Left */}
          <path
            d="M 100 220 Q 85 180 75 140"
            stroke="#4A7C4E"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Main Stem Right */}
          <path
            d="M 100 220 Q 115 180 125 140"
            stroke="#4A7C4E"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Left Branch Upper */}
          <path
            d="M 75 140 Q 60 120 50 110"
            stroke="#4A7C4E"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Right Branch Upper */}
          <path
            d="M 125 140 Q 140 120 150 110"
            stroke="#4A7C4E"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Leaves - Set 1 (Lower Left) */}
          <ellipse cx="65" cy="155" rx="12" ry="20" fill="#5FB87D" stroke="#3D7A52" strokeWidth="1.5" transform="rotate(-35 65 155)" />
          <ellipse cx="70" cy="160" rx="11" ry="18" fill="#6FC990" stroke="#3D7A52" strokeWidth="1.5" transform="rotate(35 70 160)" />

          {/* Leaves - Set 2 (Lower Right) */}
          <ellipse cx="135" cy="155" rx="12" ry="20" fill="#5FB87D" stroke="#3D7A52" strokeWidth="1.5" transform="rotate(35 135 155)" />
          <ellipse cx="130" cy="160" rx="11" ry="18" fill="#6FC990" stroke="#3D7A52" strokeWidth="1.5" transform="rotate(-35 130 160)" />

          {/* Leaves - Set 3 (Mid Left) */}
          <ellipse cx="50" cy="115" rx="13" ry="22" fill="#5FB87D" stroke="#3D7A52" strokeWidth="1.5" transform="rotate(-45 50 115)" />
          <ellipse cx="55" cy="120" rx="12" ry="20" fill="#6FC990" stroke="#3D7A52" strokeWidth="1.5" transform="rotate(45 55 120)" />

          {/* Leaves - Set 4 (Mid Right) */}
          <ellipse cx="150" cy="115" rx="13" ry="22" fill="#5FB87D" stroke="#3D7A52" strokeWidth="1.5" transform="rotate(45 150 115)" />
          <ellipse cx="145" cy="120" rx="12" ry="20" fill="#6FC990" stroke="#3D7A52" strokeWidth="1.5" transform="rotate(-45 145 120)" />

          {/* Leaves - Set 5 (Top) */}
          <ellipse cx="70" cy="95" rx="11" ry="18" fill="#6FC990" stroke="#3D7A52" strokeWidth="1.5" transform="rotate(-40 70 95)" />
          <ellipse cx="100" cy="80" rx="10" ry="17" fill="#5FB87D" stroke="#3D7A52" strokeWidth="1.5" transform="rotate(0 100 80)" />
          <ellipse cx="130" cy="95" rx="11" ry="18" fill="#6FC990" stroke="#3D7A52" strokeWidth="1.5" transform="rotate(40 130 95)" />

          {/* Water Droplets */}
          <circle cx="60" cy="100" r="4" fill="#87CEEB" opacity="0.7" />
          <circle cx="140" cy="105" r="3.5" fill="#87CEEB" opacity="0.6" />
          <circle cx="100" cy="90" r="3" fill="#87CEEB" opacity="0.5" />
        </svg>

        {/* Plant Status Info */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-[#9BC19B] rounded-[12px] p-3 text-center">
            <p className="text-white text-[12px] font-medium">Kondisi</p>
            <p className="text-white text-[16px] font-bold mt-1">Sehat</p>
          </div>
          <div className="bg-[#A3B18A] rounded-[12px] p-3 text-center">
            <p className="text-white text-[12px] font-medium">Umur</p>
            <p className="text-white text-[16px] font-bold mt-1">35 hari</p>
          </div>
        </div>

      </div>

      {/* ============================================================
          STREAK CHART - WATERING PERFORMANCE
          ============================================================ */}
      <div className="bg-[#FFEDD9] rounded-[24px] p-8 shadow-md">
        
        {/* Title */}
        <h3 className="text-[#2D3B2E] text-[18px] font-semibold mb-2">
          Performa Penyiraman
        </h3>
        <p className="text-[#2D3B2E] text-[12px] opacity-70 mb-6">
          Total minggu ini: {totalWatering} liter
        </p>

        {/* Bar Chart */}
        <div className="flex items-end justify-between h-40 gap-1.5 mb-6 px-1">
          {streakData.map((data, idx) => {
            const percentage = (data.value / maxValue) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                {/* Bar */}
                <div className="w-full rounded-t-[4px] transition-all hover:opacity-80" style={{
                  height: `${percentage}%`,
                  backgroundColor: '#9BC19B',
                }}>
                  <div className="text-[10px] font-bold text-white text-center pt-1 truncate">
                    {data.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Day Labels */}
        <div className="flex justify-between gap-1.5 px-1 mb-4">
          {streakData.map((data, idx) => (
            <div key={idx} className="flex-1 text-center">
              <p className="text-[#2D3B2E] text-[10px] font-medium">
                {data.day.slice(0, 3)}
              </p>
            </div>
          ))}
        </div>

        {/* Streak Counter */}
        <div className="bg-[#9BC19B] rounded-[12px] p-4 text-center">
          <p className="text-white text-[12px] font-medium">Streak Berturut-turut</p>
          <p className="text-white text-[28px] font-bold mt-2">{streakStreak} hari</p>
          <p className="text-white text-[10px] opacity-90 mt-1">🔥 Pertahankan semangat Anda!</p>
        </div>

      </div>

    </div>
  );
};

export default StreakVisualization;
