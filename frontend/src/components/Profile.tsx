import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../constants/colors';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const IS_SMALL = SCREEN_H < 680;

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

  const pad = Math.max(SCREEN_W * 0.06, 16);

  return (
    <ScrollView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 20) + 16,
            paddingBottom: IS_SMALL ? 80 : 100,
          },
        ]}
      >
        <View style={[styles.headerTop, { paddingHorizontal: pad, marginBottom: IS_SMALL ? 16 : 24 }]}>
          <Text style={[styles.headerTitle, { fontSize: IS_SMALL ? 20 : 24 }]}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <View
            style={[
              styles.avatar,
              {
                width: IS_SMALL ? 80 : 96,
                height: IS_SMALL ? 80 : 96,
                borderRadius: IS_SMALL ? 40 : 48,
                marginBottom: IS_SMALL ? 12 : 16,
              },
            ]}
          >
            <Ionicons name="person" size={IS_SMALL ? 40 : 48} color={colors.primary} />
          </View>
          <Text
            style={[
              styles.userName,
              { fontSize: IS_SMALL ? 18 : 20, marginBottom: IS_SMALL ? 2 : 4 },
            ]}
          >
            {user?.full_name || 'User Name'}
          </Text>
          <Text
            style={[
              styles.userEmail,
              { fontSize: IS_SMALL ? 12 : 14, marginBottom: IS_SMALL ? 12 : 16 },
            ]}
          >
            {user?.email || 'email@example.com'}
          </Text>

          <View style={styles.memberBadge}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={[styles.memberText, { fontSize: IS_SMALL ? 12 : 14 }]}>
              Gold Member
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.statsCard,
          {
            marginHorizontal: pad,
            marginTop: -60,
            borderRadius: 16,
            padding: IS_SMALL ? 12 : 16,
            marginBottom: IS_SMALL ? 16 : 24,
          },
        ]}
      >
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Ionicons name={stat.icon as any} size={IS_SMALL ? 20 : 24} color={colors.primary} />
              <Text
                style={[
                  styles.statValue,
                  { fontSize: IS_SMALL ? 20 : 24, marginVertical: IS_SMALL ? 6 : 8 },
                ]}
              >
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { fontSize: IS_SMALL ? 10 : 12 }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View
        style={[
          styles.menuContainer,
          {
            marginHorizontal: pad,
            borderRadius: 16,
            marginBottom: IS_SMALL ? 16 : 24,
          },
        ]}
      >
        {menuItems.map((item, index) => {
          const isLast = index === menuItems.length - 1;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, !isLast && styles.menuItemBorder]}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
                <Text
                  style={[
                    styles.menuItemText,
                    { fontSize: IS_SMALL ? 14 : 16, marginLeft: 12 },
                  ]}
                >
                  {item.label}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.gray[400]} />
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemBorder]}
          onPress={handleLogout}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="log-out-outline" size={18} color="#ef4444" />
            <Text
              style={[
                styles.menuItemText,
                { color: '#ef4444', fontSize: IS_SMALL ? 14 : 16, marginLeft: 12 },
              ]}
            >
              Logout
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.gray[400]} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.appVersion, { marginBottom: IS_SMALL ? 24 : 32 }]}>
        Futsal Mate v1.0.0
      </Text>
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
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
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  userName: {
    color: 'white',
    fontWeight: 'bold',
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.9)',
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
    marginLeft: 8,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
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
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  statLabel: {
    color: colors.gray[500],
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
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
    color: colors.gray[700],
  },
  appVersion: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.gray[400],
  },
});
