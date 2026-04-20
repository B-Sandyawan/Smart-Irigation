import React, { useCallback, useEffect, useState } from 'react';
import ControlToggleCard from './ControlToggleCard';
import StatusInfoCard from './StatusInfoCard';
import nutrisiIcon from '../../assets/dashboard-icons/nutrisi.svg';
import suhuFillIcon from '../../assets/dashboard-icons/suhu-vector-1.png';
import suhuOutlineIcon from '../../assets/dashboard-icons/suhu-vector-2.png';
import cahayaIcon from '../../assets/dashboard-icons/cahaya.png';

import { supabase } from '../../lib/supabaseClient'; 

const dashboardDummyData = {
  title: 'Dashboard',
  controls: {
    water: {
      title: 'Tombol Penyiram Air',
      readyText: 'Siap',
      activeText: 'Aktif',
      accentOn: '#9BC19B',
      accentOff: '#ADADAD',
      iconBgOuter: '#DCE9FD',
      iconBgInner: '#BFD7FF',
      iconType: 'water',
      initialAvailability: 75,
      initiallyActive: false
    },
    vent: {
      title: 'Tombol Ventilasi',
      readyText: 'Terbuka',
      activeText: 'Tertutup',
      accentOn: '#F55F5F',
      accentOff: '#ADADAD',
      iconBgOuter: '#ECDBC9',
      iconBgInner: '#C4A884',
      iconType: 'vent',
      initiallyActive: true
    }
  }
};

// SESUAIKAN TONE DENGAN RENTANG SENSOR ASLI
const getTemperatureTone = (value) => (value >= 25 && value <= 30 ? 'good' : 'bad'); // Kangkung 25-30C
const getLightTone = (value) => (value >= 400 && value <= 800 ? 'good' : 'dim'); // LDR 400-800
const getSoilTone = (value) => {
  if (value > 80) return 'wet';
  if (value < 60) return 'dry';
  return 'stable';
};

const statusCardTemplates = [
  {
    id: 'nutrisi',
    label: 'Nutrisi Pupuk (TDS)',
    labelColor: '#C4A884',
    valueColor: '#132A58',
    iconSrc: nutrisiIcon,
    iconAlt: 'Ikon nutrisi pupuk',
    iconSize: 44, 
    iconBg: '#C3DBC9',
    metricKey: 'nutrisi', // Di-mapping dari TDS
    formatValue: (value) => `${value} ppm`, // Ubah jadi ppm (bukan %)
    accentFromTone: () => '#C4A884',
    noteFromValue: (value) => {
      if (value >= 800 && value <= 1200) return 'Nutrisi sangat baik';
      if (value >= 600 && value <= 1400) return 'Nutrisi cukup baik';
      return 'Nutrisi perlu disesuaikan';
    }
  },
  {
    id: 'suhu',
    label: 'Suhu',
    labelColor: '#7CBF7C',
    valueColor: '#132A58',
    iconKind: 'temperature',
    iconSrc: suhuOutlineIcon,
    iconOverlaySrc: suhuFillIcon,
    iconAlt: 'Ikon suhu',
    iconSize: 44,
    iconBg: '#F6F286',
    metricKey: 'suhu', // Asli suhu
    formatValue: (value) => `${value}°C`,
    toneFromValue: (value) => getTemperatureTone(value),
    accentFromTone: (tone) => (tone === 'bad' ? '#D9534F' : '#4B9567'),
    noteFromTone: (tone) => tone === 'bad' ? 'Suhu butuh perhatian' : 'Suhu stabil untuk pertumbuhan'
  },
  {
    id: 'kelembapan',
    label: 'Kelembapan Tanah',
    labelColor: '#9BC19B',
    valueColor: '#385B38',
    iconKind: 'soil',
    iconSize: 44,
    iconBg: '#C7DDFB',
    metricKey: 'kelembapan', // Di-mapping dari Soil
    formatValue: (value) => `${value}%`,
    toneFromValue: (value) => getSoilTone(value),
    accentFromTone: (tone) => {
      if (tone === 'wet') return '#5FA8FF';
      if (tone === 'dry') return '#9B7A56';
      return '#4B9567';
    },
    noteFromTone: (tone) => {
      if (tone === 'wet') return 'Tanah sangat lembap dan berair';
      if (tone === 'dry') return 'Tanah cenderung kering';
      return 'Tanah stabil dan ideal';
    }
  },
  {
    id: 'cahaya',
    label: 'Cahaya (LDR)',
    labelColor: '#FEF48A',
    valueColor: '#132A58',
    iconKind: 'sun',
    iconSrc: cahayaIcon,
    iconAlt: 'Ikon cahaya',
    iconSize: 44,
    iconBg: '#F6F286',
    metricKey: 'cahaya', // Di-mapping dari LDR
    formatValue: (value) => `${value}`, // Angka raw LDR
    toneFromValue: (value) => getLightTone(value),
    accentFromTone: (tone) => (tone === 'dim' ? '#D39A1C' : '#F6B400'),
    noteFromTone: (tone) => (tone === 'dim' ? 'Intensitas cahaya kurang ideal' : 'Cahaya cukup untuk tanaman')
  }
];

const DashboardPage = () => {
  const [isWaterActive, setIsWaterActive] = useState(dashboardDummyData.controls.water.initiallyActive);
  const [waterAvailability, setWaterAvailability] = useState(dashboardDummyData.controls.water.initialAvailability);
  const [isVentActive, setIsVentActive] = useState(dashboardDummyData.controls.vent.initiallyActive);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // STATE UNTUK DATA REAL DARI SUPABASE
  const [lastUpdated, setLastUpdated] = useState('Memuat...');
  const [summaryState, setSummaryState] = useState({ score: '0%', level: 'Memuat...', note: 'Mengambil data dari server...' });
  const [statusMetrics, setStatusMetrics] = useState({ nutrisi: 0, suhu: 0, kelembapan: 0, cahaya: 0 });

  const summaryPercentage = Number.parseInt(summaryState.score, 10) || 0;
  const ringRadius = 66; 
  const ringStroke = 14; 
  const progressCircumference = 2 * Math.PI * ringRadius;
  const progressOffset = progressCircumference * (1 - summaryPercentage / 100);

  // FUNGSI UNTUK MENGAMBIL DAN MEMASANG DATA DARI SUPABASE
  const updateDashboardWithRealData = useCallback((dataRow) => {
    if (!dataRow) return;

    // Mapping nilai sensor ke status metrics UI
    setStatusMetrics({
      nutrisi: dataRow.tds || 0,
      suhu: dataRow.suhu || 0,
      kelembapan: dataRow.soil || 0,
      cahaya: dataRow.ldr || 0
    });

    // Pasang skor dan status hasil hitungan Node.js backend
    setSummaryState({
      score: `${dataRow.plant_score || 0}%`,
      level: dataRow.health_status || 'Tidak Diketahui',
      note: `Skor terbaru ditarik dari sensor. Kondisi: ${dataRow.health_status || 'Tidak Diketahui'}.`
    });

    // Format waktu terakhir update
    const dateObj = new Date(dataRow.created_at);
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = dateObj.toLocaleString('id-ID', { month: 'short' });
    const year = dateObj.getFullYear();
    setLastUpdated(`${day} ${month} ${year} - ${hours}.${minutes}`);
  }, []);

  // EFFECT UNTUK FETCH AWAL & SUBSCRIPTION REAL-TIME SUPABASE
  useEffect(() => {
    // 1. Ambil data terakhir saat web pertama kali dibuka
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data && !error) {
        updateDashboardWithRealData(data);
      }
    };

    fetchInitialData();

    // 2. Data baru yang masuk secara real-time
    const channel = supabase
      .channel('realtime_sensor')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sensor_data' }, (payload) => {
        updateDashboardWithRealData(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [updateDashboardWithRealData]);


  // Logika UI Tombol Control (Biarkan sama)
  useEffect(() => {
    const refillInterval = setInterval(() => {
      if (isWaterActive) return;
      setWaterAvailability((prev) => {
        if (prev >= 100) return prev;
        return Math.min(100, prev + 2);
      });
    }, 4000);
    return () => clearInterval(refillInterval);
  }, [isWaterActive]);

  useEffect(() => {
    if (!isWaterActive) return undefined;
    const timeoutId = setTimeout(() => {
      setIsWaterActive(false);
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [isWaterActive]);

  const handleWaterToggle = useCallback(() => {
    if (isWaterActive || waterAvailability <= 0) return;
    setIsWaterActive(true);
    setWaterAvailability((prev) => Math.max(0, prev - 8));
  }, [isWaterActive, waterAvailability]);

  const handleVentToggle = useCallback(() => {
    setIsVentActive((prev) => !prev);
  }, []);

  const waterControl = dashboardDummyData.controls.water;
  const ventControl = dashboardDummyData.controls.vent;
  const controlCards = [
    {
      key: 'water',
      title: waterControl.title,
      subtitle: isWaterActive ? waterControl.activeText : waterControl.readyText,
      isActive: isWaterActive,
      accentColor: isWaterActive ? waterControl.accentOn : waterControl.accentOff,
      iconType: waterControl.iconType,
      iconBgOuter: waterControl.iconBgOuter,
      iconBgInner: waterControl.iconBgInner,
      availabilityPercent: waterAvailability,
      onToggle: handleWaterToggle,
    },
    {
      key: 'vent',
      title: ventControl.title,
      subtitle: isVentActive ? ventControl.activeText : ventControl.readyText,
      isActive: isVentActive,
      accentColor: isVentActive ? ventControl.accentOn : ventControl.accentOff,
      iconType: ventControl.iconType,
      iconBgOuter: ventControl.iconBgOuter,
      iconBgInner: ventControl.iconBgInner,
      availabilityPercent: null,
      onToggle: handleVentToggle,
    },
  ];

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 5);
  };

  return (
    <section className="flex h-screen flex-col bg-primary-light overflow-hidden font-sans">
      
      {/* Header */}
      <div className={`shrink-0 z-20 px-4 pt-6 pb-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'shadow-md bg-primary-light/95 backdrop-blur-sm border-b border-white/10' : ''}`}>
        <div className="mx-auto w-full max-w-[980px]">
          <h1 className="text-[26px] font-bold text-white tracking-wide drop-shadow-sm">
            {dashboardDummyData.title}
          </h1>
        </div>
      </div>

      {/* Area Scrollable */}
      <div 
        className="flex-1 overflow-y-auto px-4 pb-12 sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        onScroll={handleScroll}
      >
        <div className="mx-auto flex h-full w-full max-w-[980px] flex-col pt-2 gap-8">
          
          {/* Row 1: Control Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 items-start">
            {controlCards.map((card) => (
              <ControlToggleCard
                key={card.key}
                title={card.title}
                subtitle={card.subtitle}
                isActive={card.isActive}
                iconType={card.iconType}
                accentColor={card.accentColor}
                iconBgOuter={card.iconBgOuter}
                iconBgInner={card.iconBgInner}
                availabilityPercent={card.availabilityPercent}
                onToggle={card.onToggle}
              />
            ))}
          </div>

          {/* Row 2 & 3: Monitoring Area */}
          <div className="flex flex-col gap-4">
            <h2 className="text-[15px] font-bold text-white drop-shadow-sm ml-1">
              Pantau Tanaman
            </h2>

            {/* Summary Card */}
            <div className="relative w-full rounded-[24px] bg-white px-6 py-8 shadow-sm md:px-10">
              
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
                
                {/* Kiri: Last Updated */}
                <div className="flex flex-col space-y-1.5 transition-opacity group">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-[#999]">
                    <span className="text-[15px]">🗓️</span>
                    <span>Terakhir di Update</span>
                  </div>
                  <p className="pl-6 text-[14px] font-medium text-[#444] transition-colors group-hover:text-[#4B9567]">
                    {lastUpdated}
                  </p>
                </div>

                {/* Chart Besar (Skor Tampil) */}
                <div className="flex justify-center">
                  <div className="relative flex h-[160px] w-[160px] flex-col items-center justify-center rounded-full bg-transparent">
                    <svg className="absolute h-[160px] w-[160px] -rotate-90" viewBox="0 0 160 160" aria-hidden="true">
                      {/* Background Ring */}
                      <circle cx="80" cy="80" r={ringRadius} fill="none" stroke="#C3DBC9" strokeWidth={ringStroke} />
                      {/* Progress Ring */}
                      <circle
                        cx="80"
                        cy="80"
                        r={ringRadius}
                        fill="none"
                        stroke="#4B9567"
                        strokeWidth={ringStroke}
                        strokeLinecap="round"
                        strokeDasharray={progressCircumference}
                        strokeDashoffset={progressOffset}
                        className="transition-all duration-700 ease-in-out"
                      />
                    </svg>
                    
                    {/* Nilai Skor */}
                    <div className="relative z-10 flex flex-col items-center justify-center mt-1">
                      <p className="text-[13px] font-medium text-[#888]">Skor Total</p>
                      <p className="text-[36px] font-bold leading-none text-[#385B38] tracking-tight my-1.5">
                        {summaryState.score}
                      </p>
                      <p className="text-[13px] font-medium text-[#444]">{summaryState.level}</p>
                    </div>
                  </div>
                </div>

                {/* Kanan: Keterangan */}
                <div className="flex flex-col space-y-1.5 md:pl-6">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-[#999]">
                    <span className="text-[15px]">📝</span>
                    <span>Keterangan</span>
                  </div>
                  <p className="pl-6 text-[13px] leading-relaxed text-[#444] max-w-[240px]">
                    {summaryState.note}
                  </p>
                </div>

              </div>
            </div>

            {/* Status Cards (Menampilkan Suhu, Kelembapan Tanah, TDS, dan LDR) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 mt-2">
              {statusCardTemplates.map((item) => {
                const metricValue = statusMetrics[item.metricKey];
                const tone = item.toneFromValue ? item.toneFromValue(metricValue) : 'neutral';
                const statusNote = item.noteFromTone ? item.noteFromTone(tone) : item.noteFromValue ? item.noteFromValue(metricValue) : '';

                return (
                  <StatusInfoCard
                    key={item.id}
                    label={item.label}
                    labelColor={item.labelColor}
                    value={item.formatValue(metricValue)}
                    valueColor={item.valueColor}
                    iconSrc={item.iconSrc}
                    iconOverlaySrc={item.iconOverlaySrc}
                    iconAlt={item.iconAlt}
                    iconSize={item.iconSize || 42}
                    iconKind={item.iconKind}
                    tone={tone}
                    accentColor={item.accentFromTone ? item.accentFromTone(tone) : '#C4A884'}
                    statusNote={statusNote}
                    iconBg={item.iconBg}
                  />
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;