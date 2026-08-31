import React, { useState } from "react";
import {
  Truck,
  Plus,
  Search,
  Phone,
  MessageSquare,
  DollarSign,
  Download,
  Trash2,
  Package,
  MapPin
} from "lucide-react";
import { Supplier } from "../../types/admin";
import { exportToCSV } from "../../services/adminService";

interface SuppliersTabProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
  onUpdateSupplier: (supplier: Supplier) => Promise<void>;
  onDeleteSupplier: (id: string) => Promise<void>;
}

export default function SuppliersTab({
  suppliers,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier
}: SuppliersTabProps) {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<Omit<Supplier, 'id'>>({
    name: "",
    contactPerson: "",
    mobile: "",
    email: "",
    address: "Korba, Chhattisgarh",
    suppliesCategory: "Car Shampoo & Foam",
    totalPurchased: 0,
    pendingBalance: 0
  });

  const totalSupplierSpend = suppliers.reduce((sum, s) => sum + s.totalPurchased, 0);
  const totalPayableToSuppliers = suppliers.reduce((sum, s) => sum + s.pendingBalance, 0);

  const filteredSuppliers = suppliers.filter((s) => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contactPerson?.toLowerCase().includes(search.toLowerCase()) ||
      s.mobile.includes(search) ||
      s.suppliesCategory.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name) return;
    await onAddSupplier(addForm);
    setIsAddModalOpen(false);
    setAddForm({
      name: "",
      contactPerson: "",
      mobile: "",
      email: "",
      address: "Korba, Chhattisgarh",
      suppliesCategory: "Car Shampoo & Foam",
      totalPurchased: 0,
      pendingBalance: 0
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Supplier & Vendor Directory</span>
            <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {suppliers.length} Vendors
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Chemical wholesalers, equipment dealers, and spare parts suppliers in Korba & Raipur
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => exportToCSV(suppliers, 'OkarEhha_Suppliers')}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20 flex-1 sm:flex-none justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Supplier</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Total Procurement Spent</span>
          <div className="text-2xl font-black text-white">₹{totalSupplierSpend.toLocaleString()}</div>
          <span className="text-[10px] text-gray-400 font-semibold">Total purchases across vendors</span>
        </div>

        <div className="bg-[#121824] border border-red-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Accounts Payable (Pending)</span>
          <div className="text-2xl font-black text-red-400">₹{totalPayableToSuppliers.toLocaleString()}</div>
          <span className="text-[10px] text-red-300 font-semibold">Unsettled vendor balances</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-2xl shadow-md">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search vendor name, contact person, phone or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B0F17] border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-[#121824] border border-amber-500/20 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0F17] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-3.5">Supplier Name & Person</th>
                <th className="p-3.5">Category Supplies</th>
                <th className="p-3.5">Contact & Location</th>
                <th className="p-3.5">Total Purchased</th>
                <th className="p-3.5">Pending Payable</th>
                <th className="p-3.5 text-right">Outreach & PO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
              {filteredSuppliers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="p-3.5">
                    <p className="font-bold text-white text-sm">{s.name}</p>
                    <span className="text-[11px] text-gray-400">Contact: {s.contactPerson || 'Sales Team'}</span>
                  </td>

                  <td className="p-3.5">
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                      {s.suppliesCategory}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1 text-white font-mono">
                      <span>{s.mobile}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      {s.address}
                    </span>
                  </td>

                  <td className="p-3.5 font-bold text-white">
                    ₹{s.totalPurchased.toLocaleString()}
                  </td>

                  <td className="p-3.5">
                    {s.pendingBalance > 0 ? (
                      <span className="text-red-400 font-black text-sm">
                        ₹{s.pendingBalance.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold text-[11px]">₹0 (Settled)</span>
                    )}
                  </td>

                  <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                    {/* Call */}
                    <a
                      href={`tel:${s.mobile}`}
                      className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg inline-block"
                      title="Call Supplier"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>

                    {/* WhatsApp PO */}
                    <a
                      href={`https://wa.me/91${s.mobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(s.name)},%20this%20is%20Okar%20Ehha%20Doorstep%20Cleaning.%20We%20would%20like%20to%20place%20a%20new%20stock%20order%20for%20${encodeURIComponent(s.suppliesCategory)}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg inline-block"
                      title="Send Purchase Order on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>

                    {/* Delete */}
                    <button
                      onClick={async () => {
                        if (confirm(`Remove supplier ${s.name}?`)) {
                          await onDeleteSupplier(s.id);
                        }
                      }}
                      className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD SUPPLIER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddSubmit} className="bg-[#121824] border border-amber-500/30 rounded-2xl w-full max-w-lg p-6 text-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Add Vendor / Supplier</span>
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
                <label className="block text-gray-400 font-bold mb-1">Company / Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chhattisgarh Auto Chemicals Wholesale"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Amit Verma"
                    value={addForm.contactPerson}
                    onChange={(e) => setAddForm({ ...addForm, contactPerson: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98271XXXXX"
                    value={addForm.mobile}
                    onChange={(e) => setAddForm({ ...addForm, mobile: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Supplies Category</label>
                  <select
                    value={addForm.suppliesCategory}
                    onChange={(e) => setAddForm({ ...addForm, suppliesCategory: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-semibold"
                  >
                    <option value="Car Shampoo & Foam">Car Shampoo & Foam</option>
                    <option value="Microfiber & Towels">Microfiber & Towels</option>
                    <option value="Degreasers & Tank Chemicals">Degreasers & Tank Chemicals</option>
                    <option value="Pressure Washers & Spares">Pressure Washers & Spares</option>
                    <option value="Vacuum & Extraction Tools">Vacuum & Extraction Tools</option>
                    <option value="Fuel / Petrol">Fuel / Petrol</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Opening Pending Due (₹)</label>
                  <input
                    type="number"
                    value={addForm.pendingBalance}
                    onChange={(e) => setAddForm({ ...addForm, pendingBalance: Number(e.target.value) })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-red-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Address / Warehouse City</label>
                <input
                  type="text"
                  placeholder="e.g. Transport Nagar, Korba / Pandri, Raipur"
                  value={addForm.address}
                  onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
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
                Save Supplier
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
