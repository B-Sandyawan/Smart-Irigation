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
      className="relative h-[350px] w-full rounded-[25px] bg-white p-[22px] shadow-[-4px_4px_10px_rgba(0,0,0,0.16),4px_-4px_10px_rgba(0,0,0,0.16)]"
      aria-label={title}
    >
      <p className="text-[20px] font-bold leading-[1.485] text-[#949494]">{title}</p>
      <p
        className="mt-[2px] text-[20px] font-bold leading-[1.485]"
        style={{ color: accentColor }}
      >
        {subtitle}
      </p>

      <button
        type="button"
        onClick={onToggle}
        className="group absolute left-1/2 top-[100px] flex h-[206px] w-[206px] -translate-x-1/2 items-center justify-center rounded-full border-0 p-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_28px_rgba(0,0,0,0.24)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4B95674A]"
        style={{ backgroundColor: iconBgOuter, boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)' }}
        aria-pressed={isActive}
        aria-label={`${title} ${isActive ? 'aktif' : 'nonaktif'}${isWaterMeter ? `, air ${Math.round(clampedAvailability)}%` : ''}`}
      >
        <span
          className="relative z-10 flex h-[178px] w-[178px] items-center justify-center rounded-full transition-all duration-200 group-hover:scale-[1.015]"
          style={{ backgroundColor: iconBgInner }}
        >
          {isWaterMeter ? (
            <svg
              className="pointer-events-none absolute inset-0 z-0 h-[178px] w-[178px]"
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
            className="relative z-10 h-[142px] w-[146px] object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,0.18)]"
            aria-hidden="true"
          />
        </span>
      </button>

      <p className="absolute bottom-[18px] left-[22px] text-[20px] font-bold leading-[1.485] text-[#949494]">
        {isActive ? 'Sedang Aktif' : 'Sedang Nonaktif'}
      </p>

      {isWaterMeter ? (
        <p className="absolute bottom-[18px] right-[22px] text-[16px] font-semibold leading-[1.2] text-[#163E8E]">
          {Math.round(clampedAvailability)}%
        </p>
      ) : null}
    </section>
  );
};

export default ControlToggleCard;
