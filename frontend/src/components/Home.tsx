import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { courtsAPI, favoritesAPI } from '../services/api';

interface Court {
  id: number;
  name: string;
  location: string;
  price_per_hour: number;
  rating: number;
  image_url: string;
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const IS_SMALL = SCREEN_H < 680;
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [courtsRes, favoritesRes] = await Promise.all([
        courtsAPI.getAll(),
        favoritesAPI.getAll().catch(() => ({ data: [] })),
      ]);

      setCourts(courtsRes.data);
      setFavorites(favoritesRes.data.map((f: any) => f.court_id));
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load courts');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const toggleFavorite = async (courtId: number) => {
    try {
      if (favorites.includes(courtId)) {
        await favoritesAPI.remove(courtId);
        setFavorites(favorites.filter((id) => id !== courtId));
      } else {
        await favoritesAPI.add(courtId);
        setFavorites([...favorites, courtId]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const quickActions = [
    { icon: 'location', label: 'Nearby Courts', color: '#3b82f6' },
    { icon: 'time', label: 'Quick Book', color: '#10b981' },
    { icon: 'trending-up', label: 'Popular', color: '#a855f7' },
  ];

  const pad = Math.max(SCREEN_W * 0.06, 16);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 20) + 16,
            paddingHorizontal: pad,
            paddingBottom: IS_SMALL ? 40 : 48,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.welcomeText, { fontSize: IS_SMALL ? 12 : 14 }]}>
            Welcome back!
          </Text>
          <Text
            style={[
              styles.headerTitle,
              { fontSize: IS_SMALL ? 20 : 24, marginTop: 4 },
            ]}
          >
            {user?.full_name || 'User'}
          </Text>
        </View>
        <View
          style={[
            styles.avatarCircle,
            {
              width: IS_SMALL ? 42 : 48,
              height: IS_SMALL ? 42 : 48,
              borderRadius: IS_SMALL ? 21 : 24,
            },
          ]}
        >
          <Text style={{ fontSize: IS_SMALL ? 20 : 24 }}>⚽</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          {
            marginHorizontal: pad,
            marginTop: -20,
            padding: IS_SMALL ? 10 : 12,
            borderRadius: 12,
          },
        ]}
      >
        <Ionicons
          name="search"
          size={IS_SMALL ? 18 : 20}
          color={colors.gray[400]}
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={[styles.searchInput, { fontSize: IS_SMALL ? 14 : 16 }]}
          placeholder="Search courts, location..."
          placeholderTextColor={colors.gray[400]}
        />
      </View>

      {/* Quick Actions */}
      <View
        style={[
          styles.quickActions,
          { paddingHorizontal: pad, marginBottom: IS_SMALL ? 16 : 24 },
        ]}
      >
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.actionButton,
              {
                padding: IS_SMALL ? 12 : 16,
                width: '30%',
              },
            ]}
          >
            <View
              style={[
                styles.actionIconContainer,
                {
                  backgroundColor: action.color,
                  width: IS_SMALL ? 40 : 48,
                  height: IS_SMALL ? 40 : 48,
                  borderRadius: IS_SMALL ? 20 : 24,
                  marginBottom: IS_SMALL ? 6 : 8,
                },
              ]}
            >
              <Ionicons
                name={action.icon as any}
                size={IS_SMALL ? 20 : 24}
                color="white"
              />
            </View>
            <Text
              style={[
                styles.actionLabel,
                { fontSize: IS_SMALL ? 10 : 12 },
              ]}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Featured Courts */}
      <View style={[styles.section, { paddingHorizontal: pad, marginBottom: IS_SMALL ? 16 : 24 }]}>
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { fontSize: IS_SMALL ? 16 : 18 },
            ]}
          >
            Featured Courts
          </Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          courts.map((court) => (
            <View key={court.id} style={styles.courtCard}>
              <Image
                source={{ uri: court.image_url }}
                style={[styles.courtImage, { height: IS_SMALL ? 130 : 160 }]}
              />
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>⭐ {court.rating}</Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleFavorite(court.id)}
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={favorites.includes(court.id) ? 'heart' : 'heart-outline'}
                  size={22}
                  color={favorites.includes(court.id) ? '#ef4444' : colors.gray[400]}
                />
              </TouchableOpacity>
              <View style={[styles.courtInfo, { padding: IS_SMALL ? 12 : 16 }]}>
                <Text
                  style={[
                    styles.courtName,
                    { fontSize: IS_SMALL ? 14 : 16, marginBottom: IS_SMALL ? 6 : 8 },
                  ]}
                >
                  {court.name}
                </Text>
                <View style={[styles.locationContainer, { marginBottom: IS_SMALL ? 8 : 12 }]}>
                  <Ionicons name="location" size={14} color={colors.gray[500]} />
                  <Text style={[styles.locationText, { fontSize: IS_SMALL ? 12 : 14 }]}>
                    {court.location}
                  </Text>
                </View>
                <View style={styles.courtFooter}>
                  <Text
                    style={[
                      styles.priceText,
                      { fontSize: IS_SMALL ? 14 : 16 },
                    ]}
                  >
                    ${court.price_per_hour}/hour
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.bookButton,
                      {
                        paddingHorizontal: IS_SMALL ? 12 : 16,
                        paddingVertical: IS_SMALL ? 6 : 8,
                      },
                    ]}
                    onPress={() => router.push('/booking')}
                  >
                    <Text style={[styles.bookButtonText, { fontSize: IS_SMALL ? 12 : 14 }]}>
                      Book Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
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
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  avatarCircle: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    color: colors.gray[800],
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: colors.gray[700],
    textAlign: 'center',
  },
  section: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 32,
  },
  courtCard: {
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
  courtImage: {
    width: '100%',
    backgroundColor: colors.gray[200],
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courtInfo: {},
  courtName: {
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: colors.gray[500],
    marginLeft: 4,
  },
  courtFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    color: colors.primary,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
