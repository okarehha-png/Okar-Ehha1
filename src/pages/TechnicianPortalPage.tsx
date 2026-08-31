import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Navigation, 
  Camera, 
  Sparkles, 
  ShieldCheck, 
  QrCode, 
  Check, 
  Car, 
  RefreshCw, 
  AlertCircle,
  ArrowRight,
  UserCheck
} from "lucide-react";
import { bookingService } from "../services/bookingService";
import { Booking, BookingStatus } from "../types/admin";

export default function TechnicianPortalPage() {
  const [technicianName, setTechnicianName] = useState("Ramesh Patel");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Photo & Note update state
  const [beforeUrl, setBeforeUrl] = useState("");
  const [afterUrl, setAfterUrl] = useState("");
  const [techNote, setTechNote] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const staffOptions = [
    "Ramesh Patel",
    "Sunil Kumar Yadav",
    "Prakash Dewangan",
    "Amit Sahu",
    "Vikram Singh"
  ];

  const loadTechnicianJobs = async () => {
    setIsLoading(true);
    try {
      const all = await bookingService.getAllBookings();
      if (all && all.length > 0) {
        const filtered = all.filter((b: any) => 
          !b.assignedStaff || 
          b.assignedStaff.toLowerCase().includes(technicianName.toLowerCase()) || 
          technicianName === "All"
        );
        setBookings(filtered as Booking[]);
        if (filtered.length > 0 && !selectedBooking) {
          setSelectedBooking(filtered[0] as Booking);
        }
      } else {
        // Sample realistic jobs for Korba field technician
        const sampleJobs: Booking[] = [
          {
            id: "OE-8812",
            fullName: "Bhanu Pratap Patel",
            mobile: "9826144550",
            serviceName: "Doorstep Foam Car Wash",
            packageName: "Exterior Foam + Interior Vacuum",
            vehicleType: "Creta SUV",
            vehicleNumber: "CG 12 BD 4501",
            address: "Surya Apartment, Kosabadi, Korba",
            areaZone: "Kosabadi",
            date: new Date().toISOString().split('T')[0],
            time: "10:30 AM",
            amount: 599,
            discount: 100,
            finalAmount: 499,
            paymentReceived: 0,
            pendingAmount: 499,
            paymentMethod: "UPI",
            paymentStatus: "Pending",
            status: "Assigned",
            assignedStaff: technicianName,
            assignedStaffPhone: "+91 98261 44556",
            createdAt: new Date().toISOString()
          },
          {
            id: "OE-8819",
            fullName: "Rohan Verma",
            mobile: "9826199882",
            serviceName: "Sintex Water Tank Mechanized Clean",
            packageName: "1000L UV & Antibacterial",
            vehicleType: "House Rooftop Tank",
            vehicleNumber: "",
            address: "House 45, NTPC Township Sector 2, Korba",
            areaZone: "NTPC Township",
            date: new Date().toISOString().split('T')[0],
            time: "02:00 PM",
            amount: 799,
            discount: 0,
            finalAmount: 799,
            paymentReceived: 799,
            pendingAmount: 0,
            paymentMethod: "UPI",
            paymentStatus: "Paid",
            status: "Confirmed",
            assignedStaff: technicianName,
            assignedStaffPhone: "+91 98261 44556",
            createdAt: new Date().toISOString()
          },
          {
            id: "OE-8805",
            fullName: "Pooja Agrawal",
            mobile: "9425211223",
            serviceName: "Sofa & Upholstery Shampoo Deep Wash",
            packageName: "5-Seater Living Room",
            vehicleType: "Living Room Sofa",
            vehicleNumber: "",
            address: "Near Saraswati School, Transport Nagar, Korba",
            areaZone: "Transport Nagar",
            date: new Date().toISOString().split('T')[0],
            time: "04:30 PM",
            amount: 1199,
            discount: 100,
            finalAmount: 1099,
            paymentReceived: 1099,
            pendingAmount: 0,
            paymentMethod: "Cash",
            paymentStatus: "Paid",
            status: "Completed",
            assignedStaff: technicianName,
            assignedStaffPhone: "+91 98261 44556",
            createdAt: new Date().toISOString()
          }
        ];
        setBookings(sampleJobs);
        setSelectedBooking(sampleJobs[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTechnicianJobs();
  }, [technicianName]);

  const handleUpdateStatus = async (newStatus: BookingStatus) => {
    if (!selectedBooking) return;
    setStatusUpdating(true);
    try {
      await bookingService.updateBookingStatus(selectedBooking.id, newStatus);
      const updated: Booking = { ...selectedBooking, status: newStatus };
      setSelectedBooking(updated);
      setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleCollectPayment = async (method: 'UPI' | 'Cash') => {
    if (!selectedBooking) return;
    setStatusUpdating(true);
    try {
      const amount = selectedBooking.finalAmount || selectedBooking.amount;
      await bookingService.updatePaymentStatus(selectedBooking.id, 'Paid', amount, method);
      const updated: Booking = {
        ...selectedBooking,
        paymentStatus: 'Paid',
        paymentReceived: amount,
        pendingAmount: 0,
        paymentMethod: method
      };
      setSelectedBooking(updated);
      setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
      setQrModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSavePhotosAndNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    try {
      await bookingService.updatePhotosAndNotes(selectedBooking.id, {
        beforePhotoUrl: beforeUrl || selectedBooking.beforePhotoUrl,
        afterPhotoUrl: afterUrl || selectedBooking.afterPhotoUrl,
        technicianNotes: techNote || selectedBooking.technicianNotes
      });
      const updated = {
        ...selectedBooking,
        beforePhotoUrl: beforeUrl || selectedBooking.beforePhotoUrl,
        afterPhotoUrl: afterUrl || selectedBooking.afterPhotoUrl,
        technicianNotes: techNote || selectedBooking.technicianNotes
      };
      setSelectedBooking(updated);
      setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-[#0A0E17] min-h-screen text-gray-100 font-sans pb-24 selection:bg-amber-500 selection:text-black">
      {/* Top Mobile App Header */}
      <header className="sticky top-0 z-30 bg-[#0E1422]/90 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-black flex items-center justify-center text-base shadow-md">
            OE
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-sm text-white">Technician Field App</h1>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-amber-400 font-semibold">Korba On-Demand Cleaning Dispatch</p>
          </div>
        </div>

        {/* Technician Profile Selector */}
        <div className="flex items-center gap-2">
          <select
            value={technicianName}
            onChange={(e) => setTechnicianName(e.target.value)}
            className="bg-[#161F32] border border-amber-500/40 text-amber-300 text-xs font-bold rounded-xl px-3 py-1.5 outline-none cursor-pointer"
          >
            {staffOptions.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <button
            onClick={loadTechnicianJobs}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors"
            title="Refresh Jobs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">

        {/* Today's Stats & Summary Pill */}
        <div className="grid grid-cols-3 gap-3 bg-[#0F1626] border border-gray-800 p-4 rounded-2xl">
          <div className="text-center border-r border-gray-800">
            <p className="text-[10px] uppercase font-bold text-gray-400">Total Assigned</p>
            <p className="text-xl font-black text-white mt-0.5">{bookings.length}</p>
          </div>
          <div className="text-center border-r border-gray-800">
            <p className="text-[10px] uppercase font-bold text-amber-400">In Progress / Pending</p>
            <p className="text-xl font-black text-amber-400 mt-0.5">
              {bookings.filter(b => b.status !== 'Completed').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-emerald-400">Completed Today</p>
            <p className="text-xl font-black text-emerald-400 mt-0.5">
              {bookings.filter(b => b.status === 'Completed').length}
            </p>
          </div>
        </div>

        {/* Assigned Bookings List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
            <span>Today's Dispatches ({bookings.length})</span>
            <span className="text-amber-400 text-[11px]">Select job to view & update</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bookings.map((job) => {
              const isSelected = selectedBooking?.id === job.id;
              const isDone = job.status === 'Completed';

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedBooking(job)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected 
                      ? 'bg-[#141C2E] border-amber-500 shadow-lg shadow-amber-500/10' 
                      : 'bg-[#0F1626] border-gray-800/90 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] bg-black/50 text-amber-400 px-2 py-0.5 rounded font-bold">
                        #{job.id}
                      </span>
                      <h3 className="font-extrabold text-white text-sm mt-1">{job.fullName}</h3>
                      <p className="text-xs text-gray-400">{job.serviceName}</p>
                    </div>

                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isDone 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : job.status === 'In Progress' 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-800">
                    <span className="flex items-center gap-1 text-gray-300 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {job.time}
                    </span>
                    <span className="flex items-center gap-1 text-gray-300">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      {job.areaZone || 'Korba'}
                    </span>
                    <span className="font-black text-amber-400">
                      ₹{job.finalAmount || job.amount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Job Detailed Action Sheet */}
        {selectedBooking && (
          <div className="bg-[#121A2B] border border-gray-700/80 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl animate-fadeIn">
            {/* Header with Customer & Quick Calling/Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">{selectedBooking.fullName}</h2>
                  <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    #{selectedBooking.id}
                  </span>
                </div>
                <p className="text-xs text-amber-300/90 font-bold mt-0.5">
                  {selectedBooking.serviceName} ({selectedBooking.packageName || 'Standard'})
                </p>
                {selectedBooking.vehicleNumber && (
                  <p className="text-xs text-gray-400 font-semibold mt-1">
                    🚗 Vehicle: <span className="text-white font-mono font-bold bg-black/60 px-2 py-0.5 rounded">{selectedBooking.vehicleNumber}</span> {selectedBooking.vehicleType ? `(${selectedBooking.vehicleType})` : ''}
                  </p>
                )}
              </div>

              {/* Direct Field Action Buttons (Call & Directions) */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedBooking.mobile}`}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Customer</span>
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedBooking.address}, Korba, Chhattisgarh`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Maps Route</span>
                </a>
              </div>
            </div>

            {/* Address & Slot */}
            <div className="bg-[#0A0E17] p-4 rounded-2xl border border-gray-800 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-300">Customer Location</p>
                  <p className="text-gray-400 leading-relaxed">{selectedBooking.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-1 text-gray-400">
                <span>Date: <strong className="text-white">{selectedBooking.date}</strong></span>
                <span>Time Slot: <strong className="text-amber-400">{selectedBooking.time}</strong></span>
                <span>Zone: <strong className="text-white">{selectedBooking.areaZone || 'Korba'}</strong></span>
              </div>
            </div>

            {/* 1-Click Status Advance Flow */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Update Service Status in Real-Time
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus('Confirmed')}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all ${
                    selectedBooking.status === 'Confirmed'
                      ? 'bg-blue-500 text-white border-blue-400 shadow-md'
                      : 'bg-[#151E30] text-gray-300 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  1. Confirmed
                </button>

                <button
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus('On The Way')}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all ${
                    selectedBooking.status === 'On The Way'
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md font-black animate-pulse'
                      : 'bg-[#151E30] text-gray-300 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  🚀 2. On The Way
                </button>

                <button
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus('In Progress')}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all ${
                    selectedBooking.status === 'In Progress'
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md font-black'
                      : 'bg-[#151E30] text-gray-300 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  🧼 3. Washing (Started)
                </button>

                <button
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus('Completed')}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all ${
                    selectedBooking.status === 'Completed'
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-md font-black'
                      : 'bg-[#151E30] text-gray-300 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  ✅ 4. Job Completed
                </button>
              </div>
            </div>

            {/* Payment Collection Section */}
            <div className="bg-[#0F1728] border border-gray-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Collection</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-black text-white">
                      ₹{selectedBooking.finalAmount || selectedBooking.amount}
                    </span>
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                      selectedBooking.paymentStatus === 'Paid'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {selectedBooking.paymentStatus === 'Paid' ? '✓ Received' : '⚠️ Due from Customer'}
                    </span>
                  </div>
                </div>

                {selectedBooking.paymentStatus !== 'Paid' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQrModalOpen(true)}
                      className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Show UPI QR</span>
                    </button>
                    <button
                      onClick={() => handleCollectPayment('Cash')}
                      className="bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors"
                    >
                      Cash Received
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Before & After Photo Proof Upload / Inspection */}
            <div className="bg-[#0F1728] border border-gray-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Before & After Quality Photos</span>
                </h3>
                {saveSuccess && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </span>
                )}
              </div>

              <form onSubmit={handleSavePhotosAndNotes} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-300 mb-1">Before Wash Photo (Image URL)</label>
                    <input
                      type="url"
                      placeholder="https://... (or camera photo link)"
                      defaultValue={selectedBooking.beforePhotoUrl || ""}
                      onChange={(e) => setBeforeUrl(e.target.value)}
                      className="w-full bg-[#0A0E17] border border-gray-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-300 mb-1">After Wash Photo (Image URL)</label>
                    <input
                      type="url"
                      placeholder="https://... (final shine mirror photo)"
                      defaultValue={selectedBooking.afterPhotoUrl || ""}
                      onChange={(e) => setAfterUrl(e.target.value)}
                      className="w-full bg-[#0A0E17] border border-gray-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Technician Inspection Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Minor front bumper scratch noted before wash, deep foam completed."
                    defaultValue={selectedBooking.technicianNotes || ""}
                    onChange={(e) => setTechNote(e.target.value)}
                    className="w-full bg-[#0A0E17] border border-gray-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="bg-white hover:bg-gray-200 text-black font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                  >
                    Save Inspection Proof 📸
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

      </div>

      {/* Dynamic UPI QR Modal */}
      {qrModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121A2B] border border-amber-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 animate-fadeIn shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Scan UPI to Pay</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Scan with GPay, PhonePe, Paytm or BHIM
              </p>
            </div>

            {/* Realistic generated QR Display */}
            <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  `upi://pay?pa=okarehha@upi&pn=OkarEhha&am=${selectedBooking.finalAmount || selectedBooking.amount}&cu=INR&tn=Booking_${selectedBooking.id}`
                )}`}
                alt="UPI QR Code"
                className="w-44 h-44 object-contain mx-auto"
              />
              <p className="text-[11px] font-bold text-gray-800 mt-2">
                Okar Ehha Cleaning Services (Korba)
              </p>
            </div>

            <div className="text-sm font-black text-amber-400 bg-[#0A0E17] py-2 rounded-xl border border-gray-800">
              Exact Amount: ₹{selectedBooking.finalAmount || selectedBooking.amount}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setQrModalOpen(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs py-3 rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleCollectPayment('UPI')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 rounded-xl shadow transition-colors"
              >
                Mark Paid via UPI ✓
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
