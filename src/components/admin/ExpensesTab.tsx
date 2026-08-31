import React, { useState } from "react";
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Trash2,
  Download,
  Calendar,
  DollarSign,
  Tag,
  CreditCard,
  PieChart as PieChartIcon
} from "lucide-react";
import { Expense, ExpenseCategory } from "../../types/admin";
import { exportToCSV } from "../../services/adminService";

interface ExpensesTabProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  onDeleteExpense: (id: string) => Promise<void>;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Staff Salary',
  'Petrol / Vehicle Fuel',
  'Car Shampoo & Foam',
  'Chemicals & Degreasers',
  'Cleaning Equipment',
  'Equipment Repair & Service',
  'Marketing & WhatsApp Ads',
  'Office / Shed Rent',
  'Electricity & Power',
  'Mobile & Internet',
  'Packaging & Gloves',
  'Other Operations'
];

export default function ExpensesTab({
  expenses,
  onAddExpense,
  onDeleteExpense
}: ExpensesTabProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [addForm, setAddForm] = useState<Omit<Expense, 'id'>>({
    date: new Date().toISOString().split("T")[0],
    category: "Petrol / Vehicle Fuel",
    amount: 0,
    paidTo: "",
    paymentMethod: "UPI",
    notes: ""
  });

  // Calculate Metrics
  const todayStr = new Date().toISOString().split("T")[0];
  const currentMonthStr = todayStr.slice(0, 7);

  const totalExpenseAllTime = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalExpenseToday = expenses
    .filter(e => e.date === todayStr || e.createdAt?.startsWith(todayStr))
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalExpenseMonth = expenses
    .filter(e => e.date?.startsWith(currentMonthStr) || e.createdAt?.startsWith(currentMonthStr))
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // Filtered
  const filteredExpenses = expenses.filter((e) => {
    const matchSearch =
      e.paidTo?.toLowerCase().includes(search.toLowerCase()) ||
      e.notes?.toLowerCase().includes(search.toLowerCase()) ||
      e.category?.toLowerCase().includes(search.toLowerCase());

    const matchCategory = categoryFilter === "ALL" || e.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.amount || addForm.amount <= 0) return;
    await onAddExpense(addForm);
    setIsAddModalOpen(false);
    setAddForm({
      date: new Date().toISOString().split("T")[0],
      category: "Petrol / Vehicle Fuel",
      amount: 0,
      paidTo: "",
      paymentMethod: "UPI",
      notes: ""
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Business Expenses & Outflows</span>
            <span className="text-xs bg-red-500/20 text-red-400 font-bold px-2.5 py-0.5 rounded-full border border-red-500/30">
              {filteredExpenses.length} Records
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Log fuel, chemical purchases, equipment maintenance, and technician payroll
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => exportToCSV(expenses, 'OkarEhha_Expenses')}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-red-500/20 flex-1 sm:flex-none justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121824] border border-red-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Today's Expenses</span>
          <div className="text-2xl font-black text-white">₹{totalExpenseToday.toLocaleString()}</div>
          <span className="text-[10px] text-gray-400 font-semibold">Fuel & Quick Supplies</span>
        </div>

        <div className="bg-[#121824] border border-red-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">This Month Expenses</span>
          <div className="text-2xl font-black text-red-400">₹{totalExpenseMonth.toLocaleString()}</div>
          <span className="text-[10px] text-red-300 font-semibold">August 2026</span>
        </div>

        <div className="bg-[#121824] border border-red-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">All Time Recorded</span>
          <div className="text-2xl font-black text-white">₹{totalExpenseAllTime.toLocaleString()}</div>
          <span className="text-[10px] text-gray-400 font-semibold">Total Operations Outflow</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-2xl shadow-md flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search expense description, paid to vendor/staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B0F17] border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-60 bg-[#0B0F17] border border-gray-800 rounded-xl px-3 py-2 text-xs text-red-400 font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-[#121824] border border-amber-500/20 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0F17] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Paid To / Vendor</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">Notes</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="p-3.5 font-semibold text-white">
                      {exp.date}
                    </td>

                    <td className="p-3.5">
                      <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-md font-bold text-[11px]">
                        {exp.category}
                      </span>
                    </td>

                    <td className="p-3.5 font-black text-red-400 text-sm">
                      ₹{exp.amount.toLocaleString()}
                    </td>

                    <td className="p-3.5 font-bold text-white">
                      {exp.paidTo || 'N/A'}
                    </td>

                    <td className="p-3.5 text-gray-300 font-semibold">
                      {exp.paymentMethod || 'UPI'}
                    </td>

                    <td className="p-3.5 text-gray-400 max-w-[200px] truncate">
                      {exp.notes || '-'}
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={async () => {
                          if (confirm("Delete this expense entry?")) {
                            await onDeleteExpense(exp.id);
                          }
                        }}
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD EXPENSE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddSubmit} className="bg-[#121824] border border-red-500/30 rounded-2xl w-full max-w-lg p-6 text-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-red-400" />
                <span>Record Operational Expense</span>
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
                  <label className="block text-gray-400 font-bold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={addForm.date}
                    onChange={(e) => setAddForm({ ...addForm, date: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={addForm.amount || ''}
                    onChange={(e) => setAddForm({ ...addForm, amount: Number(e.target.value) })}
                    className="w-full bg-[#0B0F17] border border-red-500/50 rounded-xl p-2.5 text-red-400 font-black text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Expense Category *</label>
                <select
                  value={addForm.category}
                  onChange={(e) => setAddForm({ ...addForm, category: e.target.value as ExpenseCategory })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-semibold"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Paid To / Recipient</label>
                  <input
                    type="text"
                    placeholder="e.g. Indian Oil Korba / Shampoo Vendor"
                    value={addForm.paidTo}
                    onChange={(e) => setAddForm({ ...addForm, paidTo: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Payment Method</label>
                  <select
                    value={addForm.paymentMethod}
                    onChange={(e) => setAddForm({ ...addForm, paymentMethod: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-semibold"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 5L super foam shampoo purchase for vehicle wash unit 2"
                  value={addForm.notes}
                  onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
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
                className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                Save Expense
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
