import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../store';
import { MapPin, Clock, Truck, ShieldCheck, Star } from 'lucide-react';
import { format } from 'date-fns';

export default function TrackingPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { bookings, drivers } = useAppContext();
  
  const booking = bookings.find(b => b.id === bookingId);
  const driver = booking?.driverId ? drivers.find(d => d.id === booking?.driverId) : null;

  const [simulatedProgress, setSimulatedProgress] = useState(0);

  useEffect(() => {
    // Simulate real-time progress if status is not completed
    if (booking?.status === 'Pending' || booking?.status === 'Confirmed') {
      setSimulatedProgress(25);
    } else if (booking?.status === 'Driver Dispatched') {
      setSimulatedProgress(50);
    } else if (booking?.status === 'In Progress') {
      setSimulatedProgress(75);
    } else if (booking?.status === 'Completed') {
      setSimulatedProgress(100);
    }
  }, [booking?.status]);

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center text-white">
        <h2 className="text-2xl font-bold font-serif mb-2">Operation Not Found</h2>
        <p className="mt-2 text-slate-400">We couldn't locate booking ID: <span className="font-mono text-cyan-400">{bookingId}</span></p>
        <Link to="/" className="mt-6 px-6 py-2 bg-slate-800 text-cyan-400 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors border border-slate-700">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-[#0a0c10] rounded-[2rem] shadow-2xl border border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-[#12151c] p-6 sm:p-8 text-white relative overflow-hidden border-b border-slate-800">
          <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
            <Truck className="h-48 w-48 translate-x-1/3 -translate-y-1/4" />
          </div>
          <div className="relative z-10 flex flex-col items-start">
             <div className="flex gap-2 items-center mb-4">
                 <span className="text-[10px] text-cyan-400 px-3 py-1 bg-cyan-500/10 rounded uppercase font-bold tracking-widest border border-cyan-500/20">Active Operation</span>
             </div>
             <h1 className="text-2xl font-bold font-serif mb-1">Service Tracking</h1>
             <p className="text-slate-400 text-sm font-mono tracking-widest">ID: {booking.id}</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-10">
          
          {/* Progress Bar Steps */}
          <div className="relative">
            <div className="flex justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">{booking.status}</span>
            </div>
            <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded-full bg-slate-800 border border-slate-700">
              <div style={{ width: `${simulatedProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000 relative">
                 <div className="absolute right-0 top-0 w-8 h-full bg-white/30 skew-x-[-45deg] animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500">
              <span className={simulatedProgress >= 25 ? "text-white" : ""}>Confirmed</span>
              <span className={simulatedProgress >= 50 ? "text-white" : ""}>Dispatched</span>
              <span className={simulatedProgress >= 75 ? "text-white" : ""}>Working</span>
              <span className={simulatedProgress >= 100 ? "text-cyan-400" : ""}>Done</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><Clock className="h-4 w-4"/> Manifest</h3>
              <div className="bg-slate-900 rounded-2xl p-5 text-sm space-y-4 border border-slate-800">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Service Code</span>
                  <span className="font-bold text-white">{booking.serviceId}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Schedule</span>
                  <span className="font-medium text-slate-300">
                    {format(new Date(`${booking.date}T${booking.time}`), 'PPp')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Destination</span>
                  <span className="font-medium text-slate-300 leading-relaxed block">{booking.address}</span>
                </div>
                {booking.carCategory && booking.carModel && (
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Vehicle</span>
                    <span className="font-medium text-slate-300">{booking.carCategory} - {booking.carModel}</span>
                  </div>
                )}
                {booking.tankCapacity && (
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Tank Capacity</span>
                    <span className="font-medium text-slate-300">{booking.tankCapacity}</span>
                  </div>
                )}
                {booking.homeSize && (
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Home Size</span>
                    <span className="font-medium text-slate-300">{booking.homeSize}</span>
                  </div>
                )}
                {booking.sofaType && (
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Sofa Type</span>
                    <span className="font-medium text-slate-300">{booking.sofaType}</span>
                  </div>
                )}
                {booking.carpetSize && (
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Carpet Size</span>
                    <span className="font-medium text-slate-300">{booking.carpetSize}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Driver Info */}
            <div className="space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> Professional Assigned</h3>
               {driver ? (
                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                   <div className="flex gap-4 items-center">
                     <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-lg">
                       {driver.name.charAt(0)}
                     </div>
                     <div>
                       <p className="font-bold text-white">{driver.name}</p>
                       <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mt-0.5">ID: {driver.id}</p>
                       <div className="mt-2 flex items-center gap-1 bg-[#0a0c10] w-max px-2 py-0.5 rounded border border-slate-800">
                         <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                         <span className="text-[10px] font-bold text-white">4.8</span>
                       </div>
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className="bg-slate-900/50 rounded-2xl p-5 text-center border border-dashed border-slate-700 flex flex-col items-center justify-center h-full">
                   <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-cyan-500 animate-spin mb-3"></div>
                   <p className="text-xs text-slate-500 font-medium">Assigning optimal professional based on geofence location...</p>
                 </div>
               )}
            </div>
            
            {/* Live Map Representation */}
            {driver && booking.status !== 'Completed' && (
              <div className="md:col-span-2 mt-2">
                 <div className="h-40 bg-[#12151c] rounded-2xl overflow-hidden relative border border-slate-800 flex items-center justify-center bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Korba&zoom=13&size=800x400&maptype=roadmap&style=feature:all|element:geometry|color:0x242f3e&style=feature:all|element:labels.text.stroke|color:0x242f3e&style=feature:all|element:labels.text.fill|color:0x746855&style=feature:water|color:0x17263c')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-[#0a0c10]/60 backdrop-blur-[1px]"></div>
                    <div className="relative z-10 flex flex-col items-center text-cyan-400 bg-slate-900/80 px-6 py-4 rounded-2xl border border-slate-700 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-6 w-6 animate-bounce" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white">Live Geo-Link Active</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 font-mono">Pro Clean Team ~ 1.2km away</p>
                    </div>
                 </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
