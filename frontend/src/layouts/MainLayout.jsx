import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    // 1. h-screen dan w-screen mengunci ukuran pas se-layar HP/Laptop
    // 2. overflow-hidden menghentikan semua scroll "liar" dari background
    // 3. overscroll-none mematikan efek ditarik/mantul bawaan browser HP
    <div className="h-screen w-screen overflow-hidden bg-[#9BC19B] font-sans overscroll-none relative">
      
      <Sidebar />
      
      {/* - h-full: Mengisi sisa ruang secara pas
        - pb-[100px]: Memberi ruang kosong di bawah untuk Sidebar versi Mobile (agar konten tidak tertutup)
        - md:pb-0 md:pl-[116px]: Di Laptop, ruang bawah dihilangkan dan diganti ruang di kiri untuk Sidebar vertikal
        - [&>*]:!h-full: Ini trik penting! Memaksa halaman di dalamnya (Dashboard/Profil) agar pas mengikuti wadah ini, 
          sehingga bagian area scroll-nya berfungsi dengan sempurna.
      */}
      <main className="h-full w-full pb-[100px] md:pb-0 md:pl-[116px] lg:pl-[124px] [&>*]:!h-full">
        <Outlet />
      </main>
      
    </div>
  );
};

export default MainLayout;