import React, { useState } from "react";
import {
  Users,
  Search,
  Phone,
  MessageSquare,
  Plus,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Car,
  Download,
  Eye,
  MapPin,
  TrendingUp
} from "lucide-react";
import { Customer, Booking } from "../../types/admin";
import { exportToCSV } from "../../services/adminService";

interface CustomersTabProps {
  bookings: Booking[];
  customers: Customer[];
  onOpenNewBookingWithCustomer?: (customer: { name: string; mobile: string; address: string }) => void;
}

export default function CustomersTab({
  bookings,
  customers: propCustomers,
  onOpenNewBookingWithCustomer
}: CustomersTabProps) {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // Automatically derive & aggregate rich customer records from all bookings
  const customerMap: Record<string, any> = {};

  bookings.forEach((b) => {
    const phone = (b.mobile || "Unknown").replace(/\D/g, "");
    if (!phone) return;

    if (!customerMap[phone]) {
      customerMap[phone] = {
        id: phone,
        name: b.fullName || "Valued Customer",
        mobile: b.mobile,
        email: b.email || "",
        address: b.address || "Korba, CG",
        totalBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalSpent: 0,
        pendingAmount: 0,
        lastService: b.date || b.createdAt?.split("T")[0],
        customerSince: b.date || b.createdAt?.split("T")[0] || "2026-01-01",
        history: [] as Booking[]
      };
    }

    const c = customerMap[phone];
    c.totalBookings += 1;
    c.history.push(b);

    if (b.status === "Completed") {
      c.completedBookings += 1;
      c.totalSpent += Number(b.finalAmount || b.amount || 0);
    } else if (b.status === "Cancelled") {
      c.cancelledBookings += 1;
    }

    const finalAmt = Number(b.finalAmount || b.amount || 0);
    const received = Number(b.paymentReceived || 0);
    if (b.status !== "Cancelled" && finalAmt > received) {
      c.pendingAmount += (finalAmt - received);
    }

    if (b.date && b.date > (c.lastService || "")) {
      c.lastService = b.date;
    }
  });

  const allCustomers = Object.values(customerMap);

  const filteredCustomers = allCustomers.filter((c) => {
    return (
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile?.includes(search) ||
      c.address?.toLowerCase().includes(search.toLowerCase())
    );
  });

  // KPI calculations
  const totalClients = allCustomers.length;
  const totalLTVRevenue = allCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalClients > 0 ? Math.round(totalLTVRevenue / (allCustomers.reduce((sum, c) => sum + c.completedBookings, 0) || 1)) : 0;
  const repeatClients = allCustomers.filter(c => c.totalBookings > 1).length;
  const repeatRate = totalClients > 0 ? Math.round((repeatClients / totalClients) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Customer Relationship Management (CRM)</span>
            <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {totalClients} Clients
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Lifetime value (LTV), booking frequency, customer history and direct outreach
          </p>
        </div>

        <button
          onClick={() => exportToCSV(allCustomers.map(c => ({
            Name: c.name,
            Mobile: c.mobile,
            Address: c.address,
            TotalBookings: c.totalBookings,
            Completed: c.completedBookings,
            TotalSpent: c.totalSpent,
            Pending: c.pendingAmount,
            LastService: c.lastService
          })), 'OkarEhha_Customers')}
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export Client List</span>
        </button>
      </div>

      {/* CRM Highlight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Total Client Base</span>
          <div className="text-2xl font-black text-white">{totalClients}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Korba Residents</span>
        </div>

        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Total Lifetime Spent</span>
          <div className="text-2xl font-black text-amber-400">₹{totalLTVRevenue.toLocaleString()}</div>
          <span className="text-[10px] text-gray-400 font-semibold">From completed services</span>
        </div>

        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Average Order Value</span>
          <div className="text-2xl font-black text-white">₹{avgOrderValue}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Per Doorstep Service</span>
        </div>

        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Repeat Client Rate</span>
          <div className="text-2xl font-black text-white">{repeatRate}%</div>
          <span className="text-[10px] text-amber-400 font-semibold">{repeatClients} clients booked 2+ times</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-2xl shadow-md flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search client by name, mobile number, or locality in Korba..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B0F17] border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#121824] border border-amber-500/20 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0F17] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-3.5">Customer Name & Contact</th>
                <th className="p-3.5">Address</th>
                <th className="p-3.5">Bookings Stats</th>
                <th className="p-3.5">Lifetime Spent (LTV)</th>
                <th className="p-3.5">Pending Due</th>
                <th className="p-3.5">Last Service</th>
                <th className="p-3.5 text-right">Outreach & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    No customers found in database.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-800/40 transition-colors">
                    {/* Customer */}
                    <td className="p-3.5">
                      <p className="font-bold text-white text-sm">{c.name}</p>
                      <span className="text-[11px] text-gray-400 font-mono">{c.mobile}</span>
                    </td>

                    {/* Address */}
                    <td className="p-3.5">
                      <p className="text-[11px] text-gray-300 max-w-[200px] truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        <span>{c.address}</span>
                      </p>
                    </td>

                    {/* Bookings */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{c.totalBookings} Total</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {c.completedBookings} Done
                        </span>
                        {c.cancelledBookings > 0 && (
                          <span className="text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                            {c.cancelledBookings} Cancel
                          </span>
                        )}
                      </div>
                    </td>

                    {/* LTV */}
                    <td className="p-3.5">
                      <span className="font-black text-amber-400 text-sm">₹{c.totalSpent.toLocaleString()}</span>
                    </td>

                    {/* Pending */}
                    <td className="p-3.5">
                      {c.pendingAmount > 0 ? (
                        <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                          ₹{c.pendingAmount.toLocaleString()} Due
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-400">All Clear ✅</span>
                      )}
                    </td>

                    {/* Last Service */}
                    <td className="p-3.5 text-gray-400 text-[11px]">
                      {c.lastService || "Recent"}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      {/* Call */}
                      <a
                        href={`tel:${c.mobile}`}
                        title="Call Customer"
                        className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg inline-block transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>

                      {/* WhatsApp */}
                      <a
                        href={`https://wa.me/91${c.mobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(c.name)},%20Greetings%20from%20Okar%20Ehha%20Doorstep%20Cleaning%20Korba!%20How%20can%20we%20help%20you%20today?`}
                        target="_blank"
                        rel="noreferrer"
                        title="WhatsApp Message"
                        className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg inline-block transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>

                      {/* View Profile */}
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold rounded-lg border border-amber-500/30 transition-colors"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER PROFILE & HISTORY MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-amber-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 text-gray-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div>
                <span className="text-xs font-mono text-amber-400">Client Profile & Lifetime History</span>
                <h3 className="text-2xl font-black text-white">{selectedCustomer.name}</h3>
                <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                  <span>📱 {selectedCustomer.mobile}</span> • <span>📍 {selectedCustomer.address}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0B0F17] p-3 rounded-xl border border-gray-800 text-center">
                <span className="text-[10px] font-bold uppercase text-gray-500 block">Total Bookings</span>
                <span className="text-lg font-black text-white">{selectedCustomer.totalBookings}</span>
              </div>
              <div className="bg-[#0B0F17] p-3 rounded-xl border border-gray-800 text-center">
                <span className="text-[10px] font-bold uppercase text-gray-500 block">Total Spent (LTV)</span>
                <span className="text-lg font-black text-amber-400">₹{selectedCustomer.totalSpent}</span>
              </div>
              <div className="bg-[#0B0F17] p-3 rounded-xl border border-gray-800 text-center">
                <span className="text-[10px] font-bold uppercase text-gray-500 block">Pending Due</span>
                <span className="text-lg font-black text-red-400">₹{selectedCustomer.pendingAmount}</span>
              </div>
            </div>

            {/* Full Booking History */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Complete Booking History
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedCustomer.history.map((b: Booking) => (
                  <div
                    key={b.id}
                    className="p-3 bg-[#0B0F17] border border-gray-800/80 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{b.serviceName}</span>
                        <span className="text-[10px] text-amber-400 font-semibold">{b.vehicleType}</span>
                      </div>
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        📅 {b.date} at {b.time} • Assigned: {b.assignedStaff || 'Unassigned'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-amber-400 block">₹{b.finalAmount || b.amount}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 inline-block mt-0.5">
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <div className="flex gap-2">
                <a
                  href={`tel:${selectedCustomer.mobile}`}
                  className="px-3.5 py-2 bg-blue-500/20 text-blue-400 font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-blue-500/30"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Client</span>
                </a>
                <a
                  href={`https://wa.me/91${selectedCustomer.mobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(selectedCustomer.name)},%20Greetings%20from%20Okar%20Ehha!`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-emerald-500/30"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
