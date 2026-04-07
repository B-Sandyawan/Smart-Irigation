import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: '/icons/home.svg',
    iconClass: 'w-[clamp(22px,3.2vw,42px)]',
    alt: 'Home'
  },
  {
    name: 'Pantau Tanaman',
    path: '/plants',
    icon: '/icons/eye.svg',
    iconClass: 'w-[clamp(25px,3.7vw,48px)]',
    alt: 'Pantau Tanaman'
  },
  {
    name: 'Profil',
    path: '/profile',
    icon: '/icons/profile.svg',
    iconClass: 'w-[clamp(21px,3vw,40px)]',
    alt: 'Profil'
  }
];

const Sidebar = () => {
  const location = useLocation();
  const navRef = useRef(null);
  const navItemRefs = useRef([]);
  const [indicatorTop, setIndicatorTop] = useState(0);

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
    setIndicatorTop(itemRect.top - navRect.top);
  }, [activeIndex]);

  useEffect(() => {
    updateIndicatorPosition();
  }, [updateIndicatorPosition]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicatorPosition);
    return () => window.removeEventListener('resize', updateIndicatorPosition);
  }, [updateIndicatorPosition]);

  return (
    <aside className="fixed left-[clamp(10px,3vw,38px)] top-[5vh] z-20 flex h-[90vh] w-[clamp(84px,11vw,140px)] flex-col items-center rounded-[clamp(16px,3vw,34px)] bg-[#FEF9F3] pt-[clamp(8px,1.4vw,16px)]">
      <div className="mb-[clamp(16px,6vw,56px)] mt-[clamp(6px,1.4vw,16px)] flex w-full justify-center">
        <img src="/icons/logo.png" alt="Logo" className="h-auto w-[clamp(30px,4.2vw,58px)]" />
      </div>

      <nav ref={navRef} className="relative flex w-full flex-col">
        <div
          className="pointer-events-none absolute right-[-1px] z-[1] h-[clamp(82px,11.5vw,124px)] w-[clamp(45px,4.36vw,80px)] rounded-[clamp(36px,5vw,62px)_0_0_clamp(36px,5vw,62px)] bg-[#9BC19B] transition-[top] duration-300 [transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)] [--curve-w:clamp(29px,4.3vw,54px)] [--curve-h:clamp(25px,3.8vw,48px)]"
          style={{ top: `${indicatorTop}px` }}
        >
          <div className="absolute right-[clamp(-44px,-3.1vw,-26px)] top-[clamp(10px,1.4vw,16px)] z-[5] h-[clamp(58px,8.2vw,98px)] w-[clamp(58px,8.2vw,98px)] rounded-full bg-[#FEF9F3]" />
          <div className="absolute right-0 top-[calc(var(--curve-h)*-1+1px)] h-[var(--curve-h)] w-[var(--curve-w)] [background-image:radial-gradient(circle_at_top_left,transparent_calc(var(--curve-w)-1px),#9BC19B_var(--curve-w))]" />
          <div className="absolute bottom-[calc(var(--curve-h)*-1+1px)] right-0 h-[var(--curve-h)] w-[var(--curve-w)] [background-image:radial-gradient(circle_at_bottom_left,transparent_calc(var(--curve-w)-1px),#9BC19B_var(--curve-w))]" />
        </div>

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
              className="relative z-[2] flex h-[clamp(82px,11.5vw,124px)] w-full items-center justify-center"
            >
              <div
                className={`flex h-[clamp(34px,4.7vw,62px)] w-[clamp(34px,4.7vw,62px)] items-center justify-center rounded-full transition-transform duration-300 [transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)] ${
                  isActive ? 'translate-x-[clamp(34px,6vw,65px)] translate-y-[clamp(2px,0.35vw,5px)]' : ''
                }`}
              >
                <img src={item.icon} alt={item.alt} className={`${item.iconClass} h-auto`} />
              </div>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
