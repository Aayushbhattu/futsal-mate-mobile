import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import colors from '../constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();
  const IS_SMALL = SCREEN_H < 680;
  const topPad = Math.max(insets.top, 20);
  const bottomPad = Math.max(insets.bottom, 20);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Green Hero Section ── */}
      <View style={[styles.hero, { paddingTop: topPad + 30, height: SCREEN_H * 0.52 }]}>
        {/* Decorative circles */}
        <View
          style={[
            styles.circle1,
            {
              width: SCREEN_W * 0.7,
              height: SCREEN_W * 0.7,
              borderRadius: SCREEN_W * 0.35,
              top: -SCREEN_W * 0.18,
              right: -SCREEN_W * 0.15,
            },
          ]}
        />
        <View
          style={[
            styles.circle2,
            {
              width: SCREEN_W * 0.45,
              height: SCREEN_W * 0.45,
              borderRadius: SCREEN_W * 0.225,
              bottom: -SCREEN_W * 0.1,
              left: -SCREEN_W * 0.08,
            },
          ]}
        />
        <View
          style={[
            styles.circle3,
            {
              width: SCREEN_W * 0.25,
              height: SCREEN_W * 0.25,
              borderRadius: SCREEN_W * 0.125,
              top: SCREEN_H * 0.06,
              left: -SCREEN_W * 0.05,
            },
          ]}
        />
        <View
          style={[
            styles.circle4,
            {
              width: 60,
              height: 60,
              borderRadius: 30,
              bottom: SCREEN_H * 0.12,
              right: SCREEN_W * 0.08,
            },
          ]}
        />

        {/* Logo */}
        <View style={{ marginTop: SCREEN_H * 0.02 }}>
          <View
            style={[
              styles.logoBg,
              {
                width: IS_SMALL ? 88 : 104,
                height: IS_SMALL ? 88 : 104,
                borderRadius: IS_SMALL ? 44 : 52,
              },
            ]}
          >
            <Ionicons name="football" size={IS_SMALL ? 40 : 52} color={colors.primary} />
          </View>
        </View>

        <Text style={[styles.brand, { fontSize: IS_SMALL ? 30 : 36 }]}>Futsal Mate</Text>
        <Text style={[styles.tagline, { fontSize: IS_SMALL ? 14 : 16 }]}>
          Find  ·  Book  ·  Play
        </Text>

        {/* Feature Pills */}
        <View style={[styles.pillsRow, { marginTop: SCREEN_H * 0.035, paddingHorizontal: 24 }]}>
          {[
            { icon: 'search' as const, label: 'Find Courts' },
            { icon: 'calendar' as const, label: 'Quick Book' },
            { icon: 'people' as const, label: 'Find Teams' },
          ].map((f, i) => (
            <View key={i} style={styles.pill}>
              <View style={styles.pillIcon}>
                <Ionicons name={f.icon} size={14} color={colors.primary} />
              </View>
              <Text style={[styles.pillLabel, { fontSize: IS_SMALL ? 9 : 11 }]}>
                {f.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── White Bottom Section ── */}
      <View style={[styles.bottom, { paddingHorizontal: 28, paddingTop: SCREEN_H * 0.045, paddingBottom: bottomPad + 12 }]}>
        <Text style={[styles.heading, { fontSize: IS_SMALL ? 24 : 28, lineHeight: IS_SMALL ? 30 : 36 }]}>
          Welcome to{'\n'}Futsal Mate
        </Text>
        <Text
          style={[
            styles.sub,
            {
              fontSize: 14,
              marginTop: 10,
              marginBottom: SCREEN_H * 0.04,
              paddingHorizontal: 4,
            },
          ]}
        >
          Book courts, find teammates, and elevate your game — all in one place.
        </Text>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.btnPrimary, { borderRadius: 16, paddingVertical: 17, marginBottom: 14 }]}
          activeOpacity={0.75}
          onPress={() => router.push('/login')}
        >
          <Ionicons name="log-in-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.btnPrimaryText}>Login</Text>
        </TouchableOpacity>

        {/* Signup Button */}
        <TouchableOpacity
          style={[styles.btnOutline, { borderRadius: 16, paddingVertical: 17, marginBottom: 20 }]}
          activeOpacity={0.75}
          onPress={() => router.push('/signup')}
        >
          <Ionicons name="person-add-outline" size={20} color={colors.primary} style={{ marginRight: 10 }} />
          <Text style={styles.btnOutlineText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing you agree to our{' '}
          <Text style={styles.termsBold}>Terms of Service</Text> &{' '}
          <Text style={styles.termsBold}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* ── Hero ── */
  hero: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    alignItems: 'center',
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  circle2: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  circle3: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  circle4: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  logoBg: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  brand: {
    fontWeight: '800',
    color: '#fff',
    marginTop: 16,
    letterSpacing: 0.8,
  },
  tagline: {
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    letterSpacing: 3,
    fontWeight: '500',
  },

  /* Feature pills */
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  pillIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  pillLabel: {
    fontWeight: '700',
    color: '#fff',
  },

  /* ── Bottom ── */
  bottom: {
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    fontWeight: '800',
    color: colors.gray[900],
    textAlign: 'center',
  },
  sub: {
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: 21,
  },

  /* Buttons */
  btnPrimary: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 7,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  btnOutline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'rgba(16,185,129,0.04)',
  },
  btnOutlineText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  terms: {
    fontSize: 11,
    color: colors.gray[400],
    textAlign: 'center',
    lineHeight: 17,
  },
  termsBold: {
    color: colors.primary,
    fontWeight: '600',
  },
});
