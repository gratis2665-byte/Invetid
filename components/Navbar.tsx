'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, ShieldCheck, LogOut, User } from 'lucide-react';

export function Navbar() {
  const { activeTab, setActiveTab, orders, currentUser, logout } = useApp();

  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING_PAYMENT').length;
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F0F7FD]/95 backdrop-blur-md border-b border-[#D4E5F5]">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => setActiveTab('catalog')}
          className="text-2xl font-serif-display font-medium tracking-tight text-[#1E3A8A] hover:text-[#2563EB] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
        >
          <span>Serenada</span>
          <span className="text-xs font-sans-body tracking-widest uppercase text-[#3B82F6] font-normal">
            Atelier
          </span>
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-sans-body font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'catalog'
                ? 'text-[#1E3A8A] font-semibold border-b-2 border-[#2563EB]'
                : 'hover:text-[#1E3A8A]'
            }`}
          >
            Katalog Desain
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'studio'
                ? 'text-[#1E3A8A] font-semibold border-b-2 border-[#2563EB]'
                : 'hover:text-[#1E3A8A]'
            }`}
          >
            Live Studio Editor
          </button>
          <button
            onClick={() => setActiveTab('guest_preview')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'guest_preview'
                ? 'text-[#1E3A8A] font-semibold border-b-2 border-[#2563EB]'
                : 'hover:text-[#1E3A8A]'
            }`}
          >
            Simulasi Undangan Tamu
          </button>

          {/* ADMIN LINK: ONLY VISIBLE IF CURRENT USER IS ADMIN */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'text-[#1E3A8A] font-semibold border-b-2 border-[#2563EB]'
                  : 'hover:text-[#1E3A8A]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <span>Admin Manajemen</span>
              {pendingOrdersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[11px] font-mono-numbers rounded bg-amber-100 text-amber-800 border border-amber-300">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Zone 3: 1 primary action + User profile & logout */}
        <div className="flex items-center gap-3 shrink-0">
          {activeTab !== 'studio' ? (
            <button
              onClick={() => setActiveTab('studio')}
              className="px-3.5 py-2 text-xs font-sans-body font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1D4ED8] transition-all shadow-sm whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-200" />
              <span className="hidden sm:inline">Kustomisasi Desain</span>
              <span className="sm:hidden">Kustomisasi</span>
            </button>
          ) : (
            isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className="px-3.5 py-2 text-xs font-sans-body font-medium text-[#1E3A8A] bg-white hover:bg-stone-50 border border-[#D4E5F5] rounded-lg transition-all whitespace-nowrap shrink-0"
              >
                Panel Admin
              </button>
            )
          )}

          {/* Profile & Logout pill */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-[#D4E5F5]">
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-[#D4E5F5] text-xs">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold ${
                    isAdmin ? 'bg-[#2563EB]' : 'bg-sky-500'
                  }`}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <span className="font-semibold text-stone-900 block truncate max-w-[120px] text-[11px]">
                    {currentUser.name}
                  </span>
                  <span
                    className={`text-[10px] font-medium uppercase tracking-wider block ${
                      isAdmin ? 'text-[#2563EB]' : 'text-stone-400'
                    }`}
                  >
                    {isAdmin ? 'Admin' : 'Pengantin'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Keluar / Logout"
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
