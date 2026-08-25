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
    // Frontend demo auth
    if (email.trim() === "bhanu@okarehha.in" && password.trim() === "Bhavika@1608") {
      localStorage.setItem("okar_admin_auth", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. For demo use: bhanu@okarehha.in / Bhavika@1608");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md border border-gray-100 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-black" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
        <p className="text-gray-500 mb-8 text-sm">Sign in to manage bookings and services.</p>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#050505] outline-none"
              placeholder="bhanu@okarehha.in"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#050505] outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-gray-900 py-4 rounded-xl font-bold hover:bg-black hover:text-white transition-colors mt-2"
          >
            Login
          </button>
        </form>

        <p className="mt-8 text-xs text-gray-500">
          This is a protected area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
