// ─── Login Screen ────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadii } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/app-store';
import i18n from '../../src/i18n';
import api from '../../src/lib/api';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginWithOtp } = useAppStore();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone) return Alert.alert(i18n.t('error'), 'Please enter your phone number');
    try {
      setLoading(true);
      await api.sendOtp(phone);
      setOtpSent(true);
      Alert.alert(i18n.t('success'), 'OTP sent to your phone');
    } catch (error: any) {
      Alert.alert(i18n.t('error'), error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!phone) return Alert.alert(i18n.t('error'), 'Please enter your phone number');
    try {
      setLoading(true);
      if (useOtp && otp) {
        await loginWithOtp(phone, otp);
      } else if (password) {
        await login(phone, password);
      } else {
        Alert.alert(i18n.t('error'), 'Please enter password or use OTP');
        return;
      }
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(i18n.t('error'), error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>{i18n.t('back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{i18n.t('login')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>{i18n.t('phone')}</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+252 6XX XXXXXX"
          keyboardType="phone-pad"
          placeholderTextColor={Colors.textHint}
        />

        {useOtp ? (
          <>
            <TouchableOpacity style={styles.otpButton} onPress={handleSendOtp} disabled={loading}>
              <Text style={styles.otpButtonText}>{otpSent ? i18n.t('resend_otp') : i18n.t('send_otp')}</Text>
            </TouchableOpacity>
            {otpSent && (
              <>
                <Text style={styles.label}>{i18n.t('otp')}</Text>
                <TextInput
                  style={styles.input}
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="000000"
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholderTextColor={Colors.textHint}
                />
              </>
            )}
          </>
        ) : (
          <>
            <Text style={styles.label}>{i18n.t('password')}</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              secureTextEntry
              placeholderTextColor={Colors.textHint}
            />
          </>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.submitButtonText}>
            {loading ? i18n.t('loading') : i18n.t('login')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toggleButton} onPress={() => setUseOtp(!useOtp)}>
          <Text style={styles.toggleButtonText}>
            {useOtp ? i18n.t('password') : i18n.t('otp')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.registerLink}>{i18n.t('register')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl,
  },
  backButton: { color: Colors.primary, fontSize: FontSizes.body },
  title: { fontSize: FontSizes.heading, fontWeight: 'bold', color: Colors.text },
  form: { paddingHorizontal: Spacing.xl, gap: Spacing.md },
  label: { fontSize: FontSizes.body, color: Colors.textSecondary, marginBottom: Spacing.xs },
  input: {
    backgroundColor: Colors.surface, borderRadius: BorderRadii.md,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: FontSizes.body, color: Colors.text,
    borderWidth: 1, borderColor: Colors.border,
  },
  otpButton: { alignSelf: 'flex-end', paddingVertical: Spacing.sm },
  otpButtonText: { color: Colors.primary, fontSize: FontSizes.body },
  submitButton: {
    backgroundColor: Colors.primary, borderRadius: BorderRadii.lg,
    paddingVertical: Spacing.lg, alignItems: 'center', marginTop: Spacing.lg,
  },
  submitButtonText: { color: '#FFFFFF', fontSize: FontSizes.subheading, fontWeight: 'bold' },
  toggleButton: { alignItems: 'center', paddingVertical: Spacing.md },
  toggleButtonText: { color: Colors.primary, fontSize: FontSizes.body },
  registerLink: { textAlign: 'center', color: Colors.accent, fontSize: FontSizes.body, marginTop: Spacing.sm },
});
