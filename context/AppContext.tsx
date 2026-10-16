'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WeddingTemplate,
  Order,
  CustomizationData,
  PaymentMethodType,
  OrderStatus,
  GuestRSVP,
} from '@/types';
import {
  INITIAL_TEMPLATES,
  DEFAULT_CUSTOMIZATION,
  INITIAL_ORDERS,
} from '@/data/initialData';

interface AppContextType {
  templates: WeddingTemplate[];
  orders: Order[];
  selectedTemplate: WeddingTemplate;
  customization: CustomizationData;
  activeTab: 'catalog' | 'studio' | 'checkout' | 'admin' | 'guest_preview';
  currentPaymentOrder: Order | null;
  guestRSVPs: GuestRSVP[];
  toast: { message: string; type?: 'success' | 'info' | 'warning' } | null;
  setActiveTab: (tab: 'catalog' | 'studio' | 'checkout' | 'admin' | 'guest_preview') => void;
  selectTemplateForCustomizing: (template: WeddingTemplate) => void;
  updateCustomization: (patch: Partial<CustomizationData>) => void;
  createOrderFromDraft: (customer: {
    name: string;
    phone: string;
    email: string;
    paymentMethod: PaymentMethodType;
  }) => Order;
  simulatePaymentSuccess: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  addNewTemplate: (
    newTemplate: Omit<WeddingTemplate, 'id' | 'salesCount'>
  ) => void;
  updateTemplatePrice: (templateId: string, newPrice: number) => void;
  updateTemplateDemoUrl: (templateId: string, demoUrl: string) => void;
  toggleTemplateActive: (templateId: string) => void;
  addGuestRSVP: (rsvp: Omit<GuestRSVP, 'id' | 'createdAt'>) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  resetAllDataToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<WeddingTemplate[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('serenada_templates');
        if (saved) return JSON.parse(saved);
      } catch {
        // storage disabled
      }
    }
    return INITIAL_TEMPLATES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('serenada_orders');
        if (saved) return JSON.parse(saved);
      } catch {
        // storage disabled
      }
    }
    return INITIAL_ORDERS;
  });

  const [selectedTemplate, setSelectedTemplate] = useState<WeddingTemplate>(INITIAL_TEMPLATES[0]);

  const [customization, setCustomization] = useState<CustomizationData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('serenada_customization');
        if (saved) return JSON.parse(saved);
      } catch {
        // storage disabled
      }
    }
    return DEFAULT_CUSTOMIZATION;
  });

  const [activeTab, setActiveTab] = useState<'catalog' | 'studio' | 'checkout' | 'admin' | 'guest_preview'>('catalog');
  const [currentPaymentOrder, setCurrentPaymentOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'warning' } | null>(null);

  const [guestRSVPs, setGuestRSVPs] = useState<GuestRSVP[]>([
    {
      id: 'rsvp-1',
      guestName: 'Bima & Partner',
      attendance: 'attending',
      guestCount: 2,
      wishes: 'Selamat menempuh hidup baru Alex & Beatrice! Semoga bahagia dan harmonis selalu selamanya.',
      createdAt: '2026-10-15T09:12:00Z',
    },
    {
      id: 'rsvp-2',
      guestName: 'Keluarga Besar Sastro',
      attendance: 'attending',
      guestCount: 4,
      wishes: 'Baarakallahu laka wa baaraka alaika. Selamat menyatukan cinta di hari istimewa!',
      createdAt: '2026-10-15T14:30:00Z',
    },
    {
      id: 'rsvp-3',
      guestName: 'Clara Santoso',
      attendance: 'tentative',
      guestCount: 1,
      wishes: 'Semoga acaranya berjalan lancar dari awal hingga akhir ya!',
      createdAt: '2026-10-16T02:00:00Z',
    },
  ]);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('serenada_templates', JSON.stringify(templates));
    } catch {
      // storage quota
    }
  }, [templates]);

  useEffect(() => {
    try {
      localStorage.setItem('serenada_orders', JSON.stringify(orders));
    } catch {
      // storage quota
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('serenada_customization', JSON.stringify(customization));
    } catch {
      // storage quota
    }
  }, [customization]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const selectTemplateForCustomizing = (template: WeddingTemplate) => {
    setSelectedTemplate(template);
    setCustomization((prev) => ({
      ...prev,
      selectedColorTone: template.palette.primary,
    }));
    setActiveTab('studio');
    showToast(`Template "${template.name}" dimuat ke Studio Editor`, 'info');
  };

  const updateCustomization = (patch: Partial<CustomizationData>) => {
    setCustomization((prev) => ({ ...prev, ...patch }));
  };

  const createOrderFromDraft = (customer: {
    name: string;
    phone: string;
    email: string;
    paymentMethod: PaymentMethodType;
  }): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `SRN-${randomNum}`;

    let vaNum = '';
    if (customer.paymentMethod === 'va_bca') vaNum = `8801${randomNum}001`;
    else if (customer.paymentMethod === 'va_mandiri') vaNum = `8910${randomNum}002`;
    else if (customer.paymentMethod === 'va_bri') vaNum = `8870${randomNum}003`;
    else if (customer.paymentMethod === 'va_bni') vaNum = `8808${randomNum}004`;

    const cleanGroom = customization.groomNickname.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanBride = customization.brideNickname.toLowerCase().replace(/[^a-z0-9]/g, '');
    const slug = `${cleanGroom || 'groom'}-${cleanBride || 'bride'}-${randomNum.toString().slice(-3)}`;

    const newOrder: Order = {
      id: newId,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      template: selectedTemplate,
      customization: { ...customization },
      amount: selectedTemplate.price,
      paymentMethod: customer.paymentMethod,
      vaNumber: vaNum,
      status: 'PENDING_PAYMENT',
      createdAt: new Date().toISOString(),
      invitationSlug: slug,
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    setCurrentPaymentOrder(newOrder);
    setActiveTab('checkout');
    showToast(`Pesanan #${newId} berhasil dibuat! Silakan selesaikan pembayaran.`, 'info');
    return newOrder;
  };

  const simulatePaymentSuccess = (orderId: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'PAID', paidAt: now } : o))
    );
    if (currentPaymentOrder && currentPaymentOrder.id === orderId) {
      setCurrentPaymentOrder((prev) =>
        prev ? { ...prev, status: 'PAID', paidAt: now } : null
      );
    }
    // Also increase template sales count
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === targetOrder.template.id ? { ...t, salesCount: t.salesCount + 1 } : t
        )
      );
    }
    showToast(`Pembayaran #${orderId} BERHASIL dikonfirmasi otomatis!`, 'success');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    if (currentPaymentOrder && currentPaymentOrder.id === orderId) {
      setCurrentPaymentOrder((prev) => (prev ? { ...prev, status } : null));
    }
    showToast(`Status pesanan #${orderId} diperbarui menjadi ${status}`, 'success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (currentPaymentOrder?.id === orderId) {
      setCurrentPaymentOrder(null);
    }
    showToast(`Pesanan #${orderId} dihapus`, 'info');
  };

  const addNewTemplate = (
    newTemplate: Omit<WeddingTemplate, 'id' | 'salesCount'>
  ) => {
    const id = `tmpl-${Date.now()}`;
    const fullTemplate: WeddingTemplate = {
      ...newTemplate,
      id,
      salesCount: 0,
    };
    setTemplates((prev) => [fullTemplate, ...prev]);
    showToast(`Template baru "${fullTemplate.name}" berhasil ditambahkan ke katalog!`, 'success');
  };

  const updateTemplatePrice = (templateId: string, newPrice: number) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === templateId ? { ...t, price: newPrice } : t))
    );
    showToast('Harga template berhasil diperbarui', 'success');
  };

  const updateTemplateDemoUrl = (templateId: string, demoUrl: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === templateId ? { ...t, demoUrl: demoUrl.trim() } : t))
    );
    showToast('Link demo web berhasil diperbarui!', 'success');
  };

  const toggleTemplateActive = (templateId: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === templateId ? { ...t, isActive: !t.isActive } : t))
    );
    showToast('Status aktif template di katalog telah diubah', 'info');
  };

  const addGuestRSVP = (rsvp: Omit<GuestRSVP, 'id' | 'createdAt'>) => {
    const newEntry: GuestRSVP = {
      ...rsvp,
      id: `rsvp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setGuestRSVPs((prev) => [newEntry, ...prev]);
    showToast('Konfirmasi kehadiran & ucapan Anda berhasil terkirim!', 'success');
  };

  const resetAllDataToDefault = () => {
    setTemplates(INITIAL_TEMPLATES);
    setOrders(INITIAL_ORDERS);
    setCustomization(DEFAULT_CUSTOMIZATION);
    setSelectedTemplate(INITIAL_TEMPLATES[0]);
    localStorage.removeItem('serenada_templates');
    localStorage.removeItem('serenada_orders');
    localStorage.removeItem('serenada_customization');
    showToast('Seluruh data berhasil di-reset ke data bawaan awal', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        templates,
        orders,
        selectedTemplate,
        customization,
        activeTab,
        currentPaymentOrder,
        guestRSVPs,
        toast,
        setActiveTab,
        selectTemplateForCustomizing,
        updateCustomization,
        createOrderFromDraft,
        simulatePaymentSuccess,
        updateOrderStatus,
        deleteOrder,
        addNewTemplate,
        updateTemplatePrice,
        updateTemplateDemoUrl,
        toggleTemplateActive,
        addGuestRSVP,
        showToast,
        resetAllDataToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
