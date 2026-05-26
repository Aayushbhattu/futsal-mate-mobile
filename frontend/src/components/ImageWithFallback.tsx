import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ImageProps, StyleSheet, View } from 'react-native';
import colors from '../constants/colors';

interface ImageWithFallbackProps extends ImageProps {
  source: { uri: string };
}

export default function ImageWithFallback({ source, style, ...props }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <View style={[styles.fallback, style]}>
        <Ionicons name="image-outline" size={40} color={colors.gray[400]} />
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={style}
      onError={() => setError(true)}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
});