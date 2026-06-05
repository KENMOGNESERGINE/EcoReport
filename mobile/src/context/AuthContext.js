import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const AuthContext = createContext(null);

const BASE = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.1.128:3000';

const apiCall = async (method, endpoint, body = null) => {
  const token = await AsyncStorage.getItem('ecotrade_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res  = await fetch(`${BASE}${endpoint}`, {
    method, headers,
    body: body ? JSON.stringify(body) : null,
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { restoreSession(); }, []);

  const restoreSession = async () => {
    try {
      const token = await AsyncStorage.getItem('ecotrade_token');
      if (token) {
        // Use /api/users/me which returns profileComplete + paymentAccounts
        const userData = await apiCall('GET', '/api/users/me');
        setUser(userData);
      }
    } catch {
      await AsyncStorage.removeItem('ecotrade_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await apiCall('POST', '/api/auth/login', { email, password });
    const token    = res.token || res.data?.token;
    const userData = res.user  || res.data?.user;
    await AsyncStorage.setItem('ecotrade_token', token);
    setUser(userData);
    // Fetch full profile with profileComplete flag
    try {
      const full = await apiCall('GET', '/api/users/me');
      setUser(full);
      return full;
    } catch { return userData; }
  };

  const register = async (payload) => {
    const name = payload.name || `${payload.firstName || ''} ${payload.lastName || ''}`.trim();
    const res = await apiCall('POST', '/api/auth/register', {
      name, email: payload.email, password: payload.password, role: payload.role || 'citizen',
    });
    const token    = res.token || res.data?.token;
    const userData = res.user  || res.data?.user;
    await AsyncStorage.setItem('ecotrade_token', token);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('ecotrade_token');
    setUser(null);
  };

  // Always fetch /api/users/me which includes profileComplete + paymentAccounts
  const refreshUser = async () => {
    try {
      const userData = await apiCall('GET', '/api/users/me');
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('refreshUser error:', err);
      return user;
    }
  };

  const token = user ? 'active' : null;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};