import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Utensils,
  Pill,
  Stethoscope,
  HeartPulse,
  History,
  LogOut,
  Heart,
  Menu,
  X,
  Sparkles,
  Microscope,
} from 'lucide-react';
import { useState } from 'react';
import MedicalBackground from './MedicalBackground';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/symptom-triage', label: 'Symptom Triage', icon: Stethoscope },
  { to: '/report-simplifier', label: 'Report Simplifier', icon: FileText },
  { to: '/diet-plan', label: 'Diet Plan', icon: Utensils },
  { to: '/drug-checker', label: 'Drug Checker', icon: Pill },
  { to: '/otc-first-aid', label: 'OTC & First Aid', icon: HeartPulse },
  { to: '/cancer-detection', label: 'Cancer Detection', icon: Microscope },
  { to: '/history', label: 'History', icon: History },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-surface-50 relative">
      <MedicalBackground />
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-[272px] bg-white backdrop-blur-xl border-r-2 border-gray-200 flex flex-col transform transition-all duration-300 ease-out relative overflow-hidden ${
          sidebarOpen ? 'translate-x-0 shadow-glass-lg' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar decoration */}
        <svg className="absolute bottom-0 left-0 w-full h-20 opacity-[0.03] pointer-events-none" viewBox="0 0 272 80" preserveAspectRatio="none">
          <path d="M0,40 L60,40 L75,15 L90,65 L105,10 L120,70 L135,40 L200,40 L272,40" fill="none" stroke="#6366f1" strokeWidth="2" className="animate-heartbeat-draw" />
        </svg>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-primary-100/20 rounded-full blur-3xl animate-orb-drift pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/20 animate-glow-pulse">
            <Heart className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-bold gradient-text">MediSense</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto relative z-10">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 shadow-sm border-l-[3px] border-primary-500'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-surface-100 hover:to-transparent hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-500/10 scale-110'
                      : 'group-hover:bg-gray-200/50 group-hover:scale-105'
                  }`}>
                    <Icon className={`w-[18px] h-[18px] transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                  </div>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-3 mx-3 mb-3 rounded-xl bg-surface-50 border-2 border-gray-100">
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.username}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-2 py-2 mt-2 text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b-2 border-gray-200 px-4 py-3.5 lg:px-8 flex items-center gap-4">
          <button
            className="lg:hidden p-2 text-gray-500 hover:text-gray-800 hover:bg-surface-100 rounded-xl transition-all"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <h1 className="text-base font-bold text-gray-900 tracking-tight">AI Healthcare Assistant</h1>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
