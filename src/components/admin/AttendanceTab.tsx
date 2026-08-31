import React, { useState } from "react";
import {
  CalendarCheck,
  Calendar,
  Clock,
  Check,
  X,
  AlertCircle,
  Download,
  Users,
  Save,
  CheckCircle2
} from "lucide-react";
import { StaffMember, AttendanceRecord } from "../../types/admin";
import { exportToCSV } from "../../services/adminService";

interface AttendanceTabProps {
  staff: StaffMember[];
  attendance: AttendanceRecord[];
  onSaveAttendance: (records: AttendanceRecord[]) => Promise<void>;
}

export default function AttendanceTab({
  staff,
  attendance,
  onSaveAttendance
}: AttendanceTabProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Initialize local attendance state for the selected date
  const [dayAttendance, setDayAttendance] = useState<Record<string, { status: 'Present' | 'Absent' | 'Half Day' | 'Leave'; overtime: number; notes: string }>>(() => {
    const map: Record<string, any> = {};
    staff.forEach(s => {
      const existing = attendance.find(a => a.staffId === s.id && a.date === selectedDate);
      map[s.id] = {
        status: existing?.status || 'Present',
        overtime: existing?.overtimeHours || 0,
        notes: existing?.notes || ''
      };
    });
    return map;
  });

  const handleStatusToggle = (staffId: string, status: 'Present' | 'Absent' | 'Half Day' | 'Leave') => {
    setDayAttendance(prev => ({
      ...prev,
      [staffId]: {
        ...prev[staffId],
        status
      }
    }));
    setSavedSuccess(false);
  };

  const handleOvertimeChange = (staffId: string, overtime: number) => {
    setDayAttendance(prev => ({
      ...prev,
      [staffId]: {
        ...prev[staffId],
        overtime
      }
    }));
    setSavedSuccess(false);
  };

  const handleSave = async () => {
    const recordsToSave: AttendanceRecord[] = staff.map(s => {
      const entry = dayAttendance[s.id] || { status: 'Present', overtime: 0, notes: '' };
      return {
        id: `att-${s.id}-${selectedDate}`,
        staffId: s.id,
        staffName: s.name,
        date: selectedDate,
        status: entry.status,
        checkInTime: entry.status === 'Present' || entry.status === 'Half Day' ? '09:00 AM' : undefined,
        checkOutTime: entry.status === 'Present' || entry.status === 'Half Day' ? '07:00 PM' : undefined,
        overtimeHours: entry.overtime,
        notes: entry.notes
      };
    });

    await onSaveAttendance(recordsToSave);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Summary counts for selected date
  const dayValues = Object.values(dayAttendance) as Array<{ status: string; overtime: number; notes: string }>;
  const presentCount = dayValues.filter(v => v.status === 'Present').length;
  const absentCount = dayValues.filter(v => v.status === 'Absent').length;
  const halfDayCount = dayValues.filter(v => v.status === 'Half Day').length;
  const leaveCount = dayValues.filter(v => v.status === 'Leave').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Staff Attendance Roster</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Mark daily check-ins, leaves, half-days, and calculate overtime for payroll
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#121824] border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-white font-bold cursor-pointer"
          />
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Roster</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>Attendance recorded successfully for {selectedDate}!</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#121824] border border-emerald-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Present Today</span>
          <div className="text-2xl font-black text-emerald-400">{presentCount} Staff</div>
          <span className="text-[10px] text-gray-400 font-semibold">On duty in Korba</span>
        </div>

        <div className="bg-[#121824] border border-red-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Absent</span>
          <div className="text-2xl font-black text-red-400">{absentCount} Staff</div>
          <span className="text-[10px] text-gray-400 font-semibold">Unannounced</span>
        </div>

        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Half Day</span>
          <div className="text-2xl font-black text-amber-400">{halfDayCount} Staff</div>
          <span className="text-[10px] text-gray-400 font-semibold">Partial shift</span>
        </div>

        <div className="bg-[#121824] border border-blue-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">On Leave</span>
          <div className="text-2xl font-black text-blue-400">{leaveCount} Staff</div>
          <span className="text-[10px] text-gray-400 font-semibold">Approved leave</span>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-[#121824] border border-amber-500/20 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0F17] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-3.5">Employee Name & Role</th>
                <th className="p-3.5">Attendance Status (Click to Set)</th>
                <th className="p-3.5">Overtime (Hours)</th>
                <th className="p-3.5">Work Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
              {staff.map((s) => {
                const currentStatus = dayAttendance[s.id]?.status || 'Present';
                const overtime = dayAttendance[s.id]?.overtime || 0;

                return (
                  <tr key={s.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-white text-sm">{s.name}</p>
                      <span className="text-[11px] text-gray-400">{s.role} • {s.mobile}</span>
                    </td>

                    {/* Quick 4 Status Pills */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStatusToggle(s.id, 'Present')}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-500 text-black shadow-md'
                              : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleStatusToggle(s.id, 'Half Day')}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                            currentStatus === 'Half Day'
                              ? 'bg-amber-500 text-black shadow-md'
                              : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          Half Day
                        </button>
                        <button
                          onClick={() => handleStatusToggle(s.id, 'Leave')}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                            currentStatus === 'Leave'
                              ? 'bg-blue-500 text-white shadow-md'
                              : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          Leave
                        </button>
                        <button
                          onClick={() => handleStatusToggle(s.id, 'Absent')}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                            currentStatus === 'Absent'
                              ? 'bg-red-500 text-white shadow-md'
                              : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>

                    {/* Overtime */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={8}
                          value={overtime}
                          onChange={(e) => handleOvertimeChange(s.id, Number(e.target.value))}
                          className="w-16 bg-[#0B0F17] border border-gray-700 rounded-lg p-1.5 text-center text-amber-400 font-bold"
                        />
                        <span className="text-gray-400 text-[11px]">hrs (+₹{overtime * 100})</span>
                      </div>
                    </td>

                    {/* Work Shift */}
                    <td className="p-3.5 text-gray-400 text-[11px]">
                      {currentStatus === 'Present' ? '09:00 AM - 07:00 PM (Full Day)' : currentStatus === 'Half Day' ? '09:00 AM - 02:00 PM (Half Shift)' : 'Off Duty'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
