// ─── Admin Panel Screen ──────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadii, StatusColors } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/app-store';
import api from '../../src/lib/api';
import i18n from '../../src/i18n';

interface AdminStats {
  totalUsers: number;
  totalListings: number;
  totalTransactions: number;
  pendingVerifications: number;
  activeListings: number;
  revenue: number;
}

export default function AdminScreen() {
  const router = useRouter();
  const { user } = useAppStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'listings'>('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role !== 'MARKET_ADMIN' && user?.role !== 'GOV_ADMIN') {
      Alert.alert('Access Denied', 'You do not have admin access');
      router.back();
      return;
    }
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.getAdminDashboard();
      if (response.success && response.data) setStats(response.data);
    } catch {}
  };

  const loadUsers = async () => {
    try {
      const response = await api.getAdminUsers({ status: 'PENDING' });
      if (response.success && response.data) setUsers(response.data.items || response.data);
    } catch {}
  };

  const loadListings = async () => {
    try {
      const response = await api.getAdminListings({ status: 'ACTIVE' });
      if (response.success && response.data) setListings(response.data.items || response.data);
    } catch {}
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadDashboard(), activeTab === 'users' ? loadUsers() : activeTab === 'listings' ? loadListings() : Promise.resolve()]);
    setRefreshing(false);
  };

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'listings') loadListings();
  }, [activeTab]);

  const handleVerify = async (userId: string) => {
    try {
      await api.verifyUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      Alert.alert('Success', 'User verified');
    } catch { Alert.alert('Error', 'Failed to verify user'); }
  };

  const handleApproveListing = async (listingId: string) => {
    try {
      await api.approveListing(listingId);
      setListings((prev) => prev.filter((l) => l.id !== listingId));
      Alert.alert('Success', 'Listing approved');
    } catch { Alert.alert('Error', 'Failed to approve listing'); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('admin_panel')}</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(['overview', 'users', 'listings'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
      >
        {activeTab === 'overview' && stats && (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}><Text style={styles.statValue}>{stats.totalUsers}</Text><Text style={styles.statLabel}>Users</Text></View>
            <View style={styles.statCard}><Text style={styles.statValue}>{stats.totalListings}</Text><Text style={styles.statLabel}>Listings</Text></View>
            <View style={styles.statCard}><Text style={styles.statValue}>{stats.totalTransactions}</Text><Text style={styles.statLabel}>Transactions</Text></View>
            <View style={styles.statCard}><Text style={styles.statValue}>{stats.pendingVerifications}</Text><Text style={styles.statLabel}>Pending</Text></View>
          </View>
        )}

        {activeTab === 'users' && users.map((u) => (
          <View key={u.id} style={styles.listItem}>
            <View style={styles.listItemAvatar}><Text style={styles.listItemAvatarText}>{u.fullName?.charAt(0) || '?'}</Text></View>
            <View style={styles.listItemInfo}>
              <Text style={styles.listItemTitle}>{u.fullName}</Text>
              <Text style={styles.listItemSub}>{u.phone} - {u.role}</Text>
            </View>
            <TouchableOpacity style={styles.verifyBtn} onPress={() => handleVerify(u.id)}>
              <Text style={styles.verifyBtnText}>Verify</Text>
            </TouchableOpacity>
          </View>
        ))}

        {activeTab === 'listings' && listings.map((l) => (
          <View key={l.id} style={styles.listItem}>
            <View style={styles.listItemInfo}>
              <Text style={styles.listItemTitle}>{l.animal?.breed || 'Unknown'}</Text>
              <Text style={styles.listItemSub}>{l.price?.toLocaleString()} SOS</Text>
            </View>
            <TouchableOpacity style={styles.verifyBtn} onPress={() => handleApproveListing(l.id)}>
              <Text style={styles.verifyBtnText}>Approve</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
  },
  backText: { color: Colors.primary, fontSize: FontSizes.body },
  headerTitle: { fontSize: FontSizes.heading, fontWeight: 'bold', color: Colors.text },
  tabRow: { flexDirection: 'row', paddingHorizontal: Spacing.xl, marginBottom: Spacing.md, gap: Spacing.sm },
  tab: {
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    borderRadius: BorderRadii.xxl, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  tabTextActive: { color: '#FFFFFF' },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  statCard: {
    width: '47%', backgroundColor: Colors.surface, borderRadius: BorderRadii.lg,
    padding: Spacing.lg, alignItems: 'center',
  },
  statValue: { fontSize: FontSizes.display, fontWeight: 'bold', color: Colors.primary },
  statLabel: { fontSize: FontSizes.caption, color: Colors.textSecondary, marginTop: Spacing.xs },
  listItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: BorderRadii.lg, padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.md,
  },
  listItemAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  listItemAvatarText: { color: '#FFFFFF', fontWeight: 'bold' },
  listItemInfo: { flex: 1 },
  listItemTitle: { fontSize: FontSizes.body, fontWeight: '600', color: Colors.text },
  listItemSub: { fontSize: FontSizes.caption, color: Colors.textSecondary, marginTop: 2 },
  verifyBtn: { backgroundColor: Colors.success, borderRadius: BorderRadii.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  verifyBtnText: { color: '#FFFFFF', fontSize: FontSizes.caption, fontWeight: 'bold' },
});
