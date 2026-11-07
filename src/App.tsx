import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from '@/store/AppContext';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Discover from '@/pages/Discover';
import ScholarshipDetails from '@/pages/ScholarshipDetails';
import Saved from '@/pages/Saved';
import Applications from '@/pages/Applications';
import Deadlines from '@/pages/Deadlines';
import Analytics from '@/pages/Analytics';
import Profile from '@/pages/Profile';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#172033',
              color: '#fff',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#D7F8A7', secondary: '#172033' },
            },
          }}
        />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/scholarship/:id" element={<ScholarshipDetails />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/deadlines" element={<Deadlines />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
