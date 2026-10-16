'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, ShieldCheck } from 'lucide-react';

export function Navbar() {
  const { activeTab, setActiveTab, orders } = useApp();

  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING_PAYMENT').length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => setActiveTab('catalog')}
          className="text-2xl font-serif-display font-medium tracking-tight text-[#2D4030] hover:text-[#1E2923] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
        >
          <span>Serenada</span>
          <span className="text-xs font-sans-body tracking-widest uppercase text-[#8C7A58] font-normal">
            Atelier
          </span>
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-sans-body font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'catalog'
                ? 'text-[#2D4030] font-semibold border-b-2 border-[#2D4030]'
                : 'hover:text-[#2D4030]'
            }`}
          >
            Katalog Desain
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'studio'
                ? 'text-[#2D4030] font-semibold border-b-2 border-[#2D4030]'
                : 'hover:text-[#2D4030]'
            }`}
          >
            Live Studio Editor
          </button>
          <button
            onClick={() => setActiveTab('guest_preview')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'guest_preview'
                ? 'text-[#2D4030] font-semibold border-b-2 border-[#2D4030]'
                : 'hover:text-[#2D4030]'
            }`}
          >
            Simulasi Undangan Tamu
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'text-[#2D4030] font-semibold border-b-2 border-[#2D4030]'
                : 'hover:text-[#2D4030]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#8C7A58]" />
            <span>Admin Manajemen</span>
            {pendingOrdersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[11px] font-mono-numbers rounded bg-amber-100 text-amber-800 border border-amber-300">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {activeTab !== 'studio' ? (
            <button
              onClick={() => setActiveTab('studio')}
              className="px-4 py-2 text-xs font-sans-body font-semibold text-white bg-[#2D4030] rounded-lg hover:bg-[#3F5643] transition-all shadow-sm whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Kustomisasi Desain</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('admin')}
              className="px-4 py-2 text-xs font-sans-body font-medium text-[#2D4030] bg-[#EFE9DF] hover:bg-[#E5DDCF] rounded-lg transition-all whitespace-nowrap shrink-0"
            >
              Buka Panel Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
