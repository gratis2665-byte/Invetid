'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  Smartphone,
  Monitor,
  Heart,
  Calendar,
  Clock,
  MapPin,
  Music,
  Check,
  ArrowRight,
  RefreshCw,
  Sliders,
} from 'lucide-react';

export function LiveStudio() {
  const {
    templates,
    selectedTemplate,
    selectTemplateForCustomizing,
    customization,
    updateCustomization,
    setActiveTab,
    showToast,
  } = useApp();

  const [activeFormTab, setActiveFormTab] = useState<'mempelai' | 'acara' | 'kutipan' | 'desain'>('mempelai');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

  const colorTones = [
    { name: 'Sage Green', color: '#3F5643' },
    { name: 'Royal Gold', color: '#C29B38' },
    { name: 'Dusty Rose', color: '#884D58' },
    { name: 'Midnight Azure', color: '#1E293B' },
    { name: 'Javanese Bronze', color: '#C69214' },
    { name: 'Minimalist Black', color: '#18181B' },
  ];

  const presets = [
    {
      label: 'Alex & Beatrice (Modern)',
      groom: 'Alexander Hamilton Sterling, S.T.',
      groomNick: 'Alexander',
      groomParents: 'Putra dari Bpk. Robert & Ibu Maria Sterling',
      bride: 'Beatrice Eleanor Schuyler, S.I.Kom.',
      brideNick: 'Beatrice',
      brideParents: 'Putri dari Bpk. William & Ibu Clara Schuyler',
      quote: '"Dua jiwa menjadi satu, melangkah beriringan dalam jalinan kasih, doa restu, dan janji suci selamanya."',
      date: '2026-11-28',
      venue: 'The Glasshouse Grand Ballroom',
    },
    {
      label: 'Dimas & Sarah (Botanical)',
      groom: 'Dimas Aditya Prasetyo, S.E.',
      groomNick: 'Dimas',
      groomParents: 'Putra pertama Bpk. H. Prasetyo & Ibu Hj. Ratna',
      bride: 'Sarah Amanda Putri, M.Ds.',
      brideNick: 'Sarah',
      brideParents: 'Putri tercinta Bpk. Bambang & Ibu Anita',
      quote: '"Mencintai bukan tentang saling memandang, melainkan bersama-sama memandang ke arah yang sama."',
      date: '2026-12-14',
      venue: 'Plataran Cilandak Garden',
    },
    {
      label: 'Rama & Shinta (Tradisional)',
      groom: 'Raden Rama Kusuma, M.Eng.',
      groomNick: 'Rama',
      groomParents: 'Putra Bpk. K.R.T. Kusuma & Ibu Hj. Endang',
      bride: 'Dyah Ayu Shinta Dewi, S.Pd.',
      brideNick: 'Shinta',
      brideParents: 'Putri Bpk. H. Suryo Broto & Ibu Siti Mariam',
      quote: '"Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu agar kamu cenderung dan merasa tenteram kepadanya."',
      date: '2027-01-10',
      venue: 'Sasana Kriya Grand Ballroom',
    },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    updateCustomization({
      groomName: p.groom,
      groomNickname: p.groomNick,
      groomParents: p.groomParents,
      brideName: p.bride,
      brideNickname: p.brideNick,
      brideParents: p.brideParents,
      loveQuote: p.quote,
      weddingDate: p.date,
      venueName: p.venue,
    });
    showToast(`Preset nama "${p.label}" diterapkan!`, 'info');
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Calculate days remaining
  const calculateDaysLeft = () => {
    try {
      const target = new Date(customization.weddingDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
      }
      return 140;
    } catch {
      return 140;
    }
  };

  const groomInitial = customization.groomNickname?.charAt(0) || 'A';
  const brideInitial = customization.brideNickname?.charAt(0) || 'B';

  return (
    <section className="w-full min-h-[calc(100vh-4.5rem)] bg-[#F7F4EE] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Studio Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E7E2DA]">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans-body uppercase tracking-widest text-[#8C7A58] font-semibold">
              <Sparkles className="w-4 h-4 text-[#C29B38]" />
              <span>Interactive Customizer Studio</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif-display text-[#1E2923]">
              Kustomisasi Undangan & Live Preview Instan
            </h1>
          </div>

          {/* Quick template selector badge & price */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#E7E2DA] text-xs">
              <span className="text-stone-500 font-sans-body">Template:</span>
              <span className="font-semibold text-[#2D4030] font-sans-body">
                {selectedTemplate.name}
              </span>
              <span className="font-mono-numbers text-stone-700 font-bold ml-1">
                {formatRupiah(selectedTemplate.price)}
              </span>
            </div>

            <button
              onClick={() => setActiveTab('checkout')}
              className="bg-[#2D4030] text-white px-4 py-2 rounded-lg text-xs font-sans-body font-semibold hover:bg-[#3F5643] transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
            >
              <span>Lanjut Bayar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2-Column Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Configuration Controls & Inputs */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Quick Template Switcher Chips */}
            <div className="bg-white p-4 rounded-xl border border-[#E7E2DA] shadow-sm">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider font-sans-body">
                  Ganti Template Desain
                </span>
                <span className="text-[11px] text-stone-400 font-sans-body">
                  Data teks tidak akan hilang
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {templates.filter((t) => t.isActive).map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => selectTemplateForCustomizing(tmpl)}
                    className={`p-2 rounded-lg text-left border transition-all text-xs flex flex-col justify-between ${
                      selectedTemplate.id === tmpl.id
                        ? 'border-[#2D4030] bg-[#FAF8F5] ring-1 ring-[#2D4030]'
                        : 'border-[#E7E2DA] hover:border-stone-400 bg-white'
                    }`}
                  >
                    <span className="font-medium text-stone-800 truncate">{tmpl.name}</span>
                    <span className="font-mono-numbers text-[10px] text-stone-500 mt-1">
                      {formatRupiah(tmpl.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Presets Bar */}
            <div className="bg-white p-4 rounded-xl border border-[#E7E2DA] shadow-sm">
              <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2 font-sans-body">
                Gunakan Contoh Cepat (Preset)
              </div>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyPreset(p)}
                    className="text-xs px-2.5 py-1.5 rounded bg-[#F2ECE1] text-stone-700 hover:bg-[#EAE2D4] transition-colors font-sans-body"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form Tabs */}
            <div className="bg-white rounded-xl border border-[#E7E2DA] shadow-sm overflow-hidden">
              <div className="flex border-b border-[#E7E2DA] bg-[#FAF8F5]">
                <button
                  onClick={() => setActiveFormTab('mempelai')}
                  className={`flex-1 py-3 text-xs font-semibold font-sans-body transition-colors border-b-2 ${
                    activeFormTab === 'mempelai'
                      ? 'border-[#2D4030] text-[#2D4030] bg-white'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  1. Nama Mempelai
                </button>
                <button
                  onClick={() => setActiveFormTab('acara')}
                  className={`flex-1 py-3 text-xs font-semibold font-sans-body transition-colors border-b-2 ${
                    activeFormTab === 'acara'
                      ? 'border-[#2D4030] text-[#2D4030] bg-white'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  2. Jadwal & Lokasi
                </button>
                <button
                  onClick={() => setActiveFormTab('kutipan')}
                  className={`flex-1 py-3 text-xs font-semibold font-sans-body transition-colors border-b-2 ${
                    activeFormTab === 'kutipan'
                      ? 'border-[#2D4030] text-[#2D4030] bg-white'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  3. Kutipan & Tema
                </button>
              </div>

              {/* Form Tab 1: Mempelai */}
              {activeFormTab === 'mempelai' && (
                <div className="p-5 space-y-4">
                  {/* Groom */}
                  <div className="p-3.5 bg-[#FAF8F5] rounded-lg border border-[#E7E2DA] space-y-3">
                    <span className="text-xs font-bold text-[#2D4030] uppercase tracking-wider block font-sans-body">
                      Mempelai Pria
                    </span>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1 font-sans-body">
                        Nama Lengkap & Gelar
                      </label>
                      <input
                        type="text"
                        value={customization.groomName}
                        onChange={(e) => updateCustomization({ groomName: e.target.value })}
                        placeholder="cth. Alexander Sterling, S.T."
                        className="w-full text-xs px-3 py-2 bg-white border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1 font-sans-body">
                          Nama Panggilan
                        </label>
                        <input
                          type="text"
                          value={customization.groomNickname}
                          onChange={(e) => updateCustomization({ groomNickname: e.target.value })}
                          placeholder="Alex"
                          className="w-full text-xs px-3 py-2 bg-white border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1 font-sans-body">
                          Keterangan Orang Tua
                        </label>
                        <input
                          type="text"
                          value={customization.groomParents}
                          onChange={(e) => updateCustomization({ groomParents: e.target.value })}
                          placeholder="Putra Bpk. & Ibu..."
                          className="w-full text-xs px-3 py-2 bg-white border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bride */}
                  <div className="p-3.5 bg-[#FAF8F5] rounded-lg border border-[#E7E2DA] space-y-3">
                    <span className="text-xs font-bold text-[#2D4030] uppercase tracking-wider block font-sans-body">
                      Mempelai Wanita
                    </span>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1 font-sans-body">
                        Nama Lengkap & Gelar
                      </label>
                      <input
                        type="text"
                        value={customization.brideName}
                        onChange={(e) => updateCustomization({ brideName: e.target.value })}
                        placeholder="cth. Beatrice Eleanor, S.Kom."
                        className="w-full text-xs px-3 py-2 bg-white border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1 font-sans-body">
                          Nama Panggilan
                        </label>
                        <input
                          type="text"
                          value={customization.brideNickname}
                          onChange={(e) => updateCustomization({ brideNickname: e.target.value })}
                          placeholder="Beatrice"
                          className="w-full text-xs px-3 py-2 bg-white border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1 font-sans-body">
                          Keterangan Orang Tua
                        </label>
                        <input
                          type="text"
                          value={customization.brideParents}
                          onChange={(e) => updateCustomization({ brideParents: e.target.value })}
                          placeholder="Putri Bpk. & Ibu..."
                          className="w-full text-xs px-3 py-2 bg-white border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Tab 2: Acara */}
              {activeFormTab === 'acara' && (
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1 font-sans-body">
                        Tanggal Acara
                      </label>
                      <input
                        type="date"
                        value={customization.weddingDate}
                        onChange={(e) => updateCustomization({ weddingDate: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-white border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1 font-sans-body">
                        Kota Penyelenggaraan
                      </label>
                      <input
                        type="text"
                        value={customization.venueCity}
                        onChange={(e) => updateCustomization({ venueCity: e.target.value })}
                        placeholder="Jakarta Selatan"
                        className="w-full text-xs px-3 py-2 bg-white border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1 font-sans-body">
                      Waktu Akad / Pemberkatan
                    </label>
                    <input
                      type="text"
                      value={customization.weddingTime}
                      onChange={(e) => updateCustomization({ weddingTime: e.target.value })}
                      placeholder="08:30 - 10:30 WIB"
                      className="w-full text-xs px-3 py-2 bg-white border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1 font-sans-body">
                      Waktu Resepsi
                    </label>
                    <input
                      type="text"
                      value={customization.receptionTime}
                      onChange={(e) => updateCustomization({ receptionTime: e.target.value })}
                      placeholder="18:30 - 21:30 WIB"
                      className="w-full text-xs px-3 py-2 bg-white border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1 font-sans-body">
                      Nama Venue / Gedung
                    </label>
                    <input
                      type="text"
                      value={customization.venueName}
                      onChange={(e) => updateCustomization({ venueName: e.target.value })}
                      placeholder="The Glasshouse Ballroom"
                      className="w-full text-xs px-3 py-2 bg-white border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1 font-sans-body">
                      Alamat Lengkap Venue
                    </label>
                    <textarea
                      rows={2}
                      value={customization.venueAddress}
                      onChange={(e) => updateCustomization({ venueAddress: e.target.value })}
                      placeholder="Jl. Gerbang Pemuda No.3..."
                      className="w-full text-xs px-3 py-2 bg-white border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                    />
                  </div>
                </div>
              )}

              {/* Form Tab 3: Kutipan & Tema */}
              {activeFormTab === 'kutipan' && (
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1 font-sans-body">
                      Kutipan Cinta / Ayat Doa
                    </label>
                    <textarea
                      rows={3}
                      value={customization.loveQuote}
                      onChange={(e) => updateCustomization({ loveQuote: e.target.value })}
                      placeholder="Tuliskan ayat atau kutipan romantis..."
                      className="w-full text-xs px-3 py-2 bg-white border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1 font-sans-body">
                      Musik Latar Pilihan
                    </label>
                    <select
                      value={customization.musicTitle}
                      onChange={(e) => updateCustomization({ musicTitle: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-white border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                    >
                      <option value="Canon in D (Violin & Piano Romantic Serenade)">
                        Canon in D (Violin & Piano Romantic Serenade)
                      </option>
                      <option value="A Thousand Years (Acoustic Cello)">
                        A Thousand Years (Acoustic Cello)
                      </option>
                      <option value="Until I Found You (Gentle Piano Ballad)">
                        Until I Found You (Gentle Piano Ballad)
                      </option>
                      <option value="Gending Sriwijaya / Tradisional Halus">
                        Gending Sriwijaya / Tradisional Halus
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1.5 font-sans-body">
                      Aksen Warna Tema
                    </label>
                    <div className="flex items-center gap-2">
                      {colorTones.map((tone) => (
                        <button
                          key={tone.color}
                          type="button"
                          onClick={() => updateCustomization({ selectedColorTone: tone.color })}
                          title={tone.name}
                          className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                            customization.selectedColorTone === tone.color
                              ? 'border-[#2D4030] scale-110 shadow-sm'
                              : 'border-white hover:scale-105'
                          }`}
                          style={{ backgroundColor: tone.color }}
                        >
                          {customization.selectedColorTone === tone.color && (
                            <Check className="w-3.5 h-3.5 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Checkout CTA Card */}
            <div className="bg-[#2D4030] text-white p-5 rounded-xl shadow-md flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-300 font-sans-body">
                  Total Biaya Undangan
                </span>
                <p className="font-mono-numbers text-xl font-bold text-amber-300">
                  {formatRupiah(selectedTemplate.price)}
                </p>
                <p className="text-[11px] text-stone-300 mt-0.5 font-sans-body">
                  Pembayaran otomatis via QRIS & Virtual Account
                </p>
              </div>
              <button
                onClick={() => setActiveTab('checkout')}
                className="bg-amber-300 text-stone-900 px-5 py-2.5 rounded-lg text-xs font-sans-body font-bold hover:bg-amber-200 transition-colors shadow flex items-center gap-2 whitespace-nowrap"
              >
                <span>Checkout Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Interactive Mockup Frame */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Viewport Toggle */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#E7E2DA] shadow-sm mb-4">
              <span className="text-xs text-stone-500 font-sans-body">Simulasi Layar:</span>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                  previewDevice === 'mobile'
                    ? 'bg-[#2D4030] text-white font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (Tamu)</span>
              </button>
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                  previewDevice === 'desktop'
                    ? 'bg-[#2D4030] text-white font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
            </div>

            {/* Simulated Device Frame */}
            <div
              className={`transition-all duration-300 bg-white rounded-2xl shadow-xl border border-[#DCD5C9] overflow-hidden ${
                previewDevice === 'mobile' ? 'w-full max-w-[390px]' : 'w-full'
              }`}
            >
              {/* Device Status Bar */}
              <div className="bg-[#1F2923] text-stone-300 px-4 py-2 flex items-center justify-between text-[11px] font-mono-numbers">
                <span className="font-semibold text-white">09:41</span>
                <span className="tracking-widest uppercase text-[10px] text-amber-300 font-sans-body">
                  Serenada Live Guest View
                </span>
                <span>100%</span>
              </div>

              {/* Invitation Content Area */}
              <div
                className="p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden"
                style={{
                  backgroundColor: selectedTemplate.palette.background,
                  color: '#1E2923',
                }}
              >
                {/* Decorative border frame */}
                <div
                  className="w-full border p-6 md:p-8 rounded-xl relative"
                  style={{ borderColor: `${customization.selectedColorTone}40` }}
                >
                  {/* Monogram Seal */}
                  <div
                    className="w-14 h-14 mx-auto rounded-full flex items-center justify-center font-serif-display text-xl font-bold mb-4 shadow-sm"
                    style={{
                      backgroundColor: customization.selectedColorTone,
                      color: '#FFFFFF',
                    }}
                  >
                    {groomInitial}&amp;{brideInitial}
                  </div>

                  <span
                    className="text-[11px] tracking-[0.25em] uppercase font-sans-body block mb-2"
                    style={{ color: customization.selectedColorTone }}
                  >
                    The Wedding Celebration Of
                  </span>

                  {/* Couple Names (Reacts Live!) */}
                  <h2 className="text-2xl sm:text-3xl font-serif-display font-medium text-[#1E2923] tracking-wide my-1">
                    {customization.groomNickname || 'Alexander'} &amp;{' '}
                    {customization.brideNickname || 'Beatrice'}
                  </h2>

                  <p className="text-xs font-sans-body text-stone-500 mt-1 max-w-xs mx-auto">
                    {customization.groomName} &amp; {customization.brideName}
                  </p>

                  <div className="w-12 h-px bg-stone-300 mx-auto my-4"></div>

                  {/* Countdown Badge */}
                  <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-stone-200 shadow-xs mb-5">
                    <Clock className="w-3.5 h-3.5 text-[#C29B38]" />
                    <span className="text-xs font-mono-numbers font-semibold text-stone-800">
                      {calculateDaysLeft()} Hari Menuju Selamanya
                    </span>
                  </div>

                  {/* Romantic Quote */}
                  <div className="max-w-sm mx-auto mb-6">
                    <p className="text-xs italic font-serif-display text-stone-600 leading-relaxed">
                      {customization.loveQuote}
                    </p>
                  </div>

                  {/* Schedule Card */}
                  <div className="bg-white/95 rounded-lg p-4 border border-stone-200/80 shadow-xs text-left space-y-3 mb-5">
                    <div className="flex items-start gap-3">
                      <Calendar
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: customization.selectedColorTone }}
                      />
                      <div>
                        <span className="text-xs font-semibold text-stone-800 block">
                          Hari &amp; Tanggal Acara
                        </span>
                        <span className="text-xs text-stone-600 font-mono-numbers">
                          {new Date(customization.weddingDate).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-t border-stone-100 pt-2.5">
                      <Clock
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: customization.selectedColorTone }}
                      />
                      <div>
                        <span className="text-xs font-semibold text-stone-800 block">
                          Rangkaian Acara
                        </span>
                        <span className="text-xs text-stone-600 block">
                          Akad: {customization.weddingTime}
                        </span>
                        <span className="text-xs text-stone-600 block">
                          Resepsi: {customization.receptionTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-t border-stone-100 pt-2.5">
                      <MapPin
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: customization.selectedColorTone }}
                      />
                      <div>
                        <span className="text-xs font-semibold text-stone-800 block">
                          {customization.venueName}
                        </span>
                        <span className="text-xs text-stone-500 leading-relaxed block">
                          {customization.venueAddress} ({customization.venueCity})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Background Music Player Simulation */}
                  <div className="bg-white/80 p-2.5 rounded-lg border border-stone-200 flex items-center justify-between text-xs text-stone-600">
                    <div className="flex items-center gap-2 truncate">
                      <Music className="w-3.5 h-3.5 text-[#2D4030] shrink-0" />
                      <span className="truncate">{customization.musicTitle}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-sans-body">Auto-play</span>
                  </div>

                  {/* Guest interactive RSVP button simulation */}
                  <div className="mt-5">
                    <button
                      onClick={() => setActiveTab('guest_preview')}
                      className="w-full py-2.5 rounded-lg text-xs font-sans-body font-semibold text-white shadow-sm transition-transform active:scale-98"
                      style={{ backgroundColor: customization.selectedColorTone }}
                    >
                      Buka Undangan Tamu Penuh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
