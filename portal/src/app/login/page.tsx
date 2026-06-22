"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent, demoRole?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = demoRole ? { demoRole } : { email, password };
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to dashboard or appropriate landing page
        router.push('/');
        router.refresh(); // Ensure layout fetches new user state
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center relative font-sans">
      
      {/* Floating Demo Bar */}
      <div className="absolute top-6 right-6 bg-white p-4 rounded-xl shadow-lg border border-brand-green/30 z-50">
        <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider text-center">Demo Quick Login</p>
        <div className="flex flex-col space-y-2">
          <button 
            onClick={() => handleLogin(undefined, 'Admin')}
            disabled={loading}
            className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded hover:bg-slate-700 transition-colors"
          >
            Sign in as Admin
          </button>
          <button 
            onClick={() => handleLogin(undefined, 'Engineer')}
            disabled={loading}
            className="bg-brand-green text-white text-sm font-medium px-4 py-2 rounded hover:bg-emerald-600 transition-colors"
          >
            Sign in as Engineer
          </button>
        </div>
      </div>

      {/* Main Login Form */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 relative overflow-hidden">
        {/* Hexagon Decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-green/10 rounded-full blur-2xl"></div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-brand-green text-white mx-auto flex items-center justify-center mb-4" 
               style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
            <span className="font-bold text-xl">BW</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-1">Sign in to the BoWHDP Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-brand-green focus:border-brand-green outline-none transition-shadow"
              placeholder="admin@bowhdp.gov.ng"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-brand-green focus:border-brand-green outline-none transition-shadow"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-green text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
