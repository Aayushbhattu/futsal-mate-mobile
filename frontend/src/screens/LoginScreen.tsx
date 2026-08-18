import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import colors from '../constants/colors';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();
  const IS_SMALL = SCREEN_H < 680;
  const topPad = Math.max(insets.top, 12);
  const bottomPad = Math.max(insets.bottom, 16);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string) => [
    styles.inputField,
    { height: IS_SMALL ? 48 : 52, borderRadius: 14, paddingHorizontal: 14, marginBottom: IS_SMALL ? 14 : 18 },
    focusedField === field && styles.inputFieldFocused,
  ];

  const iconColor = (field: string) =>
    focusedField === field ? colors.primary : colors.gray[400];

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Green top accent bar ── */}
      <View style={[styles.accentBar, { height: topPad + 10 }]} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingHorizontal: 24, paddingBottom: bottomPad + 16 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <TouchableOpacity
          style={[styles.backBtn, { top: topPad + 8 }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.gray[700]} />
        </TouchableOpacity>

        {/* Header */}
        <View style={[styles.header, { marginTop: SCREEN_H * 0.13, marginBottom: IS_SMALL ? 24 : 32 }]}>
          <View
            style={[
              styles.logoCircle,
              {
                width: IS_SMALL ? 72 : 84,
                height: IS_SMALL ? 72 : 84,
                borderRadius: IS_SMALL ? 36 : 42,
                marginBottom: 16,
              },
            ]}
          >
            <Ionicons name="football" size={IS_SMALL ? 32 : 40} color={colors.primary} />
          </View>
          <Text style={[styles.title, { fontSize: IS_SMALL ? 24 : 28, marginBottom: 6 }]}>
            Welcome Back!
          </Text>
          <Text style={[styles.subtitle, { fontSize: 14 }]}>
            Sign in to continue to Futsal Mate
          </Text>
        </View>

        {/* ── Form Card ── */}
        <View style={[styles.card, { borderRadius: 20, padding: 24, marginBottom: 20 }]}>
          {/* Email */}
          <Text style={[styles.label, { fontSize: 13, marginBottom: 8, marginLeft: 4 }]}>Email</Text>
          <View style={inputStyle('email')}>
            <Ionicons name="mail-outline" size={18} color={iconColor('email')} />
            <TextInput
              style={[styles.textInput, { fontSize: 15, marginLeft: 10 }]}
              placeholder="you@example.com"
              placeholderTextColor={colors.gray[300]}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
            />
          </View>

          {/* Password */}
          <Text style={[styles.label, { fontSize: 13, marginBottom: 8, marginLeft: 4 }]}>Password</Text>
          <View style={inputStyle('password')}>
            <Ionicons name="lock-closed-outline" size={18} color={iconColor('password')} />
            <TextInput
              style={[styles.textInput, { fontSize: 15, marginLeft: 10 }]}
              placeholder="Enter your password"
              placeholderTextColor={colors.gray[300]}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              textContentType="password"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={colors.gray[400]}
              />
            </TouchableOpacity>
          </View>

          {/* Forgot */}
          <TouchableOpacity style={[styles.forgot, { alignSelf: 'flex-end', marginBottom: 22, marginTop: -4 }]} activeOpacity={0.7}>
            <Text style={[styles.forgotText, { fontSize: 13, fontWeight: '600', color: colors.primary }]}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          {/* Login */}
          <TouchableOpacity
            style={[
              styles.loginBtn,
              { borderRadius: 14, height: IS_SMALL ? 48 : 54 },
              loading && styles.loginBtnDisabled,
            ]}
            activeOpacity={0.75}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={[styles.loginBtnText, { fontSize: 16, fontWeight: '700' }]}>Login</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={[styles.dividerRow, { flexDirection: 'row', alignItems: 'center', marginBottom: 20 }]}>
          <View style={[styles.dividerLine, { flex: 1, height: 1, backgroundColor: colors.gray[200] }]} />
          <Text style={[styles.dividerLabel, { marginHorizontal: 14, fontSize: 12, color: colors.gray[400], fontWeight: '500' }]}>
            or continue with
          </Text>
          <View style={[styles.dividerLine, { flex: 1, height: 1, backgroundColor: colors.gray[200] }]} />
        </View>

        {/* Social */}
        <View style={[styles.socialRow, { flexDirection: 'row', justifyContent: 'center', gap: 14, marginBottom: 28 }]}>
          {[
            { icon: 'logo-google' as const, bg: '#fff', border: '#e5e7eb', iconColor: '#EA4335' },
            { icon: 'logo-apple' as const, bg: '#fff', border: '#e5e7eb', iconColor: colors.gray[900] },
            { icon: 'logo-facebook' as const, bg: '#fff', border: '#e5e7eb', iconColor: '#1877F2' },
          ].map((s, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.socialBtn,
                {
                  backgroundColor: s.bg,
                  borderColor: s.border,
                  width: IS_SMALL ? 48 : 54,
                  height: IS_SMALL ? 48 : 54,
                  borderRadius: IS_SMALL ? 14 : 16,
                  borderWidth: 1.5,
                },
              ]}
              activeOpacity={0.7}
            >
              <Ionicons name={s.icon} size={22} color={s.iconColor} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Signup link */}
        <View style={[styles.signupRow, { flexDirection: 'row', justifyContent: 'center', paddingBottom: 12 }]}>
          <Text style={[styles.signupLabel, { fontSize: 14, color: colors.gray[500] }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/signup')} activeOpacity={0.7}>
            <Text style={[styles.signupLink, { fontSize: 14, fontWeight: '700', color: colors.primary }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  accentBar: {
    backgroundColor: colors.primary,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  scroll: {
    flexGrow: 1,
  },

  /* Back */
  backBtn: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  /* Header */
  header: {
    alignItems: 'center',
  },
  logoCircle: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  },
  title: {
    fontWeight: '800',
    color: colors.gray[900],
  },
  subtitle: {
    color: colors.gray[500],
    textAlign: 'center',
  },

  /* Card */
  card: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    fontWeight: '600',
    color: colors.gray[700],
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderWidth: 1.5,
    borderColor: colors.gray[200],
  },
  inputFieldFocused: {
    borderColor: colors.primary,
    backgroundColor: '#fff',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    color: colors.gray[900],
    paddingVertical: 0,
  },

  forgot: {},
  forgotText: {},

  /* Login Button */
  loginBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  loginBtnDisabled: {
    opacity: 0.55,
  },
  loginBtnText: {
    color: '#fff',
    letterSpacing: 0.3,
  },

  /* Divider */
  dividerRow: {},
  dividerLine: {},
  dividerLabel: {},

  /* Social */
  socialRow: {},
  socialBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  /* Signup */
  signupRow: {},
  signupLabel: {},
  signupLink: {},
});
