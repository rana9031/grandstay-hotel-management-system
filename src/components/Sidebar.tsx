import React from 'react';
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  KeyRound,
  UserCog,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Hotel
} from 'lucide-react';
import { ActivePage, HotelSettings, UserSession } from '../types';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onLogout: () => void;
  user: UserSession;
  settings: HotelSettings;
  stats: {
    occupiedRooms: number;
    todayCheckins: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  onLogout,
  user,
  settings,
  stats
}) => {
  const menuItems = [
    { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rooms' as ActivePage, label: 'Rooms', icon: BedDouble, badge: null },
    { id: 'bookings' as ActivePage, label: 'Bookings', icon: CalendarCheck, badge: null },
    { id: 'checkin-checkout' as ActivePage, label: 'Check-In / Out', icon: KeyRound, badge: stats.todayCheckins > 0 ? stats.todayCheckins : null },
    { id: 'guests' as ActivePage, label: 'Guests', icon: Users, badge: null },
    { id: 'staff' as ActivePage, label: 'Staff Roster', icon: UserCog, badge: null },
    { id: 'payments' as ActivePage, label: 'Payments', icon: Receipt, badge: null },
    { id: 'reports' as ActivePage, label: 'Reports', icon: BarChart3, badge: null },
    { id: 'settings' as ActivePage, label: 'Settings', icon: Settings, badge: null }
  ];

  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-40 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className={`flex items-center gap-3 overflow-hidden transition-all ${collapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg shadow-amber-900/30 shrink-0">
              <Hotel className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="text-base font-bold text-white tracking-tight leading-tight truncate font-serif-heading">
                  GrandStay
                </h1>
                <p className="text-[11px] text-amber-400/90 font-medium tracking-wider uppercase truncate">
                  Hotel Management
                </p>
              </div>
            )}
          </div>
          
          {/* Desktop collapse toggle */}
          <button
            id="sidebar-collapse-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Live Status Pill */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-950/20">
            <div className="flex items-center justify-between bg-slate-800/60 rounded-xl p-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Rooms</span>
              </div>
              <span className="font-semibold text-amber-400">{stats.occupiedRooms} Occupied</span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNav(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!collapsed && item.badge !== null && (
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Account / Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 ${collapsed ? 'justify-center' : ''}`}>
            <img
              src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"}
              alt={user.name}
              className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-amber-400/80 truncate">{user.role}</p>
              </div>
            )}
            {!collapsed && (
              <button
                id="sidebar-logout-btn"
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
