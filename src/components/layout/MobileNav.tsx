import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  LayoutDashboard,
  Search,
  Heart,
  ClipboardList,
  Calendar,
  BarChart3,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/discover', label: 'Discover', icon: Search },
  { to: '/saved', label: 'Saved', icon: Heart },
  { to: '/applications', label: 'Applications', icon: ClipboardList },
  { to: '/deadlines', label: 'Deadlines', icon: Calendar },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
] as const;

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-in panel */}
          <motion.aside
            className="fixed top-0 left-0 z-50 flex flex-col w-72 h-full bg-white shadow-xl"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#E5E9E5' }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ backgroundColor: '#D7F8A7' }}
                >
                  <GraduationCap className="w-4.5 h-4.5" style={{ color: '#101827' }} />
                </div>
                <span className="text-lg font-bold tracking-tight" style={{ color: '#101827' }}>
                  GRANTLY
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg',
                  'text-[#687386] hover:bg-gray-100 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101827]'
                )}
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Mobile navigation">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={onClose}
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
                    isActive ? { backgroundColor: '#D7F8A7' } : undefined
                  }
                >
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
