import React, { useCallback, useEffect, useState } from 'react';
import ControlToggleCard from './ControlToggleCard';
import StatusInfoCard from './StatusInfoCard';
import nutrisiIcon from '../../assets/dashboard-icons/nutrisi.svg';
import suhuFillIcon from '../../assets/dashboard-icons/suhu-vector-1.png';
import suhuOutlineIcon from '../../assets/dashboard-icons/suhu-vector-2.png';
import cahayaIcon from '../../assets/dashboard-icons/cahaya.png';

const dashboardDummyData = {
  title: 'Dashboard',
  lastUpdated: '02.00',
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
  },
  summary: {
    score: '90%',
    level: 'Sangat Baik',
    note: 'Tanaman dalam kondisi sangat baik. Namun perhatikan nutrisi pupuk yang masih optimal.'
  },
  summaryNotes: [
    'Tanaman dalam kondisi sangat baik. Namun perhatikan nutrisi pupuk yang masih optimal.',
    'Kelembapan stabil. Ventilasi dan penyiraman berjalan sesuai pola dummy saat ini.',
    'Kondisi aman. Simulasi menunjukkan pertumbuhan konsisten dalam 24 jam terakhir.'
  ],
};

const getTemperatureTone = (value) => (value >= 20 && value <= 30 ? 'good' : 'bad');
const getLightTone = (value) => (value >= 40 && value <= 90 ? 'good' : 'dim');
const getSoilTone = (value) => {
  if (value >= 80 && value <= 90) {
    return 'wet';
  }

  if (value >= 10 && value <= 40) {
    return 'dry';
  }

  return 'stable';
};

const statusCardTemplates = [
  {
    id: 'nutrisi',
    label: 'Nutrisi Pupuk',
    labelColor: '#C4A884',
    valueColor: '#132A58',
    iconSrc: nutrisiIcon,
    iconAlt: 'Ikon nutrisi pupuk',
    iconSize: 44, // Diperkecil agar elemen dalam card tidak raksasa
    iconBg: '#C3DBC9',
    metricKey: 'nutrisi',
    formatValue: (value) => `${value}%`,
    accentFromTone: () => '#C4A884',
    noteFromValue: (value) => {
      if (value >= 90) return 'Nutrisi sangat baik';
      if (value >= 80) return 'Nutrisi cukup baik';
      return 'Nutrisi perlu ditingkatkan';
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
    metricKey: 'suhu',
    formatValue: (value) => `${value}°C`,
    toneFromValue: (value) => getTemperatureTone(value),
    accentFromTone: (tone) => (tone === 'bad' ? '#D9534F' : '#4B9567'),
    noteFromTone: (tone) => tone === 'bad' ? 'Suhu terlalu tinggi untuk tanaman' : 'Suhu stabil untuk pertumbuhan'
  },
  {
    id: 'kelembapan',
    label: 'Kelembapan Tanah',
    labelColor: '#9BC19B',
    valueColor: '#385B38',
    iconKind: 'soil',
    iconSize: 44,
    iconBg: '#C7DDFB',
    metricKey: 'kelembapan',
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
    label: 'Cahaya',
    labelColor: '#FEF48A',
    valueColor: '#132A58',
    iconKind: 'sun',
    iconSrc: cahayaIcon,
    iconAlt: 'Ikon cahaya',
    iconSize: 44,
    iconBg: '#F6F286',
    metricKey: 'cahaya',
    formatValue: (value) => `${value}%`,
    toneFromValue: (value) => getLightTone(value),
    accentFromTone: (tone) => (tone === 'dim' ? '#D39A1C' : '#F6B400'),
    noteFromTone: (tone) => (tone === 'dim' ? 'Intensitas cahaya rendah' : 'Cahaya cukup untuk tanaman')
  }
];

const DashboardPage = () => {
  const [isWaterActive, setIsWaterActive] = useState(dashboardDummyData.controls.water.initiallyActive);
  const [waterAvailability, setWaterAvailability] = useState(dashboardDummyData.controls.water.initialAvailability);
  const [isVentActive, setIsVentActive] = useState(dashboardDummyData.controls.vent.initiallyActive);
  const [summaryState, setSummaryState] = useState(dashboardDummyData.summary);
  const [lastUpdated, setLastUpdated] = useState(dashboardDummyData.lastUpdated);
  const [isScrolled, setIsScrolled] = useState(false);
  const [statusMetrics, setStatusMetrics] = useState({
    nutrisi: 85,
    suhu: 95, // Disamakan dengan visual mockup (95%)
    kelembapan: 90,
    cahaya: 90
  });
  
  // Perhitungan grafik donat dibesarkan kembali agar prominent sebagai titik fokus
  const summaryPercentage = Number.parseInt(summaryState.score, 10) || 0;
  const ringRadius = 66; 
  const ringStroke = 14; 
  const progressCircumference = 2 * Math.PI * ringRadius;
  const progressOffset = progressCircumference * (1 - summaryPercentage / 100);

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

  const simulateUpdate = () => {
    const percentage = Math.floor(Math.random() * (98 - 78 + 1)) + 78;
    const level = percentage >= 90 ? 'Sangat Baik' : percentage >= 83 ? 'Baik' : 'Cukup';
    const lightRangeIsGood = Math.random() > 0.35;
    const soilRangeType = Math.random();
    const nextSoil = soilRangeType < 0.33 
      ? Math.floor(Math.random() * (90 - 80 + 1)) + 80
      : soilRangeType < 0.66 
        ? Math.floor(Math.random() * (70 - 50 + 1)) + 50
        : Math.floor(Math.random() * (40 - 10 + 1)) + 10;

    const nextMetrics = {
      nutrisi: Math.floor(Math.random() * (95 - 80 + 1)) + 80,
      suhu: Math.floor(Math.random() * (95 - 20 + 1)) + 20, // max 95 to simulate mockup occasionally
      kelembapan: nextSoil,
      cahaya: lightRangeIsGood ? Math.floor(Math.random() * (95 - 80 + 1)) + 80 : Math.floor(Math.random() * (30 - 10 + 1)) + 10
    };
    
    const noteIndex = Math.floor(Math.random() * dashboardDummyData.summaryNotes.length);
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    setStatusMetrics(nextMetrics);
    setSummaryState({
      score: `${percentage}%`,
      level,
      note: dashboardDummyData.summaryNotes[noteIndex]
    });
    setLastUpdated(`${hours}.${minutes}`);
  };

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
          
          {/* Row 1: Control Cards (Diberi items-start agar tidak melar ke bawah) */}
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
              
              {/* Layout 3 Kolom untuk Summary */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
                
                {/* Kiri: Last Updated (Dapat diklik untuk update - Menjaga Mockup Tampilan Tetap Bersih) */}
                <div 
                  className="flex flex-col space-y-1.5 cursor-pointer transition-opacity hover:opacity-70 group"
                  onClick={simulateUpdate}
                  title="Klik untuk simulasi update data"
                >
                  <div className="flex items-center gap-2 text-[13px] font-medium text-[#999]">
                    <span className="text-[15px]">🗓️</span>
                    <span>Terakhir di Update</span>
                  </div>
                  <p className="pl-6 text-[14px] font-medium text-[#444] transition-colors group-hover:text-[#4B9567]">
                    11 Mar 2026 - {lastUpdated}
                  </p>
                </div>

                {/* Tengah: Donut Chart Besar */}
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
                    
                    {/* Nilai di dalam Donat */}
                    <div className="relative z-10 flex flex-col items-center justify-center mt-1">
                      <p className="text-[13px] font-medium text-[#888]">Total</p>
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
                    <span className="text-[15px]">🗓️</span>
                    <span>Keterangan</span>
                  </div>
                  <p className="pl-6 text-[13px] leading-relaxed text-[#444] max-w-[240px]">
                    {summaryState.note}
                  </p>
                </div>

              </div>
            </div>

            {/* Status Cards (Diberikan jarak agak renggang dari Card Pantau Tanaman) */}
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