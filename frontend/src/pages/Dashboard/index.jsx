import React, { useEffect, useMemo, useRef, useState } from 'react';
import ControlToggleCard from './ControlToggleCard';
import StatusInfoCard from './StatusInfoCard';
import nutrisiIcon from '../../assets/dashboard-icons/nutrisi.svg';
import suhuFillIcon from '../../assets/dashboard-icons/suhu-vector-1.png';
import suhuOutlineIcon from '../../assets/dashboard-icons/suhu-vector-2.png';
import cahayaIcon from '../../assets/dashboard-icons/cahaya.png';

const dashboardDummyData = {
  title: 'Dashboard',
  lastUpdated: '13:40',
  controls: {
    water: {
      title: 'Tombol Penyiram Air',
      readyText: 'Penyiram air siap',
      activeText: 'Penyiram air aktif',
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
      readyText: 'Ventilasi terbuka',
      activeText: 'Ventilasi tertutup',
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
    iconSize: 84,
    iconBg: '#C3DBC9',
    metricKey: 'nutrisi',
    formatValue: (value) => `${value}%`,
    accentFromTone: () => '#C4A884',
    noteFromValue: (value) => {
      if (value >= 90) {
        return 'Nutrisi sangat baik';
      }

      if (value >= 80) {
        return 'Nutrisi cukup baik';
      }

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
    iconBg: '#F6F286',
    metricKey: 'suhu',
    formatValue: (value) => `${value}°C`,
    toneFromValue: (value) => getTemperatureTone(value),
    accentFromTone: (tone) => (tone === 'bad' ? '#D9534F' : '#4B9567'),
    noteFromTone: (tone) =>
      tone === 'bad' ? 'Suhu terlalu tinggi untuk tanaman' : 'Suhu stabil untuk pertumbuhan'
  },
  {
    id: 'kelembapan',
    label: 'Kelembapan Tanah',
    labelColor: '#9BC19B',
    valueColor: '#385B38',
    iconKind: 'soil',
    iconBg: '#C7DDFB',
    metricKey: 'kelembapan',
    formatValue: (value) => `${value}%`,
    toneFromValue: (value) => getSoilTone(value),
    accentFromTone: (tone) => {
      if (tone === 'wet') {
        return '#5FA8FF';
      }

      if (tone === 'dry') {
        return '#9B7A56';
      }

      return '#4B9567';
    },
    noteFromTone: (tone) => {
      if (tone === 'wet') {
        return 'Tanah sangat lembap dan berair';
      }

      if (tone === 'dry') {
        return 'Tanah cenderung kering';
      }

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
  const [waterAvailability, setWaterAvailability] = useState(
    dashboardDummyData.controls.water.initialAvailability
  );
  const [isVentActive, setIsVentActive] = useState(dashboardDummyData.controls.vent.initiallyActive);
  const [summaryState, setSummaryState] = useState(dashboardDummyData.summary);
  const [lastUpdated, setLastUpdated] = useState(dashboardDummyData.lastUpdated);
  const [statusMetrics, setStatusMetrics] = useState({
    nutrisi: 85,
    suhu: 26,
    kelembapan: 65,
    cahaya: 88
  });
  const waterAutoOffRef = useRef(null);
  const summaryPercentage = Number.parseInt(summaryState.score, 10) || 0;
  const ringRadius = 112;
  const ringStroke = 26;
  const progressCircumference = 2 * Math.PI * ringRadius;
  const progressOffset = progressCircumference * (1 - summaryPercentage / 100);

  useEffect(() => {
    return () => {
      if (waterAutoOffRef.current) {
        clearTimeout(waterAutoOffRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const refillInterval = setInterval(() => {
      if (isWaterActive) {
        return;
      }

      setWaterAvailability((prev) => {
        if (prev >= 100) {
          return prev;
        }

        return Math.min(100, prev + 2);
      });
    }, 4000);

    return () => clearInterval(refillInterval);
  }, [isWaterActive]);

  const handleWaterToggle = () => {
    if (isWaterActive || waterAvailability <= 0) {
      return;
    }

    setIsWaterActive(true);
    setWaterAvailability((prev) => Math.max(0, prev - 8));

    if (waterAutoOffRef.current) {
      clearTimeout(waterAutoOffRef.current);
    }

    waterAutoOffRef.current = setTimeout(() => {
      setIsWaterActive(false);
      waterAutoOffRef.current = null;
    }, 5000);
  };

  const controlCards = useMemo(() => {
    const water = dashboardDummyData.controls.water;
    const vent = dashboardDummyData.controls.vent;

    return [
      {
        key: 'water',
        title: water.title,
        subtitle: isWaterActive ? water.activeText : water.readyText,
        isActive: isWaterActive,
        accentColor: isWaterActive ? water.accentOn : water.accentOff,
        iconType: water.iconType,
        iconBgOuter: water.iconBgOuter,
        iconBgInner: water.iconBgInner,
        availabilityPercent: waterAvailability,
        onToggle: handleWaterToggle
      },
      {
        key: 'vent',
        title: vent.title,
        subtitle: isVentActive ? vent.activeText : vent.readyText,
        isActive: isVentActive,
        accentColor: isVentActive ? vent.accentOn : vent.accentOff,
        iconType: vent.iconType,
        iconBgOuter: vent.iconBgOuter,
        iconBgInner: vent.iconBgInner,
        availabilityPercent: null,
        onToggle: () => setIsVentActive((prev) => !prev)
      }
    ];
  }, [isVentActive, isWaterActive, waterAvailability]);

  const simulateUpdate = () => {
    const percentage = Math.floor(Math.random() * (98 - 78 + 1)) + 78;
    const level = percentage >= 90 ? 'Sangat Baik' : percentage >= 83 ? 'Baik' : 'Cukup';
    const lightRangeIsGood = Math.random() > 0.35;
    const soilRangeType = Math.random();
    const nextSoil =
      soilRangeType < 0.33
        ? Math.floor(Math.random() * (90 - 80 + 1)) + 80
        : soilRangeType < 0.66
          ? Math.floor(Math.random() * (70 - 50 + 1)) + 50
          : Math.floor(Math.random() * (40 - 10 + 1)) + 10;

    const nextMetrics = {
      nutrisi: Math.floor(Math.random() * (95 - 80 + 1)) + 80,
      suhu: Math.floor(Math.random() * (40 - 20 + 1)) + 20,
      kelembapan: nextSoil,
      cahaya: lightRangeIsGood
        ? Math.floor(Math.random() * (90 - 40 + 1)) + 40
        : Math.floor(Math.random() * (30 - 10 + 1)) + 10
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
    setLastUpdated(`${hours}:${minutes}`);
  };

  return (
    <section className="min-h-screen bg-primary-light px-4 pb-7 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[980px]">
        <h1 className="text-[34px] font-bold leading-[1.35] text-[#2D3B2E]">{dashboardDummyData.title}</h1>

        <div className="mt-[48px] grid grid-cols-1 gap-[18px] xl:grid-cols-2 xl:gap-[32px]">
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

        <div className="mt-[48px] w-full rounded-[25px] bg-white px-6 py-7 shadow-[-4px_-4px_10px_rgba(0,0,0,0.15),4px_4px_10px_rgba(0,0,0,0.15)] sm:px-8 sm:py-8">
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_238px_minmax(0,1fr)] lg:items-center">
            <div className="space-y-2 lg:self-start lg:pt-[66px] lg:pl-[40px]">
              <p className="text-[18px] font-normal leading-[1.22] text-[#111111]">🗓️ Terakhir diperbarui</p>
              <p className="text-[18px] font-normal leading-[1.22] text-[#111111]">{lastUpdated}</p>
            </div>

            <div className="relative mx-auto flex h-[238px] w-[238px] flex-col items-center justify-center rounded-full bg-[#C3DBC9] shadow-[0_5px_10px_rgba(0,0,0,0.25)]">
              <svg className="absolute h-[222px] w-[222px] -rotate-90" viewBox="0 0 250 250" aria-hidden="true">
                <circle cx="125" cy="125" r={ringRadius} fill="none" stroke="#9BC19B" strokeWidth={ringStroke} opacity="0.55" />
                <circle
                  cx="125"
                  cy="125"
                  r={ringRadius}
                  fill="none"
                  stroke="#5A9E71"
                  strokeWidth={ringStroke}
                  strokeLinecap="butt"
                  strokeDasharray={progressCircumference}
                  strokeDashoffset={progressOffset}
                  className="transition-all duration-500"
                />
              </svg>

              <div className="absolute inset-[22px] rounded-full bg-[#F2EEE9]" />

              <div className="relative z-10 flex flex-col items-center justify-center">
                <p className="text-[18px] font-normal leading-[1.22] text-[rgba(19,42,88,0.41)]">Total</p>
                <p className="mt-[2px] text-[50px] font-medium leading-[1.18] text-[#385B38]">{summaryState.score}</p>
                <p className="text-[15px] font-normal leading-[1.22] text-[#111111]">{summaryState.level}</p>
              </div>

              <button
                type="button"
                onClick={simulateUpdate}
                className="relative z-10 mt-[8px] rounded-[10px] bg-[#4B9567] px-4 py-2.5 text-[14px] font-medium text-[#FFFDFD] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_10px_18px_rgba(75,149,103,0.33)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4B95674A]"
              >
                Update
              </button>
            </div>

            <div className="space-y-2 lg:self-start lg:pt-[66px]">
              <p className="text-[18px] font-normal leading-[1.22] text-[#111111]">🗓️ Keterangan</p>
              <p className="max-w-[470px] text-[18px] font-normal leading-[1.22] text-[#111111]">
                {summaryState.note}
              </p>
            </div>

          </div>

          <div className="mt-[28px] grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {statusCardTemplates.map((item) => {
              const metricValue = statusMetrics[item.metricKey];
              const tone = item.toneFromValue ? item.toneFromValue(metricValue) : 'neutral';
              const statusNote = item.noteFromTone
                ? item.noteFromTone(tone)
                : item.noteFromValue
                  ? item.noteFromValue(metricValue)
                  : '';

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
                  iconSize={item.iconSize}
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
    </section>
  );
};

export default DashboardPage;
