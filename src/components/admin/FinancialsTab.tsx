import { Wallet, TrendingUp, AlertCircle, ArrowUpRight } from "lucide-react";

export default function FinancialsTab({ bookings }: { bookings: any[] }) {
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split('T')[0];
  const thisMonthStr = todayStr.substring(0, 7);
  
  // Calculate this week (start of week = sunday)
  const startOfWeek = new Date(todayDate);
  startOfWeek.setDate(todayDate.getDate() - todayDate.getDay());
  
  const stats = {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
    pending: 0
  };

  bookings.forEach(b => {
    const amount = Number(b.amount) || 0;
    
    if (b.status !== 'Cancelled' && (b.paymentStatus === 'Pending')) {
      stats.pending += amount;
    }

    if (b.status === 'Completed') {
      stats.total += amount;
      
      if (b.date === todayStr) {
        stats.today += amount;
      }
      
      if (b.date?.startsWith(thisMonthStr)) {
        stats.thisMonth += amount;
      }
      
      const bDate = new Date(b.date);
      if (bDate >= startOfWeek && bDate <= todayDate) {
        stats.thisWeek += amount;
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Revenue Overview</h2>
        <p className="text-gray-500 text-base mt-2">Track your earnings and pending payments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-black p-8 rounded-[24px] text-white flex flex-col justify-between">
          <div className="flex justify-between items-start mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-white/60 text-sm font-bold uppercase tracking-wider">Total Revenue</span>
          </div>
          <div>
            <h3 className="text-5xl font-black mb-2 tracking-tight">₹{stats.total.toLocaleString()}</h3>
            <p className="text-white/60 font-medium">Lifetime earnings</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[24px] border border-gray-200/60 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-gray-900" />
            </div>
            <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">This Month</span>
          </div>
          <div>
            <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">₹{stats.thisMonth.toLocaleString()}</h3>
            <p className="text-gray-500 font-medium">Earnings in current month</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[24px] border border-gray-200/60 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-gray-900" />
            </div>
            <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">This Week</span>
          </div>
          <div>
            <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">₹{stats.thisWeek.toLocaleString()}</h3>
            <p className="text-gray-500 font-medium">Earnings in current week</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[24px] border border-gray-200/60 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-gray-900" />
            </div>
            <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Today</span>
          </div>
          <div>
            <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">₹{stats.today.toLocaleString()}</h3>
            <p className="text-gray-500 font-medium">Earnings today</p>
          </div>
        </div>

        <div className="bg-orange-50 p-8 rounded-[24px] border border-orange-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-orange-600/80 text-sm font-bold uppercase tracking-wider">Pending Dues</span>
          </div>
          <div>
            <h3 className="text-4xl font-black text-orange-900 mb-2 tracking-tight">₹{stats.pending.toLocaleString()}</h3>
            <p className="text-orange-700 font-medium">Payments awaiting collection</p>
          </div>
        </div>
      </div>
    </div>
  );
}
