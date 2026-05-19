// ─── XooloLing App Store (Zustand + AsyncStorage) ────────────────────
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Language, UserRole, AuthTokens, Listing, Transaction, Conversation, AppNotification } from '../types';
import api from '../lib/api';

const STORE_KEY = '@xoololing:app_store';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Language
  language: Language;

  // Data
  listings: Listing[];
  transactions: Transaction[];
  conversations: Conversation[];
  notifications: AppNotification[];

  // UI
  isOffline: boolean;

  // Actions
  initialize: () => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  loginWithOtp: (phone: string, otp: string) => Promise<void>;
  register: (data: { phone: string; fullName: string; role: UserRole; password: string; language: Language; region?: string; district?: string }) => Promise<void>;
  logout: () => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  setUser: (user: User) => void;
  setListings: (listings: Listing[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setConversations: (conversations: Conversation[]) => void;
  addNotification: (notification: AppNotification) => void;
  fetchListings: () => Promise<void>;
  setOffline: (offline: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  language: 'so',
  listings: [],
  transactions: [],
  conversations: [],
  notifications: [],
  isOffline: false,

  initialize: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          user: parsed.user,
          isAuthenticated: !!parsed.user,
          language: parsed.language || 'so',
          isLoading: false,
        });
        if (parsed.user) {
          api.setTokens(parsed.tokens);
        }
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  login: async (phone, password) => {
    set({ isLoading: true });
    try {
      const response = await api.login({ phone, password });
      if (response.success && response.data) {
        const { tokens, user } = response.data;
        await AsyncStorage.setItem(STORE_KEY, JSON.stringify({ user, tokens, language: get().language }));
        api.setTokens(tokens);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
        throw new Error(response.error || 'Login failed');
      }
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  loginWithOtp: async (phone, otp) => {
    set({ isLoading: true });
    try {
      const response = await api.login({ phone, otp });
      if (response.success && response.data) {
        const { tokens, user } = response.data;
        await AsyncStorage.setItem(STORE_KEY, JSON.stringify({ user, tokens, language: get().language }));
        api.setTokens(tokens);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
        throw new Error(response.error || 'OTP login failed');
      }
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.register(data);
      if (response.success && response.data) {
        const { tokens, user } = response.data;
        await AsyncStorage.setItem(STORE_KEY, JSON.stringify({ user, tokens, language: data.language || 'so' }));
        api.setTokens(tokens);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    api.clearTokens();
    await AsyncStorage.removeItem(STORE_KEY);
    set({
      user: null,
      isAuthenticated: false,
      listings: [],
      transactions: [],
      conversations: [],
      notifications: [],
    });
  },

  setLanguage: async (lang) => {
    set({ language: lang });
    const state = get();
    await AsyncStorage.setItem(STORE_KEY, JSON.stringify({
      user: state.user,
      language: lang,
    }));
  },

  setUser: (user) => set({ user }),

  setListings: (listings) => set({ listings }),

  setTransactions: (transactions) => set({ transactions }),

  setConversations: (conversations) => set({ conversations }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  fetchListings: async () => {
    try {
      const response = await api.getListings();
      if (response.success && response.data) {
        set({ listings: response.data.items || response.data });
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    }
  },

  setOffline: (offline) => set({ isOffline: offline }),
}));
