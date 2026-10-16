export type UserRole = 'admin' | 'user';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export type TemplateCategory = 'Botanical' | 'Monogram' | 'Minimalist' | 'Traditional' | 'Floral' | 'Modern';

export interface WeddingTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  price: number;
  originalPrice: number;
  coverImage: string;
  description: string;
  badge?: string;
  demoUrl?: string;
  palette: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    accent: string;
  };
  features: string[];
  isActive: boolean;
  salesCount: number;
}

export interface CustomizationData {
  groomName: string;
  groomNickname: string;
  groomParents: string;
  brideName: string;
  brideNickname: string;
  brideParents: string;
  weddingDate: string;
  weddingTime: string;
  receptionTime: string;
  venueName: string;
  venueCity: string;
  venueAddress: string;
  loveQuote: string;
  musicTitle: string;
  selectedColorTone: string;
}

export type PaymentMethodType = 'qris' | 'qris_manual' | 'va_bca' | 'va_mandiri' | 'va_bri' | 'va_bni';

export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'IN_PROCESSING' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  template: WeddingTemplate;
  customization: CustomizationData;
  amount: number;
  paymentMethod: PaymentMethodType;
  vaNumber?: string;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
  invitationSlug: string;
  notes?: string;
  paymentProofImage?: string;
  waConfirmationSent?: boolean;
}

export interface GuestRSVP {
  id: string;
  guestName: string;
  attendance: 'attending' | 'declined' | 'tentative';
  guestCount: number;
  wishes: string;
  createdAt: string;
}
