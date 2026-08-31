import React, { useState } from "react";
import {
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Download,
  Percent,
  CheckCircle,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { Booking, Expense } from "../../types/admin";
import { exportToCSV } from "../../services/adminService";

interface ProfitLossTabProps {
  bookings: Booking[];
  expenses: Expense[];
}

export default function ProfitLossTab({ bookings, expenses }: ProfitLossTabProps) {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('month');

  const todayStr = new Date().toISOString().split("T")[0];
  const currentMonthStr = todayStr.slice(0, 7);
  const currentYearStr = todayStr.slice(0, 4);

  // Filter Bookings & Expenses based on chosen period
  const filterByPeriod = (itemDate?: string) => {
    if (!itemDate) return true;
    if (period === 'today') return itemDate === todayStr || itemDate.startsWith(todayStr);
    if (period === 'week') {
      const d = new Date(itemDate);
      return (Date.now() - d.getTime()) <= 7 * 86400000;
    }
    if (period === 'month') return itemDate.startsWith(currentMonthStr);
    if (period === 'year') return itemDate.startsWith(currentYearStr);
    return true; // all
  };

  const periodBookings = bookings.filter(b => filterByPeriod(b.date || b.createdAt));
  const periodExpenses = expenses.filter(e => filterByPeriod(e.date || e.createdAt));

  // P&L Calculations
  const grossRevenue = periodBookings.reduce((sum, b) => sum + Number(b.amount || b.finalAmount || 0), 0);
  const discounts = periodBookings.reduce((sum, b) => {
    const orig = Number(b.amount || 0);
    const fin = Number(b.finalAmount || orig);
    return sum + (orig > fin ? orig - fin : 0);
  }, 0);
  const netRevenue = grossRevenue - discounts;

  // Categorized Expenses
  const expenseCategoryMap: Record<string, number> = {};
  let totalExpenses = 0;
  periodExpenses.forEach(e => {
    const amt = Number(e.amount) || 0;
    totalExpenses += amt;
    expenseCategoryMap[e.category] = (expenseCategoryMap[e.category] || 0) + amt;
  });

  const netProfit = netRevenue - totalExpenses;
  const profitMargin = netRevenue > 0 ? ((netProfit / netRevenue) * 100).toFixed(1) : "0";
  const isProfitable = netProfit >= 0;

  // Service Profitability estimate (Estimated material + fuel cost ~25% per service)
  const serviceMap: Record<string, { count: number; rev: number; estCost: number }> = {};
  periodBookings.forEach(b => {
    const sName = b.serviceName || 'Car Wash';
    if (!serviceMap[sName]) {
      serviceMap[sName] = { count: 0, rev: 0, estCost: 0 };
    }
    const rev = Number(b.finalAmount || b.amount || 0);
    serviceMap[sName].count += 1;
    serviceMap[sName].rev += rev;
    serviceMap[sName].estCost += Math.round(rev * 0.25); // ~25% average direct operating cost
  });

  const serviceProfitability = Object.keys(serviceMap).map(k => {
    const s = serviceMap[k];
    const profit = s.rev - s.estCost;
    const margin = s.rev > 0 ? Math.round((profit / s.rev) * 100) : 0;
    return {
      name: k,
      orders: s.count,
      revenue: s.rev,
      directCost: s.estCost,
      netProfit: profit,
      margin: margin
    };
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Period Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Profit & Loss Statement (P&L)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Accurate revenue, operating expenses, cost of goods, and net profit margins
          </p>
        </div>

        {/* Period Pills */}
        <div className="flex items-center bg-[#0B0F17] p-1 rounded-xl border border-gray-800 text-xs font-bold">
          {(['today', 'week', 'month', 'year', 'all'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                period === p
                  ? 'bg-amber-500 text-black font-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {p === 'all' ? 'All Time' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Gross Revenue</span>
          <div className="text-2xl font-black text-white">₹{grossRevenue.toLocaleString()}</div>
          <span className="text-[10px] text-gray-400 font-semibold">{periodBookings.length} Doorstep Jobs</span>
        </div>

        <div className="bg-[#121824] border border-red-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Total Operating Expenses</span>
          <div className="text-2xl font-black text-red-400">₹{totalExpenses.toLocaleString()}</div>
          <span className="text-[10px] text-red-300 font-semibold">{periodExpenses.length} Expense Entries</span>
        </div>

        <div className="bg-[#121824] border border-amber-500/30 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">Net Business Profit</span>
          <div className={`text-2xl font-black ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
            ₹{netProfit.toLocaleString()}
          </div>
          <span className="text-[10px] text-gray-300 font-semibold">Net Bottomline</span>
        </div>

        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Net Profit Margin</span>
          <div className="text-2xl font-black text-amber-400">{profitMargin}%</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Healthy Operating Margin</span>
        </div>
      </div>

      {/* P&L Statement Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formal Accounting Breakdown Table */}
        <div className="bg-[#121824] border border-amber-500/20 rounded-2xl p-6 shadow-md">
          <h3 className="text-base font-bold text-white mb-1">Income & Outflow Statement</h3>
          <p className="text-xs text-gray-400 mb-4">Standard business financial breakdown</p>

          <div className="space-y-3 text-xs divide-y divide-gray-800">
            {/* 1. Revenue */}
            <div className="pt-2">
              <div className="flex justify-between font-bold text-white text-sm">
                <span>1. Gross Revenue</span>
                <span>₹{grossRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400 mt-1 pl-3">
                <span>(-) Customer Discounts</span>
                <span>-₹{discounts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-extrabold text-amber-400 mt-1 pl-3">
                <span>= Net Revenue</span>
                <span>₹{netRevenue.toLocaleString()}</span>
              </div>
            </div>

            {/* 2. Expenses Itemized */}
            <div className="pt-3">
              <div className="flex justify-between font-bold text-red-400 text-sm mb-1.5">
                <span>2. Operating Expenses</span>
                <span>₹{totalExpenses.toLocaleString()}</span>
              </div>
              <div className="space-y-1 pl-3 text-gray-300">
                {Object.keys(expenseCategoryMap).length === 0 ? (
                  <p className="text-gray-500 text-[11px] italic">No expenses logged for this period.</p>
                ) : (
                  Object.keys(expenseCategoryMap).map((cat) => (
                    <div key={cat} className="flex justify-between text-[11px]">
                      <span className="text-gray-400">• {cat}</span>
                      <span className="font-semibold text-red-300">₹{expenseCategoryMap[cat].toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 3. Net Bottomline */}
            <div className="pt-4">
              <div className="flex justify-between items-center bg-[#0B0F17] p-3 rounded-xl border border-amber-500/30">
                <div>
                  <span className="font-black text-sm text-white block">NET PROFIT / (LOSS)</span>
                  <span className="text-[10px] text-gray-400">Net Revenue minus Total Expenses</span>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-black block ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                    ₹{netProfit.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">Margin: {profitMargin}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Profitability Breakdown */}
        <div className="bg-[#121824] border border-amber-500/20 rounded-2xl p-6 shadow-md">
          <h3 className="text-base font-bold text-white mb-1">Service Unit Profitability</h3>
          <p className="text-xs text-gray-400 mb-4">Estimated profitability per doorstep service type</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0F17] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="p-3">Service</th>
                  <th className="p-3 text-right">Revenue</th>
                  <th className="p-3 text-right">Direct Cost</th>
                  <th className="p-3 text-right">Est. Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {serviceProfitability.map((sp, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/40">
                    <td className="p-3">
                      <p className="font-bold text-white">{sp.name}</p>
                      <span className="text-[10px] text-gray-500">{sp.orders} orders</span>
                    </td>
                    <td className="p-3 text-right font-semibold text-gray-200">
                      ₹{sp.revenue.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-red-400 font-medium">
                      ₹{sp.directCost.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      <span className="font-bold text-emerald-400 block">₹{sp.netProfit.toLocaleString()}</span>
                      <span className="text-[10px] text-amber-400">{sp.margin}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
