import React from 'react';


import kangkungImage from '../../assets/kankung.png';

const PlantInfoCard = ({ 
  
  imageUrl = kangkungImage, 
  plantName = "Kangkung",
  plantSubtitle = "Tanaman dalam kebunku",
  plantDescription = "Kangkung adalah tanaman sayuran hijau yang tumbuh cepat dan banyak ditemukan di daerah berair."
}) => {
  return (
    <div className="w-full rounded-[18px] border border-[#5D5A56] bg-[#F3F0EC] px-5 py-6 shadow-[0_3px_8px_rgba(0,0,0,0.22)] flex flex-col items-center">

      <div className="flex justify-center mb-5">
        <div className="relative h-[184px] w-[184px] rounded-full overflow-hidden border border-[#6F6B66] bg-[#EFE1CF] flex items-center justify-center flex-shrink-0">
          <img
            src={imageUrl}
            alt={plantName}
            className="w-full h-full object-contain p-3 z-10"
          />
        </div>
      </div>

      <h2 className="text-center text-[#1F1F1F] text-[24px] font-bold leading-[1.1] mb-1">
        {plantName}
      </h2>
      <p className="text-center text-[#6A946A] text-[14px] font-semibold mb-4">
        {plantSubtitle}
      </p>

      <div className="flex justify-center w-full">
        <p className="max-w-[228px] text-center text-[#545454] text-[13px] font-medium leading-[1.25]">
          {plantDescription}
        </p>
      </div>

    </div>
  );
};

export default PlantInfoCard;