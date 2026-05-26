import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from '../src/context/AuthContext';
import AppNavigator from '../src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
      setTimeout(() => setShowSplash(false), 2500);
    }
  }, [appIsReady]);

  if (!appIsReady || showSplash) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.logoPlaceholder}>
          
          <Text style={styles.logoText}>⚽</Text>
        </View>
        <Text style={styles.splashText}>Book Your Game</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 80,
  },
  splashText: {
    fontSize: 20,
    color: '#d1fae5',
    fontWeight: '500',
  },
});