require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const db       = require('./database');

const app        = express();
const PORT       = process.env.PORT       || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'ecotrade_secret_2025';

// ── MIDDLEWARE ────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use((req,res,next)=>{console.log(req.method,req.path);next();});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── MULTER ────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase())
      ? cb(null, true)
      : cb(new Error('Only image files allowed'));
  },
});

// ── AUTH MIDDLEWARE ───────────────────────────────────────
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
};

const getImageUrl = (req, filename) => {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

const isProfileComplete = (user, payments) =>
  !!(user.first_name && user.last_name && user.email &&
     user.phone && user.city && user.id_number && payments.length > 0);

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ error: 'All fields required' });

    const exists = await db.get('SELECT id FROM users WHERE email=$1', [email]);
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const result = await db.run(
      'INSERT INTO users (first_name,last_name,email,phone,password) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [firstName, lastName, email, phone || '', hashed]
    );
    const user  = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      token,
      user: {
        id: user.id, firstName: user.first_name, lastName: user.last_name,
        email: user.email, phone: user.phone, profileComplete: false,
      },
    });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.get('SELECT * FROM users WHERE email=$1', [email]);
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const payments = await db.all('SELECT * FROM payment_accounts WHERE user_id=$1', [user.id]);
    const token    = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user.id, firstName: user.first_name, lastName: user.last_name,
        email: user.email, phone: user.phone, city: user.city,
        idNumber: user.id_number, bio: user.bio,
        profileComplete: isProfileComplete(user, payments),
        paymentAccounts: payments,
      },
    });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// ═══════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════
app.get('/api/users/me', auth, async (req, res) => {
  try {
    const user     = await db.get('SELECT * FROM users WHERE id=$1', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'Not found' });
    const payments = await db.all('SELECT * FROM payment_accounts WHERE user_id=$1', [user.id]);
    res.json({
      id: user.id, firstName: user.first_name, lastName: user.last_name,
      email: user.email, phone: user.phone, city: user.city,
      idNumber: user.id_number, bio: user.bio,
      avatar: user.avatar ? getImageUrl(req, user.avatar) : null,
      profileComplete: isProfileComplete(user, payments),
      paymentAccounts: payments,
    });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/users/me', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, city, idNumber, bio } = req.body;
    await db.run(
      `UPDATE users SET first_name=$1, last_name=$2, phone=$3, city=$4,
       id_number=$5, bio=$6, updated_at=NOW() WHERE id=$7`,
      [firstName, lastName, phone, city, idNumber, bio, req.user.id]
    );
    const user     = await db.get('SELECT * FROM users WHERE id=$1', [req.user.id]);
    const payments = await db.all('SELECT * FROM payment_accounts WHERE user_id=$1', [user.id]);
    res.json({ success: true, profileComplete: isProfileComplete(user, payments) });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  await db.run('UPDATE users SET avatar=$1 WHERE id=$2', [req.file.filename, req.user.id]);
  res.json({ avatar: getImageUrl(req, req.file.filename) });
});

// ── PAYMENT ACCOUNTS ──────────────────────────────────────
app.get('/api/users/me/payments', auth, async (req, res) => {
  res.json(await db.all('SELECT * FROM payment_accounts WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]));
});

app.post('/api/users/me/payments', auth, async (req, res) => {
  try {
    const { type, number, accountName } = req.body;
    if (!type || !number) return res.status(400).json({ error: 'Type and number required' });
    const result = await db.run(
      'INSERT INTO payment_accounts (user_id,type,number,account_name) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.user.id, type, number, accountName || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/users/me/payments/:id', auth, async (req, res) => {
  await db.run('DELETE FROM payment_accounts WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════
// LISTINGS
// ═══════════════════════════════════════════════════════════
app.get('/api/listings', async (req, res) => {
  try {
    const { category, city, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const params = [];
    let idx = 1;

    let q = `
      SELECT l.*, u.first_name, u.last_name, u.phone AS seller_phone,
        (SELECT filename FROM listing_images WHERE listing_id=l.id ORDER BY is_primary DESC LIMIT 1) AS primary_image
      FROM listings l
      JOIN users u ON l.user_id = u.id
      WHERE l.active = TRUE
    `;

    if (category && category !== 'all') { q += ` AND l.category=$${idx++}`;              params.push(category); }
    if (city)                           { q += ` AND l.city ILIKE $${idx++}`;             params.push(`%${city}%`); }
    if (search)                         { q += ` AND (l.title ILIKE $${idx++} OR l.description ILIKE $${idx++})`; params.push(`%${search}%`, `%${search}%`); }

    q += ` ORDER BY l.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(Number(limit), Number(offset));

    const listings = await db.all(q, params);
    res.json({
      listings: listings.map(l => ({
        id: l.id, title: l.title, category: l.category, condition: l.condition,
        quantity: l.quantity, price: Number(l.price), city: l.city,
        description: l.description, phone: l.seller_phone,
        latitude: l.latitude ? Number(l.latitude) : null,
        longitude: l.longitude ? Number(l.longitude) : null,
        seller: `${l.first_name} ${l.last_name}`, sellerId: l.user_id,
        createdAt: l.created_at,
        image: l.primary_image ? getImageUrl(req, l.primary_image) : null,
      })),
    });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/listings/:id', async (req, res) => {
  try {
    const l = await db.get(
      `SELECT l.*, u.first_name, u.last_name, u.phone AS seller_phone, u.avatar AS seller_avatar
       FROM listings l JOIN users u ON l.user_id=u.id WHERE l.id=$1`,
      [req.params.id]
    );
    if (!l) return res.status(404).json({ error: 'Listing not found' });
    const images = await db.all('SELECT * FROM listing_images WHERE listing_id=$1 ORDER BY is_primary DESC', [l.id]);
    res.json({
      id: l.id, title: l.title, category: l.category, condition: l.condition,
      quantity: l.quantity, price: Number(l.price), city: l.city,
      description: l.description, phone: l.seller_phone,
      latitude:  l.latitude  ? Number(l.latitude)  : null,
      longitude: l.longitude ? Number(l.longitude) : null,
      seller: `${l.first_name} ${l.last_name}`, sellerId: l.user_id,
      sellerAvatar: l.seller_avatar ? getImageUrl(req, l.seller_avatar) : null,
      createdAt: l.created_at,
      images: images.map(i => ({ id: i.id, url: getImageUrl(req, i.filename), isPrimary: i.is_primary })),
    });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/listings', auth, upload.array('images', 8), async (req, res) => {
  try {
    const user     = await db.get('SELECT * FROM users WHERE id=$1', [req.user.id]);
    const payments = await db.all('SELECT * FROM payment_accounts WHERE user_id=$1', [req.user.id]);
    if (!isProfileComplete(user, payments))
      return res.status(403).json({ error: 'PROFILE_INCOMPLETE', message: 'Complete your profile and add a payment account first.' });

    const { title, category, condition, quantity, price, city, description, latitude, longitude } = req.body;
    if (!title || !category || !quantity || !price || !city)
      return res.status(400).json({ error: 'Missing required fields' });

    const result = await db.run(
      `INSERT INTO listings (user_id,title,category,condition,quantity,price,city,description,latitude,longitude)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [req.user.id, title, category, condition || 'Mixed', quantity, Number(price),
       city, description || '', latitude || null, longitude || null]
    );
    const listing = result.rows[0];

    if (req.files?.length) {
      for (let i = 0; i < req.files.length; i++) {
        await db.run(
          'INSERT INTO listing_images (listing_id,filename,is_primary) VALUES ($1,$2,$3)',
          [listing.id, req.files[i].filename, i === 0]
        );
      }
    }

    res.status(201).json({ success: true, listing: { id: listing.id, title, category, city, price } });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/listings/:id', auth, async (req, res) => {
  try {
    const exists = await db.get('SELECT id FROM listings WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    if (!exists) return res.status(404).json({ error: 'Not found or not yours' });
    const { title, category, condition, quantity, price, city, description, latitude, longitude } = req.body;
    await db.run(
      `UPDATE listings SET title=$1,category=$2,condition=$3,quantity=$4,price=$5,
       city=$6,description=$7,latitude=$8,longitude=$9,updated_at=NOW() WHERE id=$10`,
      [title, category, condition, quantity, price, city, description, latitude, longitude, req.params.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/listings/:id', auth, async (req, res) => {
  await db.run('UPDATE listings SET active=FALSE WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ success: true });
});

app.get('/api/users/me/listings', auth, async (req, res) => {
  try {
    const listings = await db.all(
      `SELECT l.*,
        (SELECT filename FROM listing_images WHERE listing_id=l.id ORDER BY is_primary DESC LIMIT 1) AS primary_image
       FROM listings l WHERE l.user_id=$1 AND l.active=TRUE ORDER BY l.created_at DESC`,
      [req.user.id]
    );
    res.json(listings.map(l => ({ ...l, price: Number(l.price), image: l.primary_image ? getImageUrl(req, l.primary_image) : null })));
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/listings/:id/images', auth, upload.array('images', 8), async (req, res) => {
  const listing = await db.get('SELECT id FROM listings WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  if (!listing) return res.status(404).json({ error: 'Not found' });
  if (!req.files?.length) return res.status(400).json({ error: 'No files uploaded' });
  const cnt = await db.get('SELECT COUNT(*) AS c FROM listing_images WHERE listing_id=$1', [req.params.id]);
  for (let i = 0; i < req.files.length; i++) {
    await db.run('INSERT INTO listing_images (listing_id,filename,is_primary) VALUES ($1,$2,$3)',
      [req.params.id, req.files[i].filename, Number(cnt.c) === 0 && i === 0]);
  }
  const imgs = await db.all('SELECT * FROM listing_images WHERE listing_id=$1', [req.params.id]);
  res.json(imgs.map(i => ({ id: i.id, url: getImageUrl(req, i.filename), isPrimary: i.is_primary })));
});

// ═══════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════
app.post('/api/orders', auth, async (req, res) => {
  try {
    const { listingId, paymentMethod, paymentNumber, amount } = req.body;
    if (!listingId || !paymentMethod || !amount)
      return res.status(400).json({ error: 'Missing required fields' });

    const listing = await db.get('SELECT * FROM listings WHERE id=$1 AND active=TRUE', [listingId]);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    if (listing.user_id === req.user.id) return res.status(400).json({ error: 'Cannot buy your own listing' });

    const result = await db.run(
      `INSERT INTO orders (buyer_id,seller_id,listing_id,amount,payment_method,payment_number,status)
       VALUES ($1,$2,$3,$4,$5,$6,'pending') RETURNING id`,
      [req.user.id, listing.user_id, listingId, amount, paymentMethod, paymentNumber || '']
    );
    const orderId = result.rows[0].id;

    // Simulate payment confirmation after 2 seconds
    setTimeout(async () => {
      try {
        await db.run("UPDATE orders SET status='paid', paid_at=NOW() WHERE id=$1", [orderId]);
      } catch (e) { console.error('Order update error:', e); }
    }, 2000);

    res.status(201).json({ success: true, orderId, message: 'Order placed. Payment processing...' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/orders/me', auth, async (req, res) => {
  try {
    const orders = await db.all(
      `SELECT o.*, l.title AS listing_title, u.first_name AS seller_first, u.last_name AS seller_last
       FROM orders o
       JOIN listings l ON o.listing_id = l.id
       JOIN users u ON o.seller_id = u.id
       WHERE o.buyer_id = $1
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(orders.map(o => ({ ...o, amount: Number(o.amount) })));
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ── HEALTH ────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await db.get('SELECT 1');
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected', error: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🌿 EcoTrade API → http://localhost:${PORT}`);
  console.log(`🐘 PostgreSQL → ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}\n`);
});

module.exports = app;