import React from 'react';

const axisY = [0, 25, 50, 75, 100];
const axisX = ['Feb', 'March', 'Apr', 'May'];

const DropletIcon = () => (
  <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M7 1.2C5.4 3.6 1.5 7.4 1.5 11.1C1.5 14.1 3.9 16.5 7 16.5C10.1 16.5 12.5 14.1 12.5 11.1C12.5 7.4 8.6 3.6 7 1.2Z" stroke="#4FA3F0" strokeWidth="1.3"/>
  </svg>
);

const SproutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M7.5 13.5V8" stroke="#A07D49" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M7.4 8.5C7.4 5.8 9.2 3.7 11.8 3.2C11.8 5.8 10.5 8.4 7.4 8.5Z" fill="#C39A5E"/>
    <path d="M7.6 9C4.7 8.8 3.1 6.9 2.7 4.3C5.4 4.2 7.3 6.1 7.6 9Z" fill="#B9925A"/>
  </svg>
);

const ThermoIcon = () => (
  <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4.5 3.2C4.5 2.1 5.4 1.2 6.5 1.2C7.6 1.2 8.5 2.1 8.5 3.2V10.1C9.7 10.8 10.5 12.1 10.5 13.6C10.5 15.8 8.7 17.6 6.5 17.6C4.3 17.6 2.5 15.8 2.5 13.6C2.5 12.1 3.3 10.8 4.5 10.1V3.2Z" stroke="#D56C5C" strokeWidth="1.2"/>
    <circle cx="6.5" cy="13.7" r="1.7" fill="#E07C6E"/>
  </svg>
);

const iconByType = {
  humidity: <DropletIcon />,
  soil: <SproutIcon />,
  temperature: <ThermoIcon />,
};

const SensorChartCard = ({ title, value, iconType = 'humidity', lineColor = '#8CC8F9', points }) => {
  const chartWidth = 760;
  const chartHeight = 130;
  const leftPad = 26;
  const rightPad = 16;
  const topPad = 12;
  const bottomPad = 24;

  const plotWidth = chartWidth - leftPad - rightPad;
  const plotHeight = chartHeight - topPad - bottomPad;

  const polylinePoints = points
    .map((point, index) => {
      const x = leftPad + (plotWidth / (points.length - 1)) * index;
      const y = topPad + ((100 - point) / 100) * plotHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <article className="rounded-[22px] bg-[#F2F2F2] px-[24px] py-[18px] shadow-[0_10px_16px_rgba(72,97,70,0.25)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          {iconByType[iconType] || iconByType.humidity}
          <h3 className="text-[31px] font-semibold leading-[1.1] text-[#1F1F1F]">{title}</h3>
        </div>
        <p className="text-[34px] font-semibold leading-[1] text-[#111111]">{value}</p>
      </div>

      <div className="mt-[8px] overflow-x-auto">
        <svg className="min-w-[760px]" width="760" height="130" viewBox="0 0 760 130" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {axisY.map((tick) => {
            const y = topPad + ((100 - tick) / 100) * plotHeight;
            return (
              <g key={tick}>
                <line x1={leftPad} y1={y} x2={chartWidth - rightPad} y2={y} stroke="#BDBDBD" strokeWidth="1" />
                <text x={leftPad - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#3B3B3B">
                  {tick}
                </text>
              </g>
            );
          })}

          {[1, 2, 3, 4].map((index) => {
            const x = leftPad + (plotWidth / 5) * index;
            return <line key={index} x1={x} y1={topPad} x2={x} y2={topPad + plotHeight} stroke="#C8C8C8" strokeWidth="1" />;
          })}

          <polyline points={polylinePoints} fill="none" stroke={lineColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />

          {axisX.map((label, index) => {
            const x = leftPad + (plotWidth / (axisX.length + 1)) * (index + 1);
            const y = topPad + plotHeight + 13;
            return (
              <text key={label} x={x} y={y} textAnchor="middle" fontSize="10" fill="#2D2D2D">
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    </article>
  );
};

export default SensorChartCard;
