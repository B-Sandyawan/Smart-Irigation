import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: (isActive) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke={isActive ? '#FFFFFF' : '#000000'} xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10L12 3L21 10V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V10Z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    name: 'Pantau Tanaman',
    path: '/plants',
    icon: (isActive) => (
      <svg width="21" height="14" viewBox="0 0 21 14" fill="none" strokeWidth="2" stroke={isActive ? '#FFFFFF' : '#000000'} xmlns="http://www.w3.org/2000/svg">
        <path d="M10.4908 1.48L7.84478 6.77L1.23077 7.73001L6.01578 12.39L4.88676 18.98L10.4908 16.03L16.0948 18.98L14.9658 12.39L19.7508 7.73001L13.1368 6.77L10.4908 1.48Z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    name: 'Profil',
    path: '/profile',
    icon: (isActive) => (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" strokeWidth="2" stroke={isActive ? '#FFFFFF' : '#000000'} xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="11.5" r="5" />
        <path d="M5.0625 25.8906C5.0625 21.7766 9.51152 18.4375 15 18.4375C20.4885 18.4375 24.9375 21.7766 24.9375 25.8906" strokeLinecap="round"/>
      </svg>
    )
  }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-[334px] min-h-[982px] bg-[#FEF9F3] flex flex-col pt-[101px] pl-[47px] box-border relative">
      <nav className="flex flex-col gap-0 w-[239px]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center w-[239px] h-[49px] pl-[28px] pr-4 rounded-[25px] transition-colors relative box-border
                ${isActive ? 'bg-[#4B9567]' : 'hover:bg-[#EACABF]/20'}`}
            >
              <div className="flex-shrink-0 flex items-center justify-center w-[24px] h-[24px]">
                {item.icon(isActive)}
              </div>
              <span className={`ml-[13px] font-sans text-[20px] font-medium leading-[1.275em] ${isActive ? 'text-[#FFFDFD]' : 'text-[#000000]'}`}>
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
