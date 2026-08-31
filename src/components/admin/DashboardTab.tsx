import { TrendingUp, CheckCircle2, Clock, Star, Wallet, Calendar, AlertCircle, XCircle } from "lucide-react";

export default function DashboardTab({ bookings }: { bookings: any[] }) {
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = today.substring(0, 7);

  const stats = {
    todayBookings: bookings.filter(b => b.date === today).length,
    pendingBookings: bookings.filter(b => !b.status || b.status === 'Received').length,
    confirmedBookings: bookings.filter(b => b.status === 'Confirmed').length,
    completedBookings: bookings.filter(b => b.status === 'Completed').length,
    cancelledBookings: bookings.filter(b => b.status === 'Cancelled').length,
    
    todayRevenue: bookings.filter(b => b.date === today && b.status === 'Completed').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0),
    monthlyRevenue: bookings.filter(b => b.date?.startsWith(thisMonth) && b.status === 'Completed').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0),
    pendingPayments: bookings.filter(b => b.paymentStatus === 'Pending' && b.status !== 'Cancelled').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0),
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard Overview</h2>
        <p className="text-gray-500 text-base mt-2">Monitor your operations, revenue, and booking activities.</p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[24px] border border-gray-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gray-900" />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{stats.todayBookings}</h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Today's Bookings</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-gray-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-gray-900" />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">₹{stats.todayRevenue.toLocaleString()}</h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Today's Revenue</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-gray-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-gray-900" />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">₹{stats.monthlyRevenue.toLocaleString()}</h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Monthly Revenue</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-gray-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">₹{stats.pendingPayments.toLocaleString()}</h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending Payments</p>
          </div>
        </div>
      </div>

      {/* Booking Status Breakdown */}
      <h3 className="text-xl font-bold text-gray-900 tracking-tight mt-8 mb-4">Booking Status</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
             <Clock className="w-6 h-6 text-yellow-600" />
           </div>
           <div>
             <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending</p>
             <p className="text-2xl font-black text-gray-900">{stats.pendingBookings}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
             <CheckCircle2 className="w-6 h-6 text-blue-600" />
           </div>
           <div>
             <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Confirmed</p>
             <p className="text-2xl font-black text-gray-900">{stats.confirmedBookings}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
             <CheckCircle2 className="w-6 h-6 text-green-600" />
           </div>
           <div>
             <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Completed</p>
             <p className="text-2xl font-black text-gray-900">{stats.completedBookings}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
             <XCircle className="w-6 h-6 text-red-600" />
           </div>
           <div>
             <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Cancelled</p>
             <p className="text-2xl font-black text-gray-900">{stats.cancelledBookings}</p>
           </div>
        </div>
      </div>
    </div>
  );
}
