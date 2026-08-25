import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Home, 
  Search, 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  Wallet, 
  Settings, 
  Bell, 
  ChevronDown, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  MapPin,
  Star
} from "lucide-react";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("okar_admin_auth");
    if (!isAuth) {
      navigate("/admin/login");
    }

    const stored = localStorage.getItem('okar_bookings');
    if (stored) {
      setBookings(JSON.parse(stored).reverse());
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("okar_admin_auth");
    navigate("/admin/login");
  };

  const updateStatus = (id: string, newStatus: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
    setBookings(updated);
    localStorage.setItem('okar_bookings', JSON.stringify(updated.slice().reverse()));
  };

  const filteredBookings = filter === "All" ? bookings : bookings.filter(b => b.status === filter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Received' || b.status === 'Confirmed').length,
    completed: bookings.filter(b => b.status === 'Completed').length,
    revenue: bookings.filter(b => b.status === 'Completed').reduce((acc, curr) => acc + (curr.amount || 0), 0)
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden font-sans">
      
      {/* Sidebar - Urban Company Style */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <span className="text-xl font-bold text-black tracking-tight">Okar Ehha</span>
          <span className="ml-2 text-xs font-semibold bg-black text-white px-2 py-0.5 rounded uppercase tracking-widest">Partner</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'dashboard' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("bookings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'bookings' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <CalendarCheck className="w-5 h-5" /> Bookings
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <Users className="w-5 h-5" /> Customers
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <Wallet className="w-5 h-5" /> Payouts
          </button>
        </div>

        <div className="p-4 border-t border-gray-100">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <Home className="w-5 h-5" /> Live Website
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors mt-1">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
             <div className="relative hidden md:block w-72">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input type="text" placeholder="Search bookings, customers..." className="w-full pl-9 pr-4 py-2 bg-[#F5F7FA] border-none rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black" />
             </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-gray-200">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900 leading-tight">Admin User</p>
                <p className="text-xs text-gray-500 font-medium">Bhanu</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Page Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
              <p className="text-gray-500 text-sm mt-1">Track your business performance and recent bookings.</p>
            </div>

            {/* Premium Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">+12%</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">₹{stats.revenue}</h3>
                  <p className="text-sm text-gray-500 font-medium">Total Earnings</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.completed}</h3>
                  <p className="text-sm text-gray-500 font-medium">Jobs Completed</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.pending}</h3>
                  <p className="text-sm text-gray-500 font-medium">Active Jobs</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">4.9</h3>
                  <p className="text-sm text-gray-500 font-medium">Average Rating</p>
                </div>
              </div>

            </div>

            {/* Bookings Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 md:p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
                
                {/* Scrollable Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-5 px-5 md:mx-0 md:px-0">
                  {["All", "Received", "Confirmed", "Started", "Completed", "Cancelled"].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                        filter === f 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Job Details</th>
                      <th className="px-6 py-4 font-semibold">Customer</th>
                      <th className="px-6 py-4 font-semibold">Schedule</th>
                      <th className="px-6 py-4 font-semibold">Amount</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                           <div className="flex flex-col items-center justify-center">
                             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                               <CalendarCheck className="w-8 h-8 text-gray-300" />
                             </div>
                             <p className="text-gray-900 font-bold">No bookings found</p>
                             <p className="text-gray-500 text-sm mt-1">There are no jobs matching this filter.</p>
                           </div>
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 text-sm">{b.serviceName}</span>
                              <span className="text-xs text-gray-500 mt-0.5 line-clamp-1">{b.packageName}</span>
                              <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{b.id}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900 text-sm">{b.fullName}</span>
                              <span className="text-xs text-gray-500 mt-0.5">{b.mobile}</span>
                              <span className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Address Details
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900 text-sm">{b.date}</span>
                              <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" /> {b.time}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-gray-900 text-sm">₹{b.amount}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                              b.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                              b.status === 'Cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                              b.status === 'Started' || b.status === 'On The Way' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}>
                              {b.status || 'Received'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <select
                              value={b.status || 'Received'}
                              onChange={(e) => updateStatus(b.id, e.target.value)}
                              className="text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black cursor-pointer appearance-none pr-8 relative hover:bg-gray-50"
                              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\' stroke-width=\'2\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em' }}
                            >
                              <option value="Received">Mark Received</option>
                              <option value="Confirmed">Mark Confirmed</option>
                              <option value="Assigned">Assign Professional</option>
                              <option value="On The Way">On The Way</option>
                              <option value="Started">Start Job</option>
                              <option value="Completed">Mark Completed</option>
                              <option value="Cancelled">Cancel Job</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}
