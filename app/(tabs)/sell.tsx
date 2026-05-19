// ─── Sell Tab ────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadii, AnimalEmoji } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/app-store';
import { AnimalType, AnimalGender, AnimalHealth } from '../../src/types';
import api from '../../src/lib/api';
import i18n from '../../src/i18n';

const ANIMAL_TYPES: AnimalType[] = ['CATTLE', 'GOAT', 'SHEEP', 'CAMEL', 'DONKEY', 'HORSE'];
const GENDERS: AnimalGender[] = ['MALE', 'FEMALE'];
const HEALTH: AnimalHealth[] = ['HEALTHY', 'VACCINATED', 'SICK', 'QUARANTINED'];

export default function SellScreen() {
  const router = useRouter();
  const { user } = useAppStore();
  const [type, setType] = useState<AnimalType>('CATTLE');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [ageUnit, setAgeUnit] = useState<'MONTHS' | 'YEARS'>('YEARS');
  const [gender, setGender] = useState<AnimalGender>('MALE');
  const [weight, setWeight] = useState('');
  const [healthStatus, setHealthStatus] = useState<AnimalHealth>('HEALTHY');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!breed || !age || !price || !region || !district) {
      return Alert.alert('Error', 'Please fill in all required fields');
    }
    try {
      setLoading(true);
      await api.createListing({
        animal: { type, breed, age: parseInt(age), ageUnit, gender, weight: weight ? parseFloat(weight) : undefined, healthStatus, description, images: [], vaccinationRecords: [] },
        price: parseInt(price),
        location: { region, district },
      });
      Alert.alert('Success', 'Listing created successfully!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>{i18n.t('new_listing')}</Text>

      {/* Animal Type */}
      <Text style={styles.label}>Type *</Text>
      <View style={styles.chipRow}>
        {ANIMAL_TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.chip, type === t && styles.chipActive]}
            onPress={() => setType(t)}
          >
            <Text style={styles.chipEmoji}>{AnimalEmoji[t]}</Text>
            <Text style={[styles.chipText, type === t && styles.chipTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Breed *</Text>
      <TextInput style={styles.input} value={breed} onChangeText={setBreed} placeholder="e.g. Boran, Galla" placeholderTextColor={Colors.textHint} />

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Age *</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="Age" placeholderTextColor={Colors.textHint} />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Unit</Text>
          <View style={styles.chipRow}>
            {(['MONTHS', 'YEARS'] as const).map((u) => (
              <TouchableOpacity key={u} style={[styles.chip, ageUnit === u && styles.chipActive]} onPress={() => setAgeUnit(u)}>
                <Text style={[styles.chipText, ageUnit === u && styles.chipTextActive]}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.label}>Gender *</Text>
      <View style={styles.chipRow}>
        {GENDERS.map((g) => (
          <TouchableOpacity key={g} style={[styles.chip, gender === g && styles.chipActive]} onPress={() => setGender(g)}>
            <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g === 'MALE' ? '♂ Male' : '♀ Female'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="Optional" placeholderTextColor={Colors.textHint} />

      <Text style={styles.label}>Health Status</Text>
      <View style={styles.chipRow}>
        {HEALTH.map((h) => (
          <TouchableOpacity key={h} style={[styles.chip, healthStatus === h && styles.chipActive]} onPress={() => setHealthStatus(h)}>
            <Text style={[styles.chipText, healthStatus === h && styles.chipTextActive]}>{h}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Describe your animal..." placeholderTextColor={Colors.textHint} multiline numberOfLines={4} />

      <Text style={styles.label}>Price (SOS) *</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="number-pad" placeholder="0" placeholderTextColor={Colors.textHint} />

      <Text style={styles.label}>Region *</Text>
      <TextInput style={styles.input} value={region} onChangeText={setRegion} placeholder="e.g. Banadir" placeholderTextColor={Colors.textHint} />

      <Text style={styles.label}>District *</Text>
      <TextInput style={styles.input} value={district} onChangeText={setDistrict} placeholder="e.g. Hodan" placeholderTextColor={Colors.textHint} />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitButtonText}>{loading ? 'Creating...' : i18n.t('post_listing')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: 60, paddingBottom: 120 },
  title: { fontSize: FontSizes.heading, fontWeight: 'bold', color: Colors.text, marginBottom: Spacing.xl },
  label: { fontSize: FontSizes.body, color: Colors.textSecondary, marginTop: Spacing.md, marginBottom: Spacing.xs },
  input: {
    backgroundColor: Colors.surface, borderRadius: BorderRadii.md,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: FontSizes.body, color: Colors.text,
    borderWidth: 1, borderColor: Colors.border,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: Spacing.md },
  half: { flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadii.xxl, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  chipTextActive: { color: '#FFFFFF' },
  chipEmoji: { fontSize: 14 },
  submitButton: {
    backgroundColor: Colors.primary, borderRadius: BorderRadii.lg,
    paddingVertical: Spacing.lg, alignItems: 'center', marginTop: Spacing.xxl,
  },
  submitButtonText: { color: '#FFFFFF', fontSize: FontSizes.subheading, fontWeight: 'bold' },
});
