import React, { useState } from 'react';
import {
  UserCog,
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Shield,
  Briefcase,
  Clock,
  Sparkles
} from 'lucide-react';
import { Staff, StaffRole, StaffStatus, HotelSettings } from '../types';
import { Modal } from '../components/Modal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToast } from '../context/ToastContext';

interface StaffViewProps {
  staff: Staff[];
  setStaff: (staff: Staff[]) => void;
  settings: HotelSettings;
}

export const StaffView: React.FC<StaffViewProps> = ({ staff, setStaff, settings }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Receptionist' as StaffRole,
    phone: '',
    email: '',
    joiningDate: '2025-01-15',
    status: 'Active' as StaffStatus,
    shift: 'Morning' as 'Morning' | 'Evening' | 'Night' | 'Full Time',
    salary: 45000,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  });

  const { success, error } = useToast();

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      role: 'Receptionist',
      phone: '+1 (555) ',
      email: '',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      shift: 'Morning',
      salary: 42000,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (s: Staff) => {
    setEditingStaff(s);
    setFormData({
      name: s.name,
      role: s.role,
      phone: s.phone,
      email: s.email,
      joiningDate: s.joiningDate,
      status: s.status,
      shift: s.shift,
      salary: s.salary,
      avatar: s.avatar || ''
    });
    setIsAddEditOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      error('Validation Error', 'Staff member name and email are required.');
      return;
    }

    if (editingStaff) {
      const updated = staff.map((s) =>
        s.id === editingStaff.id
          ? {
              ...s,
              name: formData.name,
              role: formData.role,
              phone: formData.phone,
              email: formData.email,
              joiningDate: formData.joiningDate,
              status: formData.status,
              shift: formData.shift,
              salary: Number(formData.salary),
              avatar: formData.avatar
            }
          : s
      );
      setStaff(updated);
      success('Staff Record Updated', `${formData.name} details saved.`);
    } else {
      const newStaff: Staff = {
        id: `STF-${Math.floor(10 + Math.random() * 90)}`,
        name: formData.name,
        role: formData.role,
        phone: formData.phone,
        email: formData.email,
        joiningDate: formData.joiningDate,
        status: formData.status,
        shift: formData.shift,
        salary: Number(formData.salary),
        avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      };
      setStaff([newStaff, ...staff]);
      success('Staff Member Added', `${newStaff.name} joined as ${newStaff.role}.`);
    }

    setIsAddEditOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deletingStaff) return;
    setStaff(staff.filter((s) => s.id !== deletingStaff.id));
    success('Staff Removed', `${deletingStaff.name} removed from active roster.`);
    setDeletingStaff(null);
  };

  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'All' || s.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Hotel Staff Roster ({staff.length} Personnel)</h3>
          <p className="text-xs text-slate-500 mt-0.5">Manage departmental teams, work shifts, contact logs and assignments</p>
        </div>
        <button
          id="staff-add-staff-btn"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="staff-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff by name, role, email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            id="staff-role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">All Roles</option>
            <option value="Manager">Manager</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Chef">Chef</option>
            <option value="Concierge">Concierge</option>
            <option value="Security">Security</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <select
            id="staff-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[11px] font-semibold">
              <tr>
                <th className="px-6 py-3.5">Staff Member</th>
                <th className="px-6 py-3.5">Role & Shift</th>
                <th className="px-6 py-3.5">Contact Email</th>
                <th className="px-6 py-3.5">Phone Number</th>
                <th className="px-6 py-3.5">Joining Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No staff members match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{member.name}</p>
                          <span className="text-xs text-slate-400 font-mono">{member.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{member.role}</span>
                      <span className="text-xs text-slate-400 block">{member.shift} Shift</span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{member.email}</span>
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{member.phone}</span>
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {member.joiningDate}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          member.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : member.status === 'On Leave'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Staff Member"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingStaff(member)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      <Modal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingStaff ? `Edit Staff: ${editingStaff.name}` : 'Add Staff Member'}
        subtitle="Staff designation, work shifts, credentials and status"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveStaff} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                id="staff-form-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Jonathan Reynolds"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Departmental Role
              </label>
              <select
                id="staff-form-role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as StaffRole })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Manager">General Manager</option>
                <option value="Receptionist">Front Desk Receptionist</option>
                <option value="Housekeeping">Housekeeping Supervisor</option>
                <option value="Chef">Executive Chef</option>
                <option value="Concierge">Guest Concierge</option>
                <option value="Security">Security Officer</option>
                <option value="Maintenance">Maintenance Technician</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Work Email *
              </label>
              <input
                id="staff-form-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="staff@grandstay.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                id="staff-form-phone"
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Duty Shift
              </label>
              <select
                id="staff-form-shift"
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Morning">Morning Shift (7:00 AM - 3:30 PM)</option>
                <option value="Evening">Evening Shift (3:00 PM - 11:30 PM)</option>
                <option value="Night">Night Shift (11:00 PM - 7:30 AM)</option>
                <option value="Full Time">Full Time Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Employment Status
              </label>
              <select
                id="staff-form-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as StaffStatus })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Joining Date
              </label>
              <input
                id="staff-form-joining-date"
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Annual Salary ({settings.currencySymbol})
              </label>
              <input
                id="staff-form-salary"
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
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
              {editingStaff ? 'Save Changes' : 'Add Staff Member'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Staff Confirmation */}
      <ConfirmationModal
        isOpen={!!deletingStaff}
        onClose={() => setDeletingStaff(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Staff Member"
        message={`Are you sure you want to remove ${deletingStaff?.name} (${deletingStaff?.role}) from the staff registry?`}
        confirmText="Remove Staff"
      />
    </div>
  );
};
