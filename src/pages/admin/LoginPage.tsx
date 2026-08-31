import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Loader2, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleTestLogin = async () => {
    setLoading(true);
    // Simulate slight delay for UX
    setTimeout(() => {
      setLoading(false);
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
      <div className="bg-white p-10 md:p-12 rounded-[24px] shadow-sm w-full max-w-[440px] border border-gray-200/60">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-7 h-7 text-gray-900" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Admin Access</h1>
          <p className="text-gray-500 text-center font-medium">
            AI Studio Preview Mode
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm font-medium mb-6 flex gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            Because this is an AI Studio Starter project, strict domain security is enabled by Firebase. 
            We have temporarily bypassed authentication so you can test the admin dashboard.
          </p>
        </div>

        <button
          type="button"
          onClick={handleTestLogin}
          disabled={loading}
          className="w-full bg-black text-white px-6 py-4 rounded-xl font-bold text-base hover:bg-gray-900 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enter Dashboard (Test Mode)"}
        </button>
      </div>
    </div>
  );
}
