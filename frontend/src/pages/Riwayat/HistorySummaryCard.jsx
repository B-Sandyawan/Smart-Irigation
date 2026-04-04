import React from 'react';

const HistorySummaryCard = ({ title, value, unit, accent = 'bg-[#EACABF]' }) => {
  return (
    <article className="w-full min-h-[126px] rounded-[20px] border border-[#D9C7B8] bg-[#FFFCF8] p-[20px]">
      <div className={`w-[42px] h-[6px] rounded-[99px] ${accent}`} />
      <p className="mt-[18px] text-[16px] leading-[1.275em] text-[#4D4D4D] font-normal">{title}</p>
      <div className="mt-[8px] flex items-end gap-[6px]">
        <p className="text-[30px] leading-[1.2em] font-semibold text-[#2D3B2E]">{value}</p>
        {unit && <span className="pb-[4px] text-[14px] leading-[1.275em] text-[#6C6C6C]">{unit}</span>}
      </div>
    </article>
  );
};

export default HistorySummaryCard;
