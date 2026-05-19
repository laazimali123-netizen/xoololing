// ─── Animal Detail Screen ────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadii, AnimalEmoji, StatusColors } from '../../src/constants/theme';
import api from '../../src/lib/api';
import { Listing } from '../../src/types';
import i18n from '../../src/i18n';

export default function AnimalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      const response = await api.getListing(id);
      if (response.success && response.data) {
        setListing(response.data);
      }
    } catch {
      Alert.alert('Error', 'Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{i18n.t('loading')}</Text>
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{i18n.t('no_results')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.heroImage}>
          <Text style={styles.heroEmoji}>{AnimalEmoji[listing.animal.type]}</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Main Info */}
        <View style={styles.mainInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.breed}>{listing.animal.breed}</Text>
            <View style={[styles.statusBadge, { backgroundColor: StatusColors[listing.status] || Colors.disabled }]}>
              <Text style={styles.statusText}>{listing.status}</Text>
            </View>
          </View>
          <Text style={styles.price}>{listing.price.toLocaleString()} SOS</Text>
          <Text style={styles.location}>{listing.location.region} - {listing.location.district}</Text>
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Details</Text>
          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{listing.animal.type}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>{listing.animal.gender === 'MALE' ? '♂ Male' : '♀ Female'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Age</Text>
              <Text style={styles.detailValue}>{listing.animal.age} {listing.animal.ageUnit.toLowerCase()}</Text>
            </View>
            {listing.animal.weight && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Weight</Text>
                <Text style={styles.detailValue}>{listing.animal.weight} kg</Text>
              </View>
            )}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Health</Text>
              <Text style={styles.detailValue}>{listing.animal.healthStatus}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        {listing.animal.description ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{i18n.t('description')}</Text>
            <Text style={styles.descriptionText}>{listing.animal.description}</Text>
          </View>
        ) : null}

        {/* Seller Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{i18n.t('seller')}</Text>
          <View style={styles.sellerRow}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>{listing.sellerName.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.sellerName}>{listing.sellerName}</Text>
              <Text style={styles.sellerPhone}>{listing.sellerPhone}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => Alert.alert('Chat', 'Opening chat with seller...')}
        >
          <Text style={styles.chatButtonText}>{i18n.t('contact_seller')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => router.push(`/payment?listingId=${listing.id}`)}
        >
          <Text style={styles.buyButtonText}>{i18n.t('buy')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  loadingText: { fontSize: FontSizes.body, color: Colors.textSecondary },
  heroImage: {
    height: 240, backgroundColor: Colors.primaryLight + '20',
    justifyContent: 'center', alignItems: 'center', position: 'relative',
  },
  heroEmoji: { fontSize: 80 },
  backBtn: { position: 'absolute', top: 56, left: Spacing.lg, width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  backBtnText: { fontSize: 20, color: Colors.text },
  mainInfo: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  breed: { fontSize: FontSizes.heading, fontWeight: 'bold', color: Colors.text },
  statusBadge: { paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: BorderRadii.sm },
  statusText: { color: '#FFFFFF', fontSize: 10, fontWeight: '600' },
  price: { fontSize: FontSizes.display, fontWeight: 'bold', color: Colors.primary, marginTop: Spacing.sm },
  location: { fontSize: FontSizes.body, color: Colors.textSecondary, marginTop: Spacing.xs },
  card: {
    marginHorizontal: Spacing.xl, marginTop: Spacing.lg,
    backgroundColor: Colors.surface, borderRadius: BorderRadii.lg,
    padding: Spacing.lg,
  },
  cardTitle: { fontSize: FontSizes.subheading, fontWeight: '600', color: Colors.text, marginBottom: Spacing.md },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  detailItem: { width: '45%' },
  detailLabel: { fontSize: FontSizes.caption, color: Colors.textHint },
  detailValue: { fontSize: FontSizes.body, color: Colors.text, marginTop: 2 },
  descriptionText: { fontSize: FontSizes.body, color: Colors.textSecondary, lineHeight: 22 },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  sellerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  sellerAvatarText: { color: '#FFFFFF', fontSize: FontSizes.subheading, fontWeight: 'bold' },
  sellerName: { fontSize: FontSizes.subheading, fontWeight: '600', color: Colors.text },
  sellerPhone: { fontSize: FontSizes.caption, color: Colors.textSecondary, marginTop: 2 },
  bottomActions: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: Spacing.md,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.divider,
  },
  chatButton: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadii.lg,
    paddingVertical: Spacing.md, alignItems: 'center',
    borderWidth: 2, borderColor: Colors.primary,
  },
  chatButtonText: { color: Colors.primary, fontSize: FontSizes.body, fontWeight: '600' },
  buyButton: {
    flex: 1, backgroundColor: Colors.primary, borderRadius: BorderRadii.lg,
    paddingVertical: Spacing.md, alignItems: 'center',
  },
  buyButtonText: { color: '#FFFFFF', fontSize: FontSizes.body, fontWeight: 'bold' },
});
