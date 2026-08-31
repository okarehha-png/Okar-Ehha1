import React, { useState } from "react";
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { PurchaseOrder, Supplier } from "../../types/admin";
import { exportToCSV } from "../../services/adminService";

interface PurchasesTabProps {
  purchases: PurchaseOrder[];
  suppliers: Supplier[];
  onAddPurchase: (purchase: Omit<PurchaseOrder, 'id'>) => Promise<void>;
  onDeletePurchase: (id: string) => Promise<void>;
}

export default function PurchasesTab({
  purchases,
  suppliers,
  onAddPurchase,
  onDeletePurchase
}: PurchasesTabProps) {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<Omit<PurchaseOrder, 'id'>>({
    date: new Date().toISOString().split("T")[0],
    supplierName: suppliers[0]?.name || "Korba Auto Care Chemicals",
    invoiceNumber: `INV-${Date.now().toString().slice(-4)}`,
    totalAmount: 1500,
    paymentStatus: "Paid",
    itemsSummary: "5L Car Foam Shampoo + 10x Microfiber Towels",
    notes: ""
  });

  const totalPurchasesAmount = purchases.reduce((sum, p) => sum + p.totalAmount, 0);

  const filteredPurchases = purchases.filter((p) => {
    return (
      p.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      p.itemsSummary.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.totalAmount) return;
    await onAddPurchase(addForm);
    setIsAddModalOpen(false);
    setAddForm({
      date: new Date().toISOString().split("T")[0],
      supplierName: suppliers[0]?.name || "Korba Auto Care Chemicals",
      invoiceNumber: `INV-${Date.now().toString().slice(-4)}`,
      totalAmount: 1500,
      paymentStatus: "Paid",
      itemsSummary: "",
      notes: ""
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Purchase Orders & Vendor Bills</span>
            <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {purchases.length} Bills
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Log inventory purchase invoices, chemical procurement bills, and supplier settlements
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => exportToCSV(purchases, 'OkarEhha_Purchases')}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Purchases</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20 flex-1 sm:flex-none justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Purchase Bill</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Total Procurement Cost</span>
          <div className="text-2xl font-black text-amber-400">₹{totalPurchasesAmount.toLocaleString()}</div>
          <span className="text-[10px] text-gray-400 font-semibold">Across all recorded vendor invoices</span>
        </div>

        <div className="bg-[#121824] border border-emerald-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Settled Purchases</span>
          <div className="text-2xl font-black text-emerald-400">
            {purchases.filter(p => p.paymentStatus === 'Paid').length} Bills Paid
          </div>
          <span className="text-[10px] text-emerald-300 font-semibold">No vendor payment disputes</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-2xl shadow-md">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search invoice number, supplier or item description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B0F17] border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-[#121824] border border-amber-500/20 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0F17] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-3.5">Invoice # & Date</th>
                <th className="p-3.5">Supplier / Vendor</th>
                <th className="p-3.5">Items Purchased</th>
                <th className="p-3.5">Bill Amount</th>
                <th className="p-3.5">Payment Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
              {filteredPurchases.map((p) => (
                <tr key={p.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="p-3.5">
                    <span className="font-mono text-amber-400 font-bold block">{p.invoiceNumber || 'INV-001'}</span>
                    <span className="text-[10px] text-gray-500">{p.date}</span>
                  </td>

                  <td className="p-3.5 font-bold text-white text-sm">
                    {p.supplierName}
                  </td>

                  <td className="p-3.5 text-gray-300 max-w-[280px]">
                    {p.itemsSummary}
                  </td>

                  <td className="p-3.5 font-black text-amber-400 text-sm">
                    ₹{p.totalAmount.toLocaleString()}
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.paymentStatus === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {p.paymentStatus}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={async () => {
                        if (confirm("Delete this purchase entry?")) {
                          await onDeletePurchase(p.id);
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

      {/* ADD PURCHASE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddSubmit} className="bg-[#121824] border border-amber-500/30 rounded-2xl w-full max-w-md p-6 text-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <span>Log Purchase Invoice</span>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Invoice Date</label>
                  <input
                    type="date"
                    required
                    value={addForm.date}
                    onChange={(e) => setAddForm({ ...addForm, date: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Bill / Inv Number</label>
                  <input
                    type="text"
                    required
                    value={addForm.invoiceNumber}
                    onChange={(e) => setAddForm({ ...addForm, invoiceNumber: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Supplier</label>
                <select
                  value={addForm.supplierName}
                  onChange={(e) => setAddForm({ ...addForm, supplierName: e.target.value })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.name}>{s.name} ({s.suppliesCategory})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Total Bill Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={addForm.totalAmount || ''}
                    onChange={(e) => setAddForm({ ...addForm, totalAmount: Number(e.target.value) })}
                    className="w-full bg-[#0B0F17] border border-amber-500/50 rounded-xl p-2.5 text-amber-400 font-black text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Payment Status</label>
                  <select
                    value={addForm.paymentStatus}
                    onChange={(e) => setAddForm({ ...addForm, paymentStatus: e.target.value as any })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Pending">Pending (Credit)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Items Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 5L foam wash shampoo + 10 microfiber cloths"
                  value={addForm.itemsSummary}
                  onChange={(e) => setAddForm({ ...addForm, itemsSummary: e.target.value })}
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
                Save Bill
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
