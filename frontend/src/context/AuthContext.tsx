import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

// ⚠️ REPLACE WITH YOUR COMPUTER'S IP ADDRESS WHEN BACKEND IS READY
const API_BASE_URL = 'http://192.168.1.xxx:8081/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, full_name: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const savedToken = await SecureStore.getItemAsync('authToken');
      if (savedToken) {
        setToken(savedToken);
        
        setUser({ id: 1, email: 'test@test.com', full_name: 'Test User' });
      }
    } catch (error) {
      console.error('Error loading token:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (authToken: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      await logout();
    }
  };

  const login = async (email: string, password: string) => {
    //  TEMPORARY BYPASS — for testing untill backend is ready
    const fakeToken = 'test-token-123';
    const fakeUser = { id: 1, email, full_name: 'Test User' };
    await SecureStore.setItemAsync('authToken', fakeToken);
    setToken(fakeToken);
    setUser(fakeUser);

    
    // try {
    //   const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    //     email,
    //     password,
    //   });
    //   const { token: authToken, user: userData } = response.data;
    //   await SecureStore.setItemAsync('authToken', authToken);
    //   setToken(authToken);
    //   setUser(userData);
    // } catch (error: any) {
    //   throw new Error(error.response?.data?.error || 'Login failed');
    // }
  };

  const signup = async (email: string, password: string, full_name: string, phone?: string) => {
    // ✅ TEMPORARY BYPASS — remove when backend is ready
    const fakeToken = 'test-token-123';
    const fakeUser = { id: 1, email, full_name };
    await SecureStore.setItemAsync('authToken', fakeToken);
    setToken(fakeToken);
    setUser(fakeUser);

    
    // try {
    //   const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
    //     email,
    //     password,
    //     full_name,
    //     phone,
    //   });
    //   const { token: authToken, user: userData } = response.data;
    //   await SecureStore.setItemAsync('authToken', authToken);
    //   setToken(authToken);
    //   setUser(userData);
    // } catch (error: any) {
    //   throw new Error(error.response?.data?.error || 'Signup failed');
    // }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};