import React from 'react';

// ↓↓↓ MASUKKAN LINK GAMBAR KANGKUNG KAMU DI SINI UNTUK DEFAULT ↓↓↓
import kangkungImage from '../../assets/17065c4e3231a60b9b413a8146e43809 1.png';
// ↑↑↑ ========================================================== ↑↑↑

/**
 * PlantInfoCard Component
 * * Menampilkan informasi tanaman kangkung dengan gambar dalam frame lingkaran
 * yang utuh dan presisi (tidak terpotong).
 * * Tipografi: font-sans (Montserrat/MPLUS), warna teks abu gelap `#444` dan hijau Dashboard `#4B9567`.
 */
const PlantInfoCard = ({ 
  // Jika prop 'imageUrl' tidak dikirim, akan menggunakan kangkungImage yang diimport di atas.
  imageUrl = kangkungImage, 
  plantName = "Kangkung",
  plantSubtitle = "Tanaman dalam kebunku",
  plantDescription = "Kangkung adalah tanaman sayuran hijau yang tumbuh cepat dan banyak ditemukan di daerah berair."
}) => {
  return (
    // Latar belakang putih dan shadow ringan ala Dashboard
    <div className="bg-white rounded-[24px] p-6 shadow-sm w-full flex flex-col items-center">
      
      {/* ============================================================
          Frame Lingkaran Tanaman
          ============================================================ */}
      <div className="flex justify-center mb-5">
        {/*
          1. w-[180px] h-[180px] -> Ukuran lingkaran sebanding dashboard
          2. rounded-full overflow-hidden border-[4px] border-[#4B9567] -> Membuat frame lingkaran hijau
          3. bg-[#FDF4E9] -> Memberi warna krem di dalam lingkaran
          4. flex items-center justify-center -> Menengahkan gambar di dalam lingkaran
        */}
        <div className="relative w-[180px] h-[180px] rounded-full overflow-hidden border-[4px] border-[#4B9567] bg-[#FDF4E9] flex items-center justify-center flex-shrink-0">
          <img
            src={imageUrl}
            alt={plantName}
            // MENGUBAH 'object-cover' MENJADI 'object-contain' agar gambar tampak utuh, tidak terpotong,
            // dan presisi di tengah.
            // Ditambah p-3 agar ada sedikit jarak aman dari garis tepi (border).
            className="w-full h-full object-contain p-3 z-10"
          />
        </div>
      </div>

      {/* ============================================================
          Judul & Subtitle
          ============================================================ */}
      <h2 className="text-center text-[#444] text-[24px] font-bold mb-1 tracking-tight">
        {plantName}
      </h2>
      <p className="text-center text-[#4B9567] text-[14px] font-bold mb-4">
        {plantSubtitle}
      </p>

      {/* ============================================================
          Deskripsi
          ============================================================ */}
      <div className="flex justify-center w-full">
        {/* Jarak antar baris disesuaikan (leading-relaxed) agar rapi */}
        <p className="text-center text-[#888] text-[13px] font-medium leading-relaxed max-w-[240px]">
          {plantDescription}
        </p>
      </div>

    </div>
  );
};

export default PlantInfoCard;