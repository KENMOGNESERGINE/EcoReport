-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(100),
    address TEXT,
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    account_name VARCHAR(100),
    total_sales INTEGER DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    quantity_kg DECIMAL(10,2) NOT NULL,
    asking_price DECIMAL(10,2) NOT NULL,
    suggested_price DECIMAL(10,2),
    pickup_type VARCHAR(50) DEFAULT 'buyer_collects',
    location_lat DECIMAL(10,8) NOT NULL,
    location_lng DECIMAL(11,8) NOT NULL,
    geom GEOMETRY(POINT, 4326),
    address TEXT,
    image_url TEXT,
    photos JSONB DEFAULT '[]',
    city VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    view_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days')
);

-- Spatial indexes
CREATE INDEX idx_listings_geom ON listings USING GIST(geom);
CREATE INDEX idx_listings_seller_status ON listings(seller_id, status);
CREATE INDEX idx_listings_category_status ON listings(category, status);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id),
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    quantity_kg DECIMAL(10,2) NOT NULL,
    price_agreed DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    pickup_time TIMESTAMP,
    pickup_address TEXT,
    buyer_confirmed BOOLEAN DEFAULT FALSE,
    seller_confirmed BOOLEAN DEFAULT FALSE,
    buyer_rating INTEGER CHECK (buyer_rating BETWEEN 1 AND 5),
    seller_rating INTEGER CHECK (seller_rating BETWEEN 1 AND 5),
    buyer_review TEXT,
    seller_review TEXT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for transactions
CREATE INDEX idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX idx_transactions_seller ON transactions(seller_id);
CREATE INDEX idx_transactions_listing ON transactions(listing_id);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    listing_id UUID NOT NULL REFERENCES listings(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, listing_id)
);

-- Price suggestions table
CREATE TABLE IF NOT EXISTS price_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price_per_kg DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(city, category)
);

-- Insert sample price suggestions
INSERT INTO price_suggestions (city, category, price_per_kg) VALUES
    ('New York', 'plastic', 0.50),
    ('New York', 'glass', 0.30),
    ('New York', 'metal', 1.20),
    ('New York', 'ewaste', 2.50),
    ('Los Angeles', 'plastic', 0.45),
    ('Los Angeles', 'glass', 0.28),
    ('Los Angeles', 'metal', 1.15),
    ('Los Angeles', 'ewaste', 2.30)
ON CONFLICT (city, category) DO NOTHING;

-- Auto-update geom from lat/lng
CREATE OR REPLACE FUNCTION update_listing_geom()
RETURNS TRIGGER AS $$
BEGIN
    NEW.geom = ST_SetSRID(ST_MakePoint(NEW.location_lng, NEW.location_lat), 4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for geom
DROP TRIGGER IF EXISTS update_listing_geom_trigger ON listings;
CREATE TRIGGER update_listing_geom_trigger
    BEFORE INSERT OR UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_listing_geom();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert test user (password: test123)
INSERT INTO users (id, email, password_hash, name, city)
SELECT 
    gen_random_uuid(),
    'test@example.com',
    '$2a$10$rqGKkZsB5ZcZsP5ZcZsP5e',
    'Test User',
    'New York'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'test@example.com');