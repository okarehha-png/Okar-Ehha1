import React, { useState } from "react";
import {
  Menu,
  Bell,
  Plus,
  Search,
  RefreshCw,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Receipt,
  UserCheck,
  X
} from "lucide-react";
import { NotificationItem, AdminRole } from "../../types/admin";

interface AdminHeaderProps {
  setMobileMenuOpen: (open: boolean) => void;
  activeTabTitle: string;
  notifications: NotificationItem[];
  onRefresh: () => void;
  onQuickNewBooking: () => void;
  onQuickNewExpense: () => void;
  userRole: AdminRole;
  setActiveTab: (tab: string) => void;
}

export default function AdminHeader({
  setMobileMenuOpen,
  activeTabTitle,
  notifications,
  onRefresh,
  onQuickNewBooking,
  onQuickNewExpense,
  userRole,
  setActiveTab
}: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-[#0C1017]/95 backdrop-blur-md border-b border-amber-500/20 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Left side: Hamburger + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg bg-gray-800/80"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{activeTabTitle}</span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-extrabold tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-md">
              {userRole} Mode
            </span>
          </h1>
          <p className="text-[11px] text-gray-400 hidden sm:block">
            Okar Ehha Operations • Korba, CG
          </p>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2.5">
        {/* Quick Action: New Booking */}
        <button
          onClick={onQuickNewBooking}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Booking</span>
        </button>

        {/* Quick Action: Add Expense */}
        <button
          onClick={onQuickNewExpense}
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors hidden md:flex"
        >
          <Receipt className="w-3.5 h-3.5 text-amber-400" />
          <span>Expense</span>
        </button>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          title="Refresh Data"
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors border border-gray-800"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors relative border border-gray-800"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black font-black text-[9px] rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#121824] border border-amber-500/30 rounded-2xl shadow-2xl p-4 z-50 text-gray-200">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-sm text-white">System Notifications</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-2 divide-y divide-gray-800/60 max-h-72 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4 text-center">No alerts at the moment.</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (notif.linkTab) setActiveTab(notif.linkTab);
                        setShowNotifications(false);
                      }}
                      className="pt-2 cursor-pointer hover:bg-gray-800/40 p-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        {notif.type === 'stock' && <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                        {notif.type === 'booking' && <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />}
                        {notif.type === 'payment' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />}
                        {notif.type === 'salary' && <UserCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />}
                        <div>
                          <p className="text-xs font-bold text-white">{notif.title}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{notif.message}</p>
                          <span className="text-[9px] text-gray-500 mt-1 block">{notif.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
