// ─── XooloLing Offline Support ────────────────────────────────────────
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Listing, Transaction, Conversation } from '../types';

const KEYS = {
  CACHED_LISTINGS: '@xoololing:cached_listings',
  CACHED_TRANSACTIONS: '@xoololing:cached_transactions',
  CACHED_CONVERSATIONS: '@xoololing:cached_conversations',
  PENDING_ACTIONS: '@xoololing:pending_actions',
  LAST_SYNC: '@xoololing:last_sync',
};

interface PendingAction {
  id: string;
  type: string;
  payload: any;
  createdAt: string;
  retries: number;
}

class OfflineManager {
  private isOnline: boolean = true;

  setOnlineStatus(online: boolean) {
    this.isOnline = online;
  }

  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  // ─── Cache listings ───────────────────────────────────────────────
  async cacheListings(listings: Listing[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CACHED_LISTINGS, JSON.stringify(listings));
    } catch (e) {
      console.error('Failed to cache listings:', e);
    }
  }

  async getCachedListings(): Promise<Listing[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CACHED_LISTINGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // ─── Cache transactions ──────────────────────────────────────────
  async cacheTransactions(transactions: Transaction[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CACHED_TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to cache transactions:', e);
    }
  }

  async getCachedTransactions(): Promise<Transaction[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CACHED_TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // ─── Cache conversations ─────────────────────────────────────────
  async cacheConversations(conversations: Conversation[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CACHED_CONVERSATIONS, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to cache conversations:', e);
    }
  }

  async getCachedConversations(): Promise<Conversation[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CACHED_CONVERSATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // ─── Pending actions queue ────────────────────────────────────────
  async addPendingAction(type: string, payload: any): Promise<void> {
    try {
      const actions = await this.getPendingActions();
      actions.push({
        id: Date.now().toString(),
        type,
        payload,
        createdAt: new Date().toISOString(),
        retries: 0,
      });
      await AsyncStorage.setItem(KEYS.PENDING_ACTIONS, JSON.stringify(actions));
    } catch (e) {
      console.error('Failed to add pending action:', e);
    }
  }

  async getPendingActions(): Promise<PendingAction[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PENDING_ACTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  async removePendingAction(id: string): Promise<void> {
    try {
      const actions = await this.getPendingActions();
      const filtered = actions.filter((a) => a.id !== id);
      await AsyncStorage.setItem(KEYS.PENDING_ACTIONS, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to remove pending action:', e);
    }
  }

  // ─── Sync tracking ───────────────────────────────────────────────
  async setLastSync(): Promise<void> {
    await AsyncStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
  }

  async getLastSync(): Promise<string | null> {
    return await AsyncStorage.getItem(KEYS.LAST_SYNC);
  }
}

export const offlineManager = new OfflineManager();
export default offlineManager;
