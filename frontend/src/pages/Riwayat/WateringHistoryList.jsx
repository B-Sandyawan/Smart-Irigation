import React from 'react';

const statusStyles = {
  Selesai: 'bg-[#C3DBC9] text-[#385B38]',
  Gagal: 'bg-[#FCEBEA] text-[#D9534F]',
};

const LeafIcon = () => (
  <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M23 10.2C23 17.2 17.7 22 11 22C9.7 22 8.4 21.8 7.3 21.3C6.8 20.2 6.5 19 6.5 17.7C6.5 11 11.3 5.7 18.3 5.7C19.9 5.7 21.5 6 23 6.6V10.2Z" fill="#FFFFFF"/>
    <path d="M10 14.8C11.8 17.4 14.4 19.5 17.8 21" stroke="#4B9567" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M11.9 18C10.2 17.9 8.6 17.4 7.2 16.5" stroke="#4B9567" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M14.4 15C14.2 13.2 14.6 11.5 15.4 10" stroke="#4B9567" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const WateringHistoryList = ({ items }) => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {items.map((item) => {
        const statusClass = statusStyles[item.status] || statusStyles.Selesai;

        return (
          <article
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-[20px] bg-white px-5 py-4 shadow-sm"
          >
            <div className="flex min-w-0 items-center gap-4">
              
              <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#4B9567]">
                <LeafIcon />
              </div>

              <div className="min-w-0">
                
                <p className="truncate text-[15px] font-bold leading-tight text-[#444]">{item.primaryText}</p>
                <p className="mt-1 text-[13px] font-medium leading-tight text-[#999]">{item.secondaryText}</p>
              </div>
            </div>

            <span
              className={`inline-flex h-[28px] min-w-[90px] shrink-0 items-center justify-center rounded-full px-4 text-[13px] font-bold tracking-wide ${statusClass}`}
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