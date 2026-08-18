import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

function webStorage() {
  try {
    return (globalThis as any).localStorage;
  } catch {
    return null;
  }
}

export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (isWeb) {
      return webStorage()?.getItem(key) ?? null;
    }
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      webStorage()?.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  async deleteItem(key: string): Promise<void> {
    if (isWeb) {
      webStorage()?.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};
