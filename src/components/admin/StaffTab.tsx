import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Phone,
  MessageSquare,
  DollarSign,
  UserCheck,
  Calendar,
  Trash2,
  Edit2,
  Download,
  Award
} from "lucide-react";
import { StaffMember, Booking } from "../../types/admin";
import { exportToCSV } from "../../services/adminService";

interface StaffTabProps {
  staff: StaffMember[];
  bookings: Booking[];
  onAddStaff: (member: Omit<StaffMember, 'id'>) => Promise<void>;
  onUpdateStaff: (member: StaffMember) => Promise<void>;
  onDeleteStaff: (id: string) => Promise<void>;
}

export default function StaffTab({
  staff,
  bookings,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff
}: StaffTabProps) {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [addForm, setAddForm] = useState<Omit<StaffMember, 'id'>>({
    name: "",
    role: "Technician",
    mobile: "",
    baseSalary: 12000,
    commissionPercentage: 5,
    joinedDate: new Date().toISOString().split("T")[0],
    isActive: true,
    emergencyContact: ""
  });

  // Calculate staff performance metrics from bookings
  const staffMetricsMap: Record<string, { jobs: number; rev: number; commission: number }> = {};
  bookings.forEach(b => {
    if (b.status === 'Completed' && b.assignedStaff) {
      if (!staffMetricsMap[b.assignedStaff]) {
        staffMetricsMap[b.assignedStaff] = { jobs: 0, rev: 0, commission: 0 };
      }
      const rev = Number(b.finalAmount || b.amount || 0);
      staffMetricsMap[b.assignedStaff].jobs += 1;
      staffMetricsMap[b.assignedStaff].rev += rev;
      staffMetricsMap[b.assignedStaff].commission += Math.round(rev * 0.05); // 5% avg
    }
  });

  const totalMonthlyPayroll = staff.reduce((sum, s) => sum + (s.isActive ? s.baseSalary : 0), 0);
  const activeStaffCount = staff.filter(s => s.isActive).length;

  const filteredStaff = staff.filter((s) => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.mobile.includes(search)
    );
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.mobile) return;
    await onAddStaff(addForm);
    setIsAddModalOpen(false);
    setAddForm({
      name: "",
      role: "Technician",
      mobile: "",
      baseSalary: 12000,
      commissionPercentage: 5,
      joinedDate: new Date().toISOString().split("T")[0],
      isActive: true,
      emergencyContact: ""
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    await onUpdateStaff(editingStaff);
    setEditingStaff(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Staff & Technician Management</span>
            <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {activeStaffCount} Active Crew
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Doorstep cleaning technicians, van drivers, supervisors and customer care team
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => exportToCSV(staff, 'OkarEhha_Staff')}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Staff</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20 flex-1 sm:flex-none justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Active Team Members</span>
          <div className="text-2xl font-black text-white">{activeStaffCount} Employees</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Ready for dispatch</span>
        </div>

        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Base Monthly Payroll</span>
          <div className="text-2xl font-black text-amber-400">₹{totalMonthlyPayroll.toLocaleString()}</div>
          <span className="text-[10px] text-gray-400 font-semibold">Fixed monthly salaries</span>
        </div>

        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Top Performer</span>
          <div className="text-xl font-black text-emerald-400">
            {Object.keys(staffMetricsMap).sort((a, b) => staffMetricsMap[b].jobs - staffMetricsMap[a].jobs)[0] || 'Ramesh Patel'}
          </div>
          <span className="text-[10px] text-gray-400 font-semibold">Highest completed doorstep jobs</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-2xl shadow-md">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search employee by name, role (Technician / Driver) or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B0F17] border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-[#121824] border border-amber-500/20 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0F17] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-3.5">Staff Member & Contact</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Base Salary</th>
                <th className="p-3.5">Commission %</th>
                <th className="p-3.5">Completed Jobs</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
              {filteredStaff.map((s) => {
                const metric = staffMetricsMap[s.name] || { jobs: 0, rev: 0 };

                return (
                  <tr key={s.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-white text-sm">{s.name}</p>
                      <span className="text-[11px] text-gray-400 font-mono">{s.mobile}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-md font-bold text-[11px]">
                        {s.role}
                      </span>
                    </td>

                    <td className="p-3.5 font-bold text-white text-sm">
                      ₹{s.baseSalary.toLocaleString()}/mo
                    </td>

                    <td className="p-3.5 text-amber-400 font-bold">
                      {s.commissionPercentage}% per job
                    </td>

                    <td className="p-3.5">
                      <span className="font-extrabold text-emerald-400">
                        {metric.jobs} Services
                      </span>
                      <span className="block text-[10px] text-gray-500">₹{metric.rev.toLocaleString()} revenue</span>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-gray-800 text-gray-500'
                        }`}
                      >
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      {/* Call */}
                      <a
                        href={`tel:${s.mobile}`}
                        className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg inline-block"
                        title="Call Staff"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>

                      {/* Edit */}
                      <button
                        onClick={() => setEditingStaff(s)}
                        className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg inline-block"
                        title="Edit Salary / Role"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={async () => {
                          if (confirm(`Remove staff ${s.name}?`)) {
                            await onDeleteStaff(s.id);
                          }
                        }}
                        className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT STAFF MODAL */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleEditSubmit} className="bg-[#121824] border border-amber-500/30 rounded-2xl w-full max-w-md p-6 text-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-amber-400" />
                <span>Edit Staff: {editingStaff.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Role</label>
                  <select
                    value={editingStaff.role}
                    onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="Technician">Technician</option>
                    <option value="Senior Detailer">Senior Detailer</option>
                    <option value="Driver / Field Exec">Driver / Field Exec</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={editingStaff.mobile}
                    onChange={(e) => setEditingStaff({ ...editingStaff, mobile: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Monthly Base (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingStaff.baseSalary}
                    onChange={(e) => setEditingStaff({ ...editingStaff, baseSalary: Number(e.target.value) })}
                    className="w-full bg-[#0B0F17] border border-amber-500/50 rounded-xl p-2.5 text-amber-400 font-black text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Commission (%)</label>
                  <input
                    type="number"
                    required
                    value={editingStaff.commissionPercentage}
                    onChange={(e) => setEditingStaff({ ...editingStaff, commissionPercentage: Number(e.target.value) })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Active Status</label>
                <select
                  value={editingStaff.isActive ? "true" : "false"}
                  onChange={(e) => setEditingStaff({ ...editingStaff, isActive: e.target.value === "true" })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-semibold"
                >
                  <option value="true">Active (Working)</option>
                  <option value="false">Inactive / On Long Leave</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs rounded-xl"
              >
                Save Updates
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD STAFF MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddSubmit} className="bg-[#121824] border border-amber-500/30 rounded-2xl w-full max-w-md p-6 text-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Onboard New Staff Member</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sahu"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Role</label>
                  <select
                    value={addForm.role}
                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="Technician">Technician</option>
                    <option value="Senior Detailer">Senior Detailer</option>
                    <option value="Driver / Field Exec">Driver / Field Exec</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98270XXXXX"
                    value={addForm.mobile}
                    onChange={(e) => setAddForm({ ...addForm, mobile: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Monthly Base (₹)</label>
                  <input
                    type="number"
                    required
                    value={addForm.baseSalary}
                    onChange={(e) => setAddForm({ ...addForm, baseSalary: Number(e.target.value) })}
                    className="w-full bg-[#0B0F17] border border-amber-500/50 rounded-xl p-2.5 text-amber-400 font-black text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Commission (%)</label>
                  <input
                    type="number"
                    value={addForm.commissionPercentage}
                    onChange={(e) => setAddForm({ ...addForm, commissionPercentage: Number(e.target.value) })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Emergency Contact / Family Phone</label>
                <input
                  type="text"
                  placeholder="e.g. Father: 98260XXXXX"
                  value={addForm.emergencyContact}
                  onChange={(e) => setAddForm({ ...addForm, emergencyContact: e.target.value })}
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
                Add Staff Member
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
