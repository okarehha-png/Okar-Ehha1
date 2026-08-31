import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim() === "bhanu@okarehha.in" && password.trim() === "Bhavika@1608") {
      localStorage.setItem("okar_admin_auth", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. Please verify your access details.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
      <div className="bg-white p-10 md:p-12 rounded-[24px] shadow-sm w-full max-w-[440px] border border-gray-200/60">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-7 h-7 text-gray-900" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Admin Access</h1>
          <p className="text-gray-500 text-base">Sign in to manage Okar Ehha operations.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
              placeholder="bhanu@okarehha.in"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white px-6 py-4 rounded-xl font-bold text-base hover:bg-gray-900 transition-colors mt-4 shadow-sm"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
