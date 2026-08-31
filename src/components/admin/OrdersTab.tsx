import React, { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  Phone,
  MessageSquare,
  UserCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Edit3,
  Trash2,
  Download,
  Plus,
  ArrowUpDown,
  Car,
  MapPin,
  FileText,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { Booking, BookingStatus, PaymentStatus, StaffMember, ServiceItem } from "../../types/admin";
import { whatsAppTemplates, exportToCSV } from "../../services/adminService";
import InvoiceModal from "../common/InvoiceModal";

interface OrdersTabProps {
  bookings: Booking[];
  staff: StaffMember[];
  services: ServiceItem[];
  onUpdateBooking: (booking: Booking) => Promise<void>;
  onDeleteBooking: (bookingId: string) => Promise<void>;
  onCreateBooking: (bookingData: Partial<Booking>) => Promise<void>;
  selectedBookingForModal?: Booking | null;
  onClearSelectedBookingModal: () => void;
}

const STATUS_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  New: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  Received: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  Confirmed: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  Assigned: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'On The Way': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  'In Progress': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  Completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  Cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' }
};

export default function OrdersTab({
  bookings,
  staff,
  services,
  onUpdateBooking,
  onDeleteBooking,
  onCreateBooking,
  selectedBookingForModal,
  onClearSelectedBookingModal
}: OrdersTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [serviceFilter, setServiceFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
  const [staffFilter, setStaffFilter] = useState<string>("ALL");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(selectedBookingForModal || null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [paymentAmountInput, setPaymentAmountInput] = useState<number>(0);
  const [paymentMethodInput, setPaymentMethodInput] = useState<string>("UPI");

  // New Booking Form State
  const [newBookingForm, setNewBookingForm] = useState({
    fullName: "",
    mobile: "",
    serviceName: services[0]?.name || "Doorstep Car Wash",
    vehicleType: "Hatchback / Sedan",
    vehicleNumber: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM",
    address: "",
    location: "Korba",
    amount: 499,
    assignedStaff: staff[0]?.name || "Ramesh Patel",
    notes: ""
  });

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      b.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      b.mobile?.includes(search) ||
      b.id?.toLowerCase().includes(search.toLowerCase()) ||
      b.address?.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
    const matchService = serviceFilter === "ALL" || b.serviceName === serviceFilter;
    const matchPayment = paymentFilter === "ALL" || b.paymentStatus === paymentFilter;
    const matchStaff = staffFilter === "ALL" || b.assignedStaff === staffFilter;

    return matchSearch && matchStatus && matchService && matchPayment && matchStaff;
  });

  // Handle Quick Status Change
  const handleStatusChange = async (booking: Booking, newStatus: BookingStatus) => {
    const updated = { ...booking, status: newStatus };
    await onUpdateBooking(updated);
    if (selectedBooking?.id === booking.id) {
      setSelectedBooking(updated);
    }
  };

  // Handle Record Payment
  const handleRecordPayment = async () => {
    if (!selectedBooking) return;
    const currentReceived = Number(selectedBooking.paymentReceived || 0);
    const addedAmount = Number(paymentAmountInput) || 0;
    const newTotalReceived = currentReceived + addedAmount;
    const finalAmt = Number(selectedBooking.finalAmount || selectedBooking.amount || 0);
    const newPending = Math.max(0, finalAmt - newTotalReceived);
    const newPaymentStatus: PaymentStatus = newPending === 0 ? "Paid" : newTotalReceived > 0 ? "Partially Paid" : "Pending";

    const updated: Booking = {
      ...selectedBooking,
      paymentReceived: newTotalReceived,
      pendingAmount: newPending,
      paymentStatus: newPaymentStatus,
      paymentMethod: paymentMethodInput
    };

    await onUpdateBooking(updated);
    setSelectedBooking(updated);
    setPaymentModalOpen(false);
  };

  // Handle Create New Booking Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateBooking({
      ...newBookingForm,
      finalAmount: newBookingForm.amount,
      paymentReceived: 0,
      pendingAmount: newBookingForm.amount,
      paymentStatus: 'Pending',
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    });
    setIsNewBookingModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Orders & Bookings Management</span>
            <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {filteredBookings.length} Total
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time status updates, staff allocation, payments & WhatsApp notifications
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => exportToCSV(bookings, 'OkarEhha_Bookings')}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all flex-1 md:flex-none justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Booking</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-2xl shadow-md space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search customer, phone, ID, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0B0F17] border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#0B0F17] border border-gray-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="New">New / Received</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Assigned">Assigned</option>
              <option value="On The Way">On The Way</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Service Filter */}
          <div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full bg-[#0B0F17] border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300 font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Services</option>
              {services.map((s) => (
                <option key={s.id || s.slug} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Payment Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full bg-[#0B0F17] border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300 font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#121824] border border-amber-500/20 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0F17] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-3.5">Booking ID & Customer</th>
                <th className="p-3.5">Service & Vehicle</th>
                <th className="p-3.5">Schedule</th>
                <th className="p-3.5">Staff</th>
                <th className="p-3.5">Amount & Payment</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    No bookings found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const badge = STATUS_BADGES[b.status] || STATUS_BADGES.Received;
                  const finalAmt = Number(b.finalAmount || b.amount || 0);
                  const received = Number(b.paymentReceived || 0);
                  const pending = Math.max(0, finalAmt - received);

                  return (
                    <tr key={b.id} className="hover:bg-gray-800/40 transition-colors">
                      {/* Customer Info */}
                      <td className="p-3.5">
                        <span className="text-[10px] font-mono text-gray-500 block">#{b.id?.slice(0, 8)}</span>
                        <p className="font-bold text-white text-sm">{b.fullName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={`tel:${b.mobile}`}
                            className="text-gray-400 hover:text-white flex items-center gap-1 text-[11px]"
                          >
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span>{b.mobile}</span>
                          </a>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-500 flex-shrink-0" />
                          <span>{b.address?.slice(0, 30)}...</span>
                        </p>
                      </td>

                      {/* Service & Vehicle */}
                      <td className="p-3.5">
                        <span className="font-bold text-gray-200 block">{b.serviceName}</span>
                        {b.packageName && (
                          <span className="text-[10px] text-gray-400 block">{b.packageName}</span>
                        )}
                        {b.vehicleType && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-semibold mt-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                            <Car className="w-3 h-3" />
                            {b.vehicleType} {b.vehicleNumber ? `(${b.vehicleNumber})` : ''}
                          </span>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>{b.date}</span>
                        </div>
                        <span className="text-[11px] text-gray-400 block mt-0.5">{b.time}</span>
                      </td>

                      {/* Assigned Staff */}
                      <td className="p-3.5">
                        {b.assignedStaff ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-blue-300 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20 text-[11px]">
                            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                            {b.assignedStaff}
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-500 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Amount & Payment */}
                      <td className="p-3.5">
                        <span className="font-black text-amber-400 text-sm">₹{finalAmt}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              b.paymentStatus === 'Paid'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : b.paymentStatus === 'Partially Paid'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {b.paymentStatus || 'Pending'}
                          </span>
                          {pending > 0 && (
                            <span className="text-[10px] text-red-300">Due: ₹{pending}</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <select
                          value={b.status || 'Received'}
                          onChange={(e) => handleStatusChange(b, e.target.value as BookingStatus)}
                          className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          <option value="New">New</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Assigned">Assigned</option>
                          <option value="On The Way">On The Way</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                        {/* WhatsApp Quick Action */}
                        <a
                          href={`https://wa.me/91${b.mobile.replace(/\D/g, '')}?text=${whatsAppTemplates.bookingConfirmation(b)}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Send WhatsApp Confirmation"
                          className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg inline-block transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>

                        {/* View & Edit Details */}
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold rounded-lg border border-amber-500/30 transition-colors"
                        >
                          Manage
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

      {/* DETAILED BOOKING MANAGE MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-amber-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 text-gray-200 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div>
                <span className="text-xs font-mono text-amber-400">Booking #{selectedBooking.id?.slice(0, 10)}</span>
                <h3 className="text-xl font-black text-white">{selectedBooking.fullName}</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  onClearSelectedBookingModal();
                }}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Quick WhatsApp Templates Dropdown / Buttons */}
            <div className="bg-[#0B0F17] p-4 rounded-xl border border-gray-800 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Messages:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold">
                <a
                  href={`https://wa.me/91${selectedBooking.mobile.replace(/\D/g, '')}?text=${whatsAppTemplates.bookingConfirmation(selectedBooking)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-center transition-colors"
                >
                  ✅ Confirm Booking
                </a>
                <a
                  href={`https://wa.me/91${selectedBooking.mobile.replace(/\D/g, '')}?text=${whatsAppTemplates.bookingReminder(selectedBooking)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-center transition-colors"
                >
                  🔔 Send Reminder
                </a>
                <a
                  href={`https://wa.me/91${selectedBooking.mobile.replace(/\D/g, '')}?text=${whatsAppTemplates.paymentReminder(selectedBooking)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-center transition-colors"
                >
                  💳 Payment Link
                </a>
                <a
                  href={`https://wa.me/91${selectedBooking.mobile.replace(/\D/g, '')}?text=${whatsAppTemplates.serviceCompleted(selectedBooking)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-center transition-colors"
                >
                  ✨ Completed Note
                </a>
                <a
                  href={`https://wa.me/91${selectedBooking.mobile.replace(/\D/g, '')}?text=${whatsAppTemplates.thankYou(selectedBooking)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-center transition-colors"
                >
                  🙏 Thank You
                </a>
                <a
                  href={`https://wa.me/91${selectedBooking.mobile.replace(/\D/g, '')}?text=${whatsAppTemplates.reviewRequest(selectedBooking)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded-lg text-center transition-colors"
                >
                  ⭐ Request Review
                </a>
              </div>
            </div>

            {/* Editable Details Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Status</label>
                <select
                  value={selectedBooking.status}
                  onChange={(e) => setSelectedBooking({ ...selectedBooking, status: e.target.value as BookingStatus })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="New">New</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Assigned">Assigned</option>
                  <option value="On The Way">On The Way</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Assign Staff Technician</label>
                <select
                  value={selectedBooking.assignedStaff || ""}
                  onChange={(e) => setSelectedBooking({ ...selectedBooking, assignedStaff: e.target.value })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="">-- Select Staff --</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Final Amount (₹)</label>
                <input
                  type="number"
                  value={selectedBooking.finalAmount || selectedBooking.amount}
                  onChange={(e) => setSelectedBooking({ ...selectedBooking, finalAmount: Number(e.target.value) })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-amber-400 font-black text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Payment Received (₹)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    disabled
                    value={selectedBooking.paymentReceived || 0}
                    className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-emerald-400 font-black text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentAmountInput(Math.max(0, (selectedBooking.finalAmount || selectedBooking.amount || 0) - (selectedBooking.paymentReceived || 0)));
                      setPaymentModalOpen(true);
                    }}
                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded-xl whitespace-nowrap"
                  >
                    + Record
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-400 font-bold mb-1">Address & Landmark</label>
                <input
                  type="text"
                  value={selectedBooking.address || ""}
                  onChange={(e) => setSelectedBooking({ ...selectedBooking, address: e.target.value })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-400 font-bold mb-1">Admin Notes & Instructions</label>
                <textarea
                  rows={2}
                  value={selectedBooking.notes || ""}
                  onChange={(e) => setSelectedBooking({ ...selectedBooking, notes: e.target.value })}
                  placeholder="e.g. Customer requested extra foam on roof, gate code 4411"
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white placeholder-gray-600"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={async () => {
                  if (confirm("Are you sure you want to delete this booking?")) {
                    await onDeleteBooking(selectedBooking.id);
                    setSelectedBooking(null);
                  }
                }}
                className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInvoiceModalOpen(true)}
                  className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Print Bill</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const techMsg = encodeURIComponent(
                      `🚨 *NEW JOB DISPATCH - OKAR EHHA*\n\nBooking: #${selectedBooking.id}\nCustomer: ${selectedBooking.fullName}\nPhone: ${selectedBooking.mobile}\nService: ${selectedBooking.serviceName}\nAddress: ${selectedBooking.address}\nSlot: ${selectedBooking.date} @ ${selectedBooking.time}\nAmount: ₹${selectedBooking.finalAmount || selectedBooking.amount}\n\n📍 Map Route: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBooking.address + ', Korba')}`
                    );
                    window.open(`https://wa.me/?text=${techMsg}`, '_blank');
                  }}
                  className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Dispatch WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl font-bold text-xs hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await onUpdateBooking(selectedBooking);
                    setSelectedBooking(null);
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs rounded-xl shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INVOICE PRINT MODAL */}
      {selectedBooking && (
        <InvoiceModal
          booking={selectedBooking}
          isOpen={invoiceModalOpen}
          onClose={() => setInvoiceModalOpen(false)}
        />
      )}

      {/* RECORD PAYMENT MODAL */}
      {paymentModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-emerald-500/30 rounded-2xl w-full max-w-md p-6 text-gray-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Record Payment Collection</span>
            </h3>
            <p className="text-xs text-gray-400">
              Recording payment for <strong>{selectedBooking.fullName}</strong> (#{selectedBooking.id?.slice(0, 8)})
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Amount Collecting (₹)</label>
              <input
                type="number"
                value={paymentAmountInput}
                onChange={(e) => setPaymentAmountInput(Number(e.target.value))}
                className="w-full bg-[#0B0F17] border border-emerald-500/50 rounded-xl p-3 text-emerald-400 font-black text-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Payment Method</label>
              <select
                value={paymentMethodInput}
                onChange={(e) => setPaymentMethodInput(e.target.value)}
                className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
              >
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="Cash">Cash on Hand</option>
                <option value="Bank">Bank Account Transfer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRecordPayment}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl"
              >
                Confirm & Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW BOOKING MODAL */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateSubmit} className="bg-[#121824] border border-amber-500/30 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 text-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Create New Doorstep Booking</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewBookingModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={newBookingForm.fullName}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, fullName: e.target.value })}
                  placeholder="e.g. Rahul Agrawal"
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={newBookingForm.mobile}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, mobile: e.target.value })}
                  placeholder="e.g. 98261XXXXX"
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Service *</label>
                <select
                  value={newBookingForm.serviceName}
                  onChange={(e) => {
                    const sel = services.find(s => s.name === e.target.value);
                    setNewBookingForm({
                      ...newBookingForm,
                      serviceName: e.target.value,
                      amount: sel?.price || 499
                    });
                  }}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-semibold"
                >
                  {services.map((s) => (
                    <option key={s.id || s.slug} value={s.name}>{s.name} (₹{s.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={newBookingForm.amount}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, amount: Number(e.target.value) })}
                  className="w-full bg-[#0B0F17] border border-amber-500/40 rounded-xl p-2.5 text-amber-400 font-black text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Vehicle Type / Model</label>
                <input
                  type="text"
                  value={newBookingForm.vehicleType}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, vehicleType: e.target.value })}
                  placeholder="e.g. Creta / Swift / Bike"
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Vehicle Number</label>
                <input
                  type="text"
                  value={newBookingForm.vehicleNumber}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, vehicleNumber: e.target.value })}
                  placeholder="e.g. CG12-AB-9876"
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Date</label>
                <input
                  type="date"
                  value={newBookingForm.date}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, date: e.target.value })}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Preferred Time</label>
                <input
                  type="text"
                  value={newBookingForm.time}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, time: e.target.value })}
                  placeholder="e.g. 11:30 AM"
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-400 font-bold mb-1">Doorstep Address in Korba *</label>
                <input
                  type="text"
                  required
                  value={newBookingForm.address}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, address: e.target.value })}
                  placeholder="e.g. House #14, Kosabadi, Near SBI Bank, Korba"
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setIsNewBookingModalOpen(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs rounded-xl shadow-md"
              >
                Create Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
