import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#FEF9F3] font-sans">
      <Sidebar />
      <main className="flex-1 ml-[47px] pt-[34px] pr-[126px]">
        {/* ml-[47px] is gap from sidebar, pt-[34px] is top padding according to Figma */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
