import { Users, Phone, MapPin } from "lucide-react";
import { useMemo } from "react";

export default function CustomersTab({ bookings }: { bookings: any[] }) {
  const customers = useMemo(() => {
    const customerMap = new Map();

    bookings.forEach(b => {
      const mobile = b.mobile;
      if (!mobile) return;
      
      if (!customerMap.has(mobile)) {
        customerMap.set(mobile, {
          fullName: b.fullName,
          mobile: b.mobile,
          address: b.address,
          totalBookings: 0,
          totalAmount: 0,
          pendingAmount: 0,
          lastBooking: b.date, // Assuming sorted by descending date
        });
      }
      
      const cust = customerMap.get(mobile);
      cust.totalBookings += 1;
      
      if (b.status === 'Completed') {
        cust.totalAmount += (Number(b.amount) || 0);
      }
      
      if ((b.paymentStatus === 'Pending') && b.status !== 'Cancelled') {
        cust.pendingAmount += (Number(b.amount) || 0);
      }
    });

    return Array.from(customerMap.values());
  }, [bookings]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Customer Database</h2>
        <p className="text-gray-500 text-base mt-2">View and manage your client relationships.</p>
      </div>

      <div className="bg-white rounded-[24px] border border-gray-200/60 shadow-sm overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Customer</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Contact & Address</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Engagement</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Lifetime Value</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Pending Dues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-10 h-10 text-gray-300" />
                      </div>
                      <p className="text-xl font-bold text-gray-900">No customers found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold shrink-0">
                          {c.fullName?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-900 text-base tracking-tight">{c.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" /> {c.mobile}
                        </span>
                        <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 max-w-[200px] truncate" title={c.address}>
                          <MapPin className="w-3.5 h-3.5 text-gray-400" /> {c.address}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-base">{c.totalBookings} Bookings</span>
                        <span className="text-xs font-medium text-gray-500 mt-1">Last: {c.lastBooking}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="font-black text-gray-900 text-lg">₹{c.totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-6">
                      {c.pendingAmount > 0 ? (
                        <span className="font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg">₹{c.pendingAmount.toLocaleString()}</span>
                      ) : (
                        <span className="font-medium text-gray-400">—</span>
                      )}
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
