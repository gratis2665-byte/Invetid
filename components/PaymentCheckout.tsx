'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PaymentMethodType, Order } from '@/types';
import {
  CheckCircle2,
  Copy,
  Clock,
  QrCode,
  CreditCard,
  Building2,
  ArrowRight,
  ShieldCheck,
  Check,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export function PaymentCheckout() {
  const {
    selectedTemplate,
    customization,
    currentPaymentOrder,
    createOrderFromDraft,
    simulatePaymentSuccess,
    setActiveTab,
    showToast,
  } = useApp();

  // Customer contact state
  const [customerName, setCustomerName] = useState('Alexander Sterling');
  const [customerPhone, setCustomerPhone] = useState('081234567890');
  const [customerEmail, setCustomerEmail] = useState('alex.sterling@gmail.com');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('qris');
  const [isCopied, setIsCopied] = useState(false);

  // Countdown timer: 15 minutes (900 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(900);

  // Active order being paid is derived from currentPaymentOrder
  const activeOrder = currentPaymentOrder;

  // Timer countdown effect
  useEffect(() => {
    if (activeOrder?.status === 'PAID') return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeOrder?.status]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Generate order if not generated yet
  const handleProceedToGenerateOrder = () => {
    if (!customerName || !customerPhone || !customerEmail) {
      showToast('Harap lengkapi nama, nomor WhatsApp, dan email pemesan.', 'warning');
      return;
    }
    createOrderFromDraft({
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      paymentMethod,
    });
  };

  const handleCopyVA = (vaText: string) => {
    navigator.clipboard.writeText(vaText);
    setIsCopied(true);
    showToast(`Nomor Virtual Account ${vaText} berhasil disalin!`, 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSimulatePayment = () => {
    if (!activeOrder) return;
    simulatePaymentSuccess(activeOrder.id);
  };

  const vaBanks = [
    { id: 'va_bca', name: 'Bank BCA', logoText: 'BCA', prefix: '8801' },
    { id: 'va_mandiri', name: 'Bank Mandiri', logoText: 'MANDIRI', prefix: '8910' },
    { id: 'va_bri', name: 'Bank BRI', logoText: 'BRI', prefix: '8870' },
    { id: 'va_bni', name: 'Bank BNI', logoText: 'BNI', prefix: '8808' },
  ];

  // If already paid: render official digital receipt
  if (activeOrder && activeOrder.status === 'PAID') {
    return (
      <section className="w-full min-h-[calc(100vh-4.5rem)] bg-[#F7F4EE] py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#E7E2DA] shadow-lg overflow-hidden">
          {/* Receipt Header Banner */}
          <div className="bg-[#2D4030] text-white p-8 text-center relative overflow-hidden">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <span className="text-xs uppercase tracking-widest text-amber-300 font-sans-body font-semibold">
              Pembayaran Berhasil Diverifikasi
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif-display font-medium mt-1">
              Selamat, Undangan Digital Anda Aktif!
            </h1>
            <p className="text-xs text-stone-300 mt-2 font-sans-body max-w-md mx-auto">
              Sistem telah mendeteksi pelunasan otomatis. Undangan digital siap dibagikan kepada
              seluruh keluarga dan tamu undangan.
            </p>
          </div>

          {/* Receipt Body */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Order Details Grid */}
            <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#E7E2DA] space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-[#E7E2DA]">
                <span className="text-stone-500 font-sans-body">No. Transaksi / Order ID:</span>
                <span className="font-mono-numbers font-bold text-stone-800 text-sm">
                  #{activeOrder.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-sans-body">Template Undangan:</span>
                <span className="font-semibold text-stone-800 font-sans-body">
                  {activeOrder.template.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-sans-body">Nama Mempelai:</span>
                <span className="font-serif-display font-medium text-stone-900 text-sm">
                  {activeOrder.customization.groomNickname} &amp;{' '}
                  {activeOrder.customization.brideNickname}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-sans-body">Metode Pembayaran:</span>
                <span className="font-sans-body uppercase font-semibold text-[#2D4030]">
                  {activeOrder.paymentMethod.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-sans-body">Waktu Terverifikasi:</span>
                <span className="font-mono-numbers text-stone-700">
                  {activeOrder.paidAt ? new Date(activeOrder.paidAt).toLocaleString('id-ID') : 'Baru saja'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-[#E7E2DA] text-sm">
                <span className="font-semibold text-stone-800 font-sans-body">Total Lunas:</span>
                <span className="font-mono-numbers font-bold text-[#2D4030] text-base">
                  {formatRupiah(activeOrder.amount)}
                </span>
              </div>
            </div>

            {/* Generated Invitation Link */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block font-sans-body">
                Tautan Undangan Tamu Aktif:
              </span>
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-emerald-300 text-xs">
                <span className="font-mono-numbers text-emerald-900 truncate">
                  serenada.id/{activeOrder.invitationSlug}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://serenada.id/${activeOrder.invitationSlug}`);
                    showToast('Link undangan disalin ke clipboard!', 'success');
                  }}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold ml-2 whitespace-nowrap"
                >
                  Salin Link
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setActiveTab('guest_preview')}
                className="flex-1 bg-[#2D4030] text-white py-3 rounded-lg text-xs font-sans-body font-semibold hover:bg-[#3F5643] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Buka Undangan Tamu</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className="flex-1 bg-[#EFE9DF] text-[#2D4030] py-3 rounded-lg text-xs font-sans-body font-semibold hover:bg-[#E5DDCF] transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#8C7A58]" />
                <span>Lihat di Dashboard Admin</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-[calc(100vh-4.5rem)] bg-[#F7F4EE] py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb / Title */}
        <div className="mb-6">
          <div className="text-xs font-sans-body uppercase tracking-widest text-[#8C7A58] font-semibold mb-1">
            Pembayaran Otomatis
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-display text-[#1E2923]">
            Selesaikan Pemesanan Undangan Anda
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-sans-body mt-1">
            Transaksi diproses secara otomatis via QRIS Dinamis dan Virtual Account dengan verifikasi instan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Payment Method Selection & Instructions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Contact Information */}
            <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-sm space-y-3">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block font-sans-body">
                1. Data Pemesan / Kontak Pengantin
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 mb-1 font-sans-body">Nama Pemesan</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                    placeholder="Nama Lengkap"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-sans-body">Nomor WhatsApp</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                    placeholder="0812xxxx"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-stone-600 mb-1 font-sans-body">
                    Alamat Email (Untuk Pengiriman Akses &amp; Struk)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#2D4030]"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method Tabs */}
            <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-sm space-y-4">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block font-sans-body">
                2. Pilih Metode Pembayaran Otomatis
              </span>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    paymentMethod === 'qris'
                      ? 'border-[#2D4030] bg-[#FAF8F5] ring-1 ring-[#2D4030]'
                      : 'border-[#E7E2DA] hover:border-stone-400 bg-white'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-[#2D4030] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block font-sans-body">
                      QRIS Dinamis
                    </span>
                    <span className="text-[11px] text-stone-500 font-sans-body">
                      BCA, Mandiri, GoPay, OVO, ShopeePay
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('va_bca')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    paymentMethod.startsWith('va_')
                      ? 'border-[#2D4030] bg-[#FAF8F5] ring-1 ring-[#2D4030]'
                      : 'border-[#E7E2DA] hover:border-stone-400 bg-white'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-[#2D4030] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block font-sans-body">
                      Virtual Account
                    </span>
                    <span className="text-[11px] text-stone-500 font-sans-body">
                      BCA, Mandiri, BRI, BNI
                    </span>
                  </div>
                </button>
              </div>

              {/* Sub-selection if Virtual Account chosen */}
              {paymentMethod.startsWith('va_') && (
                <div className="pt-2">
                  <span className="text-xs font-medium text-stone-600 block mb-2 font-sans-body">
                    Pilih Bank Virtual Account:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {vaBanks.map((bank) => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setPaymentMethod(bank.id as PaymentMethodType)}
                        className={`p-2.5 rounded-lg border text-center text-xs transition-all ${
                          paymentMethod === bank.id
                            ? 'border-[#2D4030] bg-[#2D4030] text-white font-semibold'
                            : 'border-[#E7E2DA] bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {bank.logoText}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Payment Gateway Gateway Container */}
            <div className="bg-white p-6 rounded-xl border border-[#E7E2DA] shadow-sm space-y-5">
              {/* Countdown Alert Banner */}
              <div className="flex items-center justify-between p-3.5 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                <div className="flex items-center gap-2 text-amber-900">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="font-medium font-sans-body">Selesaikan pembayaran dalam:</span>
                </div>
                <span className="font-mono-numbers font-bold text-amber-800 text-sm">
                  {formatTimer(timeLeft)}
                </span>
              </div>

              {/* If QRIS */}
              {paymentMethod === 'qris' && (
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA]">
                  {/* Generated Dynamic QR Code Graphic */}
                  <div className="w-48 h-48 bg-white p-3 rounded-xl border border-stone-300 shadow-sm flex flex-col items-center justify-center shrink-0">
                    <div className="w-full flex justify-between items-center mb-1 text-[10px] font-bold text-stone-700">
                      <span>QRIS</span>
                      <span className="text-[9px] text-stone-400 font-mono-numbers">GPN</span>
                    </div>
                    {/* Simulated SVG QR Matrix */}
                    <div className="w-32 h-32 bg-stone-900 rounded p-1 flex items-center justify-center relative overflow-hidden">
                      <div className="grid grid-cols-5 gap-1 w-full h-full p-1 bg-white">
                        <div className="bg-stone-900 col-span-2 row-span-2"></div>
                        <div className="bg-stone-900"></div>
                        <div className="bg-stone-900 col-span-2 row-span-2"></div>
                        <div className="bg-stone-900"></div>
                        <div className="bg-stone-900"></div>
                        <div className="bg-stone-900 col-span-2"></div>
                        <div className="bg-stone-900"></div>
                        <div className="bg-stone-900 col-span-2 row-span-2"></div>
                        <div className="bg-stone-900"></div>
                        <div className="bg-stone-900"></div>
                        <div className="bg-stone-900 col-span-2"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                          <span className="font-serif-display text-[9px] font-bold text-[#2D4030]">
                            SRN
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] text-stone-500 mt-1 font-mono-numbers">
                      NMID: ID1020304050607
                    </span>
                  </div>

                  {/* QRIS Instructions */}
                  <div className="space-y-2 text-xs text-stone-700">
                    <span className="font-bold text-stone-900 block font-sans-body">
                      Cara Bayar dengan QRIS:
                    </span>
                    <ol className="list-decimal list-inside space-y-1 text-stone-600 font-sans-body">
                      <li>Buka aplikasi m-Banking (BCA, Mandiri, BRI, dll) atau E-Wallet (GoPay, OVO, ShopeePay, Dana).</li>
                      <li>Pilih menu <strong>Pindai / Scan QRIS</strong>.</li>
                      <li>Arahkan kamera ke kode QR di samping.</li>
                      <li>Periksa nama merchant: <strong>SERENADA WEDDING ATELIER</strong>.</li>
                      <li>Konfirmasi pembayaran sesuai total tagihan.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* If Virtual Account */}
              {paymentMethod.startsWith('va_') && (
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E7E2DA]">
                    <div>
                      <span className="text-xs text-stone-500 font-sans-body block">
                        Bank Virtual Account
                      </span>
                      <span className="text-sm font-bold text-stone-900 font-sans-body">
                        {paymentMethod === 'va_bca' && 'BCA Virtual Account'}
                        {paymentMethod === 'va_mandiri' && 'Mandiri Virtual Account'}
                        {paymentMethod === 'va_bri' && 'BRI Virtual Account'}
                        {paymentMethod === 'va_bni' && 'BNI Virtual Account'}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-medium rounded-md w-fit">
                      Verifikasi Otomatis
                    </span>
                  </div>

                  {/* VA Number & Copy Button */}
                  <div>
                    <label className="text-xs text-stone-500 font-sans-body block mb-1">
                      Nomor Virtual Account:
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white px-3.5 py-2.5 rounded-lg border border-stone-300 font-mono-numbers text-base font-bold text-[#1E2923] tracking-wider">
                        {activeOrder?.vaNumber || '880189421001'}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyVA(activeOrder?.vaNumber || '880189421001')
                        }
                        className="bg-[#2D4030] text-white px-4 py-2.5 rounded-lg text-xs font-sans-body font-semibold hover:bg-[#3F5643] transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin Nomor</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 font-sans-body space-y-1">
                    <p className="font-semibold text-stone-800">Petunjuk Pembayaran ATM / m-Banking:</p>
                    <p>1. Masuk ke m-Banking &gt; Transfer &gt; Virtual Account.</p>
                    <p>2. Masukkan nomor VA di atas dan pastikan nominal sesuai tagihan.</p>
                    <p>3. Konfirmasi pembayaran; status pesanan akan langsung aktif otomatis.</p>
                  </div>
                </div>
              )}

              {/* AUTOMATION SIMULATOR SECTION */}
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-300/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-sans-body text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>Simulator Pembayaran Otomatis</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-mono-numbers">
                    Auto-Polling Active
                  </span>
                </div>
                <p className="text-xs text-emerald-800 font-sans-body">
                  Uji coba integrasi pembayaran otomatis tanpa rekening riil. Klik tombol di bawah
                  untuk menyimulasikan notifikasi sukses dari sistem pembayaran.
                </p>
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="w-full bg-emerald-700 text-white py-2.5 rounded-lg text-xs font-sans-body font-bold hover:bg-emerald-800 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>⚡ Simulasi Pembayaran Berhasil (Konfirmasi Instan)</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-sm space-y-4 sticky top-24">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block font-sans-body pb-3 border-b border-[#E7E2DA]">
                Ringkasan Pesanan
              </span>

              {/* Template mini preview */}
              <div className="flex items-center gap-3.5 pb-4 border-b border-[#E7E2DA]">
                <div className="w-16 h-16 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] overflow-hidden shrink-0">
                  <img
                    src={selectedTemplate.coverImage}
                    alt={selectedTemplate.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-serif-display font-medium text-stone-900 text-sm">
                    {selectedTemplate.name}
                  </h4>
                  <p className="text-xs text-stone-500 font-sans-body">
                    {customization.groomNickname} &amp; {customization.brideNickname}
                  </p>
                  <span className="text-[11px] text-[#8C7A58] font-sans-body">
                    {selectedTemplate.category} Edition
                  </span>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 text-xs font-sans-body">
                <div className="flex justify-between text-stone-600">
                  <span>Harga Template Undangan:</span>
                  <span className="font-mono-numbers font-medium text-stone-800">
                    {formatRupiah(selectedTemplate.price)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Biaya Gateway Otomatis:</span>
                  <span className="text-emerald-700 font-medium font-sans-body">Gratis (Promo)</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Masa Aktif Undangan:</span>
                  <span className="text-stone-800 font-medium">Selamanya</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-[#E7E2DA] text-sm">
                  <span className="font-bold text-stone-900 font-sans-body">Total Pembayaran:</span>
                  <span className="font-mono-numbers font-bold text-[#2D4030] text-lg">
                    {formatRupiah(selectedTemplate.price)}
                  </span>
                </div>
              </div>

              {/* If no order generated yet: button to create draft order */}
              {!activeOrder ? (
                <button
                  type="button"
                  onClick={handleProceedToGenerateOrder}
                  className="w-full bg-[#2D4030] text-white py-3 rounded-lg text-xs font-sans-body font-semibold hover:bg-[#3F5643] transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Buat Tagihan Pembayaran</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="text-[11px] text-stone-500 text-center font-sans-body space-y-1 pt-1">
                  <p>
                    Status: <strong className="text-amber-700 uppercase">Menunggu Pembayaran</strong>
                  </p>
                  <p>Order ID: #{activeOrder.id}</p>
                </div>
              )}

              {/* Guarantees */}
              <div className="pt-3 border-t border-[#E7E2DA] text-[11px] text-stone-500 space-y-1.5 font-sans-body">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#3F5643] shrink-0" />
                  <span>Garansi aktif 100% tanpa batas waktu</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#3F5643] shrink-0" />
                  <span>Revisi teks nama &amp; jadwal kapan pun</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
