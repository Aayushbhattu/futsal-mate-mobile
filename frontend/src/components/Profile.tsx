import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../constants/colors';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  const stats = [
    { label: 'Games Played', value: '0', icon: 'trophy' },
    { label: 'Hours Booked', value: '0', icon: 'time' },
    { label: 'Favorite Courts', value: '0', icon: 'heart' },
    { label: 'Team Mates', value: '0', icon: 'people' },
  ];

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', color: '#3b82f6' },
    { icon: 'time-outline', label: 'Booking History', color: colors.primary },
    { icon: 'heart-outline', label: 'Favorites', color: '#ef4444' },
    { icon: 'settings-outline', label: 'Settings', color: colors.gray[600] },
    { icon: 'help-circle-outline', label: 'Help & Support', color: '#a855f7' },
  ];

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => await logout(),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={colors.primary} />
          </View>
          <Text style={styles.userName}>{user?.full_name || 'User Name'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>

          <View style={styles.memberBadge}>
            <Ionicons name="star" size={16} color="#fbbf24" />
            <Text style={styles.memberText}>Gold Member</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Ionicons name={stat.icon as any} size={24} color={colors.primary} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => {
          const isLast = index === menuItems.length - 1;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, !isLast && styles.menuItemBorder]}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={[styles.menuItemText, { color: '#ef4444' }]}>Logout</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
      </View>

      <Text style={styles.appVersion}>Futsal Mate v1.0.0</Text>
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
    paddingTop: 60,
    paddingBottom: 100,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    backgroundColor: 'white',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginBottom: 16,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  memberText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginTop: -60,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    padding: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray[500],
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: colors.gray[700],
    marginLeft: 12,
  },
  appVersion: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.gray[400],
    marginBottom: 32,
  },
});