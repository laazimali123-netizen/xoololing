// ─── Payment Screen ──────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadii } from '../src/constants/theme';
import { initiateEBirrPayment, formatSOS, calculateEscrowFee, calculateTotalWithEscrow } from '../src/lib/ebirr';
import i18n from '../src/i18n';

export default function PaymentScreen() {
  const router = useRouter();
  const { listingId, transactionId } = useLocalSearchParams<{ listingId?: string; transactionId?: string }>();
  const [amount, setAmount] = useState('0');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');

  const numAmount = parseInt(amount) || 0;
  const escrowFee = calculateEscrowFee(numAmount);
  const total = calculateTotalWithEscrow(numAmount);

  const handlePayment = async () => {
    if (!phoneNumber) return Alert.alert('Error', 'Please enter your CBE Birr phone number');
    if (numAmount <= 0) return Alert.alert('Error', 'Invalid amount');
    try {
      setLoading(true);
      setStep('processing');
      const result = await initiateEBirrPayment({
        transactionId: transactionId || listingId || '',
        phoneNumber,
        amount: total,
      });
      if (result.success) {
        setStep('success');
        Alert.alert('Success', 'Payment initiated! Check your CBE Birr for confirmation.');
      } else {
        setStep('form');
        Alert.alert('Error', result.message || 'Payment failed');
      }
    } catch (error: any) {
      setStep('form');
      Alert.alert('Error', error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← {i18n.t('back')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{i18n.t('escrow')}</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{i18n.t('price')}</Text>
            <Text style={styles.summaryValue}>{formatSOS(numAmount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{i18n.t('fee')} (2.5%)</Text>
            <Text style={styles.summaryValue}>{formatSOS(escrowFee)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{i18n.t('total')}</Text>
            <Text style={styles.totalValue}>{formatSOS(total)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{i18n.t('cbe_birr')}</Text>
          <Text style={styles.cardSubtitle}>Pay securely via CBE Birr mobile money</Text>

          <Text style={styles.label}>{i18n.t('payment_phone')}</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+252 6XX XXXXXX"
            keyboardType="phone-pad"
            placeholderTextColor={Colors.textHint}
          />

          {step === 'form' && (
            <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={loading}>
              <Text style={styles.payButtonText}>{i18n.t('fund_escrow')} - {formatSOS(total)}</Text>
            </TouchableOpacity>
          )}

          {step === 'processing' && (
            <View style={styles.processingContainer}>
              <Text style={styles.processingText}>{i18n.t('loading')}</Text>
            </View>
          )}

          {step === 'success' && (
            <View style={styles.successContainer}>
              <Text style={styles.successEmoji}>✓</Text>
              <Text style={styles.successText}>Payment Initiated!</Text>
              <Text style={styles.successSubtext}>Check your CBE Birr app to confirm</Text>
              <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
                <Text style={styles.doneButtonText}>{i18n.t('done')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
  },
  backText: { color: Colors.primary, fontSize: FontSizes.body },
  title: { fontSize: FontSizes.heading, fontWeight: 'bold', color: Colors.text },
  summaryCard: {
    marginHorizontal: Spacing.xl, marginTop: Spacing.lg,
    backgroundColor: Colors.surface, borderRadius: BorderRadii.lg, padding: Spacing.lg,
  },
  summaryTitle: { fontSize: FontSizes.subheading, fontWeight: '600', color: Colors.text, marginBottom: Spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs },
  summaryLabel: { fontSize: FontSizes.body, color: Colors.textSecondary },
  summaryValue: { fontSize: FontSizes.body, color: Colors.text },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.divider, marginTop: Spacing.sm, paddingTop: Spacing.sm },
  totalLabel: { fontSize: FontSizes.subheading, fontWeight: 'bold', color: Colors.text },
  totalValue: { fontSize: FontSizes.subheading, fontWeight: 'bold', color: Colors.primary },
  card: {
    marginHorizontal: Spacing.xl, marginTop: Spacing.lg,
    backgroundColor: Colors.surface, borderRadius: BorderRadii.lg, padding: Spacing.lg,
  },
  cardTitle: { fontSize: FontSizes.subheading, fontWeight: '600', color: Colors.text },
  cardSubtitle: { fontSize: FontSizes.caption, color: Colors.textSecondary, marginTop: Spacing.xs, marginBottom: Spacing.lg },
  label: { fontSize: FontSizes.body, color: Colors.textSecondary, marginBottom: Spacing.xs },
  input: {
    backgroundColor: Colors.background, borderRadius: BorderRadii.md,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: FontSizes.body, color: Colors.text,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg,
  },
  payButton: {
    backgroundColor: Colors.primary, borderRadius: BorderRadii.lg,
    paddingVertical: Spacing.lg, alignItems: 'center',
  },
  payButtonText: { color: '#FFFFFF', fontSize: FontSizes.body, fontWeight: 'bold' },
  processingContainer: { alignItems: 'center', paddingVertical: Spacing.xxl },
  processingText: { fontSize: FontSizes.body, color: Colors.textSecondary },
  successContainer: { alignItems: 'center', paddingVertical: Spacing.xxl },
  successEmoji: { fontSize: 48, color: Colors.success, marginBottom: Spacing.md },
  successText: { fontSize: FontSizes.heading, fontWeight: 'bold', color: Colors.success },
  successSubtext: { fontSize: FontSizes.body, color: Colors.textSecondary, marginTop: Spacing.xs },
  doneButton: {
    marginTop: Spacing.xl, backgroundColor: Colors.primary,
    borderRadius: BorderRadii.lg, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md,
  },
  doneButtonText: { color: '#FFFFFF', fontSize: FontSizes.body, fontWeight: 'bold' },
});
