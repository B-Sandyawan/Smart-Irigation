import React from 'react';

const STATUS_STYLE = {
  Berhasil: 'bg-[#E7F7EC] text-[#2A7A4A] border-[#C1E8CF]',
  Tertunda: 'bg-[#FFF5E8] text-[#9D5D16] border-[#F1D2AA]',
  Gagal: 'bg-[#FCEBEA] text-[#A33A32] border-[#E8C1BE]',
};

const WateringStatusPill = ({ status }) => {
  const className = STATUS_STYLE[status] || STATUS_STYLE.Tertunda;

  return (
    <span
      className={`inline-flex min-w-[88px] items-center justify-center rounded-[999px] border px-[12px] py-[4px] text-[12px] leading-[1.3em] font-medium ${className}`}
    >
      {status}
    </span>
  );
};

export default WateringStatusPill;
