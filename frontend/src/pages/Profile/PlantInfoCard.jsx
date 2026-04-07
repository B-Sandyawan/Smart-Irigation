import React from 'react';

/**
 * PlantInfoCard Component
 * 
 * Menampilkan informasi tanaman kangkung dengan gambar dalam frame lingkaran
 * Tipografi:
 * - Judul: M PLUS 1p Bold
 * - Subtitle & Description: Montserrat Regular/Bold
 */
const PlantInfoCard = ({ 
  imageUrl, 
  plantName = "Kangkung",
  plantSubtitle = "Tanaman dalam kebunku",
  plantDescription = "Kangkung adalah tanaman sayuran hijau yang tumbuh cepat dan banyak ditemukan di daerah berair."
}) => {
  return (
    <div className="bg-[#FEF9F3] rounded-2xl p-4 shadow-md w-full">
      
      {/* ============================================================
          PLANT IMAGE - CIRCULAR FRAME
          ============================================================ */}
      <div className="flex justify-center mb-2">
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-[#9BC19B] shadow-md flex-shrink-0">
          <img
            src={imageUrl}
            alt={plantName}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* ============================================================
          PLANT TITLE - M PLUS 1p BOLD
          ============================================================ */}
      <h2 className="text-center text-[#1a1a1a] text-[24px] font-['M_PLUS_1p'] font-bold mb-1">
        {plantName}
      </h2>

      {/* ============================================================
          PLANT SUBTITLE - MONTSERRAT BOLD
          ============================================================ */}
      <p className="text-center text-[#9BC19B] text-[13px] font-['Montserrat'] font-bold mb-2">
        {plantSubtitle}
      </p>

      {/* ============================================================
          PLANT DESCRIPTION - MONTSERRAT REGULAR (3 LINES)
          ============================================================ */}
      <div className="flex justify-center">
        <p className="text-center text-[#1a1a1a] text-[12px] font-['Montserrat'] font-normal leading-relaxed max-w-[240px]">
          {plantDescription}
        </p>
      </div>

    </div>
  );
};

export default PlantInfoCard;
