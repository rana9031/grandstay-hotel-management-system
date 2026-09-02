import React, { useState } from 'react';
import {
  BedDouble,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Users,
  Sparkles,
  Layers,
  DollarSign,
  Star,
  Eye
} from 'lucide-react';
import { Room, RoomType, RoomStatus, HotelSettings } from '../types';
import { Modal } from '../components/Modal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToast } from '../context/ToastContext';

interface RoomsViewProps {
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  settings: HotelSettings;
}

export const RoomsView: React.FC<RoomsViewProps> = ({ rooms, setRooms, settings }) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [floorFilter, setFloorFilter] = useState<string>('All');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
  const [viewingRoom, setViewingRoom] = useState<Room | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: 'Double' as RoomType,
    pricePerNight: 140,
    status: 'Available' as RoomStatus,
    floor: 2,
    capacity: 2,
    amenities: 'High-speed Wi-Fi, Smart TV, Air Conditioning, Mini Fridge',
    description: 'Comfortable and stylishly appointed hotel room.',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    rating: 4.8
  });

  const { success, error } = useToast();

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: `${Math.floor(Math.random() * 4 + 1)}0${Math.floor(Math.random() * 8 + 4)}`,
      type: 'Double',
      pricePerNight: 150,
      status: 'Available',
      floor: 2,
      capacity: 2,
      amenities: 'High-speed Wi-Fi, Smart TV, Air Conditioning, Mini Bar, Safe',
      description: 'Elegant hotel room with premium bedding and luxury bath amenities.',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
      rating: 4.8
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      type: room.type,
      pricePerNight: room.pricePerNight,
      status: room.status,
      floor: room.floor,
      capacity: room.capacity,
      amenities: room.amenities.join(', '),
      description: room.description,
      image: room.image,
      rating: room.rating
    });
    setIsAddEditOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomNumber) {
      error('Validation Error', 'Room number is required.');
      return;
    }

    // Check duplicate room number
    const duplicate = rooms.find(
      (r) => r.roomNumber === formData.roomNumber && r.id !== editingRoom?.id
    );
    if (duplicate) {
      error('Duplicate Room Number', `Room ${formData.roomNumber} already exists.`);
      return;
    }

    const amenitiesArray = formData.amenities
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingRoom) {
      const updatedRooms = rooms.map((r) =>
        r.id === editingRoom.id
          ? {
              ...r,
              roomNumber: formData.roomNumber,
              type: formData.type,
              pricePerNight: Number(formData.pricePerNight),
              status: formData.status,
              floor: Number(formData.floor),
              capacity: Number(formData.capacity),
              amenities: amenitiesArray,
              description: formData.description,
              image: formData.image,
              rating: Number(formData.rating)
            }
          : r
      );
      setRooms(updatedRooms);
      success('Room Updated', `Room ${formData.roomNumber} details updated successfully.`);
    } else {
      const newRoom: Room = {
        id: `R-${formData.roomNumber}`,
        roomNumber: formData.roomNumber,
        type: formData.type,
        pricePerNight: Number(formData.pricePerNight),
        status: formData.status,
        floor: Number(formData.floor),
        capacity: Number(formData.capacity),
        amenities: amenitiesArray,
        description: formData.description,
        image: formData.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        rating: Number(formData.rating) || 4.7
      };
      setRooms([newRoom, ...rooms]);
      success('Room Added', `Room ${newRoom.roomNumber} created and listed.`);
    }

    setIsAddEditOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deletingRoom) return;
    setRooms(rooms.filter((r) => r.id !== deletingRoom.id));
    success('Room Removed', `Room ${deletingRoom.roomNumber} was successfully removed.`);
    setDeletingRoom(null);
  };

  const handleStatusChange = (room: Room, newStatus: RoomStatus) => {
    const updated = rooms.map((r) => (r.id === room.id ? { ...r, status: newStatus } : r));
    setRooms(updated);
    success('Status Updated', `Room ${room.roomNumber} marked as ${newStatus}.`);
  };

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.amenities.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesType = typeFilter === 'All' || r.type === typeFilter;
    const matchesFloor = floorFilter === 'All' || String(r.floor) === floorFilter;

    return matchesSearch && matchesStatus && matchesType && matchesFloor;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Room Inventory ({filteredRooms.length} Rooms)</h3>
          <p className="text-xs text-slate-500 mt-0.5">Manage room tiers, nightly pricing, status and amenities</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              id="rooms-view-cards-btn"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Card View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              id="rooms-view-table-btn"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            id="rooms-add-room-btn"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="rooms-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search room #, type, amenities..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            id="rooms-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          {/* Type Filter */}
          <select
            id="rooms-type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">All Room Types</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
          </select>

          {/* Floor Filter */}
          <select
            id="rooms-floor-filter"
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">All Floors</option>
            <option value="1">Floor 1</option>
            <option value="2">Floor 2</option>
            <option value="3">Floor 3</option>
            <option value="4">Floor 4</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <BedDouble className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-semibold text-slate-800">No rooms match your search filters</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or clear your filters to see the full catalog.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setTypeFilter('All');
              setFloorFilter('All');
            }}
            className="px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* Attractive Room Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Card Image & Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={room.image}
                  alt={`Room ${room.roomNumber}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-mono font-bold rounded-lg shadow-xs">
                    Room {room.roomNumber}
                  </span>
                  <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-semibold rounded-md shadow-xs">
                    Floor {room.floor}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-xs ${
                      room.status === 'Available'
                        ? 'bg-emerald-500 text-white'
                        : room.status === 'Occupied'
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {room.status}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-amber-300">
                      {room.type} Tier
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold font-mono">
                      {settings.currencySymbol}{room.pricePerNight}
                    </span>
                    <span className="text-[11px] opacity-80"> / night</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>

                  {/* Amenities Pills */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {room.amenities.slice(0, 3).map((amenity, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-md"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-medium rounded-md">
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer with Quick Status Switcher & Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {/* Status Toggle Button */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        handleStatusChange(
                          room,
                          room.status === 'Available' ? 'Maintenance' : room.status === 'Maintenance' ? 'Available' : 'Available'
                        )
                      }
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Quick toggle status"
                    >
                      Toggle Status
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setViewingRoom(room)}
                      title="View Details"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(room)}
                      title="Edit Room"
                      className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingRoom(room)}
                      title="Delete Room"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[11px] font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Room #</th>
                  <th className="px-6 py-3.5">Type & Floor</th>
                  <th className="px-6 py-3.5">Capacity</th>
                  <th className="px-6 py-3.5">Price / Night</th>
                  <th className="px-6 py-3.5">Amenities</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={room.image}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          Room {room.roomNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{room.type}</p>
                      <p className="text-xs text-slate-400">Floor {room.floor}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{room.capacity} Guests</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                      {settings.currencySymbol}{room.pricePerNight}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {room.amenities.slice(0, 2).map((a, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded">
                            {a}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          room.status === 'Available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : room.status === 'Occupied'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setViewingRoom(room)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(room)}
                          className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingRoom(room)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Room Modal Form */}
      <Modal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingRoom ? `Edit Room ${editingRoom.roomNumber}` : 'Add New Room to Inventory'}
        subtitle="Specify room number, tier, nightly rates and amenities"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveRoom} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Room Number *
              </label>
              <input
                id="room-form-number"
                type="text"
                required
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                placeholder="e.g. 305"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Room Tier / Type
              </label>
              <select
                id="room-form-type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as RoomType })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Price Per Night ({settings.currencySymbol}) *
              </label>
              <input
                id="room-form-price"
                type="number"
                required
                min="1"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Availability Status
              </label>
              <select
                id="room-form-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as RoomStatus })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Floor Number
              </label>
              <input
                id="room-form-floor"
                type="number"
                min="1"
                max="10"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Max Capacity (Guests)
              </label>
              <input
                id="room-form-capacity"
                type="number"
                min="1"
                max="8"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Room Image URL
            </label>
            <input
              id="room-form-image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Amenities (comma separated)
            </label>
            <input
              id="room-form-amenities"
              type="text"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              placeholder="High-speed Wi-Fi, Smart TV, Mini Bar, Jacuzzi..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              id="room-form-description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
              {editingRoom ? 'Save Changes' : 'Create Room'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Room Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingRoom}
        onClose={() => setDeletingRoom(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Room"
        message={`Are you sure you want to delete Room ${deletingRoom?.roomNumber}? This will remove it permanently from active inventory.`}
        confirmText="Delete Room"
      />

      {/* Quick Room Detail View Modal */}
      {viewingRoom && (
        <Modal
          isOpen={!!viewingRoom}
          onClose={() => setViewingRoom(null)}
          title={`Room ${viewingRoom.roomNumber} - ${viewingRoom.type} Tier`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <img
              src={viewingRoom.image}
              alt=""
              className="w-full h-56 object-cover rounded-xl shadow-sm"
            />
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold font-mono text-slate-900">
                {settings.currencySymbol}{viewingRoom.pricePerNight} <span className="text-xs text-slate-500 font-sans">/ night</span>
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  viewingRoom.status === 'Available'
                    ? 'bg-emerald-100 text-emerald-800'
                    : viewingRoom.status === 'Occupied'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {viewingRoom.status}
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{viewingRoom.description}</p>
            <div className="border-t border-slate-100 pt-3">
              <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Amenities Included</h5>
              <div className="flex flex-wrap gap-2">
                {viewingRoom.amenities.map((a, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
