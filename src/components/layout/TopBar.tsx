import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface TopBarProps {
  title: string;
  onMenuToggle: () => void;
}

export default function TopBar({ title, onMenuToggle }: TopBarProps) {
  const { state } = useApp();
  const navigate = useNavigate();
  const [topSearch, setTopSearch] = useState('');

  const initials = state.profile.displayName
    ? state.profile.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topSearch.trim()) {
      navigate(`/discover?q=${encodeURIComponent(topSearch.trim())}`);
    } else {
      navigate('/discover');
    }
  };

  const handleNotificationsClick = () => {
    toast('No new system alerts at this moment.', {
      icon: '🔔',
    });
  };

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b"
      style={{ borderColor: '#E5E9E5' }}
    >
      {/* Left: hamburger (mobile) + title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className={cn(
            'lg:hidden flex items-center justify-center w-9 h-9 rounded-lg',
            'text-[#687386] hover:bg-gray-100 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101827]'
          )}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1
          className="text-lg font-semibold truncate text-[#172033]"
        >
          {title}
        </h1>
      </div>

      {/* Right: search + notifications + avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F7F8F5] border border-[#E5E9E5] w-56 focus-within:ring-2 focus-within:ring-[#101827] focus-within:border-transparent transition-all">
          <Search className="w-4 h-4 text-[#687386] flex-shrink-0" />
          <input
            type="text"
            value={topSearch}
            onChange={(e) => setTopSearch(e.target.value)}
            placeholder="Search scholarships…"
            className="bg-transparent text-xs text-[#172033] placeholder-[#687386] outline-none w-full"
            aria-label="Search scholarships"
          />
        </form>

        {/* Notifications */}
        <button
          type="button"
          onClick={handleNotificationsClick}
          className={cn(
            'flex items-center justify-center w-9 h-9 rounded-lg',
            'text-[#687386] hover:bg-gray-100 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101827]'
          )}
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
        </button>

        {/* Avatar */}
        <Link
          to="/profile"
          className="flex items-center justify-center w-9 h-9 rounded-full text-xs font-semibold select-none hover:ring-2 hover:ring-[#101827] transition-all"
          style={{ backgroundColor: '#D7F8A7', color: '#101827' }}
          title={`Profile: ${state.profile.displayName || 'Configure Profile'}`}
          aria-label={`Profile: ${state.profile.displayName || 'Configure Profile'}`}
        >
          {initials}
        </Link>
      </div>
    </header>
  );
}
