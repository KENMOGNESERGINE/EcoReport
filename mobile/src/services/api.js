import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import axios from 'axios';

const BASE = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.1.128:3000';

const getToken    = () => AsyncStorage.getItem('ecotrade_token');
const setToken    = (t) => AsyncStorage.setItem('ecotrade_token', t);
const removeToken = () => AsyncStorage.removeItem('ecotrade_token');

const request = async (method, endpoint, body = null, isFormData = false) => {
  const token = await getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';
  const config = { method, headers };
  if (body) config.body = isFormData ? body : JSON.stringify(body);
  try {
    const res  = await fetch(`${BASE}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) throw { status: res.status, ...data };
    return data;
  } catch (err) {
    if (err.status) throw err;
    throw { error: 'Network error. Check your connection.' };
  }
};

const reportingApi = axios.create({ baseURL: `${BASE}/api`, timeout: 10000, headers: { 'Content-Type': 'application/json' } });
reportingApi.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const marketplaceService = {
  getToken, setToken, removeToken,
  register: (p)  => request('POST', '/api/auth/register', p),
  login:    (p)  => request('POST', '/api/auth/login', p),
  getMe:    ()   => request('GET',  '/api/users/me'),
  updateMe: (p)  => request('PUT',  '/api/users/me', p),
  getPayments:   ()   => request('GET',    '/api/users/me/payments'),
  addPayment:    (p)  => request('POST',   '/api/users/me/payments', p),
  deletePayment: (id) => request('DELETE', `/api/users/me/payments/${id}`),
  getListings: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/api/listings${qs ? '?' + qs : ''}`);
  },
  getListing:    (id) => request('GET',    `/api/listings/${id}`),
  getMyListings: ()   => request('GET',    '/api/users/me/listings'),
  createListing: (data, images = []) => {
    if (Platform.OS === 'web') return request('POST', '/api/listings', data, false);
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v != null) form.append(k, String(v)); });
    images.forEach((uri, i) => form.append('images', { uri, type: 'image/jpeg', name: `image_${i}.jpg` }));
    return request('POST', '/api/listings', form, true);
  },
  updateListing: (id, p) => request('PUT',    `/api/listings/${id}`, p),
  deleteListing: (id)    => request('DELETE', `/api/listings/${id}`),
  createOrder:   (p)     => request('POST', '/api/orders', p),
  getMyOrders:   ()      => request('GET',  '/api/orders/me'),
  uploadAvatar: (uri) => {
    const form = new FormData();
    form.append('avatar', { uri, type: 'image/jpeg', name: 'avatar.jpg' });
    return request('POST', '/api/users/me/avatar', form, true);
  },
};

export default reportingApi;
