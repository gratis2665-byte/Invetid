'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#1F2923] text-white rounded-lg shadow-xl border border-[#3F5643]/40 text-sm animate-fade-in"
    >
      {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
      {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
      {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
      <span className="font-medium text-stone-100">{toast.message}</span>
    </div>
  );
}
