'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Order, OrderStatus, TemplateCategory, WeddingTemplate } from '@/types';
import {
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Plus,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  Edit2,
  RotateCcw,
  Sparkles,
  Link2,
  Upload,
  Image as ImageIcon,
  MessageCircle,
  FileCheck,
  Phone,
  Save,
  Check,
} from 'lucide-react';

export function AdminDashboard() {
  const {
    orders,
    templates,
    updateOrderStatus,
    deleteOrder,
    addNewTemplate,
    updateTemplatePrice,
    updateTemplateDemoUrl,
    toggleTemplateActive,
    resetAllDataToDefault,
    setActiveTab,
    showToast,
    adminWhatsApp,
    updateAdminWhatsApp,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'catalog' | 'demo_links' | 'settings_wa'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // WhatsApp Admin setting state
  const [waInput, setWaInput] = useState(adminWhatsApp);

  // New Template Modal state
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState<TemplateCategory>('Botanical');
  const [newTemplatePrice, setNewTemplatePrice] = useState('399000');
  const [newTemplateImage, setNewTemplateImage] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCo571UP2gHgWqg99u32j8iUzCPh-4W-sLFH45XGI72cpMHEHMiu3BUOAnUs5AL0Qi30-fjl-znXnoIgeySPw3EPOim984cE-2HDg__BC_yPOv43GcZeF3B1dApyHzqwRjfyPBHqiI6Sc0iM08d1xkWFfvRjJtmpRMVF1QrKBQHvnV0DaJfbotwa4ubrN9d9JaJT0Ih-B8OKBv2iuJMhPeCt7Ag_9auYv5gEsarJKY7FydiE05eUKE'
  );
  const [newTemplateDesc, setNewTemplateDesc] = useState('Undangan digital pernikahan bernuansa mewah nan anggun.');
  const [newTemplateDemoUrl, setNewTemplateDemoUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Demo URL inputs state for inline editing
  const [demoUrlInputs, setDemoUrlInputs] = useState<Record<string, string>>({});

  // Inline editing of price state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPriceInput, setTempPriceInput] = useState<string>('');

  // Format currency
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // KPI calculations
  const totalRevenue = orders
    .filter((o) => o.status === 'PAID' || o.status === 'IN_PROCESSING' || o.status === 'COMPLETED')
    .reduce((sum, o) => sum + o.amount, 0);

  const pendingCount = orders.filter((o) => o.status === 'PENDING_PAYMENT').length;
  const paidCount = orders.filter((o) => o.status === 'PAID').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;
  const manualProofsCount = orders.filter((o) => Boolean(o.paymentProofImage)).length;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    let matchesStatus = true;
    if (statusFilter === 'PROOF_UPLOADED') {
      matchesStatus = Boolean(order.paymentProofImage);
    } else if (statusFilter !== 'ALL') {
      matchesStatus = order.status === statusFilter;
    }
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customization.groomNickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customization.brideNickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle local file upload via FileReader (from phone gallery or laptop)
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar yang valid (JPG, PNG, WebP)', 'warning');
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setNewTemplateImage(result);
      showToast(`Foto "${file.name}" berhasil dimuat!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleCreateNewTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim()) {
      showToast('Nama template tidak boleh kosong', 'warning');
      return;
    }
    const priceNum = parseInt(newTemplatePrice, 10) || 350000;
    addNewTemplate({
      name: newTemplateName,
      category: newTemplateCategory,
      price: priceNum,
      originalPrice: priceNum + 150000,
      coverImage: newTemplateImage,
      description: newTemplateDesc,
      badge: 'Baru',
      palette: {
        primary: '#1E3A8A',
        secondary: '#38BDF8',
        background: '#F0F7FD',
        card: '#FFFFFF',
        accent: '#2563EB',
      },
      features: ['Galeri Foto HD', 'Musik Auto-play', 'RSVP & Tamu', 'Navigasi Peta'],
      isActive: true,
      demoUrl: newTemplateDemoUrl.trim() || undefined,
    });
    setIsAddTemplateModalOpen(false);
    setNewTemplateName('');
    setNewTemplateDemoUrl('');
    setUploadedFileName('');
  };

  const handleSavePriceEdit = (tmplId: string) => {
    const val = parseInt(tempPriceInput, 10);
    if (!isNaN(val) && val > 0) {
      updateTemplatePrice(tmplId, val);
      setEditingPriceId(null);
    } else {
      showToast('Masukkan nominal harga yang valid', 'warning');
    }
  };

  const handleSaveWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminWhatsApp(waInput);
  };

  const getStatusBadge = (status: OrderStatus, hasProof?: boolean) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            LUNAS
          </span>
        );
      case 'PENDING_PAYMENT':
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              MENUNGGU BAYAR
            </span>
            {hasProof && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-[#1E3A8A] border border-sky-200">
                <FileCheck className="w-3 h-3 text-[#2563EB]" />
                BUKTI TERSEDIA
              </span>
            )}
          </div>
        );
      case 'IN_PROCESSING':
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-sky-100 text-[#1E3A8A] border border-sky-200">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              VERIFIKASI BUKTI
            </span>
            {hasProof && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <FileCheck className="w-3 h-3 text-emerald-600" />
                BUKTI DIUNGGAH
              </span>
            )}
          </div>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
            SELESAI &amp; AKTIF
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            DIBATALKAN
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="w-full min-h-[calc(100vh-4.5rem)] bg-[#F0F7FD] py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#D4E5F5]">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans-body uppercase tracking-widest text-[#2563EB] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
              <span>Pusat Kendali Pengelola</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-display text-[#0F172A] mt-1">
              Dashboard Manajemen Serenada
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-sans-body mt-1">
              Kelola pesanan pelanggan, upload foto katalog dari galeri HP/laptop, atur nomor WhatsApp
              Admin, dan kelola link demo.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('catalog')}
              className="px-4 py-2 bg-white hover:bg-stone-50 border border-[#D4E5F5] text-[#1E3A8A] text-xs font-sans-body font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Lihat Toko Publik</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#3B82F6]" />
            </button>
            <button
              onClick={resetAllDataToDefault}
              className="px-3.5 py-2 bg-white hover:bg-rose-50 border border-[#D4E5F5] hover:border-rose-300 text-stone-600 hover:text-rose-700 text-xs font-sans-body font-medium rounded-lg transition-colors flex items-center gap-1.5"
              title="Reset data demo kembali ke bawaan pabrik"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Data Demo</span>
            </button>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#D4E5F5] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-sans-body uppercase tracking-wider block">
                Total Pendapatan
              </span>
              <span className="text-xl font-bold font-mono-numbers text-[#1E3A8A] mt-1 block">
                {formatRupiah(totalRevenue)}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>Otomatis &amp; Terverifikasi</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#2563EB] flex items-center justify-center shrink-0 border border-sky-100">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#D4E5F5] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-sans-body uppercase tracking-wider block">
                Menunggu Verifikasi
              </span>
              <span className="text-xl font-bold font-mono-numbers text-amber-700 mt-1 block">
                {pendingCount} Pesanan
              </span>
              <span className="text-[11px] text-stone-500 mt-1 block">
                {manualProofsCount} bukti transfer terlampir
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#D4E5F5] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-sans-body uppercase tracking-wider block">
                Pesanan Lunas
              </span>
              <span className="text-xl font-bold font-mono-numbers text-emerald-700 mt-1 block">
                {paidCount} Pesanan
              </span>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                Siap kirim ke tamu
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#D4E5F5] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-sans-body uppercase tracking-wider block">
                Katalog Template
              </span>
              <span className="text-xl font-bold font-mono-numbers text-stone-900 mt-1 block">
                {templates.length} Desain
              </span>
              <span className="text-[11px] text-stone-500 mt-1 block">
                {templates.filter((t) => t.isActive).length} tayang di etalase
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-stone-50 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#D4E5F5] pb-2 text-xs font-sans-body font-semibold">
          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeAdminTab === 'orders'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-[#D4E5F5]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Manajemen Pesanan</span>
            {pendingCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-mono-numbers ${
                  activeAdminTab === 'orders'
                    ? 'bg-white text-[#2563EB]'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('catalog')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeAdminTab === 'catalog'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-[#D4E5F5]'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Katalog &amp; Upload Foto</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('demo_links')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeAdminTab === 'demo_links'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-[#D4E5F5]'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Pengaturan Link Demo</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('settings_wa')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeAdminTab === 'settings_wa'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-[#D4E5F5]'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Pengaturan WA &amp; QRIS Admin</span>
          </button>
        </div>

        {/* TAB 1: ORDER MANAGEMENT */}
        {activeAdminTab === 'orders' && (
          <div className="bg-white rounded-xl border border-[#D4E5F5] shadow-sm overflow-hidden">
            {/* Filter and search bar */}
            <div className="p-4 sm:p-5 border-b border-[#D4E5F5] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F8FAFC]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-stone-600 font-sans-body flex items-center gap-1.5 mr-2">
                  <Filter className="w-3.5 h-3.5 text-stone-400" />
                  Status:
                </span>
                {['ALL', 'PENDING_PAYMENT', 'PROOF_UPLOADED', 'PAID', 'COMPLETED', 'CANCELLED'].map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`text-xs px-2.5 py-1 rounded-md transition-all font-sans-body ${
                        statusFilter === st
                          ? 'bg-[#2563EB] text-white font-semibold shadow-xs'
                          : 'bg-white border border-[#D4E5F5] text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      {st === 'ALL' && 'Semua'}
                      {st === 'PENDING_PAYMENT' && 'Menunggu Bayar'}
                      {st === 'PROOF_UPLOADED' && 'Ada Bukti Bayar'}
                      {st === 'PAID' && 'Lunas'}
                      {st === 'COMPLETED' && 'Selesai'}
                      {st === 'CANCELLED' && 'Batal'}
                    </button>
                  )
                )}
              </div>

              {/* Search bar */}
              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari No Order, Nama, Mempelai..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#D4E5F5] rounded-md focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#D4E5F5] text-stone-500 font-sans-body uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">No. Order</th>
                    <th className="py-3 px-4">Pemesan</th>
                    <th className="py-3 px-4">Mempelai</th>
                    <th className="py-3 px-4">Template</th>
                    <th className="py-3 px-4">Metode Bayar</th>
                    <th className="py-3 px-4">Tagihan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F7FD] font-sans-body">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-stone-400">
                        Tidak ada pesanan yang sesuai dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono-numbers font-bold text-[#1E3A8A]">
                          #{order.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-stone-900">{order.customerName}</div>
                          <div className="text-[11px] text-stone-500">{order.customerPhone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-stone-800">
                            {order.customization.groomNickname} &amp; {order.customization.brideNickname}
                          </span>
                          <span className="block text-[11px] text-stone-400 font-mono-numbers">
                            {order.customization.weddingDate}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-stone-800">{order.template.name}</span>
                          <span className="block text-[10px] text-[#2563EB]">
                            {order.template.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono-numbers uppercase text-stone-700 font-medium">
                            {order.paymentMethod === 'qris_manual' ? 'QRIS Manual (WA)' : order.paymentMethod.replace('_', ' ')}
                          </span>
                          {order.paymentProofImage && (
                            <span className="block text-[10px] text-emerald-600 font-semibold">
                              ● Bukti terlampir
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono-numbers font-bold text-stone-900">
                          {formatRupiah(order.amount)}
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(order.status, Boolean(order.paymentProofImage))}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedOrderDetails(order)}
                              className="p-1.5 bg-[#EFF6FF] text-[#1E3A8A] hover:bg-[#DBEAFE] rounded-md transition-colors"
                              title="Lihat Detail Pesanan &amp; Bukti Transfer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {order.status !== 'PAID' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'PAID')}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                                title="Tandai Sudah Lunas"
                              >
                                Tandai Lunas
                              </button>
                            )}

                            <button
                              onClick={() => deleteOrder(order.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="Hapus Pesanan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CATALOG & PHOTO UPLOAD MANAGEMENT */}
        {activeAdminTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-serif-display font-medium text-stone-900">
                  Koleksi Template Undangan &amp; Pengunggahan Foto
                </h3>
                <p className="text-xs text-stone-500 font-sans-body">
                  Kelola foto template (upload langsung dari galeri HP/laptop), ubah harga, dan status tayang di etalase.
                </p>
              </div>
              <button
                onClick={() => setIsAddTemplateModalOpen(true)}
                className="bg-[#2563EB] text-white px-4 py-2.5 rounded-lg text-xs font-sans-body font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Upload &amp; Tambah Template Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`bg-white rounded-xl border p-4 shadow-xs transition-all ${
                    template.isActive ? 'border-[#D4E5F5]' : 'border-stone-300 opacity-60 bg-stone-50'
                  }`}
                >
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-[#F8FAFC] mb-3 border border-[#D4E5F5]">
                    <img
                      src={template.coverImage}
                      alt={template.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center -z-10"
                      style={{ backgroundColor: template.palette.background }}
                    >
                      <span className="font-serif-display font-bold text-stone-800">
                        {template.name}
                      </span>
                    </div>

                    <span className="absolute top-2 left-2 text-[10px] uppercase font-bold bg-white/95 px-2 py-0.5 rounded text-[#1E3A8A] shadow-xs">
                      {template.category}
                    </span>

                    <span className="absolute top-2 right-2 text-[10px] font-mono-numbers bg-stone-900/80 text-white px-2 py-0.5 rounded">
                      {template.salesCount} Terjual
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif-display font-semibold text-stone-900 text-sm">
                        {template.name}
                      </h4>
                      <button
                        onClick={() => toggleTemplateActive(template.id)}
                        title={template.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          template.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {template.isActive ? 'Aktif' : 'Non-Aktif'}
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>

                    {/* Price editor */}
                    <div className="pt-2 border-t border-[#D4E5F5] flex items-center justify-between">
                      <span className="text-xs text-stone-500 font-sans-body">Harga Katalog:</span>
                      {editingPriceId === template.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={tempPriceInput}
                            onChange={(e) => setTempPriceInput(e.target.value)}
                            className="w-24 px-2 py-1 text-xs border border-[#D4E5F5] rounded font-mono-numbers"
                          />
                          <button
                            onClick={() => handleSavePriceEdit(template.id)}
                            className="px-2 py-1 bg-[#2563EB] text-white text-[11px] rounded"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="text-stone-400 hover:text-stone-600 text-xs"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono-numbers font-bold text-[#1E3A8A] text-sm">
                            {formatRupiah(template.price)}
                          </span>
                          <button
                            onClick={() => {
                              setEditingPriceId(template.id);
                              setTempPriceInput(template.price.toString());
                            }}
                            className="p-1 text-stone-400 hover:text-stone-700"
                            title="Ubah Harga"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DEMO LINKS MANAGEMENT */}
        {activeAdminTab === 'demo_links' && (
          <div className="bg-white rounded-xl border border-[#D4E5F5] shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D4E5F5]">
              <div>
                <h3 className="text-base font-serif-display font-medium text-stone-900 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-[#2563EB]" />
                  <span>Pengaturan Link Demo Website Jadi</span>
                </h3>
                <p className="text-xs text-stone-500 font-sans-body mt-0.5 max-w-2xl">
                  Tautkan URL website undangan pernikahan riil yang sudah jadi. Jika diisi, tombol
                  &ldquo;Lihat Demo&rdquo; akan otomatis tampil di kartu katalog produk calon pengantin.
                  Jika dikosongkan, tombol demo akan disembunyikan secara otomatis.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono-numbers px-2.5 py-1 rounded bg-[#F8FAFC] border border-[#D4E5F5] text-stone-700">
                  {templates.filter((t) => t.demoUrl && t.demoUrl.trim().length > 0).length} / {templates.length} Terpasang
                </span>
              </div>
            </div>

            {/* List / Table of templates with demo URL inputs */}
            <div className="space-y-4">
              {templates.map((template) => {
                const currentVal =
                  demoUrlInputs[template.id] !== undefined
                    ? demoUrlInputs[template.id]
                    : template.demoUrl || '';
                const hasDemo = template.demoUrl && template.demoUrl.trim().length > 0;

                return (
                  <div
                    key={template.id}
                    className="p-4 rounded-xl border border-[#D4E5F5] bg-[#F8FAFC] hover:bg-white transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left: Thumbnail & Name */}
                    <div className="flex items-center gap-3.5 md:w-1/3 shrink-0">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 border border-[#D4E5F5] shrink-0">
                        <img
                          src={template.coverImage}
                          alt={template.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="font-serif-display font-semibold text-stone-900 text-sm">
                          {template.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-[#2563EB] font-sans-body font-medium">
                            {template.category}
                          </span>
                          <span className="text-stone-300">·</span>
                          {hasDemo ? (
                            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                              Demo Aktif
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400 font-sans-body">
                              Tombol Demo Disembunyikan
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle: URL Input Field */}
                    <div className="flex-1">
                      <div className="relative">
                        <Link2 className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          value={currentVal}
                          onChange={(e) =>
                            setDemoUrlInputs((prev) => ({
                              ...prev,
                              [template.id]: e.target.value,
                            }))
                          }
                          placeholder="https://contoh-undangan.serenada.id"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D4E5F5] rounded-lg focus:outline-none focus:border-[#2563EB] font-mono-numbers text-stone-800"
                        />
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          updateTemplateDemoUrl(template.id, currentVal);
                        }}
                        className="bg-[#2563EB] text-white px-3.5 py-2 rounded-lg text-xs font-sans-body font-semibold hover:bg-[#1D4ED8] transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <span>Simpan Link</span>
                      </button>

                      {hasDemo && (
                        <a
                          href={template.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white border border-[#D4E5F5] text-stone-700 hover:text-[#2563EB] hover:border-[#2563EB] px-3 py-2 rounded-lg text-xs font-sans-body font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                          title="Uji buka link di tab baru"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#3B82F6]" />
                          <span>Tes Buka</span>
                        </a>
                      )}

                      {hasDemo && (
                        <button
                          type="button"
                          onClick={() => {
                            updateTemplateDemoUrl(template.id, '');
                            setDemoUrlInputs((prev) => ({ ...prev, [template.id]: '' }));
                          }}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Link Demo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: WHATSAPP & MANUAL QRIS SETTINGS */}
        {activeAdminTab === 'settings_wa' && (
          <div className="bg-white rounded-xl border border-[#D4E5F5] shadow-sm p-6 space-y-6 max-w-3xl">
            <div className="pb-4 border-b border-[#D4E5F5]">
              <h3 className="text-base font-serif-display font-medium text-stone-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>Pengaturan WhatsApp Admin &amp; Pembayaran QRIS Manual</span>
              </h3>
              <p className="text-xs text-stone-500 font-sans-body mt-1">
                Atur nomor WhatsApp admin yang akan menerima kiriman foto bukti transfer dari pembeli,
                lengkap dengan draf konfirmasi pesanan otomatis.
              </p>
            </div>

            <form onSubmit={handleSaveWhatsApp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-sans-body">
                  Nomor WhatsApp Admin (Dengan Kode Negara, contoh: 6281234567890)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={waInput}
                    onChange={(e) => setWaInput(e.target.value)}
                    placeholder="6281234567890"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F8FAFC] border border-[#D4E5F5] rounded-lg focus:outline-none focus:border-[#2563EB] font-mono-numbers text-stone-800"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Gunakan format internasional tanpa spasi atau tanda plus (+), cth: <code>6281299998888</code>.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-2">
                <span className="font-semibold text-emerald-900 block font-sans-body">
                  Format Pesan Otomatis yang Diterima di WhatsApp Admin:
                </span>
                <pre className="bg-white p-3 rounded-lg border border-emerald-200 text-[11px] font-mono text-stone-700 whitespace-pre-wrap">
{`Halo Admin Serenada, saya ingin konfirmasi pembayaran pesanan undangan pernikahan:
• No. Pesanan: #SRN-XXXXX
• Nama Pemesan: [Nama Pelanggan]
• Mempelai: [Nama Pengantin Pria & Wanita]
• Template: [Nama Template]
• Total Tagihan: Rp 349.000
• Metode: QRIS Manual
• Status: Bukti transfer sudah saya upload di sistem.
Mohon diverifikasi pesanan saya. Terima kasih!`}
                </pre>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg text-xs font-semibold font-sans-body transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Nomor WhatsApp</span>
                </button>

                <a
                  href={`https://wa.me/${waInput.replace(/[^0-9]/g, '')}?text=Halo%20Admin%20Serenada%2C%20ini%20tes%20koneksi%20WhatsApp.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-semibold font-sans-body transition-colors flex items-center gap-2 shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Tes Buka Chat WA Admin</span>
                </a>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: DETAIL PESANAN & LIHAT BUKTI BAYAR */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#D4E5F5] shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4E5F5]">
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 font-sans-body">
                    Rincian Order
                  </span>
                  <h3 className="font-mono-numbers text-lg font-bold text-[#1E3A8A]">
                    #{selectedOrderDetails.id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Status and quick changer */}
              <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl border border-[#D4E5F5] text-xs">
                <span>Status Saat Ini:</span>
                {getStatusBadge(selectedOrderDetails.status, Boolean(selectedOrderDetails.paymentProofImage))}
              </div>

              {/* Uploaded Payment Proof Image if present */}
              {selectedOrderDetails.paymentProofImage ? (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 font-sans-body flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      Bukti Transfer Diunggah Pelanggan:
                    </span>
                    <a
                      href={selectedOrderDetails.paymentProofImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#2563EB] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Buka Ukuran Penuh</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="w-full max-h-56 rounded-lg overflow-hidden border border-emerald-200 bg-white flex items-center justify-center">
                    <img
                      src={selectedOrderDetails.paymentProofImage}
                      alt="Bukti Transfer Pembeli"
                      className="w-full h-auto max-h-56 object-contain"
                    />
                  </div>

                  {selectedOrderDetails.status !== 'PAID' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrderDetails.id, 'PAID');
                        setSelectedOrderDetails((prev) => (prev ? { ...prev, status: 'PAID' } : null));
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Verifikasi &amp; Tandai Lunas Sekarang</span>
                    </button>
                  )}
                </div>
              ) : (
                selectedOrderDetails.paymentMethod === 'qris_manual' && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Pembeli memilih QRIS manual, belum mengunggah foto struk.</span>
                  </div>
                )
              )}

              {/* Customer Info */}
              <div className="space-y-1.5 text-xs text-stone-700">
                <span className="font-bold text-stone-900 block font-sans-body uppercase tracking-wider">
                  Data Pemesan:
                </span>
                <p>Nama: <strong>{selectedOrderDetails.customerName}</strong></p>
                <div className="flex items-center gap-2">
                  <p>WhatsApp: <strong>{selectedOrderDetails.customerPhone}</strong></p>
                  <a
                    href={`https://wa.me/${selectedOrderDetails.customerPhone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(selectedOrderDetails.customerName)}%2C%20kami%20dari%20Admin%20Serenada%20mengenai%20pesanan%20undangan%20%23${selectedOrderDetails.id}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-600" />
                    <span>Chat Pelanggan</span>
                  </a>
                </div>
                <p>Email: <strong>{selectedOrderDetails.customerEmail}</strong></p>
              </div>

              {/* Wedding details */}
              <div className="space-y-1.5 text-xs text-stone-700 border-t border-[#D4E5F5] pt-3">
                <span className="font-bold text-stone-900 block font-sans-body uppercase tracking-wider">
                  Kustomisasi Mempelai:
                </span>
                <p>Mempelai Pria: {selectedOrderDetails.customization.groomName}</p>
                <p>Mempelai Wanita: {selectedOrderDetails.customization.brideName}</p>
                <p>Tanggal Acara: {selectedOrderDetails.customization.weddingDate}</p>
                <p>Venue: {selectedOrderDetails.customization.venueName}</p>
                <p>Alamat: {selectedOrderDetails.customization.venueAddress}</p>
              </div>

              {/* Payment Details */}
              <div className="space-y-1.5 text-xs text-stone-700 border-t border-[#D4E5F5] pt-3">
                <span className="font-bold text-stone-900 block font-sans-body uppercase tracking-wider">
                  Log Transaksi:
                </span>
                <p>Metode: {selectedOrderDetails.paymentMethod.toUpperCase()}</p>
                {selectedOrderDetails.vaNumber && (
                  <p className="font-mono-numbers">Nomor VA: {selectedOrderDetails.vaNumber}</p>
                )}
                <p className="font-mono-numbers font-bold text-[#1E3A8A]">
                  Total Tagihan: {formatRupiah(selectedOrderDetails.amount)}
                </p>
                <p className="text-[11px] text-stone-400">
                  Dibuat: {new Date(selectedOrderDetails.createdAt).toLocaleString('id-ID')}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedOrderDetails(null);
                    setActiveTab('guest_preview');
                  }}
                  className="flex-1 bg-[#2563EB] text-white py-2.5 rounded-lg text-xs font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Lihat Undangan Tamu</span>
                </button>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="px-4 py-2.5 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-200"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: TAMBAH TEMPLATE BARU DENGAN UPLOAD FOTO GALERI */}
        {isAddTemplateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <form
              onSubmit={handleCreateNewTemplate}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#D4E5F5] shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#D4E5F5]">
                <h3 className="font-serif-display text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#2563EB]" />
                  <span>Tambah Template &amp; Upload Foto</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddTemplateModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* PHOTO UPLOAD MECHANISM */}
                <div>
                  <label className="block text-stone-800 font-semibold mb-1.5 font-sans-body">
                    Foto Cover Template (Upload dari Galeri atau URL):
                  </label>

                  {/* Mode Selector Tabs */}
                  <div className="grid grid-cols-2 p-1 bg-[#F0F7FD] rounded-lg border border-[#D4E5F5] mb-2.5">
                    <button
                      type="button"
                      onClick={() => setUploadMode('file')}
                      className={`py-1.5 rounded-md text-xs font-semibold transition-all ${
                        uploadMode === 'file'
                          ? 'bg-white text-[#1E3A8A] shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Upload File (Galeri / Laptop)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('url')}
                      className={`py-1.5 rounded-md text-xs font-semibold transition-all ${
                        uploadMode === 'url'
                          ? 'bg-white text-[#1E3A8A] shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Gunakan Link URL
                    </button>
                  </div>

                  {uploadMode === 'file' ? (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLocalImageUpload}
                        className="hidden"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="p-4 bg-[#F8FAFC] rounded-xl border-2 border-dashed border-[#D4E5F5] hover:border-[#2563EB] cursor-pointer text-center transition-all flex flex-col items-center justify-center gap-2"
                      >
                        <div className="w-10 h-10 rounded-full bg-sky-100 text-[#2563EB] flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-stone-800 block">
                            {uploadedFileName ? `File dipilih: ${uploadedFileName}` : 'Klik untuk pilih foto dari galeri HP atau laptop'}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            Format JPG, PNG, atau WebP (terbaca langsung)
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        required
                        value={newTemplateImage}
                        onChange={(e) => setNewTemplateImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D4E5F5] rounded-lg focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  )}

                  {/* Instant Image Preview */}
                  {newTemplateImage && (
                    <div className="mt-2.5 p-2 bg-[#F8FAFC] rounded-lg border border-[#D4E5F5] flex items-center gap-3">
                      <div className="w-16 h-12 rounded overflow-hidden bg-stone-200 border border-[#D4E5F5] shrink-0">
                        <img
                          src={newTemplateImage}
                          alt="Pratinjau Cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-[11px] font-semibold text-stone-800 block truncate">
                          Pratinjau Foto Cover Siap Tayang
                        </span>
                        <span className="text-[10px] text-emerald-600 font-medium">
                          ✓ Foto valid &amp; akan ditampilkan di katalog
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Nama Template</label>
                  <input
                    type="text"
                    required
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="cth. Seraphic Azure &amp; Gold"
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D4E5F5] rounded-lg focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Kategori</label>
                    <select
                      value={newTemplateCategory}
                      onChange={(e) => setNewTemplateCategory(e.target.value as TemplateCategory)}
                      className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D4E5F5] rounded-lg focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="Botanical">Botanical</option>
                      <option value="Monogram">Monogram</option>
                      <option value="Minimalist">Minimalist</option>
                      <option value="Traditional">Traditional</option>
                      <option value="Floral">Floral</option>
                      <option value="Modern">Modern</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Harga (Rupiah)</label>
                    <input
                      type="number"
                      required
                      value={newTemplatePrice}
                      onChange={(e) => setNewTemplatePrice(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D4E5F5] rounded-lg font-mono-numbers focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    URL Link Demo Web Jadi (Opsional)
                  </label>
                  <input
                    type="url"
                    value={newTemplateDemoUrl}
                    onChange={(e) => setNewTemplateDemoUrl(e.target.value)}
                    placeholder="https://contoh-undangan-jadi.serenada.id"
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D4E5F5] rounded-lg font-mono-numbers focus:outline-none focus:border-[#2563EB]"
                  />
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Jika diisi, tombol &ldquo;Lihat Demo&rdquo; akan otomatis muncul di kartu katalog.
                  </p>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    rows={2}
                    value={newTemplateDesc}
                    onChange={(e) => setNewTemplateDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D4E5F5] rounded-lg focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#D4E5F5] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTemplateModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Simpan Template ke Katalog
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
