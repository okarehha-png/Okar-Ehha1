import React, { useState } from "react";
import {
  DollarSign,
  UserCheck,
  Calendar,
  CreditCard,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus
} from "lucide-react";
import { StaffMember, SalaryRecord, Booking, AttendanceRecord } from "../../types/admin";
import { exportToCSV } from "../../services/adminService";

interface SalariesTabProps {
  staff: StaffMember[];
  salaries: SalaryRecord[];
  bookings: Booking[];
  attendance: AttendanceRecord[];
  onPaySalary: (salaryRecord: Omit<SalaryRecord, 'id'>) => Promise<void>;
}

export default function SalariesTab({
  staff,
  salaries,
  bookings,
  attendance,
  onPaySalary
}: SalariesTabProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-08");
  const [payingStaff, setPayingStaff] = useState<StaffMember | null>(null);
  const [payMethod, setPayMethod] = useState<string>("Bank");
  const [bonusInput, setBonusInput] = useState<number>(0);
  const [deductionInput, setDeductionInput] = useState<number>(0);
  const [selectedPayslip, setSelectedPayslip] = useState<any | null>(null);

  // Compute live payroll per staff member for the selected month
  const payrollRows = staff.map(s => {
    // 1. Base
    const base = s.baseSalary;

    // 2. Commission from completed jobs
    const staffBookings = bookings.filter(b => b.assignedStaff === s.name && b.status === 'Completed');
    const totalRev = staffBookings.reduce((sum, b) => sum + Number(b.finalAmount || b.amount || 0), 0);
    const commission = Math.round(totalRev * ((s.commissionPercentage || 5) / 100));

    // 3. Overtime bonus from attendance
    const staffAtt = attendance.filter(a => a.staffId === s.id);
    const totalOtHours = staffAtt.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
    const overtimePay = totalOtHours * 100; // ₹100 per overtime hr

    // 4. Existing paid record if already processed
    const existingPaid = salaries.find(sal => sal.staffId === s.id && sal.month === selectedMonth && sal.status === 'Paid');

    const totalBonus = (existingPaid?.bonus || bonusInput) + overtimePay;
    const totalDeductions = existingPaid?.deductions || deductionInput;
    const netPayable = existingPaid ? existingPaid.netSalary : (base + commission + totalBonus - totalDeductions);

    return {
      staff: s,
      month: selectedMonth,
      baseSalary: base,
      completedJobs: staffBookings.length,
      commissionEarned: commission,
      overtimeHours: totalOtHours,
      overtimePay: overtimePay,
      bonus: totalBonus,
      deductions: totalDeductions,
      netPayable: Math.max(0, netPayable),
      isPaid: !!existingPaid,
      paidDate: existingPaid?.paidDate,
      paymentMethod: existingPaid?.paymentMethod || 'Bank',
      existingRecord: existingPaid
    };
  });

  const totalMonthlyPayout = payrollRows.reduce((sum, r) => sum + r.netPayable, 0);
  const totalPaidSoFar = payrollRows.filter(r => r.isPaid).reduce((sum, r) => sum + r.netPayable, 0);
  const totalPendingPayout = totalMonthlyPayout - totalPaidSoFar;

  const handleConfirmSalaryPayment = async () => {
    if (!payingStaff) return;
    const row = payrollRows.find(r => r.staff.id === payingStaff.id);
    if (!row) return;

    await onPaySalary({
      staffId: payingStaff.id,
      staffName: payingStaff.name,
      month: selectedMonth,
      baseSalary: row.baseSalary,
      commission: row.commissionEarned,
      bonus: bonusInput + row.overtimePay,
      deductions: deductionInput,
      netSalary: row.netPayable,
      status: 'Paid',
      paidDate: new Date().toISOString().split('T')[0],
      paymentMethod: payMethod
    });

    setPayingStaff(null);
    setBonusInput(0);
    setDeductionInput(0);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Staff Payroll & Salary Disbursements</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Base salaries, job commissions, overtime compensation and salary slips
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-[#121824] border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold cursor-pointer"
          >
            <option value="2026-08">August 2026</option>
            <option value="2026-07">July 2026</option>
            <option value="2026-06">June 2026</option>
            <option value="2026-05">May 2026</option>
          </select>

          <button
            onClick={() => exportToCSV(payrollRows.map(r => ({
              Staff: r.staff.name,
              Role: r.staff.role,
              Base: r.baseSalary,
              Commission: r.commissionEarned,
              Overtime: r.overtimePay,
              NetPayable: r.netPayable,
              Status: r.isPaid ? 'Paid' : 'Pending'
            })), `OkarEhha_Payroll_${selectedMonth}`)}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Payroll</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121824] border border-amber-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Total Month Payroll</span>
          <div className="text-2xl font-black text-white">₹{totalMonthlyPayout.toLocaleString()}</div>
          <span className="text-[10px] text-gray-400 font-semibold">Salaries + Commissions for {selectedMonth}</span>
        </div>

        <div className="bg-[#121824] border border-emerald-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Disbursed (Paid)</span>
          <div className="text-2xl font-black text-emerald-400">₹{totalPaidSoFar.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-300 font-semibold">Transferred to staff bank/cash</span>
        </div>

        <div className="bg-[#121824] border border-red-500/20 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Pending to Disburse</span>
          <div className="text-2xl font-black text-red-400">₹{totalPendingPayout.toLocaleString()}</div>
          <span className="text-[10px] text-red-300 font-semibold">Awaiting month-end settlement</span>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-[#121824] border border-amber-500/20 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0F17] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-3.5">Staff & Role</th>
                <th className="p-3.5">Base Salary</th>
                <th className="p-3.5">Commission</th>
                <th className="p-3.5">OT / Bonus</th>
                <th className="p-3.5">Net Payout</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
              {payrollRows.map((r) => (
                <tr key={r.staff.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="p-3.5">
                    <p className="font-bold text-white text-sm">{r.staff.name}</p>
                    <span className="text-[11px] text-gray-400">{r.staff.role} • {r.completedJobs} jobs done</span>
                  </td>

                  <td className="p-3.5 font-bold text-white">
                    ₹{r.baseSalary.toLocaleString()}
                  </td>

                  <td className="p-3.5 text-amber-400 font-bold">
                    +₹{r.commissionEarned.toLocaleString()}
                  </td>

                  <td className="p-3.5 text-emerald-400 font-semibold">
                    +₹{r.bonus.toLocaleString()} ({r.overtimeHours}h OT)
                  </td>

                  <td className="p-3.5">
                    <span className="font-black text-amber-400 text-sm">
                      ₹{r.netPayable.toLocaleString()}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.isPaid
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {r.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>

                  <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                    {/* View Payslip */}
                    <button
                      onClick={() => setSelectedPayslip(r)}
                      className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg inline-block text-xs font-bold"
                      title="View Payslip"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>

                    {/* Pay Salary Button */}
                    {!r.isPaid ? (
                      <button
                        onClick={() => {
                          setPayingStaff(r.staff);
                          setBonusInput(r.overtimePay);
                        }}
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-lg text-xs"
                      >
                        Disburse
                      </button>
                    ) : (
                      <span className="text-[11px] text-gray-500 italic">Disbursed on {r.paidDate}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DISBURSE SALARY MODAL */}
      {payingStaff && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-emerald-500/30 rounded-2xl w-full max-w-md p-6 text-gray-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Disburse Salary: {payingStaff.name}</span>
            </h3>
            <p className="text-xs text-gray-400">
              Month: <strong>{selectedMonth}</strong> • Base: ₹{payingStaff.baseSalary}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Additional Bonus (₹)</label>
                <input
                  type="number"
                  value={bonusInput}
                  onChange={(e) => setBonusInput(Number(e.target.value))}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-emerald-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Advance / Deductions (₹)</label>
                <input
                  type="number"
                  value={deductionInput}
                  onChange={(e) => setDeductionInput(Number(e.target.value))}
                  className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-red-400 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 font-bold mb-1">Payment Method</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-2.5 text-white font-bold text-xs"
              >
                <option value="Bank">Bank Transfer (NEFT / IMPS)</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash in Hand</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setPayingStaff(null)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSalaryPayment}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl"
              >
                Confirm Disbursement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PAYSLIP MODAL */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-amber-500/30 rounded-2xl w-full max-w-lg p-6 text-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-black">Okar Ehha Doorstep Cleaning</span>
                <h3 className="text-xl font-black text-white">Salary Payslip — {selectedMonth}</h3>
              </div>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#0B0F17] p-4 rounded-xl border border-gray-800 space-y-2 text-xs">
              <div className="flex justify-between pb-2 border-b border-gray-800">
                <span className="text-gray-400">Employee Name:</span>
                <span className="font-bold text-white">{selectedPayslip.staff.name}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-800">
                <span className="text-gray-400">Role:</span>
                <span className="font-bold text-amber-400">{selectedPayslip.staff.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Base Salary:</span>
                <span className="font-semibold text-white">₹{selectedPayslip.baseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Job Commission ({selectedPayslip.completedJobs} jobs):</span>
                <span className="font-semibold text-emerald-400">+₹{selectedPayslip.commissionEarned.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Overtime & Bonus:</span>
                <span className="font-semibold text-emerald-400">+₹{selectedPayslip.bonus.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Deductions:</span>
                <span className="font-semibold text-red-400">-₹{selectedPayslip.deductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-amber-500/30 text-sm font-black text-amber-400">
                <span>Net Disbursed:</span>
                <span>₹{selectedPayslip.netPayable.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-amber-500 text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Payslip</span>
              </button>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
