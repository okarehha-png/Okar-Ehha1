import React, { useState } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  Trash2,
  Download,
  Boxes,
  CheckCircle2
} from "lucide-react";
import { InventoryItem } from "../../types/admin";
import { exportToCSV } from "../../services/adminService";

interface InventoryTabProps {
  inventory: InventoryItem[];
  onUpdateItem: (item: InventoryItem) => Promise<void>;
  onAddItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

export default function InventoryTab({
  inventory,
  onUpdateItem,
  onAddItem,
  onDeleteItem
}: InventoryTabProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustType, setAdjustType] = useState<'IN' | 'OUT'>('IN');

  const [addForm, setAddForm] = useState<Omit<InventoryItem, 'id'>>({
    productName: "",
    category: "Chemicals & Shampoos",
    unit: "Liters",
    currentStock: 10,
    minStockLevel: 5,
    unitCost: 150,
    supplierName: "Korba Auto Care Chemicals"
  });

  const lowStockCount = inventory.filter(i => i.currentStock <= i.minStockLevel).length;
  const totalStockValue = inventory.reduce((sum, i) => sum + (i.currentStock * i.unitCost), 0);

  const filteredInventory = inventory.filter((item) => {
    const matchSearch =
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.supplierName?.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchCat = categoryFilter === "ALL" || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem || adjustQty <= 0) return;

    const newStock = adjustType === 'IN'
      ? adjustingItem.currentStock + adjustQty
      : Math.max(0, adjustingItem.currentStock - adjustQty);

    await onUpdateItem({
      ...adjustingItem,
      currentStock: newStock,
      lastRestocked: adjustType === 'IN' ? new Date().toISOString().split('T')[0] : adjustingItem.lastRestocked
    });

    setAdjustingItem(null);
    setAdjustQty(0);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.productName) return;

    await onAddItem({
      ...addForm,
      lastRestocked: new Date().toISOString().split('T')[0]
    });

    setIsAddModalOpen(false);
    setAddForm({
      productName: "",
      category: "Chemicals & Shampoos",
      unit: "Liters",
      currentStock: 10,
      minStockLevel: 5,
      unitCost: 150,
      supplierName: "Korba Auto Care Chemicals"
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Inventory & Stock Management</span>
            <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {inventory.length} SKUs
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time track of shampoos, microfiber towels, chemical supplies and machines
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => exportToCSV(inventory, 'OkarEhha_Inventory')}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Stock</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20 flex-1 sm:flex-none justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Product SKU</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Total Stock Value</span>
          <div className="text-2xl font-black text-amber-400">₹{totalStockValue.toLocaleString()}</div>
          <span className="text-[10px] text-gray-400 font-semibold">Cost of products in warehouse</span>
        </div>

        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Total Active SKUs</span>
          <div className="text-2xl font-black text-white">{inventory.length} Items</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Across 4 Categories</span>
        </div>

        <div className={`bg-[#121824] border p-4 rounded-xl ${lowStockCount > 0 ? 'border-red-500/40 bg-red-950/20' : 'border-amber-500/20'}`}>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Low Stock Alerts</span>
          <div className={`text-2xl font-black ${lowStockCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {lowStockCount} Items
          </div>
          <span className="text-[10px] text-gray-400 font-semibold">Below reorder minimum</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-2xl shadow-md flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search product name, category or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B0F17] border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-56 bg-[#0B0F17] border border-gray-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Chemicals & Shampoos">Chemicals & Shampoos</option>
            <option value="Cleaning Accessories">Cleaning Accessories</option>
            <option value="Sanitization Supplies">Sanitization Supplies</option>
            <option value="Equipment & Spare Parts">Equipment & Spare Parts</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#121824] border border-amber-500/20 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0F17] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-3.5">Product Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5">Reorder Level</th>
                <th className="p-3.5">Unit Cost</th>
                <th className="p-3.5">Total Value</th>
                <th className="p-3.5">Supplier</th>
                <th className="p-3.5 text-right">Quick Stock In/Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
              {filteredInventory.map((item) => {
                const isLow = item.currentStock <= item.minStockLevel;

                return (
                  <tr key={item.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-white text-sm">
                      {item.productName}
                    </td>

                    <td className="p-3.5">
                      <span className="text-[11px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-base font-black ${isLow ? 'text-red-400' : 'text-emerald-400'}`}>
                          {item.currentStock} {item.unit}
                        </span>
                        {isLow && (
                          <span className="p-1 bg-red-500/20 text-red-400 rounded-md" title="Low Stock Warning">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 text-gray-400 font-semibold">
                      {item.minStockLevel} {item.unit}
                    </td>

                    <td className="p-3.5 font-bold text-white">
                      ₹{item.unitCost}
                    </td>

                    <td className="p-3.5 font-black text-amber-400">
                      ₹{(item.currentStock * item.unitCost).toLocaleString()}
                    </td>

                    <td className="p-3.5 text-gray-300">
                      {item.supplierName || 'Direct Vendor'}
                    </td>

                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      {/* Stock IN / OUT */}
                      <button
                        onClick={() => {
                          setAdjustingItem(item);
                          setAdjustType('IN');
                        }}
                        className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold transition-colors"
                      >
                        + In
                      </button>
                      <button
                        onClick={() => {
                          setAdjustingItem(item);
                          setAdjustType('OUT');
                        }}
                        className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold transition-colors"
                      >
                        - Out
                      </button>

                      {/* Delete */}
                      <button
                        onClick={async () => {
                          if (confirm(`Remove ${item.productName} from inventory?`)) {
                            await onDeleteItem(item.id);
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

      {/* QUICK STOCK ADJUST MODAL */}
      {adjustingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAdjustSubmit} className="bg-[#121824] border border-amber-500/30 rounded-2xl w-full max-w-md p-6 text-gray-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Boxes className="w-5 h-5 text-amber-400" />
              <span>Stock Adjustment ({adjustType === 'IN' ? 'Stock In / Restock' : 'Stock Out / Consumption'})</span>
            </h3>
            <p className="text-xs text-gray-400">
              Product: <strong>{adjustingItem.productName}</strong> (Current Stock: {adjustingItem.currentStock} {adjustingItem.unit})
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAdjustType('IN')}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold ${adjustType === 'IN' ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-400'}`}
              >
                + Stock In (Purchase)
              </button>
              <button
                type="button"
                onClick={() => setAdjustType('OUT')}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold ${adjustType === 'OUT' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                - Stock Out (Consumed)
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Quantity ({adjustingItem.unit})</label>
              <input
                type="number"
                required
                min={1}
                value={adjustQty || ''}
                onChange={(e) => setAdjustQty(Number(e.target.value))}
                placeholder="Enter quantity"
                className="w-full bg-[#0B0F17] border border-amber-500/50 rounded-xl p-3 text-amber-400 font-black text-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setAdjustingItem(null)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2 text-black font-extrabold text-xs rounded-xl ${adjustType === 'IN' ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-red-500 hover:bg-red-400 text-white'}`}
              >
                Confirm Adjustment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD NEW PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddSubmit} className="bg-[#121824] border border-amber-500/30 rounded-2xl w-full max-w-lg p-6 text-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Add Product SKU</span>
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
                <label className="block text-gray-400 font-bold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ultra Snow Foam Wash Shampoo"
                  value={addForm.productName}
                  onChange={(e) => setAddForm({ ...addForm, productName: e.target.value })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Category</label>
                  <select
                    value={addForm.category}
                    onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-semibold"
                  >
                    <option value="Chemicals & Shampoos">Chemicals & Shampoos</option>
                    <option value="Cleaning Accessories">Cleaning Accessories</option>
                    <option value="Sanitization Supplies">Sanitization Supplies</option>
                    <option value="Equipment & Spare Parts">Equipment & Spare Parts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Unit of Measurement</label>
                  <select
                    value={addForm.unit}
                    onChange={(e) => setAddForm({ ...addForm, unit: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-semibold"
                  >
                    <option value="Liters">Liters</option>
                    <option value="Pieces / Units">Pieces / Units</option>
                    <option value="Kg">Kilograms (Kg)</option>
                    <option value="Bottles">Bottles</option>
                    <option value="Packets">Packets</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Opening Stock</label>
                  <input
                    type="number"
                    required
                    value={addForm.currentStock}
                    onChange={(e) => setAddForm({ ...addForm, currentStock: Number(e.target.value) })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Reorder Alert Min</label>
                  <input
                    type="number"
                    required
                    value={addForm.minStockLevel}
                    onChange={(e) => setAddForm({ ...addForm, minStockLevel: Number(e.target.value) })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Unit Cost (₹)</label>
                  <input
                    type="number"
                    required
                    value={addForm.unitCost}
                    onChange={(e) => setAddForm({ ...addForm, unitCost: Number(e.target.value) })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-amber-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Default Supplier</label>
                <input
                  type="text"
                  placeholder="e.g. Korba Auto Care Chemicals"
                  value={addForm.supplierName}
                  onChange={(e) => setAddForm({ ...addForm, supplierName: e.target.value })}
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
                Save SKU
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
