import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: (isActive) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke={isActive ? '#FFFFFF' : '#1C1C1C'} xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10L12 3L21 10V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V10Z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    name: 'Pantau Tanaman',
    path: '/plants',
    icon: (isActive) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke={isActive ? '#FFFFFF' : '#1C1C1C'} xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12C2 12 5.5 6.5 12 6.5C18.5 6.5 22 12 22 12C22 12 18.5 17.5 12 17.5C5.5 17.5 2 12 2 12Z" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="2.8" />
      </svg>
    )
  },
  {
    name: 'Profil',
    path: '/profile',
    icon: (isActive) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke={isActive ? '#FFFFFF' : '#1C1C1C'} xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="7.7" r="3.3" />
        <path d="M5 20.3C5 17.8 8.1 15.8 12 15.8C15.9 15.8 19 17.8 19 20.3" strokeLinecap="round"/>
      </svg>
    )
  }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-[228px] min-h-screen bg-[#F2EEE9] pt-[76px] pl-[31px] pr-[14px] box-border">
      <nav className="flex w-full flex-col gap-[7px]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex h-[41px] w-[165px] items-center rounded-[21px] pl-[17px] pr-[12px] transition-colors
                ${isActive ? 'bg-[#4B9567]' : 'hover:bg-[#E9DED4]'}`}
            >
              <div className="flex h-[17px] w-[17px] shrink-0 items-center justify-center">
                {item.icon(isActive)}
              </div>
              <span className={`ml-[10px] text-[15px] font-medium leading-[1.2] ${isActive ? 'text-[#FFFDFD]' : 'text-[#121212]'}`}>
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
