'use client';

import React, { useSyncExternalStore } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CatalogSection } from '@/components/CatalogSection';
import { LiveStudio } from '@/components/LiveStudio';
import { PaymentCheckout } from '@/components/PaymentCheckout';
import { AdminDashboard } from '@/components/AdminDashboard';
import { GuestInvitationView } from '@/components/GuestInvitationView';
import { AuthGate } from '@/components/AuthGate';
import { Toast } from '@/components/Toast';

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function AppContent() {
  const { currentUser, activeTab, setActiveTab } = useApp();

  // If user is not logged in, enforce AuthGate (Login & Register)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F0F7FD]">
        <AuthGate />
        <Toast />
      </div>
    );
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F0F7FD]">
      <div>
        {activeTab !== 'guest_preview' && <Navbar />}

        <main className="w-full">
          {activeTab === 'catalog' && (
            <>
              <HeroSection />
              <CatalogSection />
            </>
          )}

          {activeTab === 'studio' && <LiveStudio />}

          {activeTab === 'checkout' && <PaymentCheckout />}

          {activeTab === 'admin' && isAdmin && <AdminDashboard />}

          {activeTab === 'guest_preview' && <GuestInvitationView />}
        </main>
      </div>

      {activeTab !== 'guest_preview' && (
        <footer className="w-full bg-white/90 border-t border-[#D4E5F5] py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-500 font-sans-body">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="font-serif-display text-base font-semibold text-[#1E3A8A]">
                Serenada Wedding Atelier
              </span>
              <span className="hidden sm:inline text-stone-300">|</span>
              <span>Katalog Undangan Pernikahan, Live Editor &amp; Checkout Otomatis</span>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('catalog')}
                className="hover:text-stone-900 transition-colors"
              >
                Katalog Desain
              </button>
              <button
                onClick={() => setActiveTab('studio')}
                className="hover:text-stone-900 transition-colors"
              >
                Live Studio
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className="hover:text-[#1E3A8A] transition-colors text-[#2563EB] font-semibold"
                >
                  Dashboard Admin
                </button>
              )}
            </div>

            <p className="text-stone-400">
              &copy; 2026 Serenada. Hak Cipta Dilindungi.
            </p>
          </div>
        </footer>
      )}

      <Toast />
    </div>
  );
}

export default function Home() {
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F7FD]">
        <div className="text-center space-y-2">
          <div className="text-2xl font-serif-display text-[#1E3A8A]">Serenada</div>
          <p className="text-xs text-stone-400 font-sans-body">Memuat atelier undangan digital...</p>
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
