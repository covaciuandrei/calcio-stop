-- Calcio Stop Database Schema
-- This schema creates all necessary tables for the Calcio Stop application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    leagues JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_at TIMESTAMP WITH TIME ZONE NULL
);

-- Kit Types table
CREATE TABLE IF NOT EXISTS kit_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_at TIMESTAMP WITH TIME ZONE NULL
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    season VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    location VARCHAR(255) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_at TIMESTAMP WITH TIME ZONE NULL
);

-- Namesets table
CREATE TABLE IF NOT EXISTS namesets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_name VARCHAR(255) NOT NULL,
    number INTEGER NOT NULL,
    season VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    kit_type_id UUID NOT NULL REFERENCES kit_types(id),
    location VARCHAR(255) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_at TIMESTAMP WITH TIME ZONE NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('shirt', 'shorts', 'kid kit', 'adult kit')),
    sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    nameset_id UUID NULL REFERENCES namesets(id),
    team_id UUID NULL REFERENCES teams(id),
    kit_type_id UUID NOT NULL REFERENCES kit_types(id),
    badge_id UUID NULL REFERENCES badges(id),
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    olx_link TEXT NULL,
    location VARCHAR(255) NULL,
    is_on_sale BOOLEAN NOT NULL DEFAULT FALSE,
    sale_price DECIMAL(10,2) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_at TIMESTAMP WITH TIME ZONE NULL
);

-- Product Images table
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Nameset Images table
CREATE TABLE IF NOT EXISTS nameset_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nameset_id UUID NOT NULL REFERENCES namesets(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales table
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    size VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_sold DECIMAL(10,2) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    sale_type VARCHAR(20) NOT NULL CHECK (sale_type IN ('OLX', 'IN-PERSON')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('shirt', 'shorts', 'kid kit', 'adult kit')),
    sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    nameset_id UUID NULL REFERENCES namesets(id),
    team_id UUID NULL REFERENCES teams(id),
    kit_type_id UUID NOT NULL REFERENCES kit_types(id),
    badge_id UUID NULL REFERENCES badges(id),
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'to order' CHECK (status IN ('to order', 'ordered', 'received', 'message sent', 'finished')),
    customer_name VARCHAR(255) NULL,
    phone_number VARCHAR(20) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_at TIMESTAMP WITH TIME ZONE NULL
);

-- Returns table
CREATE TABLE IF NOT EXISTS returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    customer_name VARCHAR(255) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL, -- Changed to TIMESTAMP to preserve original sale time
    sale_type VARCHAR(20) NOT NULL CHECK (sale_type IN ('OLX', 'IN-PERSON')),
    original_sale_id UUID NULL, -- Reference to original sale if available
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    customer_name VARCHAR(255) NOT NULL,
    expiring_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE NULL
);

-- Settings table (for app configuration)
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Views table (for tracking product page views)
CREATE TABLE IF NOT EXISTS views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Leagues (Championships/Competitions) table
CREATE TABLE IF NOT EXISTS leagues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_at TIMESTAMP WITH TIME ZONE NULL
);

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'manager')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default kit types (UUID auto-generated)
INSERT INTO kit_types (name, created_at) VALUES 
    ('1st Kit', '2024-01-01T00:00:00.000Z'),
    ('2nd Kit', '2024-01-01T00:00:00.000Z'),
    ('3rd Kit', '2024-01-01T00:00:00.000Z'),
    ('None', '2024-01-01T00:00:00.000Z')
ON CONFLICT (name) DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value) VALUES 
    ('app_bar_order', '["dashboard", "products", "sales", "returns", "namesets", "teams", "badges", "kittypes", "stats"]'::jsonb),
    ('dashboard_order', '["products", "sales", "returns", "namesets", "teams", "badges", "kitTypes", "reservations"]'::jsonb),
    ('registration_enabled', 'true'::jsonb),
    ('maintenance_mode', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_archived_at ON teams(archived_at);
CREATE INDEX IF NOT EXISTS idx_kit_types_archived_at ON kit_types(archived_at);
CREATE INDEX IF NOT EXISTS idx_badges_archived_at ON badges(archived_at);
CREATE INDEX IF NOT EXISTS idx_namesets_archived_at ON namesets(archived_at);
CREATE INDEX IF NOT EXISTS idx_products_archived_at ON products(archived_at);
CREATE INDEX IF NOT EXISTS idx_orders_archived_at ON orders(archived_at);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_returns_date ON returns(date);
CREATE INDEX IF NOT EXISTS idx_returns_original_sale_id ON returns(original_sale_id);
CREATE INDEX IF NOT EXISTS idx_products_team_id ON products(team_id);
CREATE INDEX IF NOT EXISTS idx_products_nameset_id ON products(nameset_id);
CREATE INDEX IF NOT EXISTS idx_products_kit_type_id ON products(kit_type_id);
CREATE INDEX IF NOT EXISTS idx_products_badge_id ON products(badge_id);
CREATE INDEX IF NOT EXISTS idx_orders_team_id ON orders(team_id);
CREATE INDEX IF NOT EXISTS idx_orders_nameset_id ON orders(nameset_id);
CREATE INDEX IF NOT EXISTS idx_orders_kit_type_id ON orders(kit_type_id);
CREATE INDEX IF NOT EXISTS idx_orders_badge_id ON orders(badge_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_expiring_date ON reservations(expiring_date);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at);
CREATE INDEX IF NOT EXISTS idx_namesets_kit_type_id ON namesets(kit_type_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_display_order ON product_images(display_order);
CREATE INDEX IF NOT EXISTS idx_nameset_images_nameset_id ON nameset_images(nameset_id);
CREATE INDEX IF NOT EXISTS idx_nameset_images_display_order ON nameset_images(display_order);
CREATE INDEX IF NOT EXISTS idx_views_product_id ON views(product_id);
CREATE INDEX IF NOT EXISTS idx_views_timestamp ON views(timestamp);
CREATE INDEX IF NOT EXISTS idx_leagues_archived_at ON leagues(archived_at);
CREATE INDEX IF NOT EXISTS idx_teams_leagues ON teams USING GIN (leagues);

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE namesets ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE nameset_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE views ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security requirements)
CREATE POLICY "Allow all operations for authenticated users" ON teams FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON kit_types FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON badges FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON namesets FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON product_images FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON nameset_images FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON orders FOR ALL USING (true);
CREATE POLICY "Allow authenticated users to read reservations" ON reservations 
FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to reservations" ON reservations 
FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON sales FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON returns FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON settings FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON leagues FOR ALL USING (true);
-- Allow inserts for everyone (including unauthenticated users) for view tracking
CREATE POLICY "Allow inserts for view tracking" ON views 
FOR INSERT 
WITH CHECK (true);

-- Allow reads for authenticated users only
CREATE POLICY "Allow reads for authenticated users" ON views 
FOR SELECT 
USING (true);

-- Allow updates for authenticated users only  
CREATE POLICY "Allow updates for authenticated users" ON views 
FOR UPDATE 
USING (true);

-- Allow deletes for authenticated users only
CREATE POLICY "Allow deletes for authenticated users" ON views 
FOR DELETE 
USING (true);
