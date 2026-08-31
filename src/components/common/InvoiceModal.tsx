import React from "react";
import { X, Printer, Download, CheckCircle2, ShieldCheck, Phone, MapPin, Calendar, Clock, Sparkles } from "lucide-react";
import { Booking } from "../../types/admin";

interface InvoiceModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceModal({ booking, isOpen, onClose }: InvoiceModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${booking.id.slice(-6).toUpperCase()}`;
  const invoiceDate = booking.date || new Date().toISOString().split('T')[0];
  const isPaid = booking.paymentStatus === 'Paid' || (booking.paymentReceived >= booking.finalAmount && booking.finalAmount > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white text-gray-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-200 overflow-hidden relative animate-fadeIn my-8">
        {/* Modal Top Actions (Hidden on print) */}
        <div className="p-4 bg-gray-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Customer Tax & Service Invoice</span>
            <span className="text-xs bg-amber-500 text-black font-extrabold px-2 py-0.5 rounded">
              {invoiceNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-white hover:bg-gray-100 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div className="p-6 sm:p-8 space-y-6 print:p-8" id="printable-invoice">
          {/* Header Brand */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-black text-amber-400 flex items-center justify-center font-black text-lg">
                  OE
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-gray-900">OKAR EHHA</h2>
                  <p className="text-xs font-bold text-amber-600 tracking-wide uppercase">Doorstep Cleaning & Detailing Services</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 max-w-xs leading-relaxed">
                Transport Nagar / Kosabadi Hub, Korba, Chhattisgarh - 495677
                <br />
                Support Helpline: <span className="font-bold text-gray-800">+91 98261 00000</span>
                <br />
                Email: support@okarehha.in | Web: okarehha.in
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="inline-block bg-gray-100 text-gray-800 text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider">
                Service Bill / Invoice
              </div>
              <p className="text-xs text-gray-500">Invoice No: <span className="font-bold text-gray-900">{invoiceNumber}</span></p>
              <p className="text-xs text-gray-500">Service Date: <span className="font-bold text-gray-900">{invoiceDate}</span></p>
              <p className="text-xs text-gray-500">Time Slot: <span className="font-bold text-gray-900">{booking.time || '10:00 AM'}</span></p>
              <div className="mt-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  isPaid ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {isPaid ? '✓ Paid in Full' : '⚠️ Payment Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Location Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200/80 text-xs">
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1">Billed To (Customer)</p>
              <p className="font-bold text-gray-900 text-sm">{booking.fullName}</p>
              <p className="text-gray-600 font-medium mt-0.5">📞 {booking.mobile}</p>
              {booking.email && <p className="text-gray-500">✉️ {booking.email}</p>}
              {booking.vehicleNumber && (
                <p className="text-gray-700 font-semibold mt-1">
                  🚗 Vehicle: <span className="text-black bg-gray-200 px-1.5 py-0.5 rounded font-mono font-bold">{booking.vehicleNumber}</span> {booking.vehicleType ? `(${booking.vehicleType})` : ''}
                </p>
              )}
            </div>

            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1">Doorstep Location & Assigned Team</p>
              <p className="text-gray-800 font-medium leading-snug">
                📍 {booking.address}
              </p>
              {booking.areaZone && (
                <p className="text-xs text-amber-700 font-bold mt-1">Zone: {booking.areaZone}, Korba</p>
              )}
              {booking.assignedStaff && (
                <p className="text-gray-600 font-semibold mt-1">
                  Technician: <span className="text-gray-900 font-bold">{booking.assignedStaff}</span>
                </p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Service Description</th>
                  <th className="py-3 px-4 text-center">Package / Tier</th>
                  <th className="py-3 px-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">
                    <div>{booking.serviceName}</div>
                    <div className="text-[11px] text-gray-500 font-normal">
                      Professional on-site mechanized cleaning with high-pressure washers & specialized foam chemicals.
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center text-gray-700 font-medium">
                    {booking.packageName || 'Standard Deep Clean'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-gray-900">
                    ₹{booking.amount || booking.finalAmount}
                  </td>
                </tr>
                {booking.discount && booking.discount > 0 ? (
                  <tr className="text-emerald-700 bg-emerald-50/50">
                    <td colSpan={2} className="py-2.5 px-4 font-medium">
                      Special Korba Promotional Discount / Coupon
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold">
                      - ₹{booking.discount}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Summary Calculation */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Satisfaction & Spotless Quality Guarantee</span>
              </div>
              <p>Payment Mode: <span className="font-semibold text-gray-800">{booking.paymentMethod || 'UPI / Cash'}</span></p>
            </div>

            <div className="w-full sm:w-64 bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-bold text-gray-900">₹{booking.amount || booking.finalAmount}</span>
              </div>
              {booking.discount && booking.discount > 0 ? (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span>- ₹{booking.discount}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-sm font-black text-gray-900 pt-1.5 border-t border-gray-200">
                <span>Total Amount:</span>
                <span className="text-amber-600">₹{booking.finalAmount || booking.amount}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700 font-bold">
                <span>Amount Received:</span>
                <span>₹{booking.paymentReceived || (isPaid ? (booking.finalAmount || booking.amount) : 0)}</span>
              </div>
              {booking.pendingAmount > 0 && !isPaid && (
                <div className="flex justify-between text-xs text-red-600 font-extrabold pt-1 border-t border-gray-200">
                  <span>Balance Due:</span>
                  <span>₹{booking.pendingAmount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Terms */}
          <div className="pt-4 border-t border-gray-200 text-center text-[11px] text-gray-500 space-y-1">
            <p className="font-bold text-gray-700">Thank you for choosing Okar Ehha Doorstep Cleaning!</p>
            <p>For any queries or rescheduling, reach out to Korba Helpdesk at <span className="font-bold text-gray-900">+91 98261 00000</span> or on WhatsApp.</p>
          </div>
        </div>

        {/* Bottom Print Button */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-bold bg-black text-white hover:bg-gray-800 rounded-xl flex items-center gap-1.5 shadow transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
