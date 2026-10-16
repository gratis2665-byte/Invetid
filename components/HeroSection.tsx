'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowRight, CheckCircle, Palette, Sparkles, QrCode } from 'lucide-react';

export function HeroSection() {
  const { setActiveTab } = useApp();

  return (
    <section className="relative w-full border-b border-[#D4E5F5] bg-[#F0F7FD] overflow-hidden py-16 md:py-20 px-6">
      {/* Background delicate radial glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Headline and Call-to-actions */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-[#2563EB] text-xs font-sans-body uppercase tracking-widest font-semibold">
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            <span>Koleksi Undangan Pernikahan Digital Eksklusif</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display text-[#0F172A] font-normal leading-[1.2] text-balance">
            Desain Undangan Mewah dengan{' '}
            <span className="italic text-[#2563EB]">Live Preview Instan</span> &amp; Pembayaran Otomatis
          </h1>

          <p className="text-base sm:text-lg font-sans-body text-stone-600 max-w-xl leading-relaxed">
            Pilih dari puluhan template bergaya modern, monogram, hingga botanical.
            Kustomisasi nama mempelai langsung di layar, nikmati verifikasi pembayaran QRIS dan
            Virtual Account, serta konfirmasi langsung ke WhatsApp Admin.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('studio')}
              className="bg-[#2563EB] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#1D4ED8] transition-all shadow-sm flex items-center gap-2"
            >
              <span>Kustomisasi Nama &amp; Desain</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setActiveTab('catalog');
              }}
              className="bg-white text-[#1E3A8A] border border-[#D4E5F5] px-6 py-3 rounded-lg text-sm font-semibold hover:bg-stone-50 transition-all flex items-center gap-2 shadow-xs"
            >
              <Palette className="w-4 h-4 text-[#3B82F6]" />
              <span>Lihat Semua Katalog</span>
            </button>
          </div>

          {/* Adjacency proof points */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#D4E5F5] text-xs sm:text-sm text-stone-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Live Edit Tanpa Delay</span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>QRIS &amp; WA Otomatis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Dashboard Admin Lengkap</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Showcase Frame with Resilient Fallback */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl p-4 bg-white border border-[#D4E5F5] shadow-lg">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#EFF6FF] border border-[#D4E5F5]/60">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsrdEeDwWM1NSugUOGc9sd61HRzEF0NuKGqFSq2eTmIrhjtlT4SH4-2YAkyvoXzHVdyPqQA-x3iIL8K_jC6vUzFgM3zVl8WNH51Ke3TZmBeVg7rvZFYy-FBC57mY1pp5FGsk2a5qwtKVoocRhQcyV25uXtZp7oxj8ZQoeek888sHichyKYrnrq31VbTkDhC78eB4nqNXUL7TiBDcEYDnBZZ13oufMmpxbgEI-ZmUXUue6Pwx_a0OU"
                alt="Bespoke wedding stationery suite"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Fallback & overlay badge */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-lg border border-[#D4E5F5] flex items-center justify-between text-xs">
                <div>
                  <p className="font-serif-display font-medium text-stone-900 text-sm">
                    Alexander &amp; Beatrice
                  </p>
                  <p className="text-stone-500 font-sans-body">Royal Sapphire Edition</p>
                </div>
                <span className="font-mono-numbers font-semibold text-[#2563EB]">Rp 349.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
