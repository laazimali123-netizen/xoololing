// ─── Home Tab ─────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadii, AnimalEmoji, StatusColors } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/app-store';
import { Listing, AnimalType } from '../../src/types';
import i18n from '../../src/i18n';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.xl * 2 - Spacing.md) / 2;

const ANIMAL_FILTERS: AnimalType[] = ['CATTLE', 'GOAT', 'SHEEP', 'CAMEL', 'DONKEY', 'HORSE'];

export default function HomeScreen() {
  const router = useRouter();
  const { user, listings, fetchListings } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<AnimalType | 'ALL'>('ALL');

  useEffect(() => {
    fetchListings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };

  const filteredListings = activeFilter === 'ALL'
    ? listings
    : listings.filter((l) => l.animal.type === activeFilter);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{i18n.t('welcome')}</Text>
          <Text style={styles.userName}>{user?.fullName || 'Guest'}</Text>
        </View>
        <TouchableOpacity style={styles.notificationBadge}>
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => router.push('/(tabs)/browse')}
      >
        <Text style={styles.searchPlaceholder}>{i18n.t('search')}...</Text>
      </TouchableOpacity>

      {/* Animal Type Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'ALL' && styles.filterChipActive]}
          onPress={() => setActiveFilter('ALL')}
        >
          <Text style={[styles.filterText, activeFilter === 'ALL' && styles.filterTextActive]}>
            {i18n.t('all')}
          </Text>
        </TouchableOpacity>
        {ANIMAL_FILTERS.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterChip, activeFilter === type && styles.filterChipActive]}
            onPress={() => setActiveFilter(type)}
          >
            <Text style={styles.filterEmoji}>{AnimalEmoji[type]}</Text>
            <Text style={[styles.filterText, activeFilter === type && styles.filterTextActive]}>
              {i18n.t(type.toLowerCase() as any)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Listings Grid */}
      <ScrollView
        contentContainerStyle={styles.listingsGrid}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
      >
        {filteredListings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🐑</Text>
            <Text style={styles.emptyText}>{i18n.t('no_results')}</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredListings.map((listing) => (
              <TouchableOpacity
                key={listing.id}
                style={styles.card}
                onPress={() => router.push(`/animal/${listing.id}`)}
              >
                <View style={styles.cardImage}>
                  <Text style={styles.cardEmoji}>{AnimalEmoji[listing.animal.type]}</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardBreed} numberOfLines={1}>{listing.animal.breed}</Text>
                  <Text style={styles.cardLocation} numberOfLines={1}>{listing.location.district}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardPrice}>{listing.price.toLocaleString()} SOS</Text>
                    <View style={[styles.statusDot, { backgroundColor: StatusColors[listing.status] || Colors.disabled }]} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.md,
  },
  greeting: { fontSize: FontSizes.body, color: Colors.textSecondary },
  userName: { fontSize: FontSizes.heading, fontWeight: 'bold', color: Colors.text },
  notificationBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  bellIcon: { fontSize: 20 },
  searchBar: {
    marginHorizontal: Spacing.xl, marginVertical: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: BorderRadii.lg,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchPlaceholder: { color: Colors.textHint, fontSize: FontSizes.body },
  filterRow: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.md, maxHeight: 50 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadii.xxl, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border, marginRight: Spacing.sm,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterEmoji: { fontSize: 14 },
  filterText: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  filterTextActive: { color: '#FFFFFF' },
  listingsGrid: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  card: {
    width: CARD_WIDTH, backgroundColor: Colors.card,
    borderRadius: BorderRadii.lg, overflow: 'hidden', elevation: 2,
  },
  cardImage: {
    height: 120, backgroundColor: Colors.primaryLight + '20',
    justifyContent: 'center', alignItems: 'center',
  },
  cardEmoji: { fontSize: 48 },
  cardContent: { padding: Spacing.sm },
  cardBreed: { fontSize: FontSizes.subheading, fontWeight: '600', color: Colors.text },
  cardLocation: { fontSize: FontSizes.caption, color: Colors.textSecondary, marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.xs },
  cardPrice: { fontSize: FontSizes.body, fontWeight: 'bold', color: Colors.primary },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 64, marginBottom: Spacing.lg },
  emptyText: { fontSize: FontSizes.body, color: Colors.textSecondary },
});
