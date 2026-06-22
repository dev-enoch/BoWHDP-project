"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut, X } from 'lucide-react';

export function SubNav() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contractors', path: '/contractors' },
  ];

  return (
    <>
      <div className="bg-brand-dark text-white px-8 py-3 flex items-center justify-between border-t border-white/10 relative z-40">
        {/* Left: Logo */}
        <div className="flex items-center space-x-3">
          <svg viewBox="0 0 100 100" className="w-5 h-5 text-brand-green fill-current">
            <polygon points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25" />
          </svg>
          <span className="font-semibold text-lg tracking-wide">BoWHDP</span>
        </div>
        
        {/* Right: Nav & Auth */}
        <div className="flex items-center space-x-8">
          <nav className="flex space-x-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <Link 
                  key={link.name}
                  href={link.path} 
                  className={`relative group transition-colors pb-1 ${isActive ? 'text-brand-green' : 'text-slate-300 hover:text-white'}`}
                >
                  {link.name}
                  <span className={`absolute left-0 bottom-0 h-0.5 bg-brand-green transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              );
            })}
            
            {/* Hide complaints from non-admins */}
            {user?.role === 'Admin' && (
              <Link 
                href="/complaints" 
                className={`relative group transition-colors pb-1 ${pathname.startsWith('/complaints') ? 'text-brand-green' : 'text-slate-300 hover:text-white'}`}
              >
                Complaints
                <span className={`absolute left-0 bottom-0 h-0.5 bg-brand-green transition-all duration-300 ${pathname.startsWith('/complaints') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            )}
          </nav>

          {/* User Profile & Logout */}
          {!loading && user && (
            <div className="flex items-center space-x-4 pl-6 border-l border-white/10">
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.role}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
              </div>
              <button 
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center justify-center p-2 text-slate-300 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Sign Out</h3>
            <p className="text-slate-500 mb-6">Are you sure you want to log out of your session?</p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
