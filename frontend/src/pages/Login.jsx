import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@habits.local');
    setPassword('secret123');
    setIsSubmitting(true);
    const result = await login('demo@habits.local', 'secret123');
    setIsSubmitting(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient gradient glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl shadow-indigo-500/25 mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Welcome to Aura
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Sign in to continue your habit growth journey</p>
        </div>

        {/* Form Container */}
        <div className="bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-6 pt-6 border-t border-zinc-800/60">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 text-xs font-medium transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Instant One-Click Demo Access</span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-zinc-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 ml-1">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
