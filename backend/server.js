require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');

// ── Sergine's module routes ───────────────────────────────
const authRoutes        = require('./src/modules/auth/auth.routes');
const reportingRoutes   = require('./src/modules/reporting/reporting.routes');
const campaignsRoutes   = require('./src/modules/campaigns/campaigns.routes');
const rewardsRoutes     = require('./src/modules/rewards/rewards.routes');
const governmentRoutes  = require('./src/modules/government/government.routes');
const associationRoutes = require('./src/modules/association/association.routes');
const adminRoutes       = require('./src/modules/admin/admin.routes');

// ── Sergine's DB migrations ───────────────────────────────
const { createUsersTable }                    = require('./src/modules/auth/auth.model');
const { createReportsTable, createCampaignsTable } = require('./src/modules/reporting/reporting.model');

// ── Sergine's event consumers ─────────────────────────────
const startNotificationConsumer = require('./src/events/consumers/notification.consumer');
const startStatusConsumer       = require('./src/events/consumers/status.consumer');
const startRewardsConsumer      = require('./src/events/consumers/rewards.consumer');

// ── Shared database (compatible with both modules) ────────
const getDatabase = require('./src/shared/database');
const db          = getDatabase();

const app  = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'wastecycle_secret';

// ── Middleware ────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static uploads ────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ── Base64 image save helper ─────────────────────────
const saveBase64Image = (dataUrl) => {
  if (!dataUrl || !dataUrl.startsWith('data:')) return null;
  try {
    const b64    = dataUrl.split(',')[1];
    const ext    = dataUrl.split(';')[0].split('/')[1] || 'jpg';
    const fname  = 'report_' + Date.now() + '_' + Math.random().toString(36).slice(2) + '.' + ext;
    fs.writeFileSync(path.join(uploadsDir, fname), Buffer.from(b64, 'base64'));
    return fname;
  } catch(e) { console.error('saveBase64Image:', e); return null; }
};

// ── File upload config ────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    cb(null, allowed.test(file.mimetype));
  },
});

// ── Auth middleware ───────────────────────────────────────
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { ...decoded, id: decoded.id || decoded.userId };
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

// ── Helpers ───────────────────────────────────────────────
const getImageUrl = (req, filename) =>
  filename ? `${req.protocol}://${req.get('host')}/uploads/${filename}` : null;

const isProfileComplete = (user, payments) => {
  const hasName = (user?.first_name && user?.last_name) || user?.name;
  return !!(hasName && user?.city && user?.id_number && payments?.length > 0);
};

// ── Marketplace DB migrations ─────────────────────────────
const runMarketplaceMigrations = async () => {
  await db.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS first_name  VARCHAR(100),
      ADD COLUMN IF NOT EXISTS last_name   VARCHAR(100),
      ADD COLUMN IF NOT EXISTS id_number   VARCHAR(50),
      ADD COLUMN IF NOT EXISTS bio         TEXT,
      ADD COLUMN IF NOT EXISTS avatar      VARCHAR(255),
      ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ DEFAULT NOW();
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS payment_accounts (
      id           SERIAL PRIMARY KEY,
      user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type         VARCHAR(50) NOT NULL,
      number       VARCHAR(100) NOT NULL,
      account_name VARCHAR(100),
      created_at   TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS listings (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title       VARCHAR(255) NOT NULL,
      category    VARCHAR(100) NOT NULL,
      condition   VARCHAR(50) DEFAULT 'Mixed',
      quantity    VARCHAR(100) NOT NULL,
      price       NUMERIC(10,2) NOT NULL,
      city        VARCHAR(100) NOT NULL,
      description TEXT DEFAULT '',
      latitude    NUMERIC(10,7),
      longitude   NUMERIC(10,7),
      active      BOOLEAN DEFAULT TRUE,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS listing_images (
      id         SERIAL PRIMARY KEY,
      listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      filename   VARCHAR(255) NOT NULL,
      is_primary BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id             SERIAL PRIMARY KEY,
      buyer_id       INTEGER NOT NULL REFERENCES users(id),
      seller_id      INTEGER NOT NULL REFERENCES users(id),
      listing_id     INTEGER NOT NULL REFERENCES listings(id),
      amount         NUMERIC(10,2) NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      payment_number VARCHAR(100) DEFAULT '',
      status         VARCHAR(20) DEFAULT 'pending',
      paid_at        TIMESTAMPTZ,
      created_at     TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('✅ Marketplace tables ready');
};

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));


// u2500u2500 Auth/me endpoint u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const r = await db.query('SELECT id, name, email, role, phone, city FROM users WHERE id=$1', [req.user.id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json({ user: r.rows[0] });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ── Sergine's reporting routes ────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/reports',     reportingRoutes);
app.use('/api/campaigns',   campaignsRoutes);
app.use('/api/rewards',     rewardsRoutes);
app.use('/api/government',  governmentRoutes);
app.use('/api/association', associationRoutes);
app.use('/api/admin',       adminRoutes);

// ═══════════════════════════════════════════════════════════
// MARKETPLACE ROUTES (inline)
// ═══════════════════════════════════════════════════════════

// ── User profile ──────────────────────────────────────────
app.get('/api/users/me', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id=$1', [req.user.id]);
    const user   = result.rows[0];
    if (!user) return res.status(404).json({ error: 'Not found' });
    const pmts   = await db.query('SELECT * FROM payment_accounts WHERE user_id=$1', [user.id]);
    res.json({
      id: user.id, firstName: user.first_name, lastName: user.last_name,
      email: user.email, phone: user.phone, city: user.city,
      idNumber: user.id_number, bio: user.bio,
      avatar: user.avatar ? getImageUrl(req, user.avatar) : null,
      profileComplete: isProfileComplete(user, pmts.rows),
      paymentAccounts: pmts.rows,
      role: user.role,
    });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/users/me', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, city, idNumber, bio } = req.body;
    await db.query(
      `UPDATE users SET first_name=$1, last_name=$2, phone=$3, city=$4,
       id_number=$5, bio=$6, updated_at=NOW() WHERE id=$7`,
      [firstName, lastName, phone, city, idNumber, bio, req.user.id]
    );
    const r = await db.query('SELECT * FROM users WHERE id=$1', [req.user.id]);
    const p = await db.query('SELECT * FROM payment_accounts WHERE user_id=$1', [req.user.id]);
    res.json({ success: true, profileComplete: isProfileComplete(r.rows[0], p.rows) });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  await db.query('UPDATE users SET avatar=$1 WHERE id=$2', [req.file.filename, req.user.id]);
  res.json({ avatar: getImageUrl(req, req.file.filename) });
});

// ── Payment accounts ──────────────────────────────────────
app.get('/api/users/me/payments', auth, async (req, res) => {
  const r = await db.query('SELECT * FROM payment_accounts WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
  res.json(r.rows);
});

app.post('/api/users/me/payments', auth, async (req, res) => {
  try {
    const { type, number, accountName } = req.body;
    if (!type || !number) return res.status(400).json({ error: 'Type and number required' });
    const r = await db.query(
      'INSERT INTO payment_accounts (user_id,type,number,account_name) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.user.id, type, number, accountName || '']
    );
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/users/me/payments/:id', auth, async (req, res) => {
  await db.query('DELETE FROM payment_accounts WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ success: true });
});

// ── Listings ──────────────────────────────────────────────
app.get('/api/listings', async (req, res) => {
  try {
    const { category, city, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const params = [];
    let idx = 1;
    let q = `
      SELECT l.*, u.first_name, u.last_name, u.phone AS seller_phone,
        (SELECT filename FROM listing_images WHERE listing_id=l.id ORDER BY is_primary DESC LIMIT 1) AS primary_image
      FROM listings l JOIN users u ON l.user_id=u.id WHERE l.active=TRUE
    `;
    if (category && category !== 'all') { q += ` AND l.category=$${idx++}`;  params.push(category); }
    if (city)    { q += ` AND l.city ILIKE $${idx++}`;   params.push(`%${city}%`); }
    if (search)  { q += ` AND (l.title ILIKE $${idx++} OR l.description ILIKE $${idx++})`; params.push(`%${search}%`, `%${search}%`); }
    q += ` ORDER BY l.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(Number(limit), Number(offset));
    const r = await db.query(q, params);
    res.json({ listings: r.rows.map(l => ({
      id: l.id, title: l.title, category: l.category, condition: l.condition,
      quantity: l.quantity, price: Number(l.price), city: l.city,
      description: l.description, phone: l.seller_phone,
      latitude:  l.latitude  ? Number(l.latitude)  : null,
      longitude: l.longitude ? Number(l.longitude) : null,
      seller: `${l.first_name} ${l.last_name}`, sellerId: l.user_id,
      createdAt: l.created_at,
      image: l.primary_image ? getImageUrl(req, l.primary_image) : null,
    })) });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/listings/:id', async (req, res) => {
  try {
    const r = await db.query(
      `SELECT l.*, u.first_name, u.last_name, u.phone AS seller_phone FROM listings l
       JOIN users u ON l.user_id=u.id WHERE l.id=$1`, [req.params.id]
    );
    if (!r.rows[0]) return res.status(404).json({ error: 'Listing not found' });
    const l = r.rows[0];
    const imgs = await db.query('SELECT * FROM listing_images WHERE listing_id=$1 ORDER BY is_primary DESC', [l.id]);
    res.json({
      id: l.id, title: l.title, category: l.category, condition: l.condition,
      quantity: l.quantity, price: Number(l.price), city: l.city,
      description: l.description, phone: l.seller_phone,
      latitude: l.latitude ? Number(l.latitude) : null,
      longitude: l.longitude ? Number(l.longitude) : null,
      seller: `${l.first_name} ${l.last_name}`, sellerId: l.user_id,
      createdAt: l.created_at,
      images: imgs.rows.map(i => ({ id: i.id, url: getImageUrl(req, i.filename), isPrimary: i.is_primary })),
    });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/listings', auth, upload.array('images', 8), async (req, res) => {
  try {
    const ur = await db.query('SELECT * FROM users WHERE id=$1', [req.user.id]);
    const pr = await db.query('SELECT * FROM payment_accounts WHERE user_id=$1', [req.user.id]);
    if (!isProfileComplete(ur.rows[0], pr.rows))
      return res.status(403).json({ error: 'PROFILE_INCOMPLETE', message: 'Complete your profile and add a payment account first.' });
    const { title, category, condition, quantity, price, city, description, latitude, longitude } = req.body;
    if (!title || !category || !quantity || !price || !city)
      return res.status(400).json({ error: 'Missing required fields' });
    const r = await db.query(
      `INSERT INTO listings (user_id,title,category,condition,quantity,price,city,description,latitude,longitude)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [req.user.id, title, category, condition || 'Mixed', quantity, Number(price),
       city, description || '', latitude || null, longitude || null]
    );
    const listing = r.rows[0];
    if (req.files?.length) {
      for (let i = 0; i < req.files.length; i++) {
        await db.query('INSERT INTO listing_images (listing_id,filename,is_primary) VALUES ($1,$2,$3)',
          [listing.id, req.files[i].filename, i === 0]);
      }
    }
    res.status(201).json({ success: true, listing: { id: listing.id, title, category, city, price } });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/listings/:id', auth, async (req, res) => {
  try {
    const ex = await db.query('SELECT id FROM listings WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    if (!ex.rows[0]) return res.status(404).json({ error: 'Not found or not yours' });
    const { title, category, condition, quantity, price, city, description, latitude, longitude } = req.body;
    await db.query(
      `UPDATE listings SET title=$1,category=$2,condition=$3,quantity=$4,price=$5,
       city=$6,description=$7,latitude=$8,longitude=$9,updated_at=NOW() WHERE id=$10`,
      [title, category, condition, quantity, price, city, description, latitude, longitude, req.params.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/listings/:id', auth, async (req, res) => {
  await db.query('UPDATE listings SET active=FALSE WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ success: true });
});

app.get('/api/users/me/listings', auth, async (req, res) => {
  try {
    const r = await db.query(
      `SELECT l.*,
        (SELECT filename FROM listing_images WHERE listing_id=l.id ORDER BY is_primary DESC LIMIT 1) AS primary_image
       FROM listings l WHERE l.user_id=$1 AND l.active=TRUE ORDER BY l.created_at DESC`,
      [req.user.id]
    );
    res.json(r.rows.map(l => ({ ...l, price: Number(l.price), image: l.primary_image ? getImageUrl(req, l.primary_image) : null })));
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ── Orders ────────────────────────────────────────────────
app.post('/api/orders', auth, async (req, res) => {
  try {
    const { listingId, paymentMethod, paymentNumber, amount } = req.body;
    if (!listingId || !paymentMethod || !amount) return res.status(400).json({ error: 'Missing required fields' });
    const lr = await db.query('SELECT * FROM listings WHERE id=$1 AND active=TRUE', [listingId]);
    if (!lr.rows[0]) return res.status(404).json({ error: 'Listing not found' });
    if (lr.rows[0].user_id === req.user.id) return res.status(400).json({ error: 'Cannot buy your own listing' });
    const r = await db.query(
      `INSERT INTO orders (buyer_id,seller_id,listing_id,amount,payment_method,payment_number,status)
       VALUES ($1,$2,$3,$4,$5,$6,'pending') RETURNING id`,
      [req.user.id, lr.rows[0].user_id, listingId, amount, paymentMethod, paymentNumber || '']
    );
    const orderId = r.rows[0].id;
    setTimeout(async () => {
      try { await db.query("UPDATE orders SET status='paid',paid_at=NOW() WHERE id=$1", [orderId]); } catch(e) {}
    }, 2000);
    res.status(201).json({ success: true, orderId, message: 'Order placed. Payment processing...' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/orders/me', auth, async (req, res) => {
  try {
    const r = await db.query(
      `SELECT o.*, l.title AS listing_title, u.first_name AS seller_first, u.last_name AS seller_last
       FROM orders o JOIN listings l ON o.listing_id=l.id JOIN users u ON o.seller_id=u.id
       WHERE o.buyer_id=$1 ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(r.rows.map(o => ({ ...o, amount: Number(o.amount) })));
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ── 404 & error handlers ──────────────────────────────────
app.use((req, res) => res.status(404).json({ status: 'error', message: 'Route not found' }));
app.use((err, req, res, next) => { console.error(err.stack); res.status(500).json({ status: 'error', message: 'Internal server error' }); });

// ── Start server ──────────────────────────────────────────
createUsersTable()
  .then(() => { console.log('✅ Users table ready'); return createReportsTable(); })
  .then(() => { console.log('✅ Reports table ready'); return createCampaignsTable(); })
  .then(() => { console.log('✅ Campaigns table ready'); return runMarketplaceMigrations(); })
  .then(() => {
    startNotificationConsumer().catch(console.error);
    startStatusConsumer().catch(console.error);
    startRewardsConsumer().catch(console.error);
    app.listen(PORT, () => console.log(`🌿 EcoReport API → http://localhost:${PORT}`));
  })
  .catch(err => { console.error('Startup error:', err); process.exit(1); });

module.exports = app;