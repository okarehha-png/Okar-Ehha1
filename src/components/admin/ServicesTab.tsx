import React, { useState } from "react";
import {
  Wrench,
  Plus,
  Edit2,
  Check,
  X,
  Clock,
  DollarSign,
  Tag,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Layers,
  Sparkles
} from "lucide-react";
import { ServiceItem } from "../../types/admin";

interface ServicesTabProps {
  services: ServiceItem[];
  onUpdateService: (service: ServiceItem) => Promise<void>;
  onAddService: (service: Omit<ServiceItem, 'id'>) => Promise<void>;
  onDeleteService: (serviceId: string) => Promise<void>;
}

export default function ServicesTab({
  services,
  onUpdateService,
  onAddService,
  onDeleteService
}: ServicesTabProps) {
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<Omit<ServiceItem, 'id'>>({
    name: "",
    slug: "",
    category: "Vehicle Care",
    price: 499,
    estimatedDuration: "45 mins",
    description: "",
    isActive: true
  });

  const handleToggleActive = async (service: ServiceItem) => {
    await onUpdateService({
      ...service,
      isActive: !service.isActive
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    await onUpdateService(editingService);
    setEditingService(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = addForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await onAddService({
      ...addForm,
      slug: slug || `service-${Date.now()}`
    });
    setIsAddModalOpen(false);
    setAddForm({
      name: "",
      slug: "",
      category: "Vehicle Care",
      price: 499,
      estimatedDuration: "45 mins",
      description: "",
      isActive: true
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Services & Pricing Management</span>
            <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {services.length} Services
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure doorstep service rates, estimated durations, and package tiers for Korba
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div
            key={s.id || s.slug}
            className={`
              bg-[#121824] border rounded-2xl p-6 transition-all shadow-md relative flex flex-col justify-between
              ${s.isActive ? 'border-amber-500/30 hover:border-amber-500/60' : 'border-gray-800 opacity-60'}
            `}
          >
            <div>
              {/* Category Badge & Status */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {s.category || 'General Cleaning'}
                </span>
                <button
                  onClick={() => handleToggleActive(s)}
                  className="flex items-center gap-1 text-xs font-bold"
                  title="Toggle Active Status"
                >
                  {s.isActive ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ToggleRight className="w-6 h-6" /> Active
                    </span>
                  ) : (
                    <span className="text-gray-500 flex items-center gap-1">
                      <ToggleLeft className="w-6 h-6" /> Disabled
                    </span>
                  )}
                </button>
              </div>

              {/* Service Title */}
              <h3 className="text-lg font-black text-white mb-1">{s.name}</h3>
              <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                {s.description || 'Professional mechanized doorstep cleaning in Korba with high-pressure equipment.'}
              </p>

              {/* Pricing & Duration Chips */}
              <div className="flex items-center gap-3 py-3 border-y border-gray-800/80 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Starting Price</span>
                  <span className="text-xl font-black text-amber-400">₹{s.price}</span>
                </div>
                <div className="border-l border-gray-800 pl-3">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Duration</span>
                  <span className="text-xs font-semibold text-gray-300 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {s.estimatedDuration || '45 mins'}
                  </span>
                </div>
              </div>

              {/* Sub-packages if any */}
              {s.packages && s.packages.length > 0 && (
                <div className="mb-4 space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 block">
                    Available Packages:
                  </span>
                  {s.packages.map((pkg, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] bg-[#0B0F17] px-2.5 py-1.5 rounded-lg border border-gray-800">
                      <span className="text-gray-300">{pkg.name}</span>
                      <span className="font-bold text-amber-400">₹{pkg.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setEditingService(s)}
                className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>

              <button
                onClick={async () => {
                  if (confirm(`Are you sure you want to delete ${s.name}?`)) {
                    await onDeleteService(s.id);
                  }
                }}
                className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT SERVICE MODAL */}
      {editingService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-[#121824] border border-amber-500/30 rounded-2xl w-full max-w-lg p-6 text-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-amber-400" />
                <span>Edit Service: {editingService.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    className="w-full bg-[#0B0F17] border border-amber-500/50 rounded-xl p-2.5 text-amber-400 font-black text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    required
                    value={editingService.estimatedDuration}
                    onChange={(e) => setEditingService({ ...editingService, estimatedDuration: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Category</label>
                <select
                  value={editingService.category}
                  onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-semibold"
                >
                  <option value="Vehicle Care">Vehicle Care (Car / Bike)</option>
                  <option value="Home Care">Home Care (Sofa / Carpet / Kitchen)</option>
                  <option value="Sanitization">Sanitization (Water Tank Cleaning)</option>
                  <option value="Eco Cleaning">Eco Cleaning (Solar Panels)</option>
                  <option value="Other">Other Specialized Care</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs rounded-xl shadow-md"
              >
                Save Updates
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD SERVICE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddSubmit} className="bg-[#121824] border border-amber-500/30 rounded-2xl w-full max-w-lg p-6 text-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Add New Cleaning Service</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Glass & Facade Cleaning"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Starting Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={addForm.price}
                    onChange={(e) => setAddForm({ ...addForm, price: Number(e.target.value) })}
                    className="w-full bg-[#0B0F17] border border-amber-500/50 rounded-xl p-2.5 text-amber-400 font-black text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 60 mins"
                    value={addForm.estimatedDuration}
                    onChange={(e) => setAddForm({ ...addForm, estimatedDuration: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Category</label>
                <select
                  value={addForm.category}
                  onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-semibold"
                >
                  <option value="Vehicle Care">Vehicle Care</option>
                  <option value="Home Care">Home Care</option>
                  <option value="Sanitization">Sanitization</option>
                  <option value="Eco Cleaning">Eco Cleaning</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Explain what is included in this service..."
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs rounded-xl shadow-md"
              >
                Create Service
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
