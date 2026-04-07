import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, TrendingUp, CalendarDays } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: TrendingUp, label: 'Hot', path: '/animes/trending' },
    { icon: CalendarDays, label: 'Plan', path: '/schedule' },
  ];

  return (
    <div className="md:hidden fixed bottom-5 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="bottom-nav-pill px-8 py-3.5 flex items-center gap-10 pointer-events-auto rounded-full">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center transition-all duration-200 ${
                isActive ? 'scale-110' : 'opacity-50 active:opacity-80'
              }`
            }
          >
            {({ isActive }) => (
              <item.icon
                className={`w-6 h-6 transition-all ${isActive ? 'text-pink-400' : 'text-zinc-500'}`}
                strokeWidth={isActive ? 2.5 : 1.5}
                style={isActive ? { filter: 'drop-shadow(0 0 6px rgba(244,114,182,0.6))' } : {}}
              />
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
