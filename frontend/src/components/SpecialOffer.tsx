import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../constants/colors';
import { offersAPI } from '../services/api';

interface Offer {
  id: number;
  title: string;
  discount: string;
  description: string;
  valid_until: string;
  image_url: string;
  type: 'hot' | 'new' | 'limited';
}

export default function SpecialOffer() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const response = await offersAPI.getAll();
      setOffers(response.data);
    } catch (error) {
      console.error('Error loading offers:', error);
      Alert.alert('Error', 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      hot: { emoji: '🔥', text: 'HOT', color: '#ef4444' },
      new: { emoji: '✨', text: 'NEW', color: colors.primary },
      limited: { emoji: '⏰', text: 'LIMITED', color: '#f97316' },
    };
    return badges[type as keyof typeof badges] || badges.new;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="pricetag" size={32} color="white" />
          <Text style={styles.headerTitle}>Special Offers</Text>
        </View>
        <Text style={styles.headerSubtitle}>Don't miss out on amazing deals!</Text>
      </View>

      <View style={styles.featuredBanner}>
        <View style={styles.bannerDecor1} />
        <View style={styles.bannerDecor2} />
        <View style={styles.bannerContent}>
          <View style={styles.limitedBadge}>
            <Ionicons name="star" size={16} color="#fbbf24" />
            <Text style={styles.limitedText}>Limited Time Offer</Text>
          </View>
          <Text style={styles.bannerTitle}>First Booking Free!</Text>
          <Text style={styles.bannerDescription}>
            Sign up now and get your first booking absolutely free
          </Text>
          <TouchableOpacity style={styles.claimButton}>
            <Text style={styles.claimButtonText}>Claim Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Offers</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          offers.map((offer) => {
            const badge = getTypeBadge(offer.type);
            return (
              <View key={offer.id} style={styles.offerCard}>
                <View style={styles.offerImageContainer}>
                  <Image source={{ uri: offer.image_url }} style={styles.offerImage} />
                  <View style={[styles.typeBadge, { backgroundColor: badge.color }]}>
                    <Text style={styles.typeBadgeText}>
                      {badge.emoji} {badge.text}
                    </Text>
                  </View>
                </View>
                <View style={styles.offerInfo}>
                  <View style={styles.offerHeader}>
                    <Text style={styles.offerTitle}>{offer.title}</Text>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{offer.discount}</Text>
                    </View>
                  </View>
                  <Text style={styles.offerDescription}>{offer.description}</Text>
                  <View style={styles.validityContainer}>
                    <Ionicons name="time-outline" size={12} color={colors.gray[500]} />
                    <Text style={styles.validityText}>{offer.valid_until}</Text>
                  </View>
                  <TouchableOpacity style={styles.useOfferButton}>
                    <Text style={styles.useOfferButtonText}>Use Offer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    backgroundColor: '#f97316',
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  featuredBanner: {
    backgroundColor: '#a855f7',
    margin: 24,
    borderRadius: 16,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  bannerDecor1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 64,
  },
  bannerDecor2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 96,
    height: 96,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 48,
  },
  bannerContent: {
    zIndex: 10,
  },
  limitedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  limitedText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 8,
  },
  bannerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bannerDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginBottom: 16,
  },
  claimButton: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  claimButtonText: {
    color: '#a855f7',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 16,
  },
  loader: {
    marginVertical: 32,
  },
  offerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  offerImageContainer: {
    position: 'relative',
  },
  offerImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.gray[200],
  },
  typeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  offerInfo: {
    padding: 16,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray[900],
    flex: 1,
  },
  discountBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountText: {
    color: '#065f46',
    fontSize: 12,
    fontWeight: 'bold',
  },
  offerDescription: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 8,
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  validityText: {
    fontSize: 12,
    color: colors.gray[500],
    marginLeft: 4,
  },
  useOfferButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  useOfferButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});