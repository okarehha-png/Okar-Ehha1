import React, { useState } from "react";
import {
  Settings,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Download,
  Save,
  CheckCircle2,
  Lock,
  Globe,
  Database,
  FileSpreadsheet
} from "lucide-react";
import { AdminRole } from "../../types/admin";
import { exportToCSV } from "../../services/adminService";

interface SettingsTabProps {
  userRole: AdminRole;
  allData: {
    bookings: any[];
    customers: any[];
    services: any[];
    expenses: any[];
    inventory: any[];
    suppliers: any[];
    staff: any[];
  };
}

export default function SettingsTab({ userRole, allData }: SettingsTabProps) {
  const [businessName, setBusinessName] = useState("Okar Ehha - Doorstep Mechanized Cleaning");
  const [phone, setPhone] = useState("+91 98261 00000");
  const [email, setEmail] = useState("support@okarehha.in");
  const [address, setAddress] = useState("Main Road, Near Kosabadi, Korba, Chhattisgarh - 495677");
  const [openingTime, setOpeningTime] = useState("08:00 AM");
  const [closingTime, setClosingTime] = useState("08:00 PM");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const korbaAreas = [
    "Kosabadi",
    "Transport Nagar (TP Nagar)",
    "Balco Township",
    "NTPC Township & Jamnipali",
    "Darri & Barrage",
    "Risdi Road",
    "CSEB Colony (East & West)",
    "Kusmunda & Gevra",
    "Manikpur",
    "Hudco Colony",
    "Rajgamar",
    "Dipka"
  ];

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportFullBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `OkarEhha_Complete_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <span>Business Settings & System Configuration</span>
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Configure business details, operational hours, service zones, and backup data
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>Business profile settings updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Profile Form */}
        <div className="bg-[#121824] border border-amber-500/20 rounded-2xl p-6 shadow-md">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Business Profile Details</span>
          </h3>
          <p className="text-xs text-gray-400 mb-4">Official Okar Ehha operations branding</p>

          <form onSubmit={handleSaveBusiness} className="space-y-3 text-xs">
            <div>
              <label className="block text-gray-400 font-bold mb-1">Company / Brand Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Primary WhatsApp / Call</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Support Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Opening Time</label>
                <input
                  type="text"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Closing Time</label>
                <input
                  type="text"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-bold mb-1">Official Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs rounded-xl shadow-md"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>

        {/* Korba Service Coverage Areas & Role Matrix */}
        <div className="space-y-6">
          {/* Service Areas */}
          <div className="bg-[#121824] border border-amber-500/20 rounded-2xl p-6 shadow-md">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Doorstep Service Zones in Korba</span>
            </h3>
            <p className="text-xs text-gray-400 mb-3">Active coverage areas for mobile van units</p>

            <div className="flex flex-wrap gap-2">
              {korbaAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-[#0B0F17] border border-amber-500/30 text-amber-300 font-semibold text-xs rounded-xl"
                >
                  📍 {area}
                </span>
              ))}
            </div>
          </div>

          {/* Backup & Data Export Center */}
          <div className="bg-[#121824] border border-amber-500/20 rounded-2xl p-6 shadow-md">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span>Full Business Database Backup</span>
            </h3>
            <p className="text-xs text-gray-400 mb-4">Export all bookings, clients, expenses, and staff records</p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportFullBackup}
                className="px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Complete JSON Backup</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
