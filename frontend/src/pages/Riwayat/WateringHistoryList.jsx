import React from 'react';

const statusStyles = {
  Selesai: 'bg-[#BFE2CF] text-[#10804C]',
  Gagal: 'bg-[#EBCFCF] text-[#C91515]',
};

const LeafIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M23 10.2C23 17.2 17.7 22 11 22C9.7 22 8.4 21.8 7.3 21.3C6.8 20.2 6.5 19 6.5 17.7C6.5 11 11.3 5.7 18.3 5.7C19.9 5.7 21.5 6 23 6.6V10.2Z" fill="#FFFFFF"/>
    <path d="M10 14.8C11.8 17.4 14.4 19.5 17.8 21" stroke="#5EA276" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M11.9 18C10.2 17.9 8.6 17.4 7.2 16.5" stroke="#5EA276" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M14.4 15C14.2 13.2 14.6 11.5 15.4 10" stroke="#5EA276" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const WateringHistoryList = ({ items }) => {
  return (
    <div className="mt-[24px] flex flex-col gap-[22px]">
      {items.map((item) => {
        const statusClass = statusStyles[item.status] || statusStyles.Selesai;

        return (
          <article
            key={item.id}
            className="flex items-center justify-between gap-[18px] rounded-[14px] bg-[#F2F2F2] px-[22px] py-[8px] shadow-[0_6px_12px_rgba(49,77,54,0.18)]"
          >
            <div className="flex min-w-0 items-center gap-[18px]">
              <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#5EA276]">
                <LeafIcon />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold leading-[1.2] text-[#39403B]">{item.primaryText}</p>
                <p className="mt-[2px] text-[12px] font-medium leading-[1.2] text-[#6A6F69]">{item.secondaryText}</p>
              </div>
            </div>

            <span
              className={`inline-flex h-[24px] min-w-[136px] shrink-0 items-center justify-center rounded-[999px] px-[20px] text-[18px] font-semibold leading-[1] ${statusClass}`}
            >
              {item.status}
            </span>
          </article>
        );
      })}
    </div>
  );
};

export default WateringHistoryList;
