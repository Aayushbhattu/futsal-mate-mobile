import { Ionicons } from '@expo/vector-icons';
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
  View,
} from 'react-native';
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
  const { user } = useAuth();
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
      setFavorites(favoritesRes.data.map((f: any) => f.id));
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

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.headerTitle}>{user?.full_name || 'User'}</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>⚽</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.gray[400]} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courts, location..."
          placeholderTextColor={colors.gray[400]}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        {quickActions.map((action, index) => (
          <TouchableOpacity key={index} style={styles.actionButton}>
            <View style={[styles.actionIconContainer, { backgroundColor: action.color }]}>
              <Ionicons name={action.icon as any} size={24} color="white" />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Featured Courts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Courts</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          courts.map((court) => (
            <View key={court.id} style={styles.courtCard}>
              <Image source={{ uri: court.image_url }} style={styles.courtImage} />
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>⭐ {court.rating}</Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleFavorite(court.id)}
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={favorites.includes(court.id) ? 'heart' : 'heart-outline'}
                  size={24}
                  color={favorites.includes(court.id) ? '#ef4444' : colors.gray[400]}
                />
              </TouchableOpacity>
              <View style={styles.courtInfo}>
                <Text style={styles.courtName}>{court.name}</Text>
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={16} color={colors.gray[500]} />
                  <Text style={styles.locationText}>{court.location}</Text>
                </View>
                <View style={styles.courtFooter}>
                  <Text style={styles.priceText}>${court.price_per_hour}/hour</Text>
                  <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book Now</Text>
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
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 24,
    marginTop: -20,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.gray[800],
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: colors.gray[700],
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
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
    height: 160,
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
  courtInfo: {
    padding: 16,
  },
  courtName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: colors.gray[500],
    marginLeft: 4,
  },
  courtFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});