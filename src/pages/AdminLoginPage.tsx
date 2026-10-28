import React, { useState } from 'react';
import { Lock, Mail, ArrowLeft, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToHome }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('akashsinghkushwaha.it27@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both administrator email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(email, password);
      showToast(`Welcome back, ${res.user.name || 'Admin'}!`, 'success');
      onLoginSuccess();
    } catch (err: any) {
      const msg = err.message || 'Authentication failed. Please verify credentials.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B14] flex flex-col justify-center items-center px-4 sm:px-6 relative">
      {/* Back button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-medium text-[#A3AEC2] hover:text-white px-3 py-2 rounded-lg bg-[#101626] border border-white/5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-[#7C5CFC]/20 to-[#38BDF8]/20 border border-[#7C5CFC]/30 text-white mb-4 shadow-xl">
            <Lock className="w-7 h-7 text-[#7C5CFC]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Portfolio Admin CMS</h1>
          <p className="text-xs text-[#A3AEC2] mt-1.5">
            Authorized administrator authentication for content and site management.
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl bg-[#101626] border border-white/10 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@portfolio.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-[#131B2D] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-gradient-to-r from-[#7C5CFC] to-[#5b36ea] hover:from-[#8b6cfd] hover:to-[#6a43f7] rounded-xl shadow-lg shadow-[#7C5CFC]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 text-[11px] text-slate-500 text-center space-y-1">
            <p>Protected by HTTP-only JWT session security &amp; rate limiting.</p>
            <p className="text-slate-400">Initial master key: <code className="text-[#38BDF8]">Admin@2026#Akash</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};
