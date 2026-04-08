import React from 'react';


import kangkungImage from '../../assets/kankung.png';

const PlantInfoCard = ({ 
  
  imageUrl = kangkungImage, 
  plantName = "Kangkung",
  plantSubtitle = "Tanaman dalam kebunku",
  plantDescription = "Kangkung adalah tanaman sayuran hijau yang tumbuh cepat dan banyak ditemukan di daerah berair."
}) => {
  return (
    
    <div className="bg-white rounded-[24px] p-6 shadow-sm w-full flex flex-col items-center">
      

      <div className="flex justify-center mb-5">
        
        <div className="relative w-[180px] h-[180px] rounded-full overflow-hidden border-[4px] border-[#4B9567] bg-[#FDF4E9] flex items-center justify-center flex-shrink-0">
          <img
            src={imageUrl}
            alt={plantName}
            
            className="w-full h-full object-contain p-3 z-10"
          />
        </div>
      </div>

      
      <h2 className="text-center text-[#444] text-[24px] font-bold mb-1 tracking-tight">
        {plantName}
      </h2>
      <p className="text-center text-[#4B9567] text-[14px] font-bold mb-4">
        {plantSubtitle}
      </p>

      
      <div className="flex justify-center w-full">
        
        <p className="text-center text-[#888] text-[13px] font-medium leading-relaxed max-w-[240px]">
          {plantDescription}
        </p>
      </div>

    </div>
  );
};

export default PlantInfoCard;