import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building,
  User,
  Key,
  Palette,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  DollarSign,
  Percent,
  Clock,
  ShieldAlert,
  Database
} from 'lucide-react';
import { HotelSettings, UserSession } from '../types';
import { useToast } from '../context/ToastContext';
import { resetInitialData } from '../data/initialData';

interface SettingsViewProps {
  settings: HotelSettings;
  setSettings: (settings: HotelSettings) => void;
  currentUser: UserSession;
  setCurrentUser: (user: UserSession) => void;
  onResetAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  setSettings,
  currentUser,
  setCurrentUser,
  onResetAllData
}) => {
  const [activeTab, setActiveTab] = useState<'hotel' | 'profile' | 'security' | 'system'>('hotel');

  // Hotel Settings Form
  const [hotelData, setHotelData] = useState<HotelSettings>({ ...settings });

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone || '+1 (555) 234-5678',
    avatar: currentUser.avatar || ''
  });

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { success, error, info } = useToast();

  const handleSaveHotelSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(hotelData);
    success('Hotel Profile Saved', 'Hotel configuration and billing tax policy updated.');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      avatar: profileData.avatar
    };
    setCurrentUser(updated);
    success('Profile Saved', 'Admin credentials updated successfully.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      error('Security Error', 'New password must be at least 6 characters long.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error('Password Mismatch', 'New password and confirmation do not match.');
      return;
    }

    success('Password Changed', 'Your administrative security credentials have been updated.');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleExportSystemData = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      rooms: JSON.parse(localStorage.getItem('grandstay_rooms') || '[]'),
      bookings: JSON.parse(localStorage.getItem('grandstay_bookings') || '[]'),
      guests: JSON.parse(localStorage.getItem('grandstay_guests') || '[]'),
      staff: JSON.parse(localStorage.getItem('grandstay_staff') || '[]'),
      payments: JSON.parse(localStorage.getItem('grandstay_payments') || '[]'),
      settings: hotelData
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `GrandStay_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    success('Backup Exported', 'Full hotel database snapshot downloaded.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900">Hotel & Administrative Settings</h3>
        <p className="text-xs text-slate-500 mt-0.5">Configure property details, tax percentages, admin security and system data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation Tabs */}
        <div className="space-y-1 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs h-fit">
          <button
            onClick={() => setActiveTab('hotel')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === 'hotel'
                ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Building className="w-4 h-4 text-amber-600" />
            <span>Property & Tax Info</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === 'profile'
                ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4 text-amber-600" />
            <span>Manager Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === 'security'
                ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Key className="w-4 h-4 text-amber-600" />
            <span>Security & Password</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === 'system'
                ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Database className="w-4 h-4 text-amber-600" />
            <span>Data & Backup</span>
          </button>
        </div>

        {/* Settings Tab Content */}
        <div className="md:col-span-3">
          {/* Tab 1: Hotel Info */}
          {activeTab === 'hotel' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900">Hotel Property Information</h4>
                <p className="text-xs text-slate-500">Details printed on official invoices, folios and reservation vouchers</p>
              </div>

              <form onSubmit={handleSaveHotelSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Hotel Brand Name *
                    </label>
                    <input
                      id="settings-hotel-name"
                      type="text"
                      required
                      value={hotelData.hotelName}
                      onChange={(e) => setHotelData({ ...hotelData, hotelName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Billing Currency
                    </label>
                    <select
                      id="settings-currency-select"
                      value={hotelData.currency}
                      onChange={(e) => {
                        const val = e.target.value;
                        const symbolMap: Record<string, string> = {
                          USD: '$',
                          EUR: '€',
                          GBP: '£',
                          INR: '₹',
                          JPY: '¥',
                          AED: 'AED '
                        };
                        setHotelData({
                          ...hotelData,
                          currency: val,
                          currencySymbol: symbolMap[val] || '$'
                        });
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                      <option value="INR">INR (₹) - Indian Rupee</option>
                      <option value="JPY">JPY (¥) - Japanese Yen</option>
                      <option value="AED">AED - Emirati Dirham</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Front Desk Email
                    </label>
                    <input
                      id="settings-hotel-email"
                      type="email"
                      required
                      value={hotelData.email}
                      onChange={(e) => setHotelData({ ...hotelData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Front Desk Phone
                    </label>
                    <input
                      id="settings-hotel-phone"
                      type="text"
                      required
                      value={hotelData.phone}
                      onChange={(e) => setHotelData({ ...hotelData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Government Tax Rate (VAT / GST %)
                    </label>
                    <input
                      id="settings-tax-rate"
                      type="number"
                      min="0"
                      max="40"
                      value={hotelData.taxPercentage}
                      onChange={(e) => setHotelData({ ...hotelData, taxPercentage: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Standard Check-In / Check-Out Policy
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={hotelData.checkInTime}
                        onChange={(e) => setHotelData({ ...hotelData, checkInTime: e.target.value })}
                        placeholder="Check-In: 2:00 PM"
                        className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                      />
                      <input
                        type="text"
                        value={hotelData.checkOutTime}
                        onChange={(e) => setHotelData({ ...hotelData, checkOutTime: e.target.value })}
                        placeholder="Check-Out: 11:00 AM"
                        className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Hotel Street Address
                  </label>
                  <input
                    id="settings-hotel-address"
                    type="text"
                    value={hotelData.address}
                    onChange={(e) => setHotelData({ ...hotelData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Hotel Information</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Profile */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900">Administrator Profile</h4>
                <p className="text-xs text-slate-500">Update your account credentials, avatar and contact details</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <img
                    src={profileData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt=""
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-500"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">{currentUser.name}</p>
                    <p className="text-xs text-slate-500">{currentUser.role} &bull; {currentUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      id="profile-name-input"
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      id="profile-email-input"
                      type="email"
                      required
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      id="profile-phone-input"
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Avatar URL
                    </label>
                    <input
                      id="profile-avatar-input"
                      type="url"
                      value={profileData.avatar}
                      onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 3: Security */}
          {activeTab === 'security' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900">Change Password & Security</h4>
                <p className="text-xs text-slate-500">Ensure your administrative hotel portal account stays secured</p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Current Password
                  </label>
                  <input
                    id="security-current-password"
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <input
                    id="security-new-password"
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="security-confirm-password"
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Re-type new password"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 4: System Data & Reset */}
          {activeTab === 'system' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900">Database & Data Management</h4>
                <p className="text-xs text-slate-500">Export database JSON backup or restore default demo dataset</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">JSON Database Backup</h5>
                    <p className="text-xs text-slate-500">Download a full JSON export of rooms, bookings, guests and payments</p>
                  </div>
                  <button
                    onClick={handleExportSystemData}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON Backup</span>
                  </button>
                </div>

                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-sm font-bold text-rose-900">Reset Demo Data to Factory Defaults</h5>
                    <p className="text-xs text-rose-700">Re-populate 12 luxury rooms, sample bookings, guests and invoices</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to reset all hotel data back to initial sample state?')) {
                        onResetAllData();
                      }
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Data</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
