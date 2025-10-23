-- Calcio Stop Database Schema
-- This schema creates all necessary tables for the Calcio Stop application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
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
    kit_type_id UUID NOT NULL REFERENCES kit_types(id),
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_at TIMESTAMP WITH TIME ZONE NULL
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table (for app configuration)
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    ('app_bar_order', '["dashboard", "products", "sales", "namesets", "teams", "badges", "kittypes"]'::jsonb),
    ('dashboard_order', '["products", "sales", "namesets", "teams", "badges", "kitTypes"]'::jsonb),
    ('registration_enabled', 'true'::jsonb),
    ('maintenance_mode', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_archived_at ON teams(archived_at);
CREATE INDEX IF NOT EXISTS idx_kit_types_archived_at ON kit_types(archived_at);
CREATE INDEX IF NOT EXISTS idx_badges_archived_at ON badges(archived_at);
CREATE INDEX IF NOT EXISTS idx_namesets_archived_at ON namesets(archived_at);
CREATE INDEX IF NOT EXISTS idx_products_archived_at ON products(archived_at);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_products_team_id ON products(team_id);
CREATE INDEX IF NOT EXISTS idx_products_nameset_id ON products(nameset_id);
CREATE INDEX IF NOT EXISTS idx_products_kit_type_id ON products(kit_type_id);
CREATE INDEX IF NOT EXISTS idx_products_badge_id ON products(badge_id);
CREATE INDEX IF NOT EXISTS idx_namesets_kit_type_id ON namesets(kit_type_id);

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE namesets ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security requirements)
CREATE POLICY "Allow all operations for authenticated users" ON teams FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON kit_types FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON badges FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON namesets FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON sales FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON settings FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON users FOR ALL USING (true);
