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
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const IS_SMALL = SCREEN_H < 680;
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

  const pad = Math.max(SCREEN_W * 0.06, 16);

  return (
    <ScrollView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 20) + 16,
            paddingHorizontal: pad,
            paddingBottom: IS_SMALL ? 28 : 32,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Ionicons name="pricetag" size={IS_SMALL ? 26 : 32} color="white" />
          <Text style={[styles.headerTitle, { fontSize: IS_SMALL ? 20 : 24, marginLeft: 12 }]}>
            Special Offers
          </Text>
        </View>
        <Text style={[styles.headerSubtitle, { fontSize: IS_SMALL ? 12 : 14 }]}>
          Don't miss out on amazing deals!
        </Text>
      </View>

      <View
        style={[
          styles.featuredBanner,
          {
            margin: pad,
            borderRadius: 16,
            padding: IS_SMALL ? 18 : 24,
          },
        ]}
      >
        <View style={styles.bannerDecor1} />
        <View style={styles.bannerDecor2} />
        <View style={styles.bannerContent}>
          <View style={styles.limitedBadge}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={[styles.limitedText, { fontSize: IS_SMALL ? 10 : 12 }]}>
              Limited Time Offer
            </Text>
          </View>
          <Text
            style={[
              styles.bannerTitle,
              { fontSize: IS_SMALL ? 20 : 24, marginBottom: IS_SMALL ? 6 : 8 },
            ]}
          >
            First Booking Free!
          </Text>
          <Text
            style={[
              styles.bannerDescription,
              { fontSize: IS_SMALL ? 12 : 14, marginBottom: IS_SMALL ? 12 : 16 },
            ]}
          >
            Sign up now and get your first booking absolutely free
          </Text>
          <TouchableOpacity
            style={[
              styles.claimButton,
              {
                paddingHorizontal: IS_SMALL ? 18 : 24,
                paddingVertical: IS_SMALL ? 10 : 12,
                borderRadius: 8,
              },
            ]}
          >
            <Text style={[styles.claimButtonText, { fontSize: IS_SMALL ? 12 : 14 }]}>
              Claim Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.section, { padding: pad }]}>
        <Text
          style={[
            styles.sectionTitle,
            { fontSize: IS_SMALL ? 16 : 18, marginBottom: IS_SMALL ? 12 : 16 },
          ]}
        >
          All Offers
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          offers.map((offer) => {
            const badge = getTypeBadge(offer.type);
            return (
              <View key={offer.id} style={styles.offerCard}>
                <View style={styles.offerImageContainer}>
                  <Image
                    source={{ uri: offer.image_url }}
                    style={[styles.offerImage, { height: IS_SMALL ? 100 : 120 }]}
                  />
                  <View style={[styles.typeBadge, { backgroundColor: badge.color }]}>
                    <Text style={styles.typeBadgeText}>
                      {badge.emoji} {badge.text}
                    </Text>
                  </View>
                </View>
                <View style={[styles.offerInfo, { padding: IS_SMALL ? 12 : 16 }]}>
                  <View style={styles.offerHeader}>
                    <Text
                      style={[
                        styles.offerTitle,
                        { fontSize: IS_SMALL ? 14 : 16 },
                      ]}
                    >
                      {offer.title}
                    </Text>
                    <View style={[styles.discountBadge, { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginLeft: 8 }]}>
                      <Text style={styles.discountText}>{offer.discount}</Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.offerDescription,
                      { fontSize: IS_SMALL ? 12 : 14, marginBottom: IS_SMALL ? 6 : 8 },
                    ]}
                  >
                    {offer.description}
                  </Text>
                  <View style={[styles.validityContainer, { marginBottom: IS_SMALL ? 8 : 12 }]}>
                    <Ionicons name="time-outline" size={12} color={colors.gray[500]} />
                    <Text style={[styles.validityText, { fontSize: IS_SMALL ? 10 : 12 }]}>
                      {offer.valid_until}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.useOfferButton,
                      { padding: IS_SMALL ? 10 : 12, borderRadius: 8 },
                    ]}
                  >
                    <Text style={[styles.useOfferButtonText, { fontSize: IS_SMALL ? 12 : 14 }]}>
                      Use Offer
                    </Text>
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
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  featuredBanner: {
    backgroundColor: '#a855f7',
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
    marginLeft: 8,
  },
  bannerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  bannerDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  claimButton: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  claimButtonText: {
    color: '#a855f7',
    fontWeight: 'bold',
  },
  section: {},
  sectionTitle: {
    fontWeight: 'bold',
    color: colors.gray[900],
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
    backgroundColor: colors.gray[200],
  },
  typeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  typeBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  offerInfo: {},
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  offerTitle: {
    fontWeight: 'bold',
    color: colors.gray[900],
    flex: 1,
  },
  discountBadge: {
    backgroundColor: '#d1fae5',
  },
  discountText: {
    color: '#065f46',
    fontSize: 12,
    fontWeight: 'bold',
  },
  offerDescription: {
    color: colors.gray[600],
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validityText: {
    color: colors.gray[500],
    marginLeft: 4,
  },
  useOfferButton: {
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  useOfferButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
