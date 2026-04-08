import React, { useState } from 'react';
import WateringHistoryList from './WateringHistoryList';
import SensorHistoryList from './SensorHistoryList';
// Sesuaikan import path jika SensorHistoryList dan SensorChartCard terpisah file

const TAB = {
  WATERING: 'watering',
  SENSOR: 'sensor',
};

const dummyWateringData = [
  { id: 'wh-1', primaryText: '20 Feb 2026 - 02.00', secondaryText: '20 Feb 2026', status: 'Selesai' },
  { id: 'wh-2', primaryText: '20 Feb 2026 - 02.00', secondaryText: '20 Feb 2026', status: 'Gagal' },
  { id: 'wh-3', primaryText: '20 Feb 2026 - 02.00', secondaryText: '20 Feb 2026', status: 'Selesai' },
  { id: 'wh-4', primaryText: '20 Feb 2026 - 02.00', secondaryText: '20 Feb 2026', status: 'Gagal' },
  { id: 'wh-5', primaryText: '20 Feb 2026 - 02.00', secondaryText: '20 Feb 2026', status: 'Selesai' },
  { id: 'wh-6', primaryText: '20 Feb 2026 - 02.00', secondaryText: '20 Feb 2026', status: 'Gagal' },
];

const dummySensorData = [
  {
    id: 'sr-1',
    title: 'Kelembapan',
    value: '90%',
    iconType: 'humidity',
    lineColor: '#5FA8FF', // Warna biru disesuaikan tone dashboard
    points: [84, 80, 79, 83, 89, 92, 93, 90, 87, 85, 86, 88],
  },
  {
    id: 'sr-2',
    title: 'Kelembapan Tanah',
    value: '90%',
    iconType: 'soil',
    lineColor: '#9B7A56', // Warna cokelat tanah disesuaikan
    points: [87, 81, 79, 84, 90, 93, 94, 91, 88, 86, 87, 90],
  },
  {
    id: 'sr-3',
    title: 'Suhu',
    value: '30°C',
    iconType: 'temperature',
    lineColor: '#D9534F', // Merah peringatan suhu
    points: [66, 68, 70, 69, 72, 74, 73, 75, 76, 74, 73, 72],
  },
];

const RiwayatPage = () => {
  const [activeTab, setActiveTab] = useState(TAB.WATERING);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 5);
  };

  return (
    <section className="flex h-screen flex-col bg-[#9BC19B] overflow-hidden font-sans">
      
      {/* HEADER */}
      <div className={`shrink-0 z-20 px-4 pt-6 sm:px-6 lg:px-8 transition-all duration-300 ${
        isScrolled ? 'shadow-md bg-[#9BC19B]/95 backdrop-blur-sm' : ''
      }`}>
        <div className="mx-auto w-full max-w-[980px]">
          <h1 className="text-[26px] font-bold text-white tracking-wide drop-shadow-sm">
            Pantau Tanaman
          </h1>

          {/* Area Tab Controls */}
          <div className="mt-6 flex w-full items-end gap-6 sm:gap-[54px] border-b border-white/20 pb-[10px]">
            <button
              type="button"
              onClick={() => setActiveTab(TAB.WATERING)}
              className={`relative pb-[2px] text-[15px] sm:text-[17px] font-semibold leading-[1.1] transition-colors ${
                activeTab === TAB.WATERING ? 'text-white' : 'text-white/60 hover:text-white/90'
              }`}
            >
              Riwayat Penyiraman
              {activeTab === TAB.WATERING && (
                <span className="absolute bottom-[-13px] left-0 h-[3px] w-full rounded-[99px] bg-white" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab(TAB.SENSOR)}
              className={`relative pb-[2px] text-[15px] sm:text-[17px] font-semibold leading-[1.1] transition-colors ${
                activeTab === TAB.SENSOR ? 'text-white' : 'text-white/60 hover:text-white/90'
              }`}
            >
              Riwayat Sensor
              {activeTab === TAB.SENSOR && (
                <span className="absolute bottom-[-13px] left-0 h-[3px] w-full rounded-[99px] bg-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AREA SCROLL KONTEN */}
      <div 
        className="flex-1 overflow-y-auto px-4 pb-12 pt-4 sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        onScroll={handleScroll}
      >
        <div className="mx-auto flex h-full w-full max-w-[980px] flex-col pb-8">
          {activeTab === TAB.WATERING ? (
            <WateringHistoryList items={dummyWateringData} />
          ) : (
            // Jika SensorHistoryList kamu ada mapping seperti ini:
            // <div className="mt-4 flex flex-col gap-4"> ... mapping SensorChartCard ... </div>
            <SensorHistoryList items={dummySensorData} /> 
          )}
        </div>
      </div>

    </section>
  );
};

export default RiwayatPage;