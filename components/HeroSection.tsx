'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowRight, CheckCircle, Palette, Sparkles, QrCode } from 'lucide-react';

export function HeroSection() {
  const { setActiveTab } = useApp();

  return (
    <section className="relative w-full border-b border-[#E7E2DA] bg-[#F7F4EE] overflow-hidden py-16 md:py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline and Call-to-actions */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-[#4A634E] text-xs font-sans-body uppercase tracking-widest font-semibold">
            <Sparkles className="w-4 h-4 text-[#C29B38]" />
            <span>Koleksi Undangan Pernikahan Digital Eksklusif</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display text-[#1E2923] font-normal leading-[1.2] text-balance">
            Desain Undangan Mewah dengan{' '}
            <span className="italic text-[#2D4030]">Live Preview Instan</span> & Pembayaran Otomatis
          </h1>

          <p className="text-base sm:text-lg font-sans-body text-stone-600 max-w-xl leading-relaxed">
            Pilih dari puluhan template bergaya botanical, royal monogram, hingga modern minimalist.
            Kustomisasi nama mempelai langsung di layar, nikmati verifikasi pembayaran QRIS dan
            Virtual Account instan, serta kelola pesanan melalui dashboard admin.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('studio')}
              className="bg-[#2D4030] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#3F5643] transition-all shadow-sm flex items-center gap-2"
            >
              <span>Kustomisasi Nama & Desain</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setActiveTab('catalog');
              }}
              className="bg-[#EFE9DF] text-[#2D4030] px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#E5DDCF] transition-all flex items-center gap-2"
            >
              <Palette className="w-4 h-4 text-[#8C7A58]" />
              <span>Lihat Semua Katalog</span>
            </button>
          </div>

          {/* Adjacency proof points */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E7E2DA] text-xs sm:text-sm text-stone-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#3F5643] shrink-0" />
              <span>Live Edit Tanpa Delay</span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#3F5643] shrink-0" />
              <span>QRIS & Bank VA Otomatis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#3F5643] shrink-0" />
              <span>Dashboard Admin Lengkap</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Showcase Frame with Resilient Fallback */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl p-4 bg-white/80 border border-[#E7E2DA] shadow-lg">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF6EE] border border-[#E7E2DA]/60">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsrdEeDwWM1NSugUOGc9sd61HRzEF0NuKGqFSq2eTmIrhjtlT4SH4-2YAkyvoXzHVdyPqQA-x3iIL8K_jC6vUzFgM3zVl8WNH51Ke3TZmBeVg7rvZFYy-FBC57mY1pp5FGsk2a5qwtKVoocRhQcyV25uXtZp7oxj8ZQoeek888sHichyKYrnrq31VbTkDhC78eB4nqNXUL7TiBDcEYDnBZZ13oufMmpxbgEI-ZmUXUue6Pwx_a0OU"
                alt="Bespoke wedding stationery suite"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to elegant SVG illustration
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Fallback & overlay badge */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-lg border border-[#E7E2DA] flex items-center justify-between text-xs">
                <div>
                  <p className="font-serif-display font-medium text-stone-900 text-sm">
                    Alexander & Beatrice
                  </p>
                  <p className="text-stone-500 font-sans-body">Botanical Serenade Edition</p>
                </div>
                <span className="font-mono-numbers font-semibold text-[#2D4030]">Rp 349.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
