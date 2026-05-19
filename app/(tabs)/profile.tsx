// ─── Profile Tab ─────────────────────────────────────────────────────
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadii, RoleLabels, StatusColors } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/app-store';
import i18n from '../../src/i18n';
import { Language } from '../../src/types';

const LANGUAGES: { label: string; value: Language; native: string }[] = [
  { label: 'Somali', value: 'so', native: 'Soomaali' },
  { label: 'English', value: 'en', native: 'English' },
  { label: 'Arabic', value: 'ar', native: 'العربية' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout, language, setLanguage } = useAppStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const handleChangeLanguage = async (lang: Language) => {
    await setLanguage(lang);
  };

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.loggedOutContainer}>
        <Text style={styles.loggedOutEmoji}>👤</Text>
        <Text style={styles.loggedOutText}>Please login to view your profile</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.loginButtonText}>{i18n.t('login')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.fullName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{user.fullName}</Text>
        <Text style={styles.userPhone}>{user.phone}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{RoleLabels[user.role] || user.role}</Text>
        </View>
        <View style={[styles.verificationBadge, { backgroundColor: StatusColors[user.verificationStatus] || Colors.disabled }]}>
          <Text style={styles.verificationText}>{user.verificationStatus}</Text>
        </View>
      </View>

      {/* Language Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{i18n.t('language')}</Text>
        <View style={styles.languageRow}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.value}
              style={[styles.langChip, language === lang.value && styles.langChipActive]}
              onPress={() => handleChangeLanguage(lang.value)}
            >
              <Text style={[styles.langText, language === lang.value && styles.langTextActive]}>
                {lang.native}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Text style={styles.menuIcon}>📋</Text>
          <Text style={styles.menuLabel}>{i18n.t('my_listings')}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Text style={styles.menuIcon}>🛒</Text>
          <Text style={styles.menuLabel}>{i18n.t('my_purchases')}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Text style={styles.menuIcon}>💰</Text>
          <Text style={styles.menuLabel}>{i18n.t('my_sales')}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Text style={styles.menuIcon}>🔬</Text>
          <Text style={styles.menuLabel}>{i18n.t('my_inspection')}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={styles.menuLabel}>{i18n.t('notifications')}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuLabel}>{i18n.t('settings')}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        {(user.role === 'MARKET_ADMIN' || user.role === 'GOV_ADMIN') && (
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin')}>
            <Text style={styles.menuIcon}>🛡️</Text>
            <Text style={styles.menuLabel}>{i18n.t('admin_panel')}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{i18n.t('logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 60 },
  profileHeader: {
    backgroundColor: Colors.primary, alignItems: 'center',
    paddingTop: 70, paddingBottom: Spacing.xxl, paddingHorizontal: Spacing.xl,
    borderBottomLeftRadius: BorderRadii.xxl, borderBottomRightRadius: BorderRadii.xxl,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: FontSizes.display, fontWeight: 'bold', color: Colors.primary },
  userName: { fontSize: FontSizes.heading, fontWeight: 'bold', color: '#FFFFFF', marginTop: Spacing.md },
  userPhone: { fontSize: FontSizes.body, color: '#FFFFFF', opacity: 0.8, marginTop: Spacing.xs },
  roleBadge: {
    marginTop: Spacing.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xs,
    borderRadius: BorderRadii.xxl, backgroundColor: Colors.secondary,
  },
  roleText: { color: '#FFFFFF', fontSize: FontSizes.caption, fontWeight: 'bold' },
  verificationBadge: {
    marginTop: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: 2,
    borderRadius: BorderRadii.sm,
  },
  verificationText: { color: '#FFFFFF', fontSize: 10, fontWeight: '600' },
  section: {
    marginTop: Spacing.xl, marginHorizontal: Spacing.xl,
    backgroundColor: Colors.surface, borderRadius: BorderRadii.lg, overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: FontSizes.body, fontWeight: '600', color: Colors.textSecondary,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  languageRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  langChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadii.xxl, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  langChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  langText: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  langTextActive: { color: '#FFFFFF' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  menuIcon: { fontSize: 20, marginRight: Spacing.md },
  menuLabel: { flex: 1, fontSize: FontSizes.body, color: Colors.text },
  menuArrow: { fontSize: FontSizes.heading, color: Colors.textHint },
  logoutButton: {
    marginHorizontal: Spacing.xl, marginTop: Spacing.xxl,
    backgroundColor: Colors.error, borderRadius: BorderRadii.lg,
    paddingVertical: Spacing.lg, alignItems: 'center',
  },
  logoutText: { color: '#FFFFFF', fontSize: FontSizes.subheading, fontWeight: 'bold' },
  loggedOutContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  loggedOutEmoji: { fontSize: 64, marginBottom: Spacing.lg },
  loggedOutText: { fontSize: FontSizes.body, color: Colors.textSecondary, marginBottom: Spacing.xl },
  loginButton: {
    backgroundColor: Colors.primary, borderRadius: BorderRadii.lg,
    paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.lg,
  },
  loginButtonText: { color: '#FFFFFF', fontSize: FontSizes.subheading, fontWeight: 'bold' },
});
