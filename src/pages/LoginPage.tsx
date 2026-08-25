import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Successfully logged in');
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-900/20 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md space-y-8 bg-zinc-900/50 p-8 sm:p-10 rounded-2xl border border-white/10 backdrop-blur-sm relative z-10">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-3 text-center text-sm text-zinc-400">
            Or{' '}
            <a href="#" className="font-medium text-yellow-500 hover:text-yellow-400 transition-colors">
              create a new account
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5" htmlFor="email-address">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-zinc-700 bg-zinc-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all sm:text-sm placeholder-zinc-500"
                  placeholder="admin@okarehha.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-zinc-700 bg-zinc-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all sm:text-sm placeholder-zinc-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800/50 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-zinc-900"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-400">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-yellow-500 hover:text-yellow-400 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold tracking-widest uppercase rounded-lg text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-yellow-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-r-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                  <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
