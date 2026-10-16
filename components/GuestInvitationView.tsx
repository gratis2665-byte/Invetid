'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Gift,
  Send,
  Sparkles,
  ChevronDown,
  Navigation,
  CheckCircle,
  Copy,
  ArrowLeft,
} from 'lucide-react';

export function GuestInvitationView() {
  const {
    customization,
    selectedTemplate,
    guestRSVPs,
    addGuestRSVP,
    setActiveTab,
    showToast,
  } = useApp();

  // RSVP Form State
  const [guestName, setGuestName] = useState('');
  const [attendance, setAttendance] = useState<'attending' | 'declined' | 'tentative'>('attending');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [wishes, setWishes] = useState('');
  const [isOpenEnvelope, setIsOpenEnvelope] = useState(false);

  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      showToast('Harap isi nama Anda untuk RSVP.', 'warning');
      return;
    }
    addGuestRSVP({
      guestName: guestName.trim(),
      attendance,
      guestCount,
      wishes: wishes.trim() || 'Selamat menempuh hidup baru!',
    });
    setGuestName('');
    setWishes('');
  };

  const groomInitial = customization.groomNickname?.charAt(0) || 'A';
  const brideInitial = customization.brideNickname?.charAt(0) || 'B';

  const attendingCount = guestRSVPs.filter((r) => r.attendance === 'attending').length;

  return (
    <div
      className="min-h-screen pb-20 relative selection:bg-amber-200"
      style={{ backgroundColor: selectedTemplate.palette.background }}
    >
      {/* Top Floating Simulator Navigation Bar */}
      <div className="sticky top-0 z-50 bg-[#1E3A8A]/95 backdrop-blur-md text-white py-2.5 px-6 border-b border-sky-400/20 flex items-center justify-between text-xs shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('studio')}
            className="flex items-center gap-1.5 text-sky-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Studio</span>
          </button>
          <span className="text-sky-400/50">|</span>
          <span className="text-sky-200 font-sans-body">
            Pratinjau Undangan Tamu: {customization.groomNickname} &amp; {customization.brideNickname}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-xs transition-colors"
          >
            Katalog
          </button>
        </div>
      </div>

      {/* Main Wedding Invitation Stage */}
      <div className="max-w-2xl mx-auto px-4 pt-8 space-y-12">
        {/* HERO / COVER SECTION */}
        <section className="bg-white rounded-3xl p-8 md:p-12 border border-[#E7E2DA] shadow-xl text-center relative overflow-hidden">
          {/* Subtle floral watermark effect */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#C29B38] to-transparent"></div>

          {/* Monogram Seal */}
          <div
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center font-serif-display text-2xl font-bold mb-6 shadow-md border-2 border-white"
            style={{
              backgroundColor: customization.selectedColorTone,
              color: '#FFFFFF',
            }}
          >
            {groomInitial}&amp;{brideInitial}
          </div>

          <span
            className="text-xs uppercase tracking-[0.3em] font-sans-body font-semibold block mb-3"
            style={{ color: customization.selectedColorTone }}
          >
            The Wedding Celebration Of
          </span>

          <h1 className="text-3xl sm:text-5xl font-serif-display font-medium text-[#1E2923] tracking-tight leading-tight my-2">
            {customization.groomNickname} &amp; {customization.brideNickname}
          </h1>

          <p className="text-sm font-sans-body text-stone-500 max-w-md mx-auto mt-2">
            Dengan penuh rasa syukur dan sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk hadir
            dan memberikan doa restu pada hari pernikahan kami.
          </p>

          <div className="w-16 h-px bg-[#DCD5C9] mx-auto my-6"></div>

          {/* Wedding Date Display */}
          <div className="inline-block bg-[#FAF8F5] px-6 py-2.5 rounded-full border border-[#E7E2DA] shadow-xs">
            <span className="font-serif-display text-base font-semibold text-stone-800">
              {new Date(customization.weddingDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </section>

        {/* ROMANTIC QUOTE SECTION */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#E7E2DA] shadow-xs text-center">
          <Heart className="w-5 h-5 mx-auto mb-3 text-[#C29B38]" />
          <blockquote className="font-serif-display text-base md:text-lg italic text-stone-700 max-w-lg mx-auto leading-relaxed">
            {customization.loveQuote}
          </blockquote>
        </section>

        {/* THE BRIDE & GROOM PROFILE */}
        <section className="bg-white rounded-2xl p-8 border border-[#E7E2DA] shadow-md space-y-8">
          <div className="text-center">
            <span
              className="text-xs uppercase tracking-widest font-semibold block mb-1 font-sans-body"
              style={{ color: customization.selectedColorTone }}
            >
              Kedua Mempelai
            </span>
            <h2 className="text-2xl font-serif-display text-[#1E2923]">Mempelai Pria &amp; Wanita</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            {/* Groom */}
            <div className="p-6 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA]/80 space-y-2">
              <div
                className="w-14 h-14 mx-auto rounded-full flex items-center justify-center font-serif-display text-xl font-bold text-white mb-3"
                style={{ backgroundColor: customization.selectedColorTone }}
              >
                {groomInitial}
              </div>
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                {customization.groomName}
              </h3>
              <p className="text-xs text-stone-500 font-sans-body">{customization.groomParents}</p>
            </div>

            {/* Bride */}
            <div className="p-6 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA]/80 space-y-2">
              <div
                className="w-14 h-14 mx-auto rounded-full flex items-center justify-center font-serif-display text-xl font-bold text-white mb-3"
                style={{ backgroundColor: customization.selectedColorTone }}
              >
                {brideInitial}
              </div>
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                {customization.brideName}
              </h3>
              <p className="text-xs text-stone-500 font-sans-body">{customization.brideParents}</p>
            </div>
          </div>
        </section>

        {/* SCHEDULE & VENUE SECTION */}
        <section className="bg-white rounded-2xl p-8 border border-[#E7E2DA] shadow-md space-y-6">
          <div className="text-center">
            <span
              className="text-xs uppercase tracking-widest font-semibold block mb-1 font-sans-body"
              style={{ color: customization.selectedColorTone }}
            >
              Waktu &amp; Lokasi Acara
            </span>
            <h2 className="text-2xl font-serif-display text-[#1E2923]">Rangkaian Acara Bahagia</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Akad */}
            <div className="p-6 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] space-y-3">
              <div className="flex items-center gap-2 text-stone-800 font-semibold font-serif-display text-base">
                <Clock className="w-4 h-4 text-[#C29B38]" />
                <span>Akad / Pemberkatan</span>
              </div>
              <p className="text-xs text-stone-600 font-sans-body">{customization.weddingTime}</p>
              <div className="text-xs text-stone-500 pt-2 border-t border-[#E7E2DA]">
                {customization.venueName}
              </div>
            </div>

            {/* Resepsi */}
            <div className="p-6 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] space-y-3">
              <div className="flex items-center gap-2 text-stone-800 font-semibold font-serif-display text-base">
                <Clock className="w-4 h-4 text-[#C29B38]" />
                <span>Resepsi Pernikahan</span>
              </div>
              <p className="text-xs text-stone-600 font-sans-body">{customization.receptionTime}</p>
              <div className="text-xs text-stone-500 pt-2 border-t border-[#E7E2DA]">
                {customization.venueName}
              </div>
            </div>
          </div>

          {/* Venue Location Address & Maps */}
          <div className="p-5 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] space-y-3">
            <div className="flex items-start gap-3">
              <MapPin
                className="w-5 h-5 mt-0.5 shrink-0"
                style={{ color: customization.selectedColorTone }}
              />
              <div className="flex-1">
                <h4 className="font-serif-display text-base font-bold text-stone-900">
                  {customization.venueName}
                </h4>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed font-sans-body">
                  {customization.venueAddress} — {customization.venueCity}
                </p>
              </div>
            </div>

            {/* Simulated Maps button */}
            <div className="pt-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  customization.venueName + ' ' + customization.venueAddress
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                <span>Petunjuk Arah Google Maps</span>
              </a>
            </div>
          </div>
        </section>

        {/* DIGITAL RSVP & GUESTBOOK WISHES */}
        <section className="bg-white rounded-2xl p-8 border border-[#E7E2DA] shadow-md space-y-6">
          <div className="text-center">
            <span
              className="text-xs uppercase tracking-widest font-semibold block mb-1 font-sans-body"
              style={{ color: customization.selectedColorTone }}
            >
              Konfirmasi Kehadiran
            </span>
            <h2 className="text-2xl font-serif-display text-[#1E2923]">Buku Tamu &amp; RSVP</h2>
            <p className="text-xs text-stone-500 font-sans-body mt-1">
              {attendingCount} Tamu telah mengonfirmasi kehadiran
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRSVPSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 font-sans-body">
                Nama Lengkap Anda
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="cth. Bima Satria &amp; Pasangan"
                className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DCD5C9] rounded-lg focus:outline-none focus:border-[#2D4030]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-sans-body">
                  Konfirmasi Kehadiran
                </label>
                <select
                  value={attendance}
                  onChange={(e) =>
                    setAttendance(e.target.value as 'attending' | 'declined' | 'tentative')
                  }
                  className="w-full text-xs px-3 py-2.5 bg-[#FAF8F5] border border-[#DCD5C9] rounded-lg focus:outline-none focus:border-[#2D4030]"
                >
                  <option value="attending">Hadir</option>
                  <option value="tentative">Masih Ragu</option>
                  <option value="declined">Berhalangan Hadir</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-sans-body">
                  Jumlah Orang
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value, 10) || 1)}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DCD5C9] rounded-lg font-mono-numbers focus:outline-none focus:border-[#2D4030]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 font-sans-body">
                Ucapan &amp; Doa Restu
              </label>
              <textarea
                rows={3}
                value={wishes}
                onChange={(e) => setWishes(e.target.value)}
                placeholder="Tuliskan doa restu untuk kedua mempelai..."
                className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DCD5C9] rounded-lg focus:outline-none focus:border-[#2D4030]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-xs font-sans-body font-semibold text-white shadow-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
              style={{ backgroundColor: customization.selectedColorTone }}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Konfirmasi Kehadiran &amp; Ucapan</span>
            </button>
          </form>

          {/* List of guest wishes */}
          <div className="pt-6 border-t border-[#E7E2DA] space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-stone-600 font-sans-body">
              Ucapan Doa Restu ({guestRSVPs.length})
            </h4>
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {guestRSVPs.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{rsvp.guestName}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        rsvp.attendance === 'attending'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rsvp.attendance === 'declined'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rsvp.attendance === 'attending' && `Hadir (${rsvp.guestCount} org)`}
                      {rsvp.attendance === 'declined' && 'Berhalangan'}
                      {rsvp.attendance === 'tentative' && 'Ragu'}
                    </span>
                  </div>
                  <p className="text-stone-600 font-sans-body italic">&ldquo;{rsvp.wishes}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WEDDING GIFT / DIGITAL ANGPAO */}
        <section className="bg-white rounded-2xl p-8 border border-[#E7E2DA] shadow-md text-center space-y-4">
          <Gift className="w-6 h-6 mx-auto text-[#C29B38]" />
          <h2 className="text-xl font-serif-display text-[#1E2923]">Kado Digital &amp; Doa Restu</h2>
          <p className="text-xs text-stone-500 font-sans-body max-w-md mx-auto">
            Doa restu Anda merupakan kado terindah bagi kami. Namun jika ingin memberikan tanda kasih
            secara cashless, Anda dapat menggunakan rekening digital di bawah ini:
          </p>

          <div className="max-w-sm mx-auto p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] space-y-2 text-xs">
            <span className="font-bold text-stone-800 block">BCA - Rekening Mempelai</span>
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-stone-300">
              <span className="font-mono-numbers font-bold text-stone-900 text-sm">
                8801 2345 6789
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('880123456789');
                  showToast('Nomor rekening disalin!', 'success');
                }}
                className="text-stone-600 hover:text-stone-900 font-semibold"
              >
                Salin
              </button>
            </div>
            <p className="text-[11px] text-stone-500">
              a.n. {customization.groomName} / {customization.brideName}
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center text-xs text-stone-400 py-6 font-sans-body space-y-1">
          <p>
            Dengan cinta, <strong>{customization.groomNickname} &amp; {customization.brideNickname}</strong>
          </p>
          <p className="text-[11px]">Diberdayakan oleh Serenada Wedding Atelier</p>
        </footer>
      </div>
    </div>
  );
}
