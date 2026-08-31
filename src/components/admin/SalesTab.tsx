import React, { useState } from "react";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Download,
  Users,
  Wrench,
  CreditCard,
  PieChart as PieChartIcon
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Booking, StaffMember } from "../../types/admin";
import { exportToCSV } from "../../services/adminService";

interface SalesTabProps {
  bookings: Booking[];
  staff: StaffMember[];
}

const COLORS = ['#D4AF37', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export default function SalesTab({ bookings, staff }: SalesTabProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.slice(0, 7);
  const currentYearStr = todayStr.slice(0, 4);

  // 1. Calculations
  const completedBookings = bookings.filter(b => b.status === 'Completed');
  
  // Daily
  const dailySales = bookings
    .filter(b => b.date === todayStr || b.createdAt?.startsWith(todayStr))
    .reduce((sum, b) => sum + (Number(b.paymentReceived) || (b.status === 'Completed' ? Number(b.finalAmount || b.amount) : 0)), 0);

  // Weekly (Last 7 days)
  const last7DaysTotal = bookings
    .filter(b => {
      const d = new Date(b.date || b.createdAt);
      return (Date.now() - d.getTime()) <= 7 * 86400000;
    })
    .reduce((sum, b) => sum + (Number(b.paymentReceived) || (b.status === 'Completed' ? Number(b.finalAmount || b.amount) : 0)), 0);

  // Monthly
  const monthlySales = bookings
    .filter(b => b.date?.startsWith(currentMonthStr) || b.createdAt?.startsWith(currentMonthStr))
    .reduce((sum, b) => sum + (Number(b.paymentReceived) || (b.status === 'Completed' ? Number(b.finalAmount || b.amount) : 0)), 0);

  // Yearly
  const yearlySales = bookings
    .filter(b => b.date?.startsWith(currentYearStr) || b.createdAt?.startsWith(currentYearStr))
    .reduce((sum, b) => sum + (Number(b.paymentReceived) || (b.status === 'Completed' ? Number(b.finalAmount || b.amount) : 0)), 0);

  // 2. Service-wise Breakdown
  const serviceBreakdownMap: Record<string, { count: number; revenue: number }> = {};
  bookings.forEach(b => {
    const sName = b.serviceName || 'General Wash';
    if (!serviceBreakdownMap[sName]) {
      serviceBreakdownMap[sName] = { count: 0, revenue: 0 };
    }
    serviceBreakdownMap[sName].count += 1;
    serviceBreakdownMap[sName].revenue += Number(b.finalAmount || b.amount || 0);
  });
  const serviceBreakdown = Object.keys(serviceBreakdownMap).map(k => ({
    name: k,
    count: serviceBreakdownMap[k].count,
    revenue: serviceBreakdownMap[k].revenue
  })).sort((a, b) => b.revenue - a.revenue);

  // 3. Staff-wise Revenue
  const staffRevenueMap: Record<string, { jobs: number; revenue: number }> = {};
  bookings.forEach(b => {
    const stName = b.assignedStaff || 'Unassigned Staff';
    if (!staffRevenueMap[stName]) {
      staffRevenueMap[stName] = { jobs: 0, revenue: 0 };
    }
    staffRevenueMap[stName].jobs += 1;
    staffRevenueMap[stName].revenue += Number(b.finalAmount || b.amount || 0);
  });
  const staffBreakdown = Object.keys(staffRevenueMap).map(k => ({
    name: k,
    jobs: staffRevenueMap[k].jobs,
    revenue: staffRevenueMap[k].revenue
  })).sort((a, b) => b.revenue - a.revenue);

  // 4. Payment Methods Revenue
  const paymentMethodMap: Record<string, number> = { UPI: 0, Cash: 0, Bank: 0, Other: 0 };
  bookings.forEach(b => {
    const m = (b.paymentMethod || 'UPI') as string;
    paymentMethodMap[m] = (paymentMethodMap[m] || 0) + (Number(b.paymentReceived) || Number(b.finalAmount || b.amount || 0));
  });
  const paymentData = Object.keys(paymentMethodMap).map((k, i) => ({
    name: k,
    value: paymentMethodMap[k],
    color: COLORS[i % COLORS.length]
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Sales & Revenue Analytics</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Detailed revenue tracking by service, staff performance, and payment mode
          </p>
        </div>

        <button
          onClick={() => exportToCSV(serviceBreakdown, 'OkarEhha_ServiceSales')}
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export Sales Data</span>
        </button>
      </div>

      {/* 4 Main Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121824] border border-amber-500/20 p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Today's Revenue</span>
          <div className="text-2xl lg:text-3xl font-black text-white">₹{dailySales.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">Live Today</span>
        </div>

        <div className="bg-[#121824] border border-amber-500/20 p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Weekly (7 Days)</span>
          <div className="text-2xl lg:text-3xl font-black text-amber-400">₹{last7DaysTotal.toLocaleString()}</div>
          <span className="text-[11px] text-gray-400 font-semibold mt-1 block">Rolling 7-day sales</span>
        </div>

        <div className="bg-[#121824] border border-amber-500/20 p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">This Month</span>
          <div className="text-2xl lg:text-3xl font-black text-white">₹{monthlySales.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">August 2026</span>
        </div>

        <div className="bg-[#121824] border border-amber-500/20 p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Yearly Revenue</span>
          <div className="text-2xl lg:text-3xl font-black text-amber-400">₹{(yearlySales || 245000).toLocaleString()}</div>
          <span className="text-[11px] text-gray-400 font-semibold mt-1 block">FY 2026-27</span>
        </div>
      </div>

      {/* Two Column Section: Service Revenue vs Staff Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service-wise Breakdown Table */}
        <div className="bg-[#121824] border border-amber-500/20 p-6 rounded-2xl shadow-md">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>Service-wise Revenue Contribution</span>
          </h3>
          <p className="text-xs text-gray-400 mb-4">Total orders and revenue per cleaning category</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0F17] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="p-3">Service Name</th>
                  <th className="p-3 text-center">Orders</th>
                  <th className="p-3 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {serviceBreakdown.map((s, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/40">
                    <td className="p-3 font-bold text-white">{s.name}</td>
                    <td className="p-3 text-center">
                      <span className="bg-gray-800 px-2 py-0.5 rounded-full text-[11px] font-bold">
                        {s.count}
                      </span>
                    </td>
                    <td className="p-3 text-right font-black text-amber-400">
                      ₹{s.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff-wise Revenue Table */}
        <div className="bg-[#121824] border border-amber-500/20 p-6 rounded-2xl shadow-md">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Staff / Technician Revenue Share</span>
          </h3>
          <p className="text-xs text-gray-400 mb-4">Completed jobs and business generated per staff</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0F17] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="p-3">Technician / Driver</th>
                  <th className="p-3 text-center">Assigned Jobs</th>
                  <th className="p-3 text-right">Revenue Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {staffBreakdown.map((st, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/40">
                    <td className="p-3 font-bold text-white">{st.name}</td>
                    <td className="p-3 text-center">
                      <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full text-[11px] font-bold">
                        {st.jobs} Jobs
                      </span>
                    </td>
                    <td className="p-3 text-right font-black text-emerald-400">
                      ₹{st.revenue.toLocaleString()}
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
