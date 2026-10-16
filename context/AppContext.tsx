'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WeddingTemplate,
  Order,
  CustomizationData,
  PaymentMethodType,
  OrderStatus,
  GuestRSVP,
  UserAccount,
  UserRole,
} from '@/types';
import {
  INITIAL_TEMPLATES,
  DEFAULT_CUSTOMIZATION,
  INITIAL_ORDERS,
} from '@/data/initialData';

export const DEFAULT_ADMIN_WA = '6281234567890';

export const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'user-admin',
    name: 'Administrator Serenada',
    email: 'admin@serenada.id',
    role: 'admin',
    phone: '081234567890',
  },
  {
    id: 'user-client',
    name: 'Dimas Prasetyo (Calon Pengantin)',
    email: 'user@serenada.id',
    role: 'user',
    phone: '081298765432',
  },
];

interface AppContextType {
  currentUser: UserAccount | null;
  adminWhatsApp: string;
  templates: WeddingTemplate[];
  orders: Order[];
  selectedTemplate: WeddingTemplate;
  customization: CustomizationData;
  activeTab: 'catalog' | 'studio' | 'checkout' | 'admin' | 'guest_preview';
  currentPaymentOrder: Order | null;
  guestRSVPs: GuestRSVP[];
  toast: { message: string; type?: 'success' | 'info' | 'warning' } | null;
  setActiveTab: (tab: 'catalog' | 'studio' | 'checkout' | 'admin' | 'guest_preview') => void;
  login: (email: string, password?: string) => boolean;
  register: (name: string, email: string, password?: string, role?: UserRole) => boolean;
  logout: () => void;
  quickLoginDemo: (role: UserRole) => void;
  updateAdminWhatsApp: (phone: string) => void;
  selectTemplateForCustomizing: (template: WeddingTemplate) => void;
  updateCustomization: (patch: Partial<CustomizationData>) => void;
  createOrderFromDraft: (customer: {
    name: string;
    phone: string;
    email: string;
    paymentMethod: PaymentMethodType;
    paymentProofImage?: string;
  }) => Order;
  submitPaymentProof: (orderId: string, proofImage: string) => void;
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
  // Current logged in user (null = not logged in, shows AuthGate)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('serenada_current_user');
        if (saved) return JSON.parse(saved);
      } catch {
        // storage disabled
      }
    }
    return null;
  });

  const [adminWhatsApp, setAdminWhatsApp] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('serenada_admin_wa');
        if (saved) return saved;
      } catch {
        // storage disabled
      }
    }
    return DEFAULT_ADMIN_WA;
  });

  const [registeredAccounts, setRegisteredAccounts] = useState<UserAccount[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('serenada_users');
        if (saved) return JSON.parse(saved);
      } catch {
        // storage disabled
      }
    }
    return INITIAL_ACCOUNTS;
  });

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

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('serenada_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('serenada_current_user');
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('serenada_admin_wa', adminWhatsApp);
    } catch {}
  }, [adminWhatsApp]);

  useEffect(() => {
    try {
      localStorage.setItem('serenada_users', JSON.stringify(registeredAccounts));
    } catch {}
  }, [registeredAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem('serenada_templates', JSON.stringify(templates));
    } catch {}
  }, [templates]);

  useEffect(() => {
    try {
      localStorage.setItem('serenada_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('serenada_customization', JSON.stringify(customization));
    } catch {}
  }, [customization]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const login = (email: string, _password?: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    const found = registeredAccounts.find((a) => a.email.toLowerCase() === trimmed);
    if (found) {
      setCurrentUser(found);
      setActiveTab(found.role === 'admin' ? 'admin' : 'catalog');
      showToast(`Selamat datang kembali, ${found.name}!`, 'success');
      return true;
    }
    // Auto-login fallback if user typed any email
    const fallbackRole: UserRole = trimmed.includes('admin') ? 'admin' : 'user';
    const newAcct: UserAccount = {
      id: `user-${Date.now()}`,
      name: trimmed.split('@')[0],
      email: trimmed,
      role: fallbackRole,
    };
    setRegisteredAccounts((prev) => [...prev, newAcct]);
    setCurrentUser(newAcct);
    setActiveTab(fallbackRole === 'admin' ? 'admin' : 'catalog');
    showToast(`Berhasil masuk sebagai ${fallbackRole === 'admin' ? 'Admin' : 'Pengguna'}!`, 'success');
    return true;
  };

  const register = (name: string, email: string, _password?: string, role: UserRole = 'user'): boolean => {
    const trimmed = email.trim().toLowerCase();
    const existing = registeredAccounts.find((a) => a.email.toLowerCase() === trimmed);
    if (existing) {
      showToast('Email sudah terdaftar. Silakan login.', 'warning');
      return false;
    }
    const newAcct: UserAccount = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'Calon Pengantin',
      email: trimmed,
      role,
    };
    setRegisteredAccounts((prev) => [...prev, newAcct]);
    setCurrentUser(newAcct);
    setActiveTab(role === 'admin' ? 'admin' : 'catalog');
    showToast(`Registrasi akun berhasil! Selamat datang, ${newAcct.name}.`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('catalog');
    showToast('Anda telah berhasil keluar (logout).', 'info');
  };

  const quickLoginDemo = (role: UserRole) => {
    if (role === 'admin') {
      const adminAcct = registeredAccounts.find((a) => a.role === 'admin') || INITIAL_ACCOUNTS[0];
      setCurrentUser(adminAcct);
      setActiveTab('admin');
      showToast('Masuk sebagai Admin Bisnis Serenada', 'success');
    } else {
      const userAcct = registeredAccounts.find((a) => a.role === 'user') || INITIAL_ACCOUNTS[1];
      setCurrentUser(userAcct);
      setActiveTab('catalog');
      showToast('Masuk sebagai Calon Pengantin (User)', 'success');
    }
  };

  const updateAdminWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    setAdminWhatsApp(cleanPhone || DEFAULT_ADMIN_WA);
    showToast('Nomor WhatsApp Admin berhasil diperbarui!', 'success');
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
    paymentProofImage?: string;
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
      status: customer.paymentMethod === 'qris_manual' && customer.paymentProofImage ? 'IN_PROCESSING' : 'PENDING_PAYMENT',
      createdAt: new Date().toISOString(),
      invitationSlug: slug,
      paymentProofImage: customer.paymentProofImage,
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    setCurrentPaymentOrder(newOrder);
    setActiveTab('checkout');
    showToast(`Pesanan #${newId} berhasil dibuat!`, 'info');
    return newOrder;
  };

  const submitPaymentProof = (orderId: string, proofImage: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, paymentProofImage: proofImage, status: 'IN_PROCESSING' }
          : o
      )
    );
    if (currentPaymentOrder && currentPaymentOrder.id === orderId) {
      setCurrentPaymentOrder((prev) =>
        prev
          ? { ...prev, paymentProofImage: proofImage, status: 'IN_PROCESSING' }
          : null
      );
    }
    showToast('Bukti transfer berhasil diunggah! Siap dikirim ke WhatsApp Admin.', 'success');
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
    setAdminWhatsApp(DEFAULT_ADMIN_WA);
    setRegisteredAccounts(INITIAL_ACCOUNTS);
    localStorage.removeItem('serenada_templates');
    localStorage.removeItem('serenada_orders');
    localStorage.removeItem('serenada_customization');
    localStorage.removeItem('serenada_admin_wa');
    showToast('Seluruh data berhasil di-reset ke data bawaan awal', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        adminWhatsApp,
        templates,
        orders,
        selectedTemplate,
        customization,
        activeTab,
        currentPaymentOrder,
        guestRSVPs,
        toast,
        setActiveTab,
        login,
        register,
        logout,
        quickLoginDemo,
        updateAdminWhatsApp,
        selectTemplateForCustomizing,
        updateCustomization,
        createOrderFromDraft,
        submitPaymentProof,
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
