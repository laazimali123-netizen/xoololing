// ─── Register Screen ─────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadii } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/app-store';
import { UserRole, Language } from '../../src/types';
import i18n from '../../src/i18n';

const ROLES: { label: string; value: UserRole }[] = [
  { label: 'Rural Agent', value: 'RURAL_AGENT' },
  { label: 'City Agent', value: 'CITY_AGENT' },
  { label: 'Veterinarian', value: 'VET' },
  { label: 'Exporter', value: 'EXPORTER' },
  { label: 'Buyer', value: 'BUYER' },
];

const LANGUAGES: { label: string; value: Language }[] = [
  { label: 'Soomaali', value: 'so' },
  { label: 'English', value: 'en' },
  { label: 'العربية', value: 'ar' },
];

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAppStore();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('BUYER');
  const [language, setLanguage] = useState<Language>('so');
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !phone || !password) {
      return Alert.alert(i18n.t('error'), 'Please fill in all required fields');
    }
    if (password !== confirmPassword) {
      return Alert.alert(i18n.t('error'), 'Passwords do not match');
    }
    if (password.length < 6) {
      return Alert.alert(i18n.t('error'), 'Password must be at least 6 characters');
    }
    try {
      setLoading(true);
      await register({ phone, fullName, role, password, language, region, district });
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(i18n.t('error'), error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>{i18n.t('back')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{i18n.t('register')}</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>{i18n.t('full_name')} *</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Your full name" placeholderTextColor={Colors.textHint} />

          <Text style={styles.label}>{i18n.t('phone')} *</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+252 6XX XXXXXX" keyboardType="phone-pad" placeholderTextColor={Colors.textHint} />

          <Text style={styles.label}>{i18n.t('password')} *</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Min 6 characters" secureTextEntry placeholderTextColor={Colors.textHint} />

          <Text style={styles.label}>{i18n.t('confirm_password')} *</Text>
          <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter password" secureTextEntry placeholderTextColor={Colors.textHint} />

          <Text style={styles.label}>Role *</Text>
          <View style={styles.roleGrid}>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r.value}
                style={[styles.roleChip, role === r.value && styles.roleChipActive]}
                onPress={() => setRole(r.value)}
              >
                <Text style={[styles.roleChipText, role === r.value && styles.roleChipTextActive]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{i18n.t('language')}</Text>
          <View style={styles.roleGrid}>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.value}
                style={[styles.roleChip, language === l.value && styles.roleChipActive]}
                onPress={() => setLanguage(l.value)}
              >
                <Text style={[styles.roleChipText, language === l.value && styles.roleChipTextActive]}>
                  {l.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{i18n.t('region')}</Text>
          <TextInput style={styles.input} value={region} onChangeText={setRegion} placeholder="e.g. Banadir" placeholderTextColor={Colors.textHint} />

          <Text style={styles.label}>{i18n.t('district')}</Text>
          <TextInput style={styles.input} value={district} onChangeText={setDistrict} placeholder="e.g. Hodan" placeholderTextColor={Colors.textHint} />

          <TouchableOpacity style={styles.submitButton} onPress={handleRegister} disabled={loading}>
            <Text style={styles.submitButtonText}>
              {loading ? i18n.t('loading') : i18n.t('register')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginLink}>{i18n.t('login')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl,
  },
  backButton: { color: Colors.primary, fontSize: FontSizes.body },
  title: { fontSize: FontSizes.heading, fontWeight: 'bold', color: Colors.text },
  form: { paddingHorizontal: Spacing.xl, gap: Spacing.sm },
  label: { fontSize: FontSizes.body, color: Colors.textSecondary, marginTop: Spacing.sm },
  input: {
    backgroundColor: Colors.surface, borderRadius: BorderRadii.md,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: FontSizes.body, color: Colors.text,
    borderWidth: 1, borderColor: Colors.border,
  },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  roleChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadii.xxl, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  roleChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  roleChipText: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  roleChipTextActive: { color: '#FFFFFF' },
  submitButton: {
    backgroundColor: Colors.primary, borderRadius: BorderRadii.lg,
    paddingVertical: Spacing.lg, alignItems: 'center', marginTop: Spacing.xl,
  },
  submitButtonText: { color: '#FFFFFF', fontSize: FontSizes.subheading, fontWeight: 'bold' },
  loginLink: { textAlign: 'center', color: Colors.accent, fontSize: FontSizes.body, marginTop: Spacing.md },
});
