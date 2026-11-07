import { NavLink } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  Search,
  Heart,
  ClipboardList,
  Calendar,
  BarChart3,
  User,
  Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/discover', label: 'Discover', icon: Search },
  { to: '/saved', label: 'Saved', icon: Heart },
  { to: '/applications', label: 'Applications', icon: ClipboardList },
  { to: '/deadlines', label: 'Deadlines', icon: Calendar },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
] as const;

export default function Sidebar() {
  return (
    <aside
      className="hidden lg:flex flex-col w-64 h-screen bg-white border-r fixed top-0 left-0 z-30"
      style={{ borderColor: '#E5E9E5' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-6 py-5">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ backgroundColor: '#D7F8A7' }}
        >
          <GraduationCap className="w-5 h-5" style={{ color: '#101827' }} />
        </div>
        <span
          className="text-xl font-bold tracking-tight"
          style={{ color: '#101827' }}
        >
          GRANTLY
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto" aria-label="Main navigation">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                isActive
                  ? 'text-[#101827] font-semibold'
                  : 'text-[#687386] hover:bg-gray-50 hover:text-[#172033]'
              )
            }
            style={({ isActive }) =>
              isActive
                ? { backgroundColor: '#D7F8A7', focusRingColor: '#101827' }
                : undefined
            }
          >
            <Icon className="w-[18px] h-[18px] flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Demo Data Badge */}
      <div className="px-4 py-4 border-t" style={{ borderColor: '#E5E9E5' }}>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
          style={{ backgroundColor: '#F7F8F5', color: '#687386' }}
        >
          <Database className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Demo Data</span>
        </div>
      </div>
    </aside>
  );
}
