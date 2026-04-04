import React, { useState } from 'react';
import WateringHistoryList from './WateringHistoryList';
import SensorHistoryList from './SensorHistoryList';

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
  { id: 'wh-7', primaryText: '20 Feb 2026 - 02.00', secondaryText: '20 Feb 2026', status: 'Selesai' },
  { id: 'wh-8', primaryText: '20 Feb 2026 - 02.00', secondaryText: '20 Feb 2026', status: 'Gagal' },
];

const dummySensorData = [
  {
    id: 'sr-1',
    title: 'Kelembaban',
    value: '90%',
    iconType: 'humidity',
    lineColor: '#8CC8F9',
    points: [84, 80, 79, 83, 89, 92, 93, 90, 87, 85, 86, 88],
  },
  {
    id: 'sr-2',
    title: 'Kelembaban Tanah',
    value: '90%',
    iconType: 'soil',
    lineColor: '#9E8657',
    points: [87, 81, 79, 84, 90, 93, 94, 91, 88, 86, 87, 90],
  },
  {
    id: 'sr-3',
    title: 'Suhu',
    value: '30°C',
    iconType: 'temperature',
    lineColor: '#DC786A',
    points: [66, 68, 70, 69, 72, 74, 73, 75, 76, 74, 73, 72],
  },
];

const RiwayatPage = () => {
  const [activeTab, setActiveTab] = useState(TAB.WATERING);

  return (
    <section className="min-h-screen w-full bg-[#9CBC98] pl-[40px] pr-[30px] pb-[42px] pt-[14px] md:min-h-[980px] md:pl-[64px] md:pr-[42px]">
      <header>
        <h1 className="text-[42px] font-bold leading-[1.15] text-[#2D3B2E]">Pantau Tanaman</h1>
      </header>

      <div className="mt-[26px] flex w-full max-w-[980px] items-end gap-[54px] border-b border-[#DCEBD9] pb-[10px]">
        <button
          type="button"
          onClick={() => setActiveTab(TAB.WATERING)}
          className={`relative pb-[2px] text-[17px] font-semibold leading-[1.1] transition-colors ${
            activeTab === TAB.WATERING ? 'text-[#E8F0E5]' : 'text-[#4E6E52]/75 hover:text-[#E8F0E5]'
          }`}
        >
          Riwayat Penyiraman
          {activeTab === TAB.WATERING && (
            <span className="absolute bottom-[-13px] left-0 h-[3px] w-full rounded-[99px] bg-[#E8F0E5]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab(TAB.SENSOR)}
          className={`relative pb-[2px] text-[17px] font-semibold leading-[1.1] transition-colors ${
            activeTab === TAB.SENSOR ? 'text-[#E8F0E5]' : 'text-[#4E6E52]/75 hover:text-[#E8F0E5]'
          }`}
        >
          Riwayat Sensor
          {activeTab === TAB.SENSOR && (
            <span className="absolute bottom-[-13px] left-0 h-[3px] w-full rounded-[99px] bg-[#E8F0E5]" />
          )}
        </button>
      </div>

      <div className="w-full max-w-[980px] pb-[10px] pt-[20px]">
        {activeTab === TAB.WATERING ? (
          <WateringHistoryList items={dummyWateringData} />
        ) : (
          <SensorHistoryList items={dummySensorData} />
        )}
      </div>
    </section>
  );
};

export default RiwayatPage;
