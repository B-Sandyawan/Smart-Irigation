import React, { useState, useEffect, useCallback } from 'react';
import WateringHistoryList from './WateringHistoryList';
import SensorHistoryList from './SensorHistoryList';
import { supabase } from '../../lib/supabaseClient';

const TAB = {
  WATERING: 'watering',
  SENSOR: 'sensor',
};

// ─── Helper: format tanggal ────────────────────────────────────────────────────

function formatTanggal(isoString) {
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return {
    full: `${day} ${month} ${year} - ${hours}.${minutes}`,
    date: `${day} ${month} ${year}`,
  };
}

// ─── Helper: hitung rata-rata sensor per hari (7 hari terakhir) ────────────────

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function groupByDay(rows) {
  // Kelompokkan data sensor per hari dalam seminggu
  const buckets = {};

  rows.forEach((row) => {
    const d = new Date(row.created_at);
    const dateKey = d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    if (!buckets[dateKey]) {
      buckets[dateKey] = { suhu: [], kelembaban: [], soil: [], ldr: [], dayIndex: d.getDay() };
    }
    buckets[dateKey].suhu.push(row.suhu);
    buckets[dateKey].kelembaban.push(row.kelembaban);
    buckets[dateKey].soil.push(row.soil);
    buckets[dateKey].ldr.push(row.ldr);
  });

  // Ambil 7 hari terakhir, buat array rata-rata per hari
  const sortedDates = Object.keys(buckets).sort();
  const last7 = sortedDates.slice(-7);

  const avg = (arr) => arr.length === 0 ? 0 : Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

  const result = {
    labels: last7.map((dateKey) => HARI[new Date(dateKey).getDay()]),
    suhu: last7.map((dateKey) => avg(buckets[dateKey].suhu)),
    kelembaban: last7.map((dateKey) => avg(buckets[dateKey].kelembaban)),
    soil: last7.map((dateKey) => avg(buckets[dateKey].soil)),
    ldr: last7.map((dateKey) => avg(buckets[dateKey].ldr)),
  };

  return result;
}

// ─── Komponen Utama ───────────────────────────────────────────────────────────

const RiwayatPage = () => {
  const [activeTab, setActiveTab] = useState(TAB.WATERING);
  const [isScrolled, setIsScrolled] = useState(false);

  // State data
  const [wateringData, setWateringData] = useState([]);
  const [sensorChartData, setSensorChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── Fetch Riwayat Penyiraman ─────────────────────────────────────────────

  const fetchWateringHistory = useCallback(async () => {
    const { data, error } = await supabase
      .from('watering_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('[RIWAYAT] Gagal fetch watering_history:', error.message);
      return;
    }

    const mapped = (data || []).map((row) => {
      const t = formatTanggal(row.created_at);
      return {
        id: `wh-${row.id}`,
        primaryText: t.full,
        secondaryText: `Durasi: ${row.duration_seconds} detik`,
        status: 'Selesai',
      };
    });

    setWateringData(mapped);
  }, []);

  // ─── Fetch Riwayat Sensor (7 hari terakhir) ──────────────────────────────

  const fetchSensorHistory = useCallback(async () => {
    // Ambil data 7 hari terakhir
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('sensor_data')
      .select('suhu, kelembaban, soil, ldr, created_at')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[RIWAYAT] Gagal fetch sensor_data:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      setSensorChartData([]);
      return;
    }

    const grouped = groupByDay(data);

    // Ambil nilai terakhir untuk tampilan value
    const latest = data[data.length - 1];

    const chartItems = [
      {
        id: 'sr-kelembaban',
        title: 'Kelembaban Udara',
        value: `${latest.kelembaban}%`,
        iconType: 'humidity',
        lineColor: '#5FA8FF',
        points: grouped.kelembaban,
      },
      {
        id: 'sr-soil',
        title: 'Kelembaban Tanah',
        value: `${latest.soil}%`,
        iconType: 'soil',
        lineColor: '#9B7A56',
        points: grouped.soil,
      },
      {
        id: 'sr-suhu',
        title: 'Suhu',
        value: `${latest.suhu}°C`,
        iconType: 'temperature',
        lineColor: '#D9534F',
        points: grouped.suhu,
      },
    ];

    setSensorChartData(chartItems);
  }, []);

  // ─── Init ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchWateringHistory(), fetchSensorHistory()]).finally(() => {
      setLoading(false);
    });
  }, [fetchWateringHistory, fetchSensorHistory]);

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 5);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <section className="flex h-screen flex-col bg-transparent overflow-hidden font-sans">

      {/* HEADER */}
      <div className={`shrink-0 z-20 px-4 pt-6 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'shadow-md bg-white/10 backdrop-blur-sm' : ''}`}>
        <div className="mx-auto w-full max-w-[980px]">
          <h1 className="text-[26px] font-bold text-white tracking-wide drop-shadow-sm">
            Pantau Tanaman
          </h1>

          {/* Area Tab Controls */}
          <div className="mt-6 flex w-full items-end gap-6 sm:gap-[54px] border-b border-white/20 pb-[10px]">
            <button
              type="button"
              onClick={() => setActiveTab(TAB.WATERING)}
              className={`relative pb-[2px] text-[15px] sm:text-[17px] font-semibold leading-[1.1] transition-colors ${activeTab === TAB.WATERING ? 'text-white' : 'text-white/60 hover:text-white/90'
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
              className={`relative pb-[2px] text-[15px] sm:text-[17px] font-semibold leading-[1.1] transition-colors ${activeTab === TAB.SENSOR ? 'text-white' : 'text-white/60 hover:text-white/90'
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

          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-white/80 text-[16px] font-medium animate-pulse">Memuat data...</p>
            </div>
          ) : activeTab === TAB.WATERING ? (
            wateringData.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-white/70 text-[15px] font-medium">Belum ada data riwayat penyiraman.</p>
              </div>
            ) : (
              <WateringHistoryList items={wateringData} />
            )
          ) : (
            sensorChartData.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-white/70 text-[15px] font-medium">Belum ada data sensor dalam 7 hari terakhir.</p>
              </div>
            ) : (
              <SensorHistoryList items={sensorChartData} />
            )
          )}

        </div>
      </div>

    </section>
  );
};

export default RiwayatPage;