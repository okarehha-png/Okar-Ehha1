import React, { useState } from "react";
import {
  Wallet,
  Search,
  Filter,
  DollarSign,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  CreditCard,
  Phone
} from "lucide-react";
import { Booking, PaymentStatus } from "../../types/admin";
import { whatsAppTemplates, exportToCSV } from "../../services/adminService";

interface PaymentsTabProps {
  bookings: Booking[];
  onUpdateBooking: (booking: Booking) => Promise<void>;
}

export default function PaymentsTab({ bookings, onUpdateBooking }: PaymentsTabProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [recordingBooking, setRecordingBooking] = useState<Booking | null>(null);
  const [collectAmount, setCollectAmount] = useState<number>(0);
  const [collectMethod, setCollectMethod] = useState<string>("UPI");

  // Summary Metrics
  const totalInvoiced = bookings.reduce((sum, b) => sum + (Number(b.finalAmount || b.amount || 0)), 0);
  const totalCollected = bookings.reduce((sum, b) => sum + (Number(b.paymentReceived || 0)), 0);
  const totalPending = Math.max(0, totalInvoiced - totalCollected);
  const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

  // Filter List
  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      b.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      b.mobile?.includes(search) ||
      b.id?.toLowerCase().includes(search.toLowerCase());

    const matchStatus = filterStatus === "ALL" || b.paymentStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleConfirmCollection = async () => {
    if (!recordingBooking) return;
    const currentRec = Number(recordingBooking.paymentReceived || 0);
    const addedAmt = Number(collectAmount) || 0;
    const newTotalRec = currentRec + addedAmt;
    const finalAmt = Number(recordingBooking.finalAmount || recordingBooking.amount || 0);
    const newPending = Math.max(0, finalAmt - newTotalRec);
    const newStatus: PaymentStatus = newPending === 0 ? "Paid" : newTotalRec > 0 ? "Partially Paid" : "Pending";

    const updated: Booking = {
      ...recordingBooking,
      paymentReceived: newTotalRec,
      pendingAmount: newPending,
      paymentStatus: newStatus,
      paymentMethod: collectMethod
    };

    await onUpdateBooking(updated);
    setRecordingBooking(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Payments & Pending Receivables</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Track customer invoices, collect partial/full dues, and send WhatsApp payment reminders
          </p>
        </div>

        <button
          onClick={() => exportToCSV(bookings.map(b => ({
            BookingID: b.id,
            Customer: b.fullName,
            Mobile: b.mobile,
            Service: b.serviceName,
            InvoiceAmount: b.finalAmount || b.amount,
            PaidAmount: b.paymentReceived || 0,
            PendingDue: Math.max(0, (b.finalAmount || b.amount || 0) - (b.paymentReceived || 0)),
            PaymentStatus: b.paymentStatus || 'Pending',
            PaymentMethod: b.paymentMethod || 'UPI'
          })), 'OkarEhha_Payments')}
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export Receivables</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Total Invoiced</span>
          <div className="text-2xl font-black text-white">₹{totalInvoiced.toLocaleString()}</div>
          <span className="text-[10px] text-gray-400 font-semibold">Total Order Value</span>
        </div>

        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Total Collected</span>
          <div className="text-2xl font-black text-emerald-400">₹{totalCollected.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-300 font-semibold">In Cash, UPI & Bank</span>
        </div>

        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Pending Balance</span>
          <div className="text-2xl font-black text-red-400">₹{totalPending.toLocaleString()}</div>
          <span className="text-[10px] text-red-300 font-semibold">Awaiting Customer Settlement</span>
        </div>

        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Collection Efficiency</span>
          <div className="text-2xl font-black text-amber-400">{collectionRate}%</div>
          <span className="text-[10px] text-amber-300 font-semibold">Payment Recovery Ratio</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-2xl shadow-md flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by customer name, phone or booking ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B0F17] border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-48 bg-[#0B0F17] border border-gray-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="Paid">Paid (Completed)</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Pending">Pending Due</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-[#121824] border border-amber-500/20 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0F17] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-3.5">Customer & Booking</th>
                <th className="p-3.5">Service</th>
                <th className="p-3.5">Invoice Amount</th>
                <th className="p-3.5">Paid Amount</th>
                <th className="p-3.5">Pending Due</th>
                <th className="p-3.5">Method & Status</th>
                <th className="p-3.5 text-right">Collect & Remind</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const finalAmt = Number(b.finalAmount || b.amount || 0);
                  const paid = Number(b.paymentReceived || 0);
                  const pending = Math.max(0, finalAmt - paid);

                  return (
                    <tr key={b.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="p-3.5">
                        <span className="text-[10px] font-mono text-gray-500 block">#{b.id?.slice(0, 8)}</span>
                        <p className="font-bold text-white text-sm">{b.fullName}</p>
                        <span className="text-[11px] text-gray-400">{b.mobile}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-gray-200">{b.serviceName}</span>
                        <span className="block text-[10px] text-gray-500">{b.date}</span>
                      </td>

                      <td className="p-3.5 font-bold text-white text-sm">
                        ₹{finalAmt}
                      </td>

                      <td className="p-3.5 font-black text-emerald-400 text-sm">
                        ₹{paid}
                      </td>

                      <td className="p-3.5">
                        {pending > 0 ? (
                          <span className="font-black text-red-400 text-sm">
                            ₹{pending}
                          </span>
                        ) : (
                          <span className="text-emerald-400 text-[11px] font-bold">₹0 (Cleared)</span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                            b.paymentStatus === 'Paid'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : b.paymentStatus === 'Partially Paid'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {b.paymentStatus || 'Pending'}
                        </span>
                        <span className="block text-[10px] text-gray-400 mt-0.5">{b.paymentMethod || 'UPI'}</span>
                      </td>

                      <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                        {/* WhatsApp Payment Reminder */}
                        {pending > 0 && (
                          <a
                            href={`https://wa.me/91${b.mobile.replace(/\D/g, '')}?text=${whatsAppTemplates.paymentReminder(b)}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Send WhatsApp Payment Link / Reminder"
                            className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg inline-block transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {/* Record Collection */}
                        <button
                          onClick={() => {
                            setRecordingBooking(b);
                            setCollectAmount(pending > 0 ? pending : finalAmt);
                          }}
                          className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold rounded-lg border border-emerald-500/30 transition-colors"
                        >
                          + Record
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      {recordingBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-emerald-500/30 rounded-2xl w-full max-w-md p-6 text-gray-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Collect Payment</span>
            </h3>
            <p className="text-xs text-gray-400">
              Customer: <strong>{recordingBooking.fullName}</strong> • Total Due: ₹{Math.max(0, (recordingBooking.finalAmount || recordingBooking.amount || 0) - (recordingBooking.paymentReceived || 0))}
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Amount to Add (₹)</label>
              <input
                type="number"
                value={collectAmount}
                onChange={(e) => setCollectAmount(Number(e.target.value))}
                className="w-full bg-[#0B0F17] border border-emerald-500/50 rounded-xl p-3 text-emerald-400 font-black text-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Payment Method</label>
              <select
                value={collectMethod}
                onChange={(e) => setCollectMethod(e.target.value)}
                className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm / BHIM)</option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank Account Transfer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setRecordingBooking(null)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCollection}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl"
              >
                Save Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
