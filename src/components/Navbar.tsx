import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Bell,
  Search,
  Plus,
  KeyRound,
  User,
  Settings,
  LogOut,
  Calendar,
  Clock,
  Sparkles,
  BedDouble,
  Check,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ActivePage, AppNotification, HotelSettings, UserSession } from '../types';

interface NavbarProps {
  setMobileOpen: (open: boolean) => void;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  user: UserSession;
  onLogout: () => void;
  notifications: AppNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onOpenQuickBooking: () => void;
  onOpenQuickCheckin: () => void;
  settings: HotelSettings;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  setMobileOpen,
  activePage,
  setActivePage,
  user,
  onLogout,
  notifications,
  onMarkNotificationAsRead,
  onClearAllNotifications,
  onOpenQuickBooking,
  onOpenQuickCheckin,
  settings,
  searchQuery,
  setSearchQuery
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const pageTitles: Record<ActivePage, { title: string; subtitle: string }> = {
    dashboard: { title: 'Hotel Operations Dashboard', subtitle: 'Overview of occupancy, revenue, and daily front desk flow' },
    rooms: { title: 'Room Inventory & Status', subtitle: 'Manage room catalog, pricing, availability and housekeeping' },
    bookings: { title: 'Reservations & Booking Management', subtitle: 'Track guest stays, confirmation statuses, and schedules' },
    'checkin-checkout': { title: 'Front Desk Express Desk', subtitle: 'Process real-time guest check-ins, key cards, and billing settlements' },
    guests: { title: 'Guest Directory & Profiles', subtitle: 'Manage customer records, preferences, and loyalty history' },
    staff: { title: 'Staff Roster & Duties', subtitle: 'Hotel personnel directory, shift allocation, and roles' },
    payments: { title: 'Financial Ledger & Invoices', subtitle: 'Transactions, payment methods, receipts, and folios' },
    reports: { title: 'Analytics & Performance Reports', subtitle: 'Occupancy analysis, RevPAR, revenue streams, and trends' },
    settings: { title: 'System & Property Settings', subtitle: 'Hotel profile, taxes, preferences, and appearance' }
  };

  const currentInfo = pageTitles[activePage] || { title: 'GrandStay', subtitle: 'Hotel Management' };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="navbar-mobile-toggle-btn"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate leading-tight">
            {currentInfo.title}
          </h2>
          <p className="text-xs text-slate-500 hidden sm:block truncate mt-0.5">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Center/Right: Actions, Time, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Date & Time display */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 border border-slate-200/60 rounded-xl text-xs text-slate-600 font-medium">
          <Calendar className="w-3.5 h-3.5 text-amber-700" />
          <span>{currentDate}</span>
          <span className="text-slate-300">|</span>
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono text-slate-800">{currentTime}</span>
        </div>

        {/* Global Quick Action: New Booking */}
        <button
          id="navbar-quick-booking-btn"
          onClick={onOpenQuickBooking}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">New Booking</span>
        </button>

        {/* Quick Check-In Button */}
        <button
          id="navbar-quick-checkin-btn"
          onClick={onOpenQuickCheckin}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-colors shrink-0"
        >
          <KeyRound className="w-4 h-4 text-amber-400" />
          <span>Check-In</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            id="navbar-notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAllNotifications}
                    className="text-xs text-amber-700 hover:text-amber-800 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationAsRead(n.id)}
                      className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !n.read ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {n.type === 'checkin' && <KeyRound className="w-4 h-4 text-emerald-600" />}
                        {n.type === 'payment' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                        {n.type === 'maintenance' && <AlertCircle className="w-4 h-4 text-rose-500" />}
                        {n.type === 'booking' && <Calendar className="w-4 h-4 text-sky-600" />}
                        {n.type === 'system' && <Bell className="w-4 h-4 text-slate-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            id="navbar-profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <img
              src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"}
              alt={user.name}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-amber-500/20"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">{user.name}</p>
              <p className="text-[10px] text-slate-500 leading-tight">{user.role}</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 py-1.5">
              <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
                <p className="text-xs font-bold text-slate-800">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded-md">
                  {user.role}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setActivePage('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Hotel Settings</span>
                </button>
                <button
                  onClick={() => {
                    setActivePage('reports');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  <span>Performance Reports</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  id="navbar-dropdown-logout-btn"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
