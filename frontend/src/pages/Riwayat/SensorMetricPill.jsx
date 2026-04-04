import React from 'react';

const SensorMetricPill = ({ label, value }) => {
  return (
    <span className="inline-flex items-center gap-[6px] rounded-[999px] border border-[#DDE8DD] bg-[#F8FBF7] px-[10px] py-[4px] text-[11px] leading-[1.2] text-[#3F5642]">
      <span className="font-medium">{label}</span>
      <span className="font-semibold text-[#2D3B2E]">{value}</span>
    </span>
  );
};

export default SensorMetricPill;
