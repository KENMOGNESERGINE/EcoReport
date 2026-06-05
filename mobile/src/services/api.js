import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your machine's local IP when testing on a physical device
// e.g. 'http://192.168.1.100:5000'
const BASE_URL = (typeof window !== 'undefined') ? 'http://localhost:3000' : 'http://192.168.1.128:3000';

class ApiService {
  BASE_URL = (typeof window !== "undefined") ? "http://localhost:3000" : "http://192.168.1.128:3000";
  async getToken() {
    return await AsyncStorage.getItem('ecotrade_token');
  }

  async setToken(token) {
    await AsyncStorage.setItem('ecotrade_token', token);
  }

  async removeToken() {
    await AsyncStorage.removeItem('ecotrade_token');
  }

  async request(method, endpoint, body = null, isFormData = false) {
    const token = await this.getToken();
    const headers = {};

    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!isFormData) headers['Content-Type'] = 'application/json';

    const config = { method, headers };
    if (body) config.body = isFormData ? body : JSON.stringify(body);

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, config);
      const data = await res.json();
      if (!res.ok) throw { status: res.status, ...data };
      return data;
    } catch (err) {
      if (err.status) throw err;
      throw { error: 'Network error. Check your connection.' };
    }
  }

  // ── AUTH ──────────────────────────────────────────────
  register(payload)  { return this.request('POST', '/api/auth/register', payload); }
  login(payload)     { return this.request('POST', '/api/auth/login', payload); }

  // ── PROFILE ───────────────────────────────────────────
  getMe()            { return this.request('GET', '/api/users/me'); }
  updateMe(payload)  { return this.request('PUT', '/api/users/me', payload); }

  uploadAvatar(uri) {
    const form = new FormData();
    form.append('avatar', { uri, type: 'image/jpeg', name: 'avatar.jpg' });
    return this.request('POST', '/api/users/me/avatar', form, true);
  }

  // ── PAYMENTS ──────────────────────────────────────────
  getPayments()             { return this.request('GET', '/api/users/me/payments'); }
  addPayment(payload)       { return this.request('POST', '/api/users/me/payments', payload); }
  deletePayment(id)         { return this.request('DELETE', `/api/users/me/payments/${id}`); }

  // ── LISTINGS ──────────────────────────────────────────
  getListings(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request('GET', `/api/listings${qs ? '?' + qs : ''}`);
  }
  getListing(id)            { return this.request('GET', `/api/listings/${id}`); }
  getMyListings()           { return this.request('GET', '/api/users/me/listings'); }

  async createListing(data, images = []) {
    const { Platform } = require('react-native');
    if (Platform.OS === 'web') {
      // Web: use browser FormData with Blob objects for real image upload
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v != null) form.append(k, String(v)); });
      // Convert base64/blob URLs to File objects and append
      for (let i = 0; i < images.length; i++) {
        const uri = images[i];
        try {
          let blob;
          if (uri.startsWith('data:')) {
            // base64 data URL from camera capture
            const res = await fetch(uri);
            blob = await res.blob();
          } else if (uri.startsWith('blob:')) {
            // blob URL from file picker
            const res = await fetch(uri);
            blob = await res.blob();
          } else {
            continue;
          }
          form.append('images', new File([blob], `image_${i}.jpg`, { type: 'image/jpeg' }));
        } catch (e) { console.warn('Image conversion error:', e); }
      }
      const token = await this.getToken();
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      // Do NOT set Content-Type - let browser set it with boundary for multipart
      const res = await fetch(`${this.BASE_URL || 'http://localhost:3000'}/api/listings`, {
        method: 'POST', headers, body: form
      });
      const result = await res.json();
      if (!res.ok) throw result;
      return result;
    }
    // Native
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v != null) form.append(k, String(v)); });
    images.forEach((uri, i) => form.append('images', { uri, type: 'image/jpeg', name: `image_${i}.jpg` }));
    return this.request('POST', '/api/listings', form, true);
  }

  updateListing(id, payload) { return this.request('PUT', `/api/listings/${id}`, payload); }
  deleteListing(id)          { return this.request('DELETE', `/api/listings/${id}`); }

  uploadListingImages(listingId, images) {
    const form = new FormData();
    images.forEach((uri, i) => form.append('images', { uri, type: 'image/jpeg', name: `img_${i}.jpg` }));
    return this.request('POST', `/api/listings/${listingId}/images`, form, true);
  }

  // ── ORDERS ────────────────────────────────────────────
  createOrder(payload) { return this.request('POST', '/api/orders', payload); }
  getMyOrders()        { return this.request('GET', '/api/orders/me'); }
}

const marketplaceService = new ApiService();
export { marketplaceService };
export default marketplaceService;