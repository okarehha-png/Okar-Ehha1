import { useState, useMemo } from "react";
import { CalendarCheck, Search, MapPin, Clock, Trash2, MessageCircle } from "lucide-react";
import { bookingService } from "../../services/bookingService";

export default function BookingsTab({ bookings, onUpdate }: { bookings: any[], onUpdate: () => void }) {
  const [filter, setFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // Search
      const searchMatch = !searchQuery || 
        b.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.mobile?.includes(searchQuery) ||
        b.id?.toLowerCase().includes(searchQuery.toLowerCase());
        
      // Status Filter
      const statusMatch = filter === "All" || (b.status || 'Received') === filter;
      
      // Payment Filter
      const paymentMatch = paymentFilter === "All" || (b.paymentStatus || 'Pending') === paymentFilter;
      
      // Date Filter
      const dateMatch = !dateFilter || b.date === dateFilter;

      return searchMatch && statusMatch && paymentMatch && dateMatch;
    });
  }, [bookings, filter, paymentFilter, searchQuery, dateFilter]);

  const updateStatus = async (id: string, newStatus: string) => {
    await bookingService.updateBookingStatus(id, newStatus);
    onUpdate();
  };

  const updatePayment = async (id: string, newStatus: string) => {
    await bookingService.updatePaymentStatus(id, newStatus);
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      setDeletingId(id);
      await bookingService.deleteBooking(id);
      onUpdate();
      setDeletingId(null);
    }
  };

  const handleWhatsApp = (mobile: string, booking: any) => {
    // Format number to e.g. 919999999999
    let formattedMobile = mobile.replace(/\D/g, '');
    if (formattedMobile.length === 10) {
      formattedMobile = '91' + formattedMobile;
    }
    const message = `Hello ${booking.fullName}, this is from Okar Ehha regarding your booking (${booking.id}) on ${booking.date} at ${booking.time}.`;
    window.open(`https://wa.me/${formattedMobile}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Booking Management</h2>
        <p className="text-gray-500 text-base mt-2">Manage all service requests, payments, and statuses.</p>
      </div>

      <div className="bg-white rounded-[24px] border border-gray-200/60 shadow-sm overflow-hidden mt-6">
        {/* Filters Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col gap-6">
          <div className="flex flex-col xl:flex-row gap-4 justify-between">
            <div className="relative w-full xl:w-96">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name, mobile, or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all" 
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <input 
                type="date" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
              />
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all cursor-pointer"
              >
                <option value="All">All Payments</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
          
          {/* Scrollable Status Pills */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {["All", "Received", "Confirmed", "Started", "Completed", "Cancelled"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                  filter === f 
                    ? 'bg-black text-white border-black shadow-md' 
                    : 'bg-white text-gray-600 border-gray-200/80 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Job Ref</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Client Details</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Schedule</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Value & Payment</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center">
                     <div className="flex flex-col items-center justify-center">
                       <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                         <CalendarCheck className="w-10 h-10 text-gray-300" />
                       </div>
                       <p className="text-xl font-bold text-gray-900">No records found</p>
                       <p className="text-gray-500 text-base mt-2">Try adjusting your filters or search criteria.</p>
                     </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-base tracking-tight">{b.serviceName}</span>
                        <span className="text-sm font-medium text-gray-500 mt-1 line-clamp-1">{b.packageName}</span>
                        {b.vehicleType && <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded w-max mt-1">{b.vehicleType}</span>}
                        <span className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">{b.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-base tracking-tight">{b.fullName}</span>
                          <button onClick={() => handleWhatsApp(b.mobile, b)} className="text-green-600 hover:text-green-700 bg-green-50 p-1.5 rounded-full" title="Message on WhatsApp">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-sm font-medium text-gray-500 mt-1">{b.mobile}</span>
                        <span className="text-xs font-semibold text-gray-500 mt-2 flex items-start gap-1.5 max-w-[250px]" title={`${b.address}${b.landmark ? `, ${b.landmark}` : ''}`}>
                          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" /> 
                          <span className="line-clamp-2 leading-relaxed">{b.address}{b.landmark ? `, ${b.landmark}` : ''}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-base tracking-tight">{b.date}</span>
                        <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mt-1">
                          <Clock className="w-3.5 h-3.5" /> {b.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-2">
                        <span className="font-black text-gray-900 text-lg tracking-tight">₹{b.amount}</span>
                        <select
                          value={b.paymentStatus || 'Pending'}
                          onChange={(e) => updatePayment(b.id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2 py-1 focus:outline-none cursor-pointer border ${
                            (b.paymentStatus || 'Pending') === 'Paid' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <select
                        value={b.status || 'Received'}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer focus:outline-none border-2 focus:ring-2 focus:ring-black ${
                          b.status === 'Completed' ? 'bg-black text-white border-black' :
                          b.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                          b.status === 'Started' || b.status === 'On The Way' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        <option value="Received">Received</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Assigned">Assigned</option>
                        <option value="On The Way">On The Way</option>
                        <option value="Started">Started</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button 
                        onClick={() => handleDelete(b.id)}
                        disabled={deletingId === b.id}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
