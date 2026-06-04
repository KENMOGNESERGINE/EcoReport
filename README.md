# ♻ EcoTrade — Recycling Marketplace

A full-stack React Native + Node.js marketplace for buying and selling recyclable materials.

---

## Project Structure

```
ecore/
├── backend/              ← Node.js + Express API
│   ├── server.js         ← Main API server (all routes)
│   ├── database.js       ← SQLite setup + migrations
│   ├── uploads/          ← Uploaded images
│   ├── package.json
│   └── Dockerfile
├── mobile/               ← React Native (Expo) app
│   ├── App.js            ← Navigation root
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js    ← Auth state (JWT)
│   │   ├── services/
│   │   │   └── api.js            ← All API calls
│   │   └── screens/
│   │       ├── AuthScreen.js          ← Login / Sign Up
│   │       ├── MarketplaceScreen.js   ← Home feed + filters
│   │       ├── ListingDetailScreen.js ← Detail + map + payment
│   │       ├── CreateListingScreen.js ← Post listing + sensors
│   │       ├── MyListingsScreen.js    ← Seller's listings
│   │       └── ProfileScreen.js      ← Profile + payments + orders
│   └── package.json
└── docker-compose.yml
```

---

## Setup

### 1. Backend
```bash
cd backend
npm install
npm run dev        # starts on http://localhost:5000
```

### 2. Mobile
```bash
cd mobile
npm install
npx expo start     # scan QR with Expo Go app
```

### 3. Connect mobile → backend

**Android emulator:** `10.0.2.2:5000` (already set in api.js)
**Physical device:** Edit `mobile/src/services/api.js`:
```js
const BASE_URL = 'http://YOUR_LOCAL_IP:5000';
```
Find your IP with `ipconfig` (Windows) or `ifconfig` (Mac/Linux).

### 4. Google Maps API key
1. Go to https://console.cloud.google.com
2. Enable **Maps SDK for Android** and **Maps SDK for iOS**
3. Create an API key
4. Add it to `mobile/app.json` in both `android.config.googleMaps.apiKey` and `ios.config.googleMapsApiKey`

### 5. Docker (production)
```bash
docker-compose up -d
```

---

## Features

| Feature | Details |
|---|---|
| Auth | JWT register/login, 30-day token, profile guard |
| Listings | Create, browse, filter by category/search, paginated |
| Images | Multi-image upload, camera capture, gallery picker |
| Sensors | GPS location (auto-fill city + map pin), microphone (voice notes) |
| Map | Interactive map pin on create, real Google Maps on detail view |
| Profile | Personal info, completion bar, national ID required |
| Payments | MTN MoMo, Orange Money, Bank Transfer accounts |
| Orders | Buy flow with 2% service fee, order history |
| Guards | Cannot list without complete profile + payment account |

---

## API Endpoints

```
POST /api/auth/register
POST /api/auth/login
GET  /api/users/me
PUT  /api/users/me
POST /api/users/me/avatar
GET  /api/users/me/payments
POST /api/users/me/payments
DEL  /api/users/me/payments/:id
GET  /api/listings?category=&search=&page=&limit=
GET  /api/listings/:id
POST /api/listings          (multipart/form-data)
PUT  /api/listings/:id
DEL  /api/listings/:id
GET  /api/users/me/listings
POST /api/listings/:id/images
POST /api/orders
GET  /api/orders/me
GET  /api/health
```
