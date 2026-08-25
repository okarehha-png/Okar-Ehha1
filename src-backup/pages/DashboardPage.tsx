import React, { useState } from 'react';
import { useAppContext } from '../store';
import { formatINR } from '../utils';
import { format } from 'date-fns';
import { Users, Calendar, CheckSquare, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { bookings, updateBookingStatus, drivers } = useAppContext();
  const [activeTab, setActiveTab] = useState<'Bookings' | 'Reviews'>('Bookings');
  
  const totalRevenue = bookings.reduce((acc, b) => acc + b.totalPrice, 0);
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;

  const handleStatusUpdate = (id: string, state: any, driverId?: string) => {
    updateBookingStatus(id, state, driverId);
    toast.success(`Booking ${state}`, {
      description: `Booking ${id} status updated to ${state}.`
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1 text-sm">Manage all operations for Okar Ehha.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3 mb-3 text-slate-400">
            <CheckSquare className="h-5 w-5 text-cyan-400" />
            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-300">Total Bookings</h3>
          </div>
          <p className="text-3xl font-mono font-bold text-white">{bookings.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3 mb-3 text-slate-400">
            <Calendar className="h-5 w-5 text-yellow-500" />
            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-300">Pending Requests</h3>
          </div>
          <p className="text-3xl font-mono font-bold text-yellow-500">{pendingCount}</p>
        </div>
        <div className="bg-gradient-to-br from-[#12151c] to-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10">
            <Users className="h-32 w-32 translate-x-8 translate-y-8 text-cyan-400" />
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-3 text-slate-400">
               <h3 className="font-bold text-xs uppercase tracking-widest text-slate-300">Total Revenue</h3>
             </div>
             <p className="text-3xl font-mono font-bold text-cyan-400">{formatINR(totalRevenue)}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0a0c10] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="border-b border-slate-800 bg-slate-900/40 px-6 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">Recent Operations</h2>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#12151c] text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">ID & Customer</th>
                <th className="py-4 px-6">Service</th>
                <th className="py-4 px-6">Schedule</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">No operational records found.</td>
                </tr>
              ) : (
                bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-mono font-bold text-cyan-400 mb-1">{booking.id}</div>
                      <div className="font-medium text-white">{booking.customerName}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{booking.customerPhone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-200">{booking.serviceId}</div>
                      {booking.carCategory && booking.carModel && (
                        <div className="text-[10px] text-slate-500 mt-0.5">{booking.carCategory} - {booking.carModel}</div>
                      )}
                      {booking.tankCapacity && (
                        <div className="text-[10px] text-slate-500 mt-0.5">Capacity: {booking.tankCapacity}</div>
                      )}
                      {booking.homeSize && (
                        <div className="text-[10px] text-slate-500 mt-0.5">Size: {booking.homeSize}</div>
                      )}
                      {booking.sofaType && (
                        <div className="text-[10px] text-slate-500 mt-0.5">Type: {booking.sofaType}</div>
                      )}
                      {booking.carpetSize && (
                        <div className="text-[10px] text-slate-500 mt-0.5">Size: {booking.carpetSize}</div>
                      )}
                      <div className="text-xs text-slate-400 mt-1 font-mono">{formatINR(booking.totalPrice)} {booking.recurring !== 'One-Time' && <span className="text-cyan-500">[{booking.recurring}]</span>}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="whitespace-nowrap font-medium text-white">{format(new Date(`${booking.date}T${booking.time}`), 'MMM d, yyyy')}</div>
                      <div className="text-xs text-slate-400 font-mono mt-1">{format(new Date(`${booking.date}T${booking.time}`), 'p')}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                        booking.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {booking.status === 'Pending' && (
                        <button 
                          onClick={() => handleStatusUpdate(booking.id, 'Confirmed')}
                          className="text-cyan-400 hover:text-white text-xs font-bold uppercase tracking-widest mr-4 transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {(booking.status === 'Confirmed' || booking.status === 'Pending') && (
                        <select 
                          className="text-xs bg-[#0a0c10] border-slate-700 text-white rounded-lg px-2 py-1 focus:ring-cyan-500 focus:border-cyan-500 ml-auto block w-32 outline-none"
                          onChange={(e) => {
                            if(e.target.value) {
                              handleStatusUpdate(booking.id, 'Driver Dispatched', e.target.value);
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>Assign Pro</option>
                          {drivers.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
                          ))}
                        </select>
                      )}
                      {booking.status === 'Driver Dispatched' && (
                        <button 
                          onClick={() => handleStatusUpdate(booking.id, 'In Progress')}
                          className="text-yellow-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                          Mark Active
                        </button>
                      )}
                      {booking.status === 'In Progress' && (
                        <button 
                          onClick={() => handleStatusUpdate(booking.id, 'Completed')}
                          className="text-green-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                          Complete
                        </button>
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
