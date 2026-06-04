import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.1.128:3000';

class ApiService {
  async getToken() { return await AsyncStorage.getItem('ecotrade_token'); }
  async setToken(token) { await AsyncStorage.setItem('ecotrade_token', token); }
  async removeToken() { await AsyncStorage.removeItem('ecotrade_token'); }

  async request(method, endpoint, body = null, isFormData = false) {
    const token = await this.getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!isFormData) headers['Content-Type'] = 'application/json';
    const config = { method, headers };
    if (body) config.body = isFormData ? body : JSON.stringify(body);
    try {
      console.log(`API ${method} ${endpoint}`);
      const res  = await fetch(`${BASE_URL}${endpoint}`, config);
      const data = await res.json();
      if (!res.ok) throw { status: res.status, ...data };
      return data;
    } catch (err) {
      console.error('API Error:', JSON.stringify(err));
      if (err.status) throw err;
      throw { error: 'Network error. Check your connection and backend.' };
    }
  }

  register(payload)  { return this.request('POST', '/api/auth/register', payload); }
  login(payload)     { return this.request('POST', '/api/auth/login', payload); }
  getMe()            { return this.request('GET',  '/api/users/me'); }
  updateMe(payload)  { return this.request('PUT',  '/api/users/me', payload); }
  getPayments()      { return this.request('GET',  '/api/users/me/payments'); }
  addPayment(p)      { return this.request('POST', '/api/users/me/payments', p); }
  deletePayment(id)  { return this.request('DELETE', `/api/users/me/payments/${id}`); }

  getListings(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request('GET', `/api/listings${qs ? '?' + qs : ''}`);
  }
  getListing(id)     { return this.request('GET',    `/api/listings/${id}`); }
  getMyListings()    { return this.request('GET',    '/api/users/me/listings'); }

  createListing(data, images = []) {
    if (Platform.OS === 'web') {
      return this.request('POST', '/api/listings', data, false);
    }
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v != null) form.append(k, String(v)); });
    images.forEach((uri, i) => form.append('images', { uri, type: 'image/jpeg', name: `image_${i}.jpg` }));
    return this.request('POST', '/api/listings', form, true);
  }

  updateListing(id, payload) { return this.request('PUT',    `/api/listings/${id}`, payload); }
  deleteListing(id)          { return this.request('DELETE', `/api/listings/${id}`); }
  createOrder(payload)       { return this.request('POST', '/api/orders', payload); }
  getMyOrders()              { return this.request('GET',  '/api/orders/me'); }

  uploadAvatar(uri) {
    const form = new FormData();
    form.append('avatar', { uri, type: 'image/jpeg', name: 'avatar.jpg' });
    return this.request('POST', '/api/users/me/avatar', form, true);
  }
}

export default new ApiService();
