import React from 'react';

const DimSunIcon = () => (
  <svg viewBox="0 0 72 72" className="h-[54px] w-[54px]" aria-hidden="true">
    <circle cx="36" cy="36" r="12" fill="#D5B96B" opacity="0.7" />
    <g stroke="#B6953D" strokeWidth="5" strokeLinecap="round" opacity="0.35">
      <path d="M36 7v10" />
      <path d="M36 55v10" />
      <path d="M7 36h10" />
      <path d="M55 36h10" />
      <path d="M16.5 16.5l7 7" />
      <path d="M48.5 48.5l7 7" />
      <path d="M55.5 16.5l-7 7" />
      <path d="M23.5 48.5l-7 7" />
    </g>
  </svg>
);

const SoilIcon = ({ tone }) => {
  const isWet = tone === 'wet';
  const isStable = tone === 'stable';
  const soilColor = isWet ? '#7A5B3A' : isStable ? '#6F8F4B' : '#9B7A56';
  const topColor = isWet ? '#5FA8FF' : isStable ? '#9BC19B' : '#D9C4A5';
  const waterColor = '#5FA8FF';

  return (
    <svg viewBox="0 0 72 72" className="h-[48px] w-[48px]" aria-hidden="true">
      <path d="M12 39c6-4 12-5 18-3 7 2 11 7 18 7 8 0 12-5 12-5v16H12V39Z" fill={soilColor} />
      <path d="M12 39c6-4 12-5 18-3 7 2 11 7 18 7 8 0 12-5 12-5v7c-5 4-9 6-16 6-8 0-12-4-19-6-6-2-12-1-13 0v-6Z" fill={topColor} opacity={isWet ? 0.85 : 1} />
      {isWet ? (
        <>
          <path d="M36 18c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z" fill={waterColor} />
          <path d="M22 21c3 4 4 6 4 8a4 4 0 0 1-8 0c0-2 1-4 4-8Z" fill={waterColor} opacity="0.85" />
          <path d="M50 21c3 4 4 6 4 8a4 4 0 0 1-8 0c0-2 1-4 4-8Z" fill={waterColor} opacity="0.85" />
        </>
      ) : isStable ? (
        <>
          <path d="M36 21v10" stroke="#4B9567" strokeWidth="3" strokeLinecap="round" />
          <path d="M36 26c4-4 8-3 10 1-4 1-8 1-10-1Z" fill="#4B9567" />
          <path d="M36 30c-4-4-8-3-10 1 4 1 8 1 10-1Z" fill="#4B9567" />
        </>
      ) : (
        <>
          <path d="M19 24h10" stroke={soilColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M45 24h8" stroke={soilColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M33 31h6" stroke={soilColor} strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
};

const StatusInfoCard = ({
  label,
  labelColor,
  value,
  valueColor,
  icon,
  iconSrc,
  iconOverlaySrc,
  iconAlt,
  iconSize,
  iconKind,
  tone,
  accentColor,
  statusNote,
  iconBg
}) => {
  const isTemperatureIcon = iconKind === 'temperature';
  const isSunIcon = iconKind === 'sun';
  const isSoilIcon = iconKind === 'soil';
  const temperatureFilter = tone === 'bad' ? 'none' : 'hue-rotate(120deg) saturate(1.2) brightness(0.9)';
  const sunFilter = tone === 'dim' ? 'grayscale(0.35) brightness(0.65) saturate(0.7)' : 'none';
  const sunOpacity = tone === 'dim' ? 0.72 : 1;

  return (
    <article className="relative h-[120px] w-full rounded-[20px] bg-white px-[16px] py-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      <p className="text-[14px] font-bold leading-[1.22]" style={{ color: labelColor || '#132A58' }}>{label}</p>
      <p className="mt-[8px] text-[20px] font-normal leading-[1.22]" style={{ color: valueColor }}>
        {value}
      </p>
      {statusNote ? (
        <p className="mt-[4px] max-w-[130px] text-[11px] font-medium leading-[1.3]" style={{ color: accentColor || '#C4A884' }}>
          {statusNote}
        </p>
      ) : null}

      <div
        className="absolute right-[10px] top-[14px] flex h-[80px] w-[76px] items-center justify-center rounded-full border-[5px]"
        style={{ borderColor: accentColor || '#C4A884', backgroundColor: iconBg }}
        aria-hidden="true"
      >
        <div
          className="flex h-[66px] w-[62px] items-center justify-center rounded-full"
          style={{ backgroundColor: '#FFFFFF' }}
          aria-hidden="true"
        >
          {isTemperatureIcon && iconSrc && iconOverlaySrc ? (
            <div className="relative h-[48px] w-[48px]">
              <img
                src={iconSrc}
                alt={iconAlt || ''}
                className="absolute inset-0 h-full w-full object-contain"
                aria-hidden={iconAlt ? undefined : 'true'}
              />
              <img
                src={iconOverlaySrc}
                alt=""
                className="absolute inset-0 h-full w-full object-contain"
                style={{ filter: temperatureFilter }}
                aria-hidden="true"
              />
            </div>
          ) : isSunIcon ? (
            tone === 'dim' ? (
              <DimSunIcon />
            ) : (
              <img
                src={iconSrc}
                alt={iconAlt || ''}
                className="h-[54px] w-[54px] object-contain"
                style={{ filter: sunFilter, opacity: sunOpacity }}
                aria-hidden={iconAlt ? undefined : 'true'}
              />
            )
          ) : isSoilIcon ? (
            <SoilIcon tone={tone} />
          ) : iconSrc ? (
            <img
              src={iconSrc}
              alt={iconAlt || ''}
              className="object-contain"
              style={{ width: `${iconSize || 48}px`, height: `${iconSize || 48}px` }}
              aria-hidden={iconAlt ? undefined : 'true'}
            />
          ) : (
            <span className="text-[28px] leading-none">{icon}</span>
          )}
        </div>
      </div>
    </article>
  );
};

export default StatusInfoCard;