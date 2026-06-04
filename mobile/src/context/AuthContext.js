import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { marketplaceService as api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { restoreSession(); }, []);

  const restoreSession = async () => {
    try {
      const token = await AsyncStorage.getItem('ecotrade_token');
      if (token) { const userData = await api.getMe(); setUser(userData); }
    } catch { await AsyncStorage.removeItem('ecotrade_token'); }
    finally { setLoading(false); }
  };

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    await api.setToken(res.token);
    setUser(res.user);
    await AsyncStorage.setItem('token', res.token);
    await AsyncStorage.setItem('user', JSON.stringify(res.user));
    return res.user;
  };

  const register = async (payload) => {
    const res = await api.register(payload);
    await api.setToken(res.token);
    setUser(res.user);
    await AsyncStorage.setItem('token', res.token);
    await AsyncStorage.setItem('user', JSON.stringify(res.user));
    return res.user;
  };

  const logout = async () => {
    await api.removeToken();
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  const refreshUser = async () => { const u = await api.getMe(); setUser(u); return u; };
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
