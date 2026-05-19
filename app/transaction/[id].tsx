// ─── Transaction Detail Screen ───────────────────────────────────────
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadii, StatusColors, AnimalEmoji } from '../../src/constants/theme';
import api from '../../src/lib/api';
import { Transaction } from '../../src/types';
import i18n from '../../src/i18n';

const STATUS_STEPS: Transaction['status'][] = [
  'PENDING', 'ESCROW_FUNDED', 'INSPECTION', 'APPROVED', 'COMPLETED',
];

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadTransaction(); }, [id]);

  const loadTransaction = async () => {
    try {
      const response = await api.getTransaction(id);
      if (response.success && response.data) setTransaction(response.data);
    } catch {
      Alert.alert('Error', 'Failed to load transaction');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !transaction) {
    return <View style={styles.center}><Text>{i18n.t('loading')}</Text></View>;
  }

  const currentStepIndex = STATUS_STEPS.indexOf(transaction.status);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('transaction')}</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Status */}
      <View style={styles.statusCard}>
        <View style={[styles.statusBadge, { backgroundColor: StatusColors[transaction.status] || Colors.disabled }]}>
          <Text style={styles.statusText}>{transaction.status}</Text>
        </View>
        <Text style={styles.amount}>{transaction.amount.toLocaleString()} SOS</Text>
      </View>

      {/* Progress */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progress</Text>
        <View style={styles.progressRow}>
          {STATUS_STEPS.map((step, i) => (
            <View key={step} style={styles.progressStep}>
              <View style={[styles.progressDot, i <= currentStepIndex && styles.progressDotActive]} />
              {i < STATUS_STEPS.length - 1 && (
                <View style={[styles.progressLine, i < currentStepIndex && styles.progressLineActive]} />
              )}
              <Text style={[styles.progressLabel, i <= currentStepIndex && styles.progressLabelActive]}>
                {step.replace('_', ' ')}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Animal Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Animal</Text>
        <View style={styles.animalRow}>
          <Text style={styles.animalEmoji}>{AnimalEmoji[transaction.animal.type]}</Text>
          <View>
            <Text style={styles.animalBreed}>{transaction.animal.breed}</Text>
            <Text style={styles.animalDetails}>
              {transaction.animal.gender === 'MALE' ? '♂' : '♀'} {transaction.animal.age} {transaction.animal.ageUnit.toLowerCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      {transaction.status === 'PENDING' && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/payment?transactionId=${transaction.id}`)}
        >
          <Text style={styles.actionButtonText}>{i18n.t('fund_escrow')}</Text>
        </TouchableOpacity>
      )}

      {transaction.status === 'ESCROW_FUNDED' && (
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Inspection', 'Scheduling inspection...')}>
          <Text style={styles.actionButtonText}>{i18n.t('schedule_inspection')}</Text>
        </TouchableOpacity>
      )}

      {transaction.status === 'APPROVED' && (
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Release', 'Releasing payment...')}>
          <Text style={styles.actionButtonText}>{i18n.t('release_payment')}</Text>
        </TouchableOpacity>
      )}

      {(transaction.status === 'ESCROW_FUNDED' || transaction.status === 'INSPECTION') && (
        <TouchableOpacity
          style={[styles.actionButton, styles.disputeButton]}
          onPress={() => Alert.alert('Dispute', 'Opening dispute...')}
        >
          <Text style={[styles.actionButtonText, styles.disputeButtonText]}>{i18n.t('open_dispute')}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
  },
  backText: { color: Colors.primary, fontSize: FontSizes.body },
  headerTitle: { fontSize: FontSizes.heading, fontWeight: 'bold', color: Colors.text },
  statusCard: { marginHorizontal: Spacing.xl, padding: Spacing.xl, backgroundColor: Colors.surface, borderRadius: BorderRadii.lg, alignItems: 'center', gap: Spacing.md },
  statusBadge: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadii.xxl },
  statusText: { color: '#FFFFFF', fontSize: FontSizes.body, fontWeight: 'bold' },
  amount: { fontSize: FontSizes.display, fontWeight: 'bold', color: Colors.text },
  card: { marginHorizontal: Spacing.xl, marginTop: Spacing.lg, backgroundColor: Colors.surface, borderRadius: BorderRadii.lg, padding: Spacing.lg },
  cardTitle: { fontSize: FontSizes.subheading, fontWeight: '600', color: Colors.text, marginBottom: Spacing.md },
  progressRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  progressStep: { alignItems: 'center', flex: 1 },
  progressDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.border, marginBottom: Spacing.xs },
  progressDotActive: { backgroundColor: Colors.primary },
  progressLine: { height: 2, backgroundColor: Colors.border, width: '100%', marginTop: 5 },
  progressLineActive: { backgroundColor: Colors.primary },
  progressLabel: { fontSize: 9, color: Colors.textHint, textAlign: 'center' },
  progressLabelActive: { color: Colors.primary, fontWeight: '600' },
  animalRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  animalEmoji: { fontSize: 36 },
  animalBreed: { fontSize: FontSizes.subheading, fontWeight: '600', color: Colors.text },
  animalDetails: { fontSize: FontSizes.caption, color: Colors.textSecondary, marginTop: 2 },
  actionButton: { marginHorizontal: Spacing.xl, marginTop: Spacing.xl, backgroundColor: Colors.primary, borderRadius: BorderRadii.lg, paddingVertical: Spacing.lg, alignItems: 'center' },
  actionButtonText: { color: '#FFFFFF', fontSize: FontSizes.subheading, fontWeight: 'bold' },
  disputeButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors.error },
  disputeButtonText: { color: Colors.error },
});
