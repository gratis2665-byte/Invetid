'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { PaymentMethodType, Order } from '@/types';
import {
  CheckCircle2,
  Copy,
  Clock,
  QrCode,
  Building2,
  ArrowRight,
  ShieldCheck,
  Check,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Upload,
  Image as ImageIcon,
  MessageCircle,
  FileCheck,
  Phone,
} from 'lucide-react';

export function PaymentCheckout() {
  const {
    selectedTemplate,
    customization,
    currentPaymentOrder,
    createOrderFromDraft,
    submitPaymentProof,
    simulatePaymentSuccess,
    setActiveTab,
    showToast,
    adminWhatsApp,
  } = useApp();

  // Customer contact state
  const [customerName, setCustomerName] = useState('Alexander Sterling');
  const [customerPhone, setCustomerPhone] = useState('081234567890');
  const [customerEmail, setCustomerEmail] = useState('alex.sterling@gmail.com');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('qris');
  const [isCopied, setIsCopied] = useState(false);

  // Manual QRIS state
  const [proofFilePreview, setProofFilePreview] = useState<string | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const handleProceedToGenerateOrder = (proofImg?: string) => {
    if (!customerName || !customerPhone || !customerEmail) {
      showToast('Harap lengkapi nama, nomor WhatsApp, dan email pemesan.', 'warning');
      return null;
    }
    return createOrderFromDraft({
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      paymentMethod,
      paymentProofImage: proofImg || proofFilePreview || undefined,
    });
  };

  const handleCopyVA = (vaText: string) => {
    navigator.clipboard.writeText(vaText);
    setIsCopied(true);
    showToast(`Nomor Virtual Account ${vaText} berhasil disalin!`, 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSimulatePayment = () => {
    if (!activeOrder) {
      const generated = handleProceedToGenerateOrder();
      if (generated) simulatePaymentSuccess(generated.id);
      return;
    }
    simulatePaymentSuccess(activeOrder.id);
  };

  // Handle local file selection for payment proof
  const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (JPG, PNG, atau WebP).', 'warning');
      return;
    }

    setIsUploadingProof(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setProofFilePreview(result);
      setIsUploadingProof(false);
      showToast('Foto bukti pembayaran berhasil dimuat!', 'success');

      // If active order already exists, update its proof image
      if (activeOrder) {
        submitPaymentProof(activeOrder.id, result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Send WhatsApp confirmation to admin
  const handleSendProofToWhatsApp = () => {
    if (!customerName || !customerPhone || !customerEmail) {
      showToast('Harap lengkapi formulir kontak terlebih dahulu.', 'warning');
      return;
    }

    let currentOrder = activeOrder;
    if (!currentOrder) {
      currentOrder = handleProceedToGenerateOrder(proofFilePreview || undefined);
    } else if (proofFilePreview && !currentOrder.paymentProofImage) {
      submitPaymentProof(currentOrder.id, proofFilePreview);
    }

    if (!currentOrder) return;

    const cleanAdminPhone = adminWhatsApp.replace(/[^0-9]/g, '') || '6281234567890';
    const message = `Halo Admin Serenada, saya ingin konfirmasi pembayaran pesanan undangan pernikahan:
• No. Pesanan: #${currentOrder.id}
• Nama Pemesan: ${customerName}
• Mempelai: ${customization.groomNickname} & ${customization.brideNickname}
• Template: ${currentOrder.template.name}
• Total Tagihan: ${formatRupiah(currentOrder.amount)}
• Metode: QRIS Manual
• Status: Bukti transfer sudah saya upload di sistem.

Mohon diverifikasi pesanan saya agar undangan aktif. Terima kasih!`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${cleanAdminPhone}?text=${encoded}`;

    window.open(waUrl, '_blank');
    showToast('Membuka WhatsApp Admin Serenada...', 'info');
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
      <section className="w-full min-h-[calc(100vh-4.5rem)] bg-[#F0F7FD] py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#D4E5F5] shadow-lg overflow-hidden">
          {/* Receipt Header Banner */}
          <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-8 text-center relative overflow-hidden">
            <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
              <CheckCircle2 className="w-10 h-10 text-sky-200" />
            </div>
            <span className="text-xs uppercase tracking-widest text-sky-200 font-sans-body font-semibold">
              Pembayaran Berhasil Diverifikasi
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif-display font-medium mt-1">
              Selamat, Undangan Digital Anda Aktif!
            </h1>
            <p className="text-xs text-sky-100 mt-2 font-sans-body max-w-md mx-auto">
              Sistem telah mendeteksi pelunasan. Undangan digital siap dibagikan kepada seluruh
              keluarga dan tamu undangan.
            </p>
          </div>

          {/* Receipt Body */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Order Details Grid */}
            <div className="bg-[#F8FAFC] p-5 rounded-xl border border-[#D4E5F5] space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-[#D4E5F5]">
                <span className="text-stone-500 font-sans-body">No. Transaksi / Order ID:</span>
                <span className="font-mono-numbers font-bold text-[#1E3A8A] text-sm">
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
                <span className="font-semibold text-stone-800 font-sans-body">
                  {activeOrder.customization.groomNickname} &amp; {activeOrder.customization.brideNickname}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-sans-body">Tanggal Pernikahan:</span>
                <span className="font-mono-numbers text-stone-800">
                  {activeOrder.customization.weddingDate}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-sans-body">Metode Pembayaran:</span>
                <span className="font-semibold text-[#2563EB] font-sans-body uppercase">
                  {activeOrder.paymentMethod.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-[#D4E5F5]">
                <span className="text-stone-600 font-semibold font-sans-body">Total Dilunasi:</span>
                <span className="font-mono-numbers font-bold text-base text-[#1E3A8A]">
                  {formatRupiah(activeOrder.amount)}
                </span>
              </div>
            </div>

            {/* Public Link Generator Box */}
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 space-y-2">
              <span className="text-xs font-semibold text-[#1E3A8A] block font-sans-body">
                Tautan Website Undangan Anda:
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white px-3 py-2 rounded-lg border border-[#D4E5F5] font-mono-numbers text-xs text-stone-700 truncate">
                  https://serenada.id/u/{activeOrder.invitationSlug}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://serenada.id/u/${activeOrder.invitationSlug}`
                    );
                    showToast('Tautan undangan berhasil disalin!', 'success');
                  }}
                  className="bg-[#2563EB] text-white px-3 py-2 rounded-lg text-xs font-sans-body font-semibold hover:bg-[#1D4ED8] transition-colors whitespace-nowrap"
                >
                  Salin Tautan
                </button>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setActiveTab('guest_preview')}
                className="flex-1 bg-[#2563EB] text-white py-3 rounded-lg text-xs font-sans-body font-semibold hover:bg-[#1D4ED8] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Buka Pratinjau Undangan Tamu</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('catalog')}
                className="flex-1 bg-white border border-[#D4E5F5] text-[#1E3A8A] py-3 rounded-lg text-xs font-sans-body font-semibold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
              >
                <span>Kembali ke Katalog</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-[calc(100vh-4.5rem)] bg-[#F0F7FD] py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb / Title */}
        <div className="mb-6">
          <div className="text-xs font-sans-body uppercase tracking-widest text-[#2563EB] font-semibold mb-1">
            Pembayaran &amp; Checkout Undangan
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-display text-[#0F172A]">
            Selesaikan Pemesanan Undangan Anda
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-sans-body mt-1">
            Pilih metode pembayaran: QRIS Otomatis, QRIS Manual dengan Konfirmasi WhatsApp Admin,
            atau Transfer Virtual Account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Payment Method Selection & Instructions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Contact Information */}
            <div className="bg-white p-5 rounded-xl border border-[#D4E5F5] shadow-sm space-y-3">
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
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D4E5F5] rounded-md focus:outline-none focus:border-[#2563EB]"
                    placeholder="Nama Lengkap"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-sans-body">Nomor WhatsApp</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D4E5F5] rounded-md focus:outline-none focus:border-[#2563EB]"
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
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D4E5F5] rounded-md focus:outline-none focus:border-[#2563EB]"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method Tabs */}
            <div className="bg-white p-5 rounded-xl border border-[#D4E5F5] shadow-sm space-y-4">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block font-sans-body">
                2. Pilih Metode Pembayaran
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Method 1: QRIS Otomatis */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                    paymentMethod === 'qris'
                      ? 'border-[#2563EB] bg-[#EFF6FF] ring-1 ring-[#2563EB]'
                      : 'border-[#D4E5F5] hover:border-stone-400 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-[#2563EB] shrink-0" />
                    <span className="text-xs font-bold text-stone-900 font-sans-body">
                      QRIS Otomatis
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-sans-body leading-tight">
                    Scan instan, auto-verifikasi via gateway
                  </span>
                </button>

                {/* Method 2: QRIS Manual + WA Admin */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris_manual')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-2 relative ${
                    paymentMethod === 'qris_manual'
                      ? 'border-[#16A34A] bg-emerald-50 ring-1 ring-[#16A34A]'
                      : 'border-[#D4E5F5] hover:border-emerald-300 bg-white'
                  }`}
                >
                  <span className="absolute -top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                    Via WA Admin
                  </span>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-stone-900 font-sans-body">
                      QRIS Manual
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-sans-body leading-tight">
                    Upload bukti bayar &amp; kirim ke WA Admin
                  </span>
                </button>

                {/* Method 3: Virtual Account */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('va_bca')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                    paymentMethod.startsWith('va_')
                      ? 'border-[#2563EB] bg-[#EFF6FF] ring-1 ring-[#2563EB]'
                      : 'border-[#D4E5F5] hover:border-stone-400 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#2563EB] shrink-0" />
                    <span className="text-xs font-bold text-stone-900 font-sans-body">
                      Virtual Account
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-sans-body leading-tight">
                    BCA, Mandiri, BRI, BNI
                  </span>
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
                            ? 'border-[#2563EB] bg-[#2563EB] text-white font-semibold'
                            : 'border-[#D4E5F5] bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {bank.logoText}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Payment Gateway Container */}
            <div className="bg-white p-6 rounded-xl border border-[#D4E5F5] shadow-sm space-y-5">
              {/* Countdown Alert Banner */}
              <div className="flex items-center justify-between p-3.5 bg-sky-50 rounded-lg border border-sky-200 text-xs">
                <div className="flex items-center gap-2 text-[#1E3A8A]">
                  <Clock className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="font-medium font-sans-body">Selesaikan pembayaran dalam:</span>
                </div>
                <span className="font-mono-numbers font-bold text-[#1E3A8A] text-sm">
                  {formatTimer(timeLeft)}
                </span>
              </div>

              {/* SECTION: QRIS OTOMATIS */}
              {paymentMethod === 'qris' && (
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#F8FAFC] rounded-xl border border-[#D4E5F5]">
                  {/* Generated Dynamic QR Code Graphic */}
                  <div className="w-48 h-48 bg-white p-3 rounded-xl border border-[#D4E5F5] shadow-sm flex flex-col items-center justify-center shrink-0">
                    <div className="w-full flex justify-between items-center mb-1 text-[10px] font-bold text-stone-700">
                      <span>QRIS</span>
                      <span className="text-[9px] text-[#2563EB] font-mono-numbers">GPN</span>
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
                          <span className="font-serif-display text-[9px] font-bold text-[#1E3A8A]">
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
                      Cara Bayar dengan QRIS Otomatis:
                    </span>
                    <ol className="list-decimal list-inside space-y-1 text-stone-600 font-sans-body">
                      <li>Buka aplikasi m-Banking (BCA, Mandiri, BRI, dll) atau E-Wallet (GoPay, OVO, ShopeePay, Dana).</li>
                      <li>Pilih menu <strong>Pindai / Scan QRIS</strong>.</li>
                      <li>Arahkan kamera ke kode QR di samping.</li>
                      <li>Periksa merchant: <strong>SERENADA WEDDING ATELIER</strong>.</li>
                      <li>Sistem otomatis mendeteksi pelunasan dalam beberapa detik.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* SECTION: QRIS MANUAL + KIRIM BUKTI KE WA */}
              {paymentMethod === 'qris_manual' && (
                <div className="space-y-5 p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* QR Code */}
                    <div className="w-48 h-48 bg-white p-3 rounded-xl border border-emerald-200 shadow-sm flex flex-col items-center justify-center shrink-0">
                      <div className="w-full flex justify-between items-center mb-1 text-[10px] font-bold text-emerald-800">
                        <span>QRIS MANUAL</span>
                        <span className="text-[9px] text-emerald-600 font-semibold">Toko</span>
                      </div>
                      <div className="w-32 h-32 bg-stone-900 rounded p-1 flex items-center justify-center relative overflow-hidden">
                        <div className="grid grid-cols-5 gap-1 w-full h-full p-1 bg-white">
                          <div className="bg-emerald-900 col-span-2 row-span-2"></div>
                          <div className="bg-emerald-900"></div>
                          <div className="bg-emerald-900 col-span-2 row-span-2"></div>
                          <div className="bg-emerald-900"></div>
                          <div className="bg-emerald-900"></div>
                          <div className="bg-emerald-900 col-span-2"></div>
                          <div className="bg-emerald-900"></div>
                          <div className="bg-emerald-900 col-span-2 row-span-2"></div>
                          <div className="bg-emerald-900"></div>
                          <div className="bg-emerald-900"></div>
                          <div className="bg-emerald-900 col-span-2"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow">
                            <span className="font-serif-display text-[9px] font-bold text-emerald-800">
                              WA
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] text-stone-500 mt-1 font-mono-numbers">
                        Merchant: SERENADA ATELIER
                      </span>
                    </div>

                    {/* Step-by-step for Manual QRIS */}
                    <div className="space-y-2 text-xs text-stone-700 flex-1">
                      <span className="font-bold text-emerald-900 block font-sans-body">
                        Alur Pembayaran Manual QRIS &amp; WhatsApp:
                      </span>
                      <ol className="list-decimal list-inside space-y-1 text-stone-600 font-sans-body">
                        <li>Scan QRIS di samping melalui m-Banking atau E-Wallet apa pun.</li>
                        <li>Kirim nominal tepat <strong>{formatRupiah(selectedTemplate.price)}</strong>.</li>
                        <li>Simpan screenshot bukti transfer / struk pembayaran.</li>
                        <li>Upload foto bukti pada kotak di bawah.</li>
                        <li>Klik <strong>&ldquo;Kirim Bukti Pembayaran ke WhatsApp Admin&rdquo;</strong> untuk verifikasi instan.</li>
                      </ol>
                    </div>
                  </div>

                  {/* Upload Proof Box */}
                  <div className="pt-2 border-t border-emerald-200">
                    <label className="block text-xs font-semibold text-emerald-900 mb-2 font-sans-body">
                      Unggah Foto Bukti Transfer / Struk:
                    </label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProofFileChange}
                      className="hidden"
                    />

                    {proofFilePreview ? (
                      <div className="p-3 bg-white rounded-xl border border-emerald-300 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-emerald-200 bg-stone-100 shrink-0">
                            <img
                              src={proofFilePreview}
                              alt="Bukti Transfer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-stone-800 block flex items-center gap-1.5">
                              <FileCheck className="w-4 h-4 text-emerald-600" />
                              Foto Bukti Siap Dikirim
                            </span>
                            <span className="text-[11px] text-stone-500">
                              Tersimpan &amp; akan dilampirkan ke konfirmasi admin
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Ganti Foto
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="p-6 bg-white rounded-xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 cursor-pointer text-center transition-all flex flex-col items-center justify-center gap-2 group"
                      >
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-stone-800 block">
                            Klik untuk upload foto bukti transfer dari galeri HP/laptop
                          </span>
                          <span className="text-[11px] text-stone-400">
                            Mendukung format JPG, PNG, atau screenshot
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Direct WhatsApp Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSendProofToWhatsApp}
                      className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white py-3 rounded-xl text-xs font-sans-body font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Kirim Bukti Pembayaran ke WhatsApp Admin</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                    <p className="text-[11px] text-stone-500 text-center mt-1.5 font-sans-body">
                      Nomor WA Admin tujuan: <strong>+{adminWhatsApp}</strong>. Pesan template akan otomatis terisi rapi.
                    </p>
                  </div>
                </div>
              )}

              {/* SECTION: VIRTUAL ACCOUNT */}
              {paymentMethod.startsWith('va_') && (
                <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#D4E5F5] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D4E5F5]">
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
                    <span className="px-2.5 py-1 bg-sky-100 text-[#1E3A8A] text-[11px] font-medium rounded-md w-fit">
                      Verifikasi Otomatis
                    </span>
                  </div>

                  {/* VA Number & Copy Button */}
                  <div>
                    <label className="text-xs text-stone-500 font-sans-body block mb-1">
                      Nomor Virtual Account:
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white px-3.5 py-2.5 rounded-lg border border-[#D4E5F5] font-mono-numbers text-base font-bold text-[#1E3A8A] tracking-wider">
                        {activeOrder?.vaNumber || '880189421001'}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyVA(activeOrder?.vaNumber || '880189421001')
                        }
                        className="bg-[#2563EB] text-white px-4 py-2.5 rounded-lg text-xs font-sans-body font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-sky-200" />
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
                    <p>2. Masukkan nomor VA di atas dan pastikan nominal tagihan sesuai.</p>
                    <p>3. Konfirmasi pembayaran; status pesanan akan langsung aktif otomatis.</p>
                  </div>
                </div>
              )}

              {/* AUTOMATION SIMULATOR SECTION */}
              <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#1E3A8A] font-sans-body text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#2563EB]" />
                    <span>Simulator Pembayaran Otomatis</span>
                  </div>
                  <span className="text-[11px] text-[#2563EB] font-mono-numbers">
                    Auto-Polling Active
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-sans-body">
                  Uji coba integrasi pembayaran otomatis tanpa rekening riil. Klik tombol di bawah
                  untuk menyimulasikan notifikasi sukses dari sistem pembayaran.
                </p>
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="w-full bg-[#2563EB] text-white py-2.5 rounded-lg text-xs font-sans-body font-bold hover:bg-[#1D4ED8] transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-sky-200" />
                  <span>⚡ Simulasi Pembayaran Berhasil (Konfirmasi Instan)</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-[#D4E5F5] shadow-sm space-y-4 sticky top-24">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block font-sans-body pb-3 border-b border-[#D4E5F5]">
                Ringkasan Pesanan Undangan
              </span>

              {/* Selected template snapshot */}
              <div className="flex gap-3">
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-stone-100 border border-[#D4E5F5] shrink-0">
                  <img
                    src={selectedTemplate.coverImage}
                    alt={selectedTemplate.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[11px] text-[#2563EB] font-medium font-sans-body">
                    {selectedTemplate.category} Edition
                  </span>
                  <h4 className="font-serif-display font-semibold text-stone-900 text-sm">
                    {selectedTemplate.name}
                  </h4>
                  <div className="text-xs text-stone-600 font-sans-body">
                    Mempelai: <strong>{customization.groomNickname} &amp; {customization.brideNickname}</strong>
                  </div>
                  <div className="text-[11px] text-stone-400 font-mono-numbers">
                    {customization.weddingDate}
                  </div>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="pt-3 border-t border-[#D4E5F5] space-y-2 text-xs">
                <div className="flex justify-between text-stone-600 font-sans-body">
                  <span>Harga Paket Template</span>
                  <span className="font-mono-numbers font-medium">
                    {formatRupiah(selectedTemplate.price)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 font-sans-body">
                  <span>Biaya Setup Domain &amp; Hosting</span>
                  <span className="text-emerald-600 font-semibold">GRATIS</span>
                </div>
                <div className="flex justify-between text-stone-600 font-sans-body">
                  <span>Biaya Layanan Gateway</span>
                  <span className="text-emerald-600 font-semibold">Rp 0</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-[#D4E5F5]">
                  <span className="font-bold text-stone-900 font-sans-body">Total Tagihan:</span>
                  <span className="font-mono-numbers font-bold text-lg text-[#1E3A8A]">
                    {formatRupiah(selectedTemplate.price)}
                  </span>
                </div>
              </div>

              {/* Security reassurance */}
              <div className="pt-2 border-t border-[#D4E5F5] flex items-center gap-2 text-stone-500 text-[11px] font-sans-body">
                <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>Transaksi dijamin aman dengan enkripsi SSL 256-bit dan verifikasi resmi.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
