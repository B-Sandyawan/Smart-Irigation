import React from 'react';
import group20Icon from '../../assets/Group 20.svg';
import group279Icon from '../../assets/Group 279.svg';

const iconTypeMap = {
  water: group20Icon,
  vent: group279Icon
};

const ControlToggleCard = ({
  title,
  subtitle,
  isActive,
  iconType,
  accentColor,
  iconBgOuter,
  iconBgInner,
  availabilityPercent,
  onToggle
}) => {
  const hasCircularMeter = typeof availabilityPercent === 'number';
  const isWaterMeter = hasCircularMeter && iconType === 'water';
  const clampedAvailability = Math.max(0, Math.min(100, availabilityPercent ?? 0));
  const meterVisibleLength = clampedAvailability * 0.75;

  return (
    <section
      className="relative h-[200px] w-full rounded-[20px] bg-white p-[16px] shadow-[-4px_4px_10px_rgba(0,0,0,0.16),4px_-4px_10px_rgba(0,0,0,0.16)]"
      aria-label={title}
    >
      <p className="text-[14px] font-bold leading-[1.485] text-[#949494]">{title}</p>
      <p
        className="mt-[2px] text-[14px] font-bold leading-[1.485]"
        style={{ color: accentColor }}
      >
        {subtitle}
      </p>

      <button
        type="button"
        onClick={onToggle}
        className="group absolute left-1/2 top-[65px] flex h-[100px] w-[100px] -translate-x-1/2 items-center justify-center rounded-full border-0 p-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_28px_rgba(0,0,0,0.24)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4B95674A]"
        style={{ backgroundColor: iconBgOuter, boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)' }}
        aria-pressed={isActive}
        aria-label={`${title} ${isActive ? 'aktif' : 'nonaktif'}${isWaterMeter ? ', indikator air aktif' : ''}`}
      >
        <span
          className="relative z-10 flex h-[84px] w-[84px] items-center justify-center rounded-full transition-all duration-200 group-hover:scale-[1.015]"
          style={{ backgroundColor: iconBgInner }}
        >
          {isWaterMeter ? (
            <svg
              className="pointer-events-none absolute inset-0 z-0 h-[84px] w-[84px]"
              viewBox="0 0 178 178"
              aria-hidden="true"
            >
              <circle
                cx="89"
                cy="89"
                r="75"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={10}
                strokeLinecap="round"
                opacity="0.95"
                pathLength="100"
                strokeDasharray="75 25"
                transform="rotate(-90 89 89)"
              />
              <circle
                cx="89"
                cy="89"
                r="75"
                fill="none"
                stroke="#163E8E"
                strokeWidth={10}
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray={`${meterVisibleLength} 100`}
                transform="rotate(-90 89 89)"
                className="transition-all duration-500"
              />
            </svg>
          ) : null}

          <img
            src={iconTypeMap[iconType]}
            alt=""
            className="relative z-10 h-[60px] w-[60px] object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,0.18)]"
            aria-hidden="true"
          />
        </span>
      </button>

      <p className="absolute bottom-[12px] left-[16px] text-[12px] font-bold leading-[1.485] text-[#949494]">
        {isActive ? 'Sedang Aktif' : 'Sedang Nonaktif'}
      </p>

    </section>
  );
};

export default ControlToggleCard;