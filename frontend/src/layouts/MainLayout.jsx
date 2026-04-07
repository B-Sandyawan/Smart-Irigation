import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#9BC19B] font-sans">
      <Sidebar />
      <main className="flex-1 pl-[clamp(128px,20vw,243px)]">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
