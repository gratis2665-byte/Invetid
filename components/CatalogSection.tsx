'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TemplateCategory, WeddingTemplate } from '@/types';
import { Search, Sparkles, Check, ExternalLink } from 'lucide-react';

export function CatalogSection() {
  const { templates, selectTemplateForCustomizing, setActiveTab } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Botanical', 'Monogram', 'Minimalist', 'Traditional', 'Floral', 'Modern'];

  const filteredTemplates = templates.filter((template) => {
    if (!template.isActive) return false;
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <section id="catalog-section" className="w-full py-16 px-6 max-w-7xl mx-auto">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#D4E5F5]">
        <div>
          <div className="text-xs font-sans-body uppercase tracking-widest text-[#2563EB] font-semibold mb-1">
            Koleksi Undangan Digital
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-display text-[#0F172A]">
            Pilih Desain Sesuai Tema Pernikahan Anda
          </h2>
          <p className="text-sm font-sans-body text-stone-600 mt-1 max-w-xl">
            Semua template dapat diedit secara langsung (nama mempelai, tanggal, tempat, doa restu)
            dan terhubung dengan sistem pembayaran instan.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tema, warna, atau gaya..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D4E5F5] rounded-lg focus:outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-sans-body font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === cat
                ? 'bg-[#2563EB] text-white shadow-sm font-semibold'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-[#D4E5F5]'
            }`}
          >
            {cat === 'All' ? 'Semua Desain' : cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-[#D4E5F5] p-8">
          <p className="text-base font-serif-display text-stone-800">
            Tidak ada desain undangan yang cocok dengan pencarian Anda.
          </p>
          <p className="text-sm text-stone-500 mt-1">Coba kata kunci lain atau pilih Semua Desain.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 text-xs bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8]"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group bg-white rounded-xl overflow-hidden border border-[#D4E5F5] hover:border-[#93C5FD] transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              {/* Product Visual Card with Resilient Fallback */}
              <div>
                <div className="relative aspect-[4/3] bg-[#EFF6FF] overflow-hidden">
                  <img
                    src={template.coverImage}
                    alt={template.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Decorative CSS Fallback Motif behind image */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center -z-10"
                    style={{ backgroundColor: template.palette.background }}
                  >
                    <span
                      className="font-serif-display text-xl font-semibold mb-1"
                      style={{ color: template.palette.primary }}
                    >
                      {template.name}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-stone-500 font-sans-body">
                      {template.category} Edition
                    </span>
                  </div>

                  {/* Clean unboxed tag in corner */}
                  {template.badge && (
                    <span className="absolute top-3 left-3 bg-[#1E3A8A]/90 text-white text-[11px] font-sans-body font-medium px-2.5 py-1 rounded backdrop-blur-sm">
                      {template.badge}
                    </span>
                  )}
                </div>

                {/* Card Content & Metadata */}
                <div className="p-5">
                  {/* Clean unboxed metadata with bullet separators */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 font-sans-body">
                    <span className="font-medium text-[#2563EB]">{template.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-numbers">{template.salesCount} Terjual</span>
                    <span aria-hidden="true">·</span>
                    <span>Aktif Selamanya</span>
                  </div>

                  <h3 className="font-serif-display text-lg text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                    {template.name}
                  </h3>

                  <p className="text-xs font-sans-body text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>

                  {/* Highlights list */}
                  <ul className="mt-3 space-y-1 text-xs text-stone-600 border-t border-[#F0F7FD] pt-3">
                    {template.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price & Action Module */}
              <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-[#F0F7FD]">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-sans-body">
                    Investasi
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono-numbers text-base font-bold text-[#1E3A8A]">
                      {formatRupiah(template.price)}
                    </span>
                    {template.originalPrice > template.price && (
                      <span className="font-mono-numbers text-xs text-stone-400 line-through">
                        {formatRupiah(template.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Kondisional: Tombol Lihat Demo (jika demoUrl ada dan tidak kosong) */}
                  {template.demoUrl && template.demoUrl.trim().length > 0 && (
                    <a
                      href={template.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-[#D4E5F5] text-stone-700 hover:text-[#2563EB] hover:border-[#2563EB] hover:bg-[#F0F7FD] px-3 py-2 rounded-lg text-xs font-sans-body font-medium transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                      title={`Buka Demo Jadi: ${template.name}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>Lihat Demo</span>
                    </a>
                  )}

                  <button
                    onClick={() => selectTemplateForCustomizing(template)}
                    className="bg-[#2563EB] text-white px-3.5 py-2 rounded-lg text-xs font-sans-body font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                    <span>Pilih &amp; Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
