import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  Shield,
  Award,
  DollarSign,
  Calendar,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { Guest, Booking, HotelSettings } from '../types';
import { Modal } from '../components/Modal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToast } from '../context/ToastContext';

interface GuestsViewProps {
  guests: Guest[];
  setGuests: (guests: Guest[]) => void;
  bookings: Booking[];
  settings: HotelSettings;
}

export const GuestsView: React.FC<GuestsViewProps> = ({
  guests,
  setGuests,
  bookings,
  settings
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [deletingGuest, setDeletingGuest] = useState<Guest | null>(null);
  const [viewingGuest, setViewingGuest] = useState<Guest | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    idProofType: 'Passport' as 'Passport' | 'Driver License' | 'National ID' | 'Voter ID',
    idProofNumber: '',
    notes: '',
    avatar: ''
  });

  const { success, error } = useToast();

  const handleOpenAdd = () => {
    setEditingGuest(null);
    setFormData({
      name: '',
      phone: '+1 (555) ',
      email: '',
      address: '',
      idProofType: 'Passport',
      idProofNumber: `USA-P${Math.floor(10000000 + Math.random() * 90000000)}`,
      notes: 'VIP traveler preferences.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (g: Guest) => {
    setEditingGuest(g);
    setFormData({
      name: g.name,
      phone: g.phone,
      email: g.email,
      address: g.address,
      idProofType: g.idProofType,
      idProofNumber: g.idProofNumber,
      notes: g.notes || '',
      avatar: g.avatar || ''
    });
    setIsAddEditOpen(true);
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      error('Validation Error', 'Guest name and email address are required.');
      return;
    }

    if (editingGuest) {
      const updatedGuests = guests.map((g) =>
        g.id === editingGuest.id
          ? {
              ...g,
              name: formData.name,
              phone: formData.phone,
              email: formData.email,
              address: formData.address,
              idProofType: formData.idProofType,
              idProofNumber: formData.idProofNumber,
              notes: formData.notes,
              avatar: formData.avatar
            }
          : g
      );
      setGuests(updatedGuests);
      success('Guest Profile Updated', `${formData.name} record saved.`);
    } else {
      const newGuest: Guest = {
        id: `GST-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address || 'Standard Residence',
        idProofType: formData.idProofType,
        idProofNumber: formData.idProofNumber,
        visitsCount: 1,
        totalSpent: 0,
        registeredDate: new Date().toISOString().split('T')[0],
        notes: formData.notes,
        avatar: formData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      };
      setGuests([newGuest, ...guests]);
      success('New Guest Added', `Profile for ${newGuest.name} registered.`);
    }

    setIsAddEditOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deletingGuest) return;
    setGuests(guests.filter((g) => g.id !== deletingGuest.id));
    success('Guest Deleted', `${deletingGuest.name} removed from guest book.`);
    setDeletingGuest(null);
  };

  const filteredGuests = guests.filter((g) => {
    return (
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.idProofNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Guest Directory ({guests.length} Registered)</h3>
          <p className="text-xs text-slate-500 mt-0.5">Maintain guest identity profiles, identification proofs, and loyalty spend</p>
        </div>
        <button
          id="guests-add-guest-btn"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Guest</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="guests-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone or ID proof..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Showing {filteredGuests.length} profiles
        </span>
      </div>

      {/* Guest Cards / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[11px] font-semibold">
              <tr>
                <th className="px-6 py-3.5">Guest Profile</th>
                <th className="px-6 py-3.5">Contact Details</th>
                <th className="px-6 py-3.5">Residence Address</th>
                <th className="px-6 py-3.5">Verified ID Proof</th>
                <th className="px-6 py-3.5 text-center">Visits</th>
                <th className="px-6 py-3.5">Total Spent</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No guests match your search query.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const isVip = guest.visitsCount >= 3;
                  return (
                    <tr key={guest.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={guest.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                            alt={guest.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-slate-900">{guest.name}</p>
                              {isVip && (
                                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                                  VIP
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 font-mono">{guest.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        <div className="space-y-0.5 text-xs">
                          <p className="flex items-center gap-1.5 text-slate-800">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{guest.email}</span>
                          </p>
                          <p className="flex items-center gap-1.5 text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{guest.phone}</span>
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate text-xs">
                        {guest.address}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-mono font-medium">
                          <Shield className="w-3 h-3 text-slate-400" />
                          <span>{guest.idProofType}: {guest.idProofNumber}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full font-mono">
                          {guest.visitsCount} stay{guest.visitsCount > 1 ? 's' : ''}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-mono font-bold text-slate-900">
                        {settings.currencySymbol}{guest.totalSpent.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setViewingGuest(guest)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(guest)}
                            className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Profile"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingGuest(guest)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Guest Modal */}
      <Modal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingGuest ? `Edit Guest: ${editingGuest.name}` : 'Register New Guest Profile'}
        subtitle="Customer identification, contact details and stay preferences"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveGuest} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                id="guest-form-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Katherine Pierce"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                id="guest-form-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="guest@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                id="guest-form-phone"
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                ID Proof Type
              </label>
              <select
                id="guest-form-id-type"
                value={formData.idProofType}
                onChange={(e) => setFormData({ ...formData, idProofType: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Passport">Passport</option>
                <option value="Driver License">Driver License</option>
                <option value="National ID">National ID Card</option>
                <option value="Voter ID">Voter ID</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                ID Proof Document Number *
              </label>
              <input
                id="guest-form-id-number"
                type="text"
                required
                value={formData.idProofNumber}
                onChange={(e) => setFormData({ ...formData, idProofNumber: e.target.value })}
                placeholder="USA-P12345678"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Avatar Photo URL
              </label>
              <input
                id="guest-form-avatar"
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Residential Address
            </label>
            <input
              id="guest-form-address"
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full billing street address, city, state, zip"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Guest Preferences & Medical / Dietary Notes
            </label>
            <textarea
              id="guest-form-notes"
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Requires hypoallergenic bedding, prefers ocean side, quiet morning room..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddEditOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition-colors"
            >
              {editingGuest ? 'Save Changes' : 'Register Guest'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Guest Detail View */}
      {viewingGuest && (
        <Modal
          isOpen={!!viewingGuest}
          onClose={() => setViewingGuest(null)}
          title={`Guest Profile: ${viewingGuest.name}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <img
                src={viewingGuest.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt=""
                className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-500/30"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">{viewingGuest.name}</h4>
                <p className="text-xs text-slate-500">{viewingGuest.email}</p>
                <p className="text-xs text-slate-500">{viewingGuest.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Guest ID</span>
                <span className="font-mono font-bold text-slate-800">{viewingGuest.id}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Identity Proof</span>
                <span className="font-mono font-bold text-slate-800">{viewingGuest.idProofType}: {viewingGuest.idProofNumber}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Lifetime Visits</span>
                <span className="font-mono font-bold text-slate-800">{viewingGuest.visitsCount} stays</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Total Spend</span>
                <span className="font-mono font-bold text-amber-800">{settings.currencySymbol}{viewingGuest.totalSpent.toLocaleString()}</span>
              </div>
            </div>

            {viewingGuest.notes && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-xs">
                <span className="font-semibold text-amber-900 block mb-1">Preferences & Notes</span>
                <p className="text-amber-800 leading-relaxed">{viewingGuest.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deletingGuest}
        onClose={() => setDeletingGuest(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Guest Profile"
        message={`Are you sure you want to delete profile for ${deletingGuest?.name}? This record will be permanently deleted.`}
        confirmText="Delete Profile"
      />
    </div>
  );
};
