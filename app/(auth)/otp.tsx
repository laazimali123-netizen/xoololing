// ─── OTP Verification Screen ──────────────────────────────────────────
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadii } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/app-store';
import i18n from '../../src/i18n';

export default function OtpScreen() {
  const router = useRouter();
  const { loginWithOtp } = useAppStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const refs = useRef<(TextInput | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      return Alert.alert(i18n.t('error'), 'Please enter the 6-digit code');
    }
    try {
      setLoading(true);
      await loginWithOtp('', code);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(i18n.t('error'), error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>{i18n.t('back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{i18n.t('verify_otp')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to your phone</Text>
        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(ref) => { refs.current[i] = ref; }}
              style={styles.otpInput}
              value={digit}
              onChangeText={(v) => handleChange(i, v)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify} disabled={loading}>
          <Text style={styles.verifyButtonText}>
            {loading ? i18n.t('loading') : i18n.t('verify_otp')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendButton}>
          <Text style={styles.resendText}>{i18n.t('resend_otp')}</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  content: { paddingHorizontal: Spacing.xl, alignItems: 'center', marginTop: Spacing.xxl },
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xxl },
  otpRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xxl },
  otpInput: {
    width: 48, height: 56, borderRadius: BorderRadii.md,
    backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border,
    fontSize: FontSizes.heading, color: Colors.text,
  },
  verifyButton: {
    backgroundColor: Colors.primary, borderRadius: BorderRadii.lg,
    paddingVertical: Spacing.lg, alignItems: 'center', width: '100%',
  },
  verifyButtonText: { color: '#FFFFFF', fontSize: FontSizes.subheading, fontWeight: 'bold' },
  resendButton: { marginTop: Spacing.xl, paddingVertical: Spacing.md },
  resendText: { color: Colors.primary, fontSize: FontSizes.body },
});
