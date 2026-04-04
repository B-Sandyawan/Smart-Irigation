import React from 'react';
import SensorChartCard from './SensorChartCard';

const SensorHistoryList = ({ items }) => {
  return (
    <div className="mt-[24px] flex flex-col gap-[22px]">
      {items.map((item) => (
        <SensorChartCard
          key={item.id}
          title={item.title}
          value={item.value}
          iconType={item.iconType}
          lineColor={item.lineColor}
          points={item.points}
        />
      ))}
    </div>
  );
};

export default SensorHistoryList;
