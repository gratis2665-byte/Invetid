'use client';

import React, { useState } from 'react';
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
  ToggleLeft,
  ToggleRight,
  RotateCcw,
  Sparkles,
  Link2,
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
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'catalog' | 'demo_links'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // New Template Modal state
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState<TemplateCategory>('Botanical');
  const [newTemplatePrice, setNewTemplatePrice] = useState('399000');
  const [newTemplateImage, setNewTemplateImage] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCo571UP2gHgWqg99u32j8iUzCPh-4W-sLFH45XGI72cpMHEHMiu3BUOAnUs5AL0Qi30-fjl-znXnoIgeySPw3EPOim984cE-2HDg__BC_yPOv43GcZeF3B1dApyHzqwRjfyPBHqiI6Sc0iM08d1xkWFfvRjJtmpRMVF1QrKBQHvnV0DaJfbotwa4ubrN9d9JaJT0Ih-B8OKBv2iuJMhPeCt7Ag_9auYv5gEsarJKY7FydiE05eUKE'
  );
  const [newTemplateDesc, setNewTemplateDesc] = useState('Undangan digital pernikahan bernuansa mewah nan anggun.');
  const [newTemplateDemoUrl, setNewTemplateDemoUrl] = useState('');

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

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customization.groomNickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customization.brideNickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
        primary: '#3F5643',
        secondary: '#C29B38',
        background: '#FAF8F5',
        card: '#FFFFFF',
        accent: '#2D4030',
      },
      features: ['Galeri Foto HD', 'Musik Auto-play', 'RSVP & Tamu', 'Navigasi Peta'],
      isActive: true,
      demoUrl: newTemplateDemoUrl.trim() || undefined,
    });
    setIsAddTemplateModalOpen(false);
    setNewTemplateName('');
    setNewTemplateDemoUrl('');
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

  const getStatusBadge = (status: OrderStatus) => {
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            MENUNGGU BAYAR
          </span>
        );
      case 'IN_PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            DIPROSES
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-300">
            <CheckCircle className="w-3.5 h-3.5 text-stone-600" />
            SELESAI
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            DIBATALKAN
          </span>
        );
    }
  };

  return (
    <section className="w-full min-h-[calc(100vh-4.5rem)] bg-[#F7F4EE] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E2DA]">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans-body uppercase tracking-widest text-[#8C7A58] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#2D4030]" />
              <span>Sistem Manajemen Admin Serenada</span>
            </div>
            <h1 className="text-2xl font-serif-display text-[#1E2923]">
              Dashboard Pesanan &amp; Katalog Undangan
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetAllDataToDefault}
              className="px-3.5 py-2 text-xs font-medium text-stone-600 bg-white hover:bg-stone-50 border border-[#DCD5C9] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data Demo</span>
            </button>
            <button
              onClick={() => setActiveTab('studio')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#2D4030] hover:bg-[#3F5643] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Buka Live Studio</span>
            </button>
          </div>
        </div>

        {/* KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-sans-body uppercase tracking-wider block">
                Total Omzet Terverifikasi
              </span>
              <p className="font-mono-numbers text-xl font-bold text-[#2D4030] mt-1">
                {formatRupiah(totalRevenue)}
              </p>
              <span className="text-[11px] text-emerald-700 font-sans-body">
                Dari pesanan lunas &amp; selesai
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-sans-body uppercase tracking-wider block">
                Total Pesanan Masuk
              </span>
              <p className="font-mono-numbers text-xl font-bold text-stone-900 mt-1">
                {orders.length} Pesanan
              </p>
              <span className="text-[11px] text-stone-500 font-sans-body">
                Semua status transaksi
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#FAF6EE] text-[#8C7A58] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-sans-body uppercase tracking-wider block">
                Menunggu Pembayaran
              </span>
              <p className="font-mono-numbers text-xl font-bold text-amber-700 mt-1">
                {pendingCount} Pesanan
              </p>
              <span className="text-[11px] text-amber-600 font-sans-body">
                Batas waktu QRIS / VA aktif
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-sans-body uppercase tracking-wider block">
                Total Desain di Katalog
              </span>
              <p className="font-mono-numbers text-xl font-bold text-stone-900 mt-1">
                {templates.filter((t) => t.isActive).length} / {templates.length}
              </p>
              <span className="text-[11px] text-stone-500 font-sans-body">
                Template aktif di etalase
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#FAF6EE] text-[#2D4030] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Main Admin Tabs */}
        <div className="flex border-b border-[#E7E2DA] gap-6 text-sm font-sans-body">
          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`py-2.5 font-semibold transition-colors border-b-2 flex items-center gap-2 ${
              activeAdminTab === 'orders'
                ? 'border-[#2D4030] text-[#2D4030]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>Daftar Pesanan Pelanggan</span>
            <span className="px-1.5 py-0.5 text-xs font-mono-numbers rounded bg-stone-200 text-stone-700">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('catalog')}
            className={`py-2.5 font-semibold transition-colors border-b-2 flex items-center gap-2 ${
              activeAdminTab === 'catalog'
                ? 'border-[#2D4030] text-[#2D4030]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>Kelola Katalog Template</span>
            <span className="px-1.5 py-0.5 text-xs font-mono-numbers rounded bg-stone-200 text-stone-700">
              {templates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('demo_links')}
            className={`py-2.5 font-semibold transition-colors border-b-2 flex items-center gap-2 ${
              activeAdminTab === 'demo_links'
                ? 'border-[#2D4030] text-[#2D4030]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Link2 className="w-4 h-4 text-[#8C7A58]" />
            <span>Pengaturan Link Demo Web</span>
            <span className="px-1.5 py-0.5 text-xs font-mono-numbers rounded bg-emerald-100 text-emerald-800">
              {templates.filter((t) => t.demoUrl && t.demoUrl.trim().length > 0).length} Terpasang
            </span>
          </button>
        </div>

        {/* TAB 1: ORDER MANAGEMENT */}
        {activeAdminTab === 'orders' && (
          <div className="bg-white rounded-xl border border-[#E7E2DA] shadow-sm overflow-hidden">
            {/* Filter and Search Bar */}
            <div className="p-4 border-b border-[#E7E2DA] flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Status Segmented Buttons */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                {['ALL', 'PENDING_PAYMENT', 'PAID', 'IN_PROCESSING', 'COMPLETED', 'CANCELLED'].map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        statusFilter === st
                          ? 'bg-[#2D4030] text-white'
                          : 'bg-[#FAF8F5] text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st === 'ALL' && 'Semua Pesanan'}
                      {st === 'PENDING_PAYMENT' && 'Menunggu Bayar'}
                      {st === 'PAID' && 'Lunas'}
                      {st === 'IN_PROCESSING' && 'Diproses'}
                      {st === 'COMPLETED' && 'Selesai'}
                      {st === 'CANCELLED' && 'Dibatalkan'}
                    </button>
                  )
                )}
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari ID, pemesan, mempelai..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DCD5C9] rounded-lg focus:outline-none focus:border-[#2D4030]"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E7E2DA] text-stone-500 font-sans-body uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">No. Order</th>
                    <th className="py-3 px-4">Pemesan</th>
                    <th className="py-3 px-4">Pasangan Pengantin</th>
                    <th className="py-3 px-4">Template</th>
                    <th className="py-3 px-4 text-right">Nominal</th>
                    <th className="py-3 px-4">Metode Bayar</th>
                    <th className="py-3 px-4">Status Pesanan</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E2DA] text-stone-700">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-stone-500">
                        Tidak ada data pesanan yang sesuai filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-3 px-4 font-mono-numbers font-bold text-stone-900">
                          #{order.id}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-stone-900">{order.customerName}</p>
                          <p className="text-[11px] text-stone-500">{order.customerPhone}</p>
                        </td>
                        <td className="py-3 px-4 font-serif-display font-medium text-stone-800">
                          {order.customization.groomNickname} &amp;{' '}
                          {order.customization.brideNickname}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-stone-800">{order.template.name}</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono-numbers font-semibold text-[#2D4030]">
                          {formatRupiah(order.amount)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="uppercase text-[11px] font-mono-numbers text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                            {order.paymentMethod.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Fast status updater dropdown */}
                            <select
                              value={order.status}
                              onChange={(e) =>
                                updateOrderStatus(order.id, e.target.value as OrderStatus)
                              }
                              className="text-[11px] bg-white border border-[#DCD5C9] rounded px-1.5 py-1 focus:outline-none focus:border-[#2D4030]"
                            >
                              <option value="PENDING_PAYMENT">Menunggu Bayar</option>
                              <option value="PAID">Tandai Lunas</option>
                              <option value="IN_PROCESSING">Diproses</option>
                              <option value="COMPLETED">Selesai</option>
                              <option value="CANCELLED">Dibatalkan</option>
                            </select>

                            <button
                              onClick={() => setSelectedOrderDetails(order)}
                              title="Lihat Rincian Lengkap"
                              className="p-1 hover:bg-stone-200 rounded text-stone-600"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => deleteOrder(order.id)}
                              title="Hapus Pesanan"
                              className="p-1 hover:bg-rose-100 rounded text-rose-600"
                            >
                              <Trash2 className="w-4 h-4" />
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

        {/* TAB 2: CATALOG MANAGEMENT */}
        {activeAdminTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif-display font-medium text-stone-900">
                  Koleksi Template Undangan
                </h3>
                <p className="text-xs text-stone-500 font-sans-body">
                  Kelola harga, status tayang di etalase, dan tambah template baru untuk pelanggan.
                </p>
              </div>
              <button
                onClick={() => setIsAddTemplateModalOpen(true)}
                className="bg-[#2D4030] text-white px-4 py-2 rounded-lg text-xs font-sans-body font-semibold hover:bg-[#3F5643] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Template Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`bg-white rounded-xl border p-4 shadow-xs transition-all ${
                    template.isActive ? 'border-[#E7E2DA]' : 'border-stone-300 opacity-60 bg-stone-50'
                  }`}
                >
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-[#FAF8F5] mb-3">
                    <img
                      src={template.coverImage}
                      alt={template.name}
                      referrerPolicy="no-referrer"
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

                    <span className="absolute top-2 left-2 text-[10px] uppercase font-bold bg-white/90 px-2 py-0.5 rounded text-stone-700">
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
                    <div className="pt-2 border-t border-[#E7E2DA] flex items-center justify-between">
                      <span className="text-xs text-stone-500 font-sans-body">Harga Katalog:</span>
                      {editingPriceId === template.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={tempPriceInput}
                            onChange={(e) => setTempPriceInput(e.target.value)}
                            className="w-24 px-2 py-1 text-xs border border-stone-300 rounded font-mono-numbers"
                          />
                          <button
                            onClick={() => handleSavePriceEdit(template.id)}
                            className="px-2 py-1 bg-[#2D4030] text-white text-[11px] rounded"
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
                          <span className="font-mono-numbers font-bold text-stone-900 text-sm">
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
          <div className="bg-white rounded-xl border border-[#E7E2DA] shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E7E2DA]">
              <div>
                <h3 className="text-base font-serif-display font-medium text-stone-900 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-[#8C7A58]" />
                  <span>Pengaturan Link Demo Website Jadi</span>
                </h3>
                <p className="text-xs text-stone-500 font-sans-body mt-0.5 max-w-2xl">
                  Tautkan URL website undangan pernikahan riil yang sudah jadi. Jika diisi, tombol
                  &ldquo;Lihat Demo&rdquo; akan otomatis tampil di kartu katalog produk calon pengantin.
                  Jika dikosongkan, tombol demo akan disembunyikan secara otomatis.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono-numbers px-2.5 py-1 rounded bg-[#FAF8F5] border border-[#E7E2DA] text-stone-700">
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
                    className="p-4 rounded-xl border border-[#E7E2DA] bg-[#FAF8F5] hover:bg-white transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left: Thumbnail & Name */}
                    <div className="flex items-center gap-3.5 md:w-1/3 shrink-0">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-200 border border-[#E7E2DA] shrink-0">
                        <img
                          src={template.coverImage}
                          alt={template.name}
                          referrerPolicy="no-referrer"
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
                          <span className="text-[11px] text-[#8C7A58] font-sans-body font-medium">
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
                          placeholder="https://undangan-contoh.serenada.id"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DCD5C9] rounded-lg focus:outline-none focus:border-[#2D4030] font-mono-numbers text-stone-800"
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
                        className="bg-[#2D4030] text-white px-3.5 py-2 rounded-lg text-xs font-sans-body font-semibold hover:bg-[#3F5643] transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <span>Simpan Link</span>
                      </button>

                      {hasDemo && (
                        <a
                          href={template.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white border border-[#DCD5C9] text-stone-700 hover:text-stone-900 hover:border-stone-400 px-3 py-2 rounded-lg text-xs font-sans-body font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                          title="Uji buka link di tab baru"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#8C7A58]" />
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
                          title="Hapus Link Demo (Tombol akan disembunyikan di katalog)"
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

        {/* MODAL: DETAIL PESANAN */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#E7E2DA] shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E2DA]">
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 font-sans-body">
                    Rincian Order
                  </span>
                  <h3 className="font-mono-numbers text-lg font-bold text-stone-900">
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
              <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] text-xs">
                <span>Status Saat Ini:</span>
                {getStatusBadge(selectedOrderDetails.status)}
              </div>

              {/* Customer Info */}
              <div className="space-y-1.5 text-xs text-stone-700">
                <span className="font-bold text-stone-900 block font-sans-body uppercase tracking-wider">
                  Data Pemesan:
                </span>
                <p>Nama: <strong>{selectedOrderDetails.customerName}</strong></p>
                <p>WhatsApp: <strong>{selectedOrderDetails.customerPhone}</strong></p>
                <p>Email: <strong>{selectedOrderDetails.customerEmail}</strong></p>
              </div>

              {/* Wedding details */}
              <div className="space-y-1.5 text-xs text-stone-700 border-t border-[#E7E2DA] pt-3">
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
              <div className="space-y-1.5 text-xs text-stone-700 border-t border-[#E7E2DA] pt-3">
                <span className="font-bold text-stone-900 block font-sans-body uppercase tracking-wider">
                  Log Transaksi:
                </span>
                <p>Metode: {selectedOrderDetails.paymentMethod.toUpperCase()}</p>
                {selectedOrderDetails.vaNumber && (
                  <p className="font-mono-numbers">Nomor VA: {selectedOrderDetails.vaNumber}</p>
                )}
                <p className="font-mono-numbers">Total Tagihan: {formatRupiah(selectedOrderDetails.amount)}</p>
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
                  className="flex-1 bg-[#2D4030] text-white py-2.5 rounded-lg text-xs font-semibold hover:bg-[#3F5643] transition-colors flex items-center justify-center gap-1.5"
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

        {/* MODAL: TAMBAH TEMPLATE BARU */}
        {isAddTemplateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <form
              onSubmit={handleCreateNewTemplate}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#E7E2DA] shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E2DA]">
                <h3 className="font-serif-display text-lg font-bold text-stone-900">
                  Tambah Template Undangan Baru
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddTemplateModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Nama Template</label>
                  <input
                    type="text"
                    required
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="cth. Golden Baroque Serenade"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD5C9] rounded-lg focus:outline-none focus:border-[#2D4030]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Kategori</label>
                    <select
                      value={newTemplateCategory}
                      onChange={(e) => setNewTemplateCategory(e.target.value as TemplateCategory)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD5C9] rounded-lg focus:outline-none focus:border-[#2D4030]"
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
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD5C9] rounded-lg font-mono-numbers focus:outline-none focus:border-[#2D4030]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    URL Gambar Cover
                  </label>
                  <input
                    type="url"
                    required
                    value={newTemplateImage}
                    onChange={(e) => setNewTemplateImage(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD5C9] rounded-lg focus:outline-none focus:border-[#2D4030]"
                  />
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
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD5C9] rounded-lg font-mono-numbers focus:outline-none focus:border-[#2D4030]"
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
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD5C9] rounded-lg focus:outline-none focus:border-[#2D4030]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E7E2DA] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTemplateModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2D4030] text-white rounded-lg text-xs font-semibold hover:bg-[#3F5643] shadow-sm"
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
