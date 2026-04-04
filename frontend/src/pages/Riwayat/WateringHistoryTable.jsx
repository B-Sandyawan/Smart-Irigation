import React from 'react';
import WateringStatusPill from './WateringStatusPill';

const WateringHistoryTable = ({ items }) => {
  return (
    <section className="w-full overflow-hidden rounded-[24px] border border-[#DCC9B9] bg-[#FFFCF8]">
      <div className="grid grid-cols-[1.3fr_1fr_1fr_0.8fr] gap-[12px] border-b border-[#E7D8CC] bg-[#F8EFE6] px-[24px] py-[16px]">
        <p className="text-[15px] leading-[1.275em] font-medium text-[#2C2C2C]">Zona Tanaman</p>
        <p className="text-[15px] leading-[1.275em] font-medium text-[#2C2C2C]">Waktu</p>
        <p className="text-[15px] leading-[1.275em] font-medium text-[#2C2C2C]">Durasi</p>
        <p className="text-[15px] leading-[1.275em] font-medium text-[#2C2C2C]">Status</p>
      </div>

      <div className="max-h-[468px] overflow-y-auto">
        {items.map((item) => (
          <article
            key={item.id}
            className="grid grid-cols-[1.3fr_1fr_1fr_0.8fr] items-center gap-[12px] border-b border-[#F0E2D7] px-[24px] py-[18px] last:border-b-0"
          >
            <div>
              <p className="text-[16px] leading-[1.275em] font-medium text-[#2D3B2E]">{item.zone}</p>
              <p className="mt-[2px] text-[13px] leading-[1.3em] text-[#7D7D7D]">{item.date}</p>
            </div>
            <p className="text-[15px] leading-[1.275em] text-[#333333]">{item.time}</p>
            <p className="text-[15px] leading-[1.275em] text-[#333333]">{item.duration}</p>
            <WateringStatusPill status={item.status} />
          </article>
        ))}
      </div>
    </section>
  );
};

export default WateringHistoryTable;
