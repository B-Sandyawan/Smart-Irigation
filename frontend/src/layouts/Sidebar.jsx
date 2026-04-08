import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: '/icons/home.svg',
    iconWidth: 'w-[24px]',
    alt: 'Home'
  },
  {
    name: 'Pantau Tanaman',
    path: '/plants',
    icon: '/icons/eye.svg',
    iconWidth: 'w-[28px]',
    alt: 'Pantau Tanaman'
  },
  {
    name: 'Profil',
    path: '/profile',
    icon: '/icons/profile.svg',
    iconWidth: 'w-[22px]',
    alt: 'Profil'
  }
];

const Sidebar = () => {
  const location = useLocation();
  const navRef = useRef(null);
  const navItemRefs = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, left: 0 });

  const activeIndex = useMemo(() => {
    const index = navItems.findIndex((item) => item.path === location.pathname);
    return index >= 0 ? index : 0;
  }, [location.pathname]);

  const updateIndicatorPosition = useCallback(() => {
    const navElement = navRef.current;
    const activeItem = navItemRefs.current[activeIndex];

    if (!navElement || !activeItem) {
      return;
    }

    const navRect = navElement.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    
    // Menyimpan koordinat Y (Desktop) dan X (Mobile) sekaligus
    setIndicatorStyle({
      top: itemRect.top - navRect.top,
      left: itemRect.left - navRect.left,
    });
  }, [activeIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateIndicatorPosition();
    }, 50);
    return () => clearTimeout(timer);
  }, [updateIndicatorPosition]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicatorPosition);
    return () => window.removeEventListener('resize', updateIndicatorPosition);
  }, [updateIndicatorPosition]);

  return (
    <aside className="fixed z-20 flex bg-[#FEF9F3] transition-all duration-300 shadow-sm 
      /* Konfigurasi Mobile (Bottom Navigation) */
      bottom-[16px] left-[16px] right-[16px] h-[76px] flex-row items-center justify-between rounded-[32px] px-6
      /* Konfigurasi Desktop (Sidebar Vertical) */
      md:bottom-[24px] md:left-[24px] md:top-[24px] md:right-auto md:w-[76px] md:flex-col md:justify-start md:px-0 md:pt-8 md:h-auto lg:bottom-[32px] lg:left-[32px] lg:top-[32px]">
      
      {/* Logo - Hanya tampil di desktop */}
      <div className="mb-10 hidden w-full justify-center md:flex">
        <img src="/icons/logo.png" alt="Logo" className="h-auto w-[38px]" />
      </div>

      <nav ref={navRef} className="relative flex h-full w-full flex-row items-center justify-between md:h-auto md:flex-col">
        
        {/* --- INDICATOR MOBILE (Bottom Nav) --- */}
        <div
          className="pointer-events-none absolute top-[-1px] z-[1] h-[50px] w-[76px] rounded-b-[32px] bg-[#9BC19B] transition-[left] duration-300 ease-in-out md:hidden"
          style={{ left: `${indicatorStyle.left}px` }}
        >
          {/* Lingkaran dalam putih krem */}
          <div className="absolute left-[12px] top-[-10px] z-[5] h-[52px] w-[52px] rounded-full bg-[#FEF9F3]" />
          {/* Lekukan kiri */}
          <div className="absolute left-[-24px] top-0 h-[24px] w-[24px] [background-image:radial-gradient(circle_at_bottom_left,transparent_23px,#9BC19B_24px)]" />
          {/* Lekukan kanan */}
          <div className="absolute right-[-24px] top-0 h-[24px] w-[24px] [background-image:radial-gradient(circle_at_bottom_right,transparent_23px,#9BC19B_24px)]" />
        </div>

        {/* --- INDICATOR DESKTOP (Sidebar) --- */}
        <div
          className="pointer-events-none absolute right-[-1px] z-[1] hidden h-[80px] w-[50px] rounded-l-[32px] bg-[#9BC19B] transition-[top] duration-300 ease-in-out md:block"
          style={{ top: `${indicatorStyle.top}px` }}
        >
          {/* Lingkaran dalam putih krem */}
          <div className="absolute right-[-26px] top-[14px] z-[5] h-[52px] w-[52px] rounded-full bg-[#FEF9F3]" />
          {/* Lekukan atas */}
          <div className="absolute right-0 top-[-24px] h-[24px] w-[24px] [background-image:radial-gradient(circle_at_top_left,transparent_23px,#9BC19B_24px)]" />
          {/* Lekukan bawah */}
          <div className="absolute bottom-[-24px] right-0 h-[24px] w-[24px] [background-image:radial-gradient(circle_at_bottom_left,transparent_23px,#9BC19B_24px)]" />
        </div>

        {/* Navigasi Menu */}
        {navItems.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              ref={(element) => {
                navItemRefs.current[index] = element;
              }}
              aria-label={item.name}
              className="relative z-[2] flex h-full w-[76px] items-center justify-center md:h-[80px] md:w-full"
            >
              <div
                className={`flex h-[44px] w-[44px] items-center justify-center rounded-full transition-transform duration-300 ease-in-out ${
                  isActive
                    ? 'translate-y-[-24px] md:translate-x-[38px] md:translate-y-0' // Geser ke atas di HP, geser ke kanan di Desktop
                    : 'hover:scale-110'
                }`}
              >
                <img src={item.icon} alt={item.alt} className={`${item.iconWidth} h-auto`} />
              </div>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;