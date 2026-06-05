import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const BASE = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.1.128:3000';

const api = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('ecotrade_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
