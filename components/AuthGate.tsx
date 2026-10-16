'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { ShieldCheck, User, Sparkles, Lock, Mail, ArrowRight, Heart } from 'lucide-react';

export function AuthGate() {
  const { login, register, quickLoginDemo, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('user');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Harap masukkan alamat email', 'warning');
      return;
    }
    login(email, password);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Harap lengkapi nama dan email', 'warning');
      return;
    }
    register(name, email, password, role);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FD] flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background delicate radial glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-md border border-[#D4E5F5] mb-2 text-[#2563EB]">
            <Heart className="w-7 h-7 fill-[#2563EB]/20 text-[#2563EB]" />
          </div>
          <h1 className="text-3xl font-serif-display font-medium text-[#0F172A] tracking-tight">
            Serenada
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#2563EB] font-sans-body font-semibold">
            Wedding Stationery &amp; Atelier
          </p>
          <p className="text-xs text-stone-500 font-sans-body pt-1">
            Silakan masuk untuk mengakses katalog undangan pernikahan, live preview studio, atau panel admin.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl border border-[#D4E5F5] shadow-lg p-6 sm:p-8 space-y-6">
          {/* Tabs: Login vs Register */}
          <div className="grid grid-cols-2 p-1 bg-[#F0F7FD] rounded-xl border border-[#D4E5F5]/60 text-xs font-sans-body font-semibold">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#1E3A8A] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-2 rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-[#1E3A8A] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>

          {/* Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-sans-body">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F8FAFC] border border-[#D4E5F5] rounded-lg focus:outline-none focus:border-[#2563EB] text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-sans-body">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F8FAFC] border border-[#D4E5F5] rounded-lg focus:outline-none focus:border-[#2563EB] text-stone-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-sans-body font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-sans-body">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="cth. Dimas &amp; Sarah"
                  className="w-full px-3 py-2.5 text-xs bg-[#F8FAFC] border border-[#D4E5F5] rounded-lg focus:outline-none focus:border-[#2563EB] text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-sans-body">
                  Alamat Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2.5 text-xs bg-[#F8FAFC] border border-[#D4E5F5] rounded-lg focus:outline-none focus:border-[#2563EB] text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-sans-body">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 text-xs bg-[#F8FAFC] border border-[#D4E5F5] rounded-lg focus:outline-none focus:border-[#2563EB] text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 font-sans-body">
                  Pilih Peran Akun:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`p-2.5 rounded-lg border text-left transition-all flex items-center gap-2 ${
                      role === 'user'
                        ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A] font-semibold ring-1 ring-[#2563EB]'
                        : 'border-[#D4E5F5] bg-white text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    <User className="w-4 h-4 text-[#2563EB]" />
                    <span>Calon Pengantin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`p-2.5 rounded-lg border text-left transition-all flex items-center gap-2 ${
                      role === 'admin'
                        ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A] font-semibold ring-1 ring-[#2563EB]'
                        : 'border-[#D4E5F5] bg-white text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                    <span>Admin Bisnis</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-sans-body font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Daftar &amp; Masuk</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-[#D4E5F5] space-y-2.5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-sans-body font-semibold block text-center">
              Akses Cepat (Demo Akun Seketika)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickLoginDemo('admin')}
                className="p-2.5 rounded-lg bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-left transition-all flex items-center gap-2 text-xs"
              >
                <div className="w-6 h-6 rounded bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-[#1E3A8A] block">Role: Admin</span>
                  <span className="text-[10px] text-stone-500">Akses Penuh Kelola</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => quickLoginDemo('user')}
                className="p-2.5 rounded-lg bg-white hover:bg-stone-50 border border-[#D4E5F5] text-left transition-all flex items-center gap-2 text-xs"
              >
                <div className="w-6 h-6 rounded bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-stone-800 block">Role: User</span>
                  <span className="text-[10px] text-stone-500">Calon Pengantin</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-stone-400 font-sans-body">
          &copy; 2026 Serenada Wedding Atelier. Sistem Otentikasi Multi-Peran.
        </p>
      </div>
    </div>
  );
}
