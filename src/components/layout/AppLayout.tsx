import { useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/discover': 'Discover Scholarships',
  '/saved': 'Saved Scholarships',
  '/applications': 'Applications',
  '/deadlines': 'Deadlines',
  '/analytics': 'Analytics',
  '/profile': 'My Profile',
};

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  const pageTitle = useMemo(() => {
    // Exact match first
    if (routeTitles[location.pathname]) return routeTitles[location.pathname];
    // Dynamic routes
    if (location.pathname.startsWith('/scholarship/')) return 'Scholarship Details';
    return 'GRANTLY';
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F7F8F5' }}>
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile navigation */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main area — offset for sidebar on desktop */}
      <div className="flex flex-col flex-1 lg:ml-64 min-h-screen">
        <TopBar
          title={pageTitle}
          onMenuToggle={() => setMobileNavOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
