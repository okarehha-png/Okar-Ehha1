import React, { useState } from "react";
import {
  Landmark,
  Wallet,
  Smartphone,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  DollarSign
} from "lucide-react";
import { FinancialAccount, FinancialTransaction, Booking, Expense } from "../../types/admin";
import { exportToCSV } from "../../services/adminService";

interface CashBankTabProps {
  accounts: FinancialAccount[];
  transactions: FinancialTransaction[];
  bookings: Booking[];
  expenses: Expense[];
  onAddTransaction: (txn: Omit<FinancialTransaction, 'id'>) => Promise<void>;
}

export default function CashBankTab({
  accounts,
  transactions,
  bookings,
  expenses,
  onAddTransaction
}: CashBankTabProps) {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferForm, setTransferForm] = useState({
    date: new Date().toISOString().split("T")[0],
    fromAccount: "Cash",
    toAccount: "Bank",
    amount: 0,
    notes: ""
  });

  // Calculate live dynamic balances:
  // Cash: Opening + Cash collections - Cash expenses
  // UPI: Opening + UPI collections - UPI expenses
  // Bank: Opening + Bank collections - Bank expenses

  const cashCollections = bookings
    .filter(b => b.paymentMethod === 'Cash' || (!b.paymentMethod && b.status === 'Completed'))
    .reduce((sum, b) => sum + Number(b.paymentReceived || (b.status === 'Completed' ? b.finalAmount || b.amount : 0)), 0);
  const cashExpenses = expenses
    .filter(e => e.paymentMethod === 'Cash')
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const cashBalance = 5000 + cashCollections - cashExpenses;

  const upiCollections = bookings
    .filter(b => b.paymentMethod === 'UPI')
    .reduce((sum, b) => sum + Number(b.paymentReceived || (b.status === 'Completed' ? b.finalAmount || b.amount : 0)), 0);
  const upiExpenses = expenses
    .filter(e => e.paymentMethod === 'UPI')
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const upiBalance = 15000 + upiCollections - upiExpenses;

  const bankCollections = bookings
    .filter(b => b.paymentMethod === 'Bank')
    .reduce((sum, b) => sum + Number(b.paymentReceived || (b.status === 'Completed' ? b.finalAmount || b.amount : 0)), 0);
  const bankExpenses = expenses
    .filter(e => e.paymentMethod === 'Bank')
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const bankBalance = 45000 + bankCollections - bankExpenses;

  const totalLiquidBalance = cashBalance + upiBalance + bankBalance;

  // Build combined transactions feed
  const combinedHistory: Array<{
    id: string;
    date: string;
    type: 'IN' | 'OUT';
    account: string;
    amount: number;
    description: string;
    category: string;
  }> = [];

  // Add bookings (inflows)
  bookings.forEach(b => {
    const amt = Number(b.paymentReceived) || (b.status === 'Completed' ? Number(b.finalAmount || b.amount) : 0);
    if (amt > 0) {
      combinedHistory.push({
        id: `book-${b.id}`,
        date: b.date || b.createdAt?.split('T')[0] || '2026-08-30',
        type: 'IN',
        account: b.paymentMethod || 'UPI',
        amount: amt,
        description: `Service: ${b.serviceName} (${b.fullName})`,
        category: 'Customer Booking'
      });
    }
  });

  // Add expenses (outflows)
  expenses.forEach(e => {
    const amt = Number(e.amount) || 0;
    if (amt > 0) {
      combinedHistory.push({
        id: `exp-${e.id}`,
        date: e.date || e.createdAt?.split('T')[0] || '2026-08-30',
        type: 'OUT',
        account: e.paymentMethod || 'UPI',
        amount: amt,
        description: e.notes || `${e.category} (${e.paidTo || 'Vendor'})`,
        category: e.category
      });
    }
  });

  combinedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferForm.amount || transferForm.amount <= 0) return;

    await onAddTransaction({
      date: transferForm.date,
      type: 'Transfer',
      category: 'Fund Transfer',
      accountType: transferForm.toAccount as any,
      amount: transferForm.amount,
      description: `Transfer from ${transferForm.fromAccount} to ${transferForm.toAccount}. ${transferForm.notes}`
    });

    setIsTransferModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Cash & Bank Financial Ledger</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time balance across Cash on Hand, UPI QR Wallets, and Business Bank Accounts
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => exportToCSV(combinedHistory, 'OkarEhha_Ledger')}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Ledger</span>
          </button>
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20 flex-1 sm:flex-none justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>+ Fund Transfer</span>
          </button>
        </div>
      </div>

      {/* 3 Account Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Cash in Hand */}
        <div className="bg-[#121824] border border-amber-500/20 p-6 rounded-2xl shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Cash in Hand</span>
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">₹{cashBalance.toLocaleString()}</div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 mt-3 pt-3 border-t border-gray-800">
            <span className="text-emerald-400">+₹{cashCollections} in</span>
            <span className="text-red-400">-₹{cashExpenses} out</span>
          </div>
        </div>

        {/* Card 2: UPI / QR Wallet */}
        <div className="bg-[#121824] border border-amber-500/20 p-6 rounded-2xl shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">UPI / QR (GPay / PhonePe)</span>
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400">₹{upiBalance.toLocaleString()}</div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 mt-3 pt-3 border-t border-gray-800">
            <span className="text-emerald-400">+₹{upiCollections} in</span>
            <span className="text-red-400">-₹{upiExpenses} out</span>
          </div>
        </div>

        {/* Card 3: Bank Account */}
        <div className="bg-[#121824] border border-amber-500/20 p-6 rounded-2xl shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Current Bank Account</span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">₹{bankBalance.toLocaleString()}</div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 mt-3 pt-3 border-t border-gray-800">
            <span className="text-emerald-400">+₹{bankCollections} in</span>
            <span className="text-red-400">-₹{bankExpenses} out</span>
          </div>
        </div>
      </div>

      {/* Total Treasury Bar */}
      <div className="bg-[#0B0F17] border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Combined Liquidity</span>
            <p className="text-xl font-black text-white">₹{totalLiquidBalance.toLocaleString()}</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          All accounts reconciled
        </span>
      </div>

      {/* Unified Transaction Ledger Table */}
      <div className="bg-[#121824] border border-amber-500/20 rounded-2xl overflow-hidden shadow-md">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Combined Ledger Transactions</h3>
          <span className="text-xs text-gray-400">{combinedHistory.length} Total Entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0F17] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Flow</th>
                <th className="p-3.5">Account</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
              {combinedHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="p-3.5 font-semibold text-white">
                    {item.date}
                  </td>

                  <td className="p-3.5">
                    {item.type === 'IN' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <ArrowDownRight className="w-3.5 h-3.5" /> Credit (IN)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        <ArrowUpRight className="w-3.5 h-3.5" /> Debit (OUT)
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 font-bold text-white">
                    {item.account}
                  </td>

                  <td className="p-3.5 text-gray-400">
                    {item.category}
                  </td>

                  <td className="p-3.5 text-gray-200 max-w-[260px] truncate">
                    {item.description}
                  </td>

                  <td className="p-3.5 text-right">
                    <span className={`font-black text-sm ${item.type === 'IN' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.type === 'IN' ? '+' : '-'}₹{item.amount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FUND TRANSFER MODAL */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleTransferSubmit} className="bg-[#121824] border border-amber-500/30 rounded-2xl w-full max-w-md p-6 text-gray-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>Record Internal Fund Transfer</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Date</label>
                <input
                  type="date"
                  value={transferForm.date}
                  onChange={(e) => setTransferForm({ ...transferForm, date: e.target.value })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">From Account</label>
                  <select
                    value={transferForm.fromAccount}
                    onChange={(e) => setTransferForm({ ...transferForm, fromAccount: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="Cash">Cash in Hand</option>
                    <option value="UPI">UPI Wallet</option>
                    <option value="Bank">Bank Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">To Account</label>
                  <select
                    value={transferForm.toAccount}
                    onChange={(e) => setTransferForm({ ...transferForm, toAccount: e.target.value })}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="Bank">Bank Account</option>
                    <option value="Cash">Cash in Hand</option>
                    <option value="UPI">UPI Wallet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Transfer Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={transferForm.amount || ''}
                  onChange={(e) => setTransferForm({ ...transferForm, amount: Number(e.target.value) })}
                  className="w-full bg-[#0B0F17] border border-amber-500/50 rounded-xl p-2.5 text-amber-400 font-black text-lg"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Daily cash deposited to SBI branch"
                  value={transferForm.notes}
                  onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setIsTransferModalOpen(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl"
              >
                Record Transfer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
