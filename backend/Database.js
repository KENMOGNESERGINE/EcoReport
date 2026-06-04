require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'wastecycle',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
});

pool.on('connect', () => console.log('📦 PostgreSQL connected'));
pool.on('error',   (err) => console.error('PostgreSQL error:', err.message));

const get = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return result.rows[0] || null;
};

const all = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return result.rows;
};

const run = async (sql, params = []) => {
  return await pool.query(sql, params);
};

const migrate = async () => {
  // Create tables one by one, safely
  // Users first — no dependencies
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          SERIAL PRIMARY KEY,
      first_name  TEXT NOT NULL,
      last_name   TEXT NOT NULL,
      email       TEXT UNIQUE NOT NULL,
      phone       TEXT DEFAULT '',
      password    TEXT NOT NULL,
      city        TEXT DEFAULT '',
      id_number   TEXT DEFAULT '',
      bio         TEXT DEFAULT '',
      avatar      TEXT DEFAULT '',
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Payment accounts — drop and recreate cleanly if fkey broken
  await pool.query(`
    DO $$ BEGIN
      -- Create without foreign key first
      CREATE TABLE IF NOT EXISTS payment_accounts (
        id           SERIAL PRIMARY KEY,
        user_id      INTEGER NOT NULL,
        type         TEXT NOT NULL,
        number       TEXT NOT NULL,
        account_name TEXT DEFAULT '',
        created_at   TIMESTAMPTZ DEFAULT NOW()
      );
    EXCEPTION WHEN others THEN
      NULL;
    END $$;
  `);

  // Add foreign key only if it doesn't exist yet
  await pool.query(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'payment_accounts_user_id_fkey'
        AND table_name = 'payment_accounts'
      ) THEN
        ALTER TABLE payment_accounts
          ADD CONSTRAINT payment_accounts_user_id_fkey
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
      END IF;
    END $$;
  `);

  // Listings
  await pool.query(`
    CREATE TABLE IF NOT EXISTS listings (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL,
      title       TEXT NOT NULL,
      category    TEXT NOT NULL,
      condition   TEXT DEFAULT 'Mixed',
      quantity    TEXT NOT NULL,
      price       NUMERIC(12,2) NOT NULL,
      city        TEXT NOT NULL,
      description TEXT DEFAULT '',
      latitude    NUMERIC(10,7),
      longitude   NUMERIC(10,7),
      active      BOOLEAN DEFAULT TRUE,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Add listings foreign key if missing
  await pool.query(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'listings_user_id_fkey'
        AND table_name = 'listings'
      ) THEN
        ALTER TABLE listings
          ADD CONSTRAINT listings_user_id_fkey
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
      END IF;
    END $$;
  `);

  // Listing images
  await pool.query(`
    CREATE TABLE IF NOT EXISTS listing_images (
      id          SERIAL PRIMARY KEY,
      listing_id  INTEGER NOT NULL,
      filename    TEXT NOT NULL,
      is_primary  BOOLEAN DEFAULT FALSE,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'listing_images_listing_id_fkey'
        AND table_name = 'listing_images'
      ) THEN
        ALTER TABLE listing_images
          ADD CONSTRAINT listing_images_listing_id_fkey
          FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE;
      END IF;
    END $$;
  `);

  // Orders
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id              SERIAL PRIMARY KEY,
      buyer_id        INTEGER NOT NULL,
      seller_id       INTEGER NOT NULL,
      listing_id      INTEGER NOT NULL,
      amount          NUMERIC(12,2) NOT NULL,
      payment_method  TEXT NOT NULL,
      payment_number  TEXT DEFAULT '',
      status          TEXT DEFAULT 'pending',
      paid_at         TIMESTAMPTZ,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'orders_buyer_id_fkey'
        AND table_name = 'orders'
      ) THEN
        ALTER TABLE orders
          ADD CONSTRAINT orders_buyer_id_fkey
          FOREIGN KEY (buyer_id) REFERENCES users(id);
      END IF;
    END $$;
  `);

  await pool.query(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'orders_listing_id_fkey'
        AND table_name = 'orders'
      ) THEN
        ALTER TABLE orders
          ADD CONSTRAINT orders_listing_id_fkey
          FOREIGN KEY (listing_id) REFERENCES listings(id);
      END IF;
    END $$;
  `);

  // Indexes
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_listings_category     ON listings(category);
    CREATE INDEX IF NOT EXISTS idx_listings_city         ON listings(city);
    CREATE INDEX IF NOT EXISTS idx_listings_user         ON listings(user_id);
    CREATE INDEX IF NOT EXISTS idx_listings_active       ON listings(active);
    CREATE INDEX IF NOT EXISTS idx_orders_buyer          ON orders(buyer_id);
    CREATE INDEX IF NOT EXISTS idx_payment_accounts_user ON payment_accounts(user_id);
  `);

  console.log('✅ Migrations complete');
};

migrate().catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});

module.exports = { get, all, run, pool };