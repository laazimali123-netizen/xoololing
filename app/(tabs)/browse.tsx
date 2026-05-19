// ─── Browse Tab ──────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, RefreshControl, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadii, AnimalEmoji, StatusColors } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/app-store';
import { AnimalType, ListingStatus } from '../../src/types';
import i18n from '../../src/i18n';

const { width } = Dimensions.get('window');

const ANIMAL_TYPES: AnimalType[] = ['CATTLE', 'GOAT', 'SHEEP', 'CAMEL', 'DONKEY', 'HORSE'];
const SORT_OPTIONS = ['recent', 'price_low', 'price_high', 'popular'];

export default function BrowseScreen() {
  const router = useRouter();
  const { listings, fetchListings } = useAppStore();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<AnimalType | null>(null);
  const [sortBy, setSortBy] = useState('recent');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchListings(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };

  let filtered = [...listings];
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((l) =>
      l.animal.breed.toLowerCase().includes(q) ||
      l.animal.description.toLowerCase().includes(q) ||
      l.location.district.toLowerCase().includes(q)
    );
  }
  if (selectedType) {
    filtered = filtered.filter((l) => l.animal.type === selectedType);
  }
  if (sortBy === 'price_low') filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price_high') filtered.sort((a, b) => b.price - a.price);
  else filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder={`${i18n.t('search')}...`}
          placeholderTextColor={Colors.textHint}
        />
      </View>

      {/* Type Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeChip, !selectedType && styles.typeChipActive]}
          onPress={() => setSelectedType(null)}
        >
          <Text style={[styles.typeText, !selectedType && styles.typeTextActive]}>{i18n.t('all')}</Text>
        </TouchableOpacity>
        {ANIMAL_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeChip, selectedType === type && styles.typeChipActive]}
            onPress={() => setSelectedType(selectedType === type ? null : type)}
          >
            <Text style={styles.typeEmoji}>{AnimalEmoji[type]}</Text>
            <Text style={[styles.typeText, selectedType === type && styles.typeTextActive]}>
              {i18n.t(type.toLowerCase() as any)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortRow}>
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.sortChip, sortBy === opt && styles.sortChipActive]}
            onPress={() => setSortBy(opt)}
          >
            <Text style={[styles.sortText, sortBy === opt && styles.sortTextActive]}>{opt.replace('_', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <Text style={styles.resultCount}>{filtered.length} {i18n.t('all').toLowerCase()}</Text>

      <ScrollView
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>{i18n.t('no_results')}</Text>
          </View>
        ) : (
          filtered.map((listing) => (
            <TouchableOpacity
              key={listing.id}
              style={styles.listingCard}
              onPress={() => router.push(`/animal/${listing.id}`)}
            >
              <View style={styles.cardImage}>
                <Text style={styles.cardEmoji}>{AnimalEmoji[listing.animal.type]}</Text>
              </View>
              <View style={styles.cardInfo}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardBreed}>{listing.animal.breed}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: StatusColors[listing.status] || Colors.disabled }]}>
                    <Text style={styles.statusText}>{listing.status}</Text>
                  </View>
                </View>
                <Text style={styles.cardLocation}>{listing.location.region} - {listing.location.district}</Text>
                <Text style={styles.cardDetails}>
                  {listing.animal.gender === 'MALE' ? '♂' : '♀'} {listing.animal.age} {listing.animal.ageUnit.toLowerCase()}
                </Text>
                <Text style={styles.cardPrice}>{listing.price.toLocaleString()} SOS</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchContainer: { paddingHorizontal: Spacing.xl, paddingTop: 60, paddingBottom: Spacing.md },
  searchInput: {
    backgroundColor: Colors.surface, borderRadius: BorderRadii.lg,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: FontSizes.body, color: Colors.text,
    borderWidth: 1, borderColor: Colors.border,
  },
  typeRow: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.sm, maxHeight: 46 },
  typeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadii.xxl, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border, marginRight: Spacing.sm,
  },
  typeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeEmoji: { fontSize: 14 },
  typeText: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  typeTextActive: { color: '#FFFFFF' },
  sortRow: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.md, maxHeight: 36 },
  sortChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: BorderRadii.sm, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border, marginRight: Spacing.sm,
  },
  sortChipActive: { backgroundColor: Colors.primaryDark, borderColor: Colors.primaryDark },
  sortText: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  sortTextActive: { color: '#FFFFFF' },
  resultCount: { paddingHorizontal: Spacing.xl, fontSize: FontSizes.caption, color: Colors.textSecondary, marginBottom: Spacing.sm },
  listContainer: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  listingCard: {
    flexDirection: 'row', backgroundColor: Colors.card,
    borderRadius: BorderRadii.lg, overflow: 'hidden', marginBottom: Spacing.md, elevation: 1,
  },
  cardImage: { width: 100, backgroundColor: Colors.primaryLight + '20', justifyContent: 'center', alignItems: 'center' },
  cardEmoji: { fontSize: 36 },
  cardInfo: { flex: 1, padding: Spacing.md },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBreed: { fontSize: FontSizes.subheading, fontWeight: '600', color: Colors.text },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadii.sm },
  statusText: { fontSize: 10, color: '#FFFFFF', fontWeight: '600' },
  cardLocation: { fontSize: FontSizes.caption, color: Colors.textSecondary, marginTop: 2 },
  cardDetails: { fontSize: FontSizes.caption, color: Colors.textSecondary, marginTop: 2 },
  cardPrice: { fontSize: FontSizes.body, fontWeight: 'bold', color: Colors.primary, marginTop: 4 },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 64, marginBottom: Spacing.lg },
  emptyText: { fontSize: FontSizes.body, color: Colors.textSecondary },
});
