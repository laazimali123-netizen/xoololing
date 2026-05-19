// ─── XooloLing Type Definitions ───────────────────────────────────────

export type UserRole =
  | 'RURAL_AGENT'
  | 'CITY_AGENT'
  | 'VET'
  | 'EXPORTER'
  | 'BUYER'
  | 'MARKET_ADMIN'
  | 'GOV_ADMIN';

export type AnimalType = 'CATTLE' | 'GOAT' | 'SHEEP' | 'CAMEL' | 'DONKEY' | 'HORSE';
export type AnimalGender = 'MALE' | 'FEMALE';
export type AnimalHealth = 'HEALTHY' | 'SICK' | 'QUARANTINED' | 'VACCINATED';
export type ListingStatus = 'DRAFT' | 'ACTIVE' | 'SOLD' | 'EXPIRED' | 'REMOVED';
export type TransactionStatus =
  | 'PENDING'
  | 'ESCROW_FUNDED'
  | 'INSPECTION'
  | 'APPROVED'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'CANCELLED'
  | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type Language = 'so' | 'en' | 'ar';

// ─── User ────────────────────────────────────────────────────────────
export interface User {
  id: string;
  phone: string;
  fullName: string;
  role: UserRole;
  language: Language;
  avatarUrl?: string;
  verificationStatus: VerificationStatus;
  location?: { region: string; district: string; coordinates?: [number, number] };
  createdAt: string;
}

// ─── Animal / Listing ────────────────────────────────────────────────
export interface Animal {
  id: string;
  type: AnimalType;
  breed: string;
  age: number;
  ageUnit: 'MONTHS' | 'YEARS';
  gender: AnimalGender;
  weight?: number;
  healthStatus: AnimalHealth;
  description: string;
  images: string[];
  vaccinationRecords: VaccinationRecord[];
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  animal: Animal;
  price: number;
  currency: 'SOS';
  location: { region: string; district: string; market?: string };
  status: ListingStatus;
  verifiedBy?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface VaccinationRecord {
  id: string;
  disease: string;
  date: string;
  vetId?: string;
  vetName?: string;
  certificateUrl?: string;
}

// ─── Transaction ─────────────────────────────────────────────────────
export interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  animal: Animal;
  amount: number;
  currency: 'SOS';
  status: TransactionStatus;
  escrowFundedAt?: string;
  inspectionScheduledAt?: string;
  completedAt?: string;
  disputeReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Payment ─────────────────────────────────────────────────────────
export interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  currency: 'SOS';
  method: 'CBE_BIRR';
  status: PaymentStatus;
  reference: string;
  phoneNumber: string;
  createdAt: string;
}

// ─── Chat ────────────────────────────────────────────────────────────
export interface Conversation {
  id: string;
  participants: { id: string; name: string; avatar?: string }[];
  lastMessage?: Message;
  unreadCount: number;
  listingId?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  type: 'TEXT' | 'IMAGE' | 'LISTING_SHARE' | 'SYSTEM';
  readAt?: string;
  createdAt: string;
}

// ─── Notification ────────────────────────────────────────────────────
export interface AppNotification {
  id: string;
  type: 'LISTING_SOLD' | 'NEW_MESSAGE' | 'PAYMENT_RECEIVED' | 'INSPECTION_SCHEDULED' | 'VERIFICATION_UPDATE' | 'DISPUTE_OPENED';
  title: string;
  body: string;
  data?: Record<string, string>;
  read: boolean;
  createdAt: string;
}

// ─── Auth ────────────────────────────────────────────────────────────
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  phone: string;
  password?: string;
  otp?: string;
}

export interface RegisterRequest {
  phone: string;
  fullName: string;
  role: UserRole;
  password: string;
  language: Language;
  region?: string;
  district?: string;
}

// ─── API Response ────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
