// ─── XooloLing API Client ────────────────────────────────────────────
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, AuthTokens, LoginRequest, RegisterRequest } from '../types';

const BASE_URL = 'https://animalstock.vercel.app/api';

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      if (this.accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry && this.refreshToken) {
          originalRequest._retry = true;
          try {
            const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
              refreshToken: this.refreshToken,
            });
            this.setTokens(data.data);
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
            }
            return this.client(originalRequest);
          } catch {
            this.clearTokens();
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setTokens(tokens: AuthTokens) {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
  }

  // ─── Auth ──────────────────────────────────────────────────────────
  async sendOtp(phone: string): Promise<ApiResponse<{ otpSent: boolean }>> {
    const { data } = await this.client.post('/auth/send-otp', { phone });
    return data;
  }

  async login(req: LoginRequest): Promise<ApiResponse<{ tokens: AuthTokens; user: any }>> {
    const { data } = await this.client.post('/auth/login', req);
    if (data.data?.tokens) this.setTokens(data.data.tokens);
    return data;
  }

  async register(req: RegisterRequest): Promise<ApiResponse<{ tokens: AuthTokens; user: any }>> {
    const { data } = await this.client.post('/auth/register', req);
    if (data.data?.tokens) this.setTokens(data.data.tokens);
    return data;
  }

  async getProfile(): Promise<ApiResponse<any>> {
    const { data } = await this.client.get('/auth/profile');
    return data;
  }

  async updateProfile(updates: Partial<any>): Promise<ApiResponse<any>> {
    const { data } = await this.client.put('/auth/profile', updates);
    return data;
  }

  // ─── Listings ──────────────────────────────────────────────────────
  async getListings(params?: Record<string, any>): Promise<ApiResponse<any>> {
    const { data } = await this.client.get('/listings', { params });
    return data;
  }

  async getListing(id: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.get(`/listings/${id}`);
    return data;
  }

  async createListing(listing: any): Promise<ApiResponse<any>> {
    const { data } = await this.client.post('/listings', listing);
    return data;
  }

  async updateListing(id: string, updates: any): Promise<ApiResponse<any>> {
    const { data } = await this.client.put(`/listings/${id}`, updates);
    return data;
  }

  async deleteListing(id: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.delete(`/listings/${id}`);
    return data;
  }

  // ─── Transactions ──────────────────────────────────────────────────
  async getTransactions(params?: Record<string, any>): Promise<ApiResponse<any>> {
    const { data } = await this.client.get('/transactions', { params });
    return data;
  }

  async getTransaction(id: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.get(`/transactions/${id}`);
    return data;
  }

  async createTransaction(listingId: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.post('/transactions', { listingId });
    return data;
  }

  async fundEscrow(transactionId: string, paymentDetails: any): Promise<ApiResponse<any>> {
    const { data } = await this.client.post(`/transactions/${transactionId}/fund-escrow`, paymentDetails);
    return data;
  }

  async releasePayment(transactionId: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.post(`/transactions/${transactionId}/release`);
    return data;
  }

  async openDispute(transactionId: string, reason: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.post(`/transactions/${transactionId}/dispute`, { reason });
    return data;
  }

  // ─── Chat ──────────────────────────────────────────────────────────
  async getConversations(): Promise<ApiResponse<any>> {
    const { data } = await this.client.get('/chat/conversations');
    return data;
  }

  async getMessages(conversationId: string, params?: Record<string, any>): Promise<ApiResponse<any>> {
    const { data } = await this.client.get(`/chat/conversations/${conversationId}/messages`, { params });
    return data;
  }

  async sendMessage(conversationId: string, text: string, type = 'TEXT'): Promise<ApiResponse<any>> {
    const { data } = await this.client.post(`/chat/conversations/${conversationId}/messages`, { text, type });
    return data;
  }

  // ─── Inspection ────────────────────────────────────────────────────
  async scheduleInspection(transactionId: string, scheduledAt: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.post(`/inspections`, { transactionId, scheduledAt });
    return data;
  }

  async submitInspectionReport(inspectionId: string, report: any): Promise<ApiResponse<any>> {
    const { data } = await this.client.put(`/inspections/${inspectionId}`, report);
    return data;
  }

  // ─── Admin ─────────────────────────────────────────────────────────
  async getAdminDashboard(): Promise<ApiResponse<any>> {
    const { data } = await this.client.get('/admin/dashboard');
    return data;
  }

  async getAdminUsers(params?: Record<string, any>): Promise<ApiResponse<any>> {
    const { data } = await this.client.get('/admin/users', { params });
    return data;
  }

  async verifyUser(userId: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.put(`/admin/users/${userId}/verify`);
    return data;
  }

  async rejectUser(userId: string, reason: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.put(`/admin/users/${userId}/reject`, { reason });
    return data;
  }

  async getAdminListings(params?: Record<string, any>): Promise<ApiResponse<any>> {
    const { data } = await this.client.get('/admin/listings', { params });
    return data;
  }

  async approveListing(listingId: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.put(`/admin/listings/${listingId}/approve`);
    return data;
  }

  async removeListing(listingId: string, reason: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.put(`/admin/listings/${listingId}/remove`, { reason });
    return data;
  }

  // ─── Payments ──────────────────────────────────────────────────────
  async initiatePayment(transactionId: string, method: string, phone: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.post('/payments/initiate', { transactionId, method, phone });
    return data;
  }

  async verifyPayment(reference: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.get(`/payments/verify/${reference}`);
    return data;
  }
}

export const api = new ApiClient();
export default api;
