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

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const insets = useSafeAreaInsets();
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();
  const IS_SMALL = SCREEN_H < 680;
  const topPad = Math.max(insets.top, 12);
  const bottomPad = Math.max(insets.bottom, 16);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSignup = async () => {
    const { fullName, email, phone, password, confirmPassword } = formData;

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(email.trim(), password, fullName.trim(), phone.trim() || undefined);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key: string, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const getPasswordStrength = () => {
    const p = formData.password;
    if (p.length === 0) return null;
    if (p.length < 6) return { label: 'Weak', color: colors.error, pct: 0.33 };
    if (p.length < 10) return { label: 'Fair', color: colors.warning, pct: 0.66 };
    return { label: 'Strong', color: colors.success, pct: 1 };
  };

  const strength = getPasswordStrength();

  const inputStyle = (field: string) => [
    styles.inputField,
    { height: IS_SMALL ? 46 : 50, borderRadius: 14, paddingHorizontal: 14, marginBottom: IS_SMALL ? 13 : 16 },
    focusedField === field && styles.inputFieldFocused,
  ];

  const iconColor = (field: string) =>
    focusedField === field ? colors.primary : colors.gray[400];

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const passwordsMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

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
        <View style={[styles.header, { marginTop: SCREEN_H * 0.11, marginBottom: IS_SMALL ? 20 : 28 }]}>
          <View
            style={[
              styles.logoCircle,
              {
                width: IS_SMALL ? 64 : 76,
                height: IS_SMALL ? 64 : 76,
                borderRadius: IS_SMALL ? 32 : 38,
                marginBottom: 14,
              },
            ]}
          >
            <Ionicons name="football" size={IS_SMALL ? 28 : 36} color={colors.primary} />
          </View>
          <Text style={[styles.title, { fontSize: IS_SMALL ? 22 : 26, marginBottom: 5 }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { fontSize: 14 }]}>
            Join Futsal Mate and start playing!
          </Text>
        </View>

        {/* ── Form Card ── */}
        <View style={[styles.card, { borderRadius: 20, padding: 22, marginBottom: 18 }]}>
          {/* Full Name */}
          <Text style={[styles.label, { fontSize: 13, marginBottom: 7, marginLeft: 4 }]}>Full Name</Text>
          <View style={inputStyle('fullName')}>
            <Ionicons name="person-outline" size={18} color={iconColor('fullName')} />
            <TextInput
              style={[styles.textInput, { fontSize: 15, marginLeft: 10 }]}
              placeholder="John Doe"
              placeholderTextColor={colors.gray[300]}
              value={formData.fullName}
              onChangeText={(v) => updateField('fullName', v)}
              onFocus={() => setFocusedField('fullName')}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="words"
              textContentType="name"
            />
          </View>

          {/* Email */}
          <Text style={[styles.label, { fontSize: 13, marginBottom: 7, marginLeft: 4 }]}>Email</Text>
          <View style={inputStyle('email')}>
            <Ionicons name="mail-outline" size={18} color={iconColor('email')} />
            <TextInput
              style={[styles.textInput, { fontSize: 15, marginLeft: 10 }]}
              placeholder="you@example.com"
              placeholderTextColor={colors.gray[300]}
              value={formData.email}
              onChangeText={(v) => updateField('email', v)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
            />
          </View>

          {/* Phone */}
          <Text style={[styles.label, { fontSize: 13, marginBottom: 7, marginLeft: 4 }]}>
            Phone <Text style={{ fontWeight: '400', color: colors.gray[400] }}>(optional)</Text>
          </Text>
          <View style={inputStyle('phone')}>
            <Ionicons name="call-outline" size={18} color={iconColor('phone')} />
            <TextInput
              style={[styles.textInput, { fontSize: 15, marginLeft: 10 }]}
              placeholder="+977 9800000000"
              placeholderTextColor={colors.gray[300]}
              value={formData.phone}
              onChangeText={(v) => updateField('phone', v)}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
            />
          </View>

          {/* Password */}
          <Text style={[styles.label, { fontSize: 13, marginBottom: 7, marginLeft: 4 }]}>Password</Text>
          <View style={inputStyle('password')}>
            <Ionicons name="lock-closed-outline" size={18} color={iconColor('password')} />
            <TextInput
              style={[styles.textInput, { fontSize: 15, marginLeft: 10 }]}
              placeholder="Min. 6 characters"
              placeholderTextColor={colors.gray[300]}
              value={formData.password}
              onChangeText={(v) => updateField('password', v)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              textContentType="newPassword"
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

          {/* Strength bar */}
          {strength && (
            <View style={[styles.strengthRow, { flexDirection: 'row', alignItems: 'center', marginTop: -10, marginBottom: 14 }]}>
              <View style={[styles.strengthTrack, { flex: 1, height: 4, backgroundColor: colors.gray[200], borderRadius: 2, marginRight: 10, overflow: 'hidden' }]}>
                <View
                  style={[
                    styles.strengthFill,
                    {
                      backgroundColor: strength.color,
                      width: `${strength.pct * 100}%`,
                      height: 4,
                      borderRadius: 2,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.strengthText, { color: strength.color, fontSize: 11, fontWeight: '700', minWidth: 42 }]}>
                {strength.label}
              </Text>
            </View>
          )}

          {/* Confirm Password */}
          <Text style={[styles.label, { fontSize: 13, marginBottom: 7, marginLeft: 4 }]}>Confirm Password</Text>
          <View style={inputStyle('confirmPassword')}>
            <Ionicons name="lock-closed-outline" size={18} color={iconColor('confirmPassword')} />
            <TextInput
              style={[styles.textInput, { fontSize: 15, marginLeft: 10 }]}
              placeholder="Re-enter your password"
              placeholderTextColor={colors.gray[300]}
              value={formData.confirmPassword}
              onChangeText={(v) => updateField('confirmPassword', v)}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              textContentType="newPassword"
            />
            {formData.confirmPassword.length > 0 && (
              <Ionicons
                name={passwordsMatch ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={passwordsMatch ? colors.success : colors.error}
              />
            )}
          </View>

          {/* Hint */}
          {passwordsMismatch && (
            <Text style={[styles.errorHint, { fontSize: 12, color: colors.error, marginTop: -10, marginBottom: 12, marginLeft: 4, fontWeight: '500' }]}>
              Passwords do not match
            </Text>
          )}

          {/* Signup */}
          <TouchableOpacity
            style={[
              styles.signupBtn,
              { borderRadius: 14, height: IS_SMALL ? 48 : 54, marginTop: 6 },
              loading && styles.signupBtnDisabled,
            ]}
            activeOpacity={0.75}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={[styles.signupBtnText, { fontSize: 16, fontWeight: '700' }]}>
                  Create Account
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Login link */}
        <View style={[styles.loginRow, { flexDirection: 'row', justifyContent: 'center', paddingBottom: 12 }]}>
          <Text style={[styles.loginLabel, { fontSize: 14, color: colors.gray[500] }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.7}>
            <Text style={[styles.loginLink, { fontSize: 14, fontWeight: '700', color: colors.primary }]}>
              Login
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

  /* Strength */
  strengthRow: {},
  strengthTrack: {},
  strengthFill: {},
  strengthText: {},

  errorHint: {},

  /* Signup Button */
  signupBtn: {
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
  signupBtnDisabled: {
    opacity: 0.55,
  },
  signupBtnText: {
    color: '#fff',
    letterSpacing: 0.3,
  },

  /* Login */
  loginRow: {},
  loginLabel: {},
  loginLink: {},
});
