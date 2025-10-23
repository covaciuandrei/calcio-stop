-- Clean RLS Setup for Calcio Stop
-- Run this in your Supabase SQL Editor

-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON teams;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON kit_types;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON badges;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON namesets;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON products;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON sales;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON settings;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON users;

-- TEAMS TABLE POLICIES
-- Allow read access for everyone (authenticated and unauthenticated)
CREATE POLICY "Allow public read access" ON teams FOR SELECT USING (true);

-- Allow full access for authenticated users
CREATE POLICY "Allow authenticated users full access" ON teams 
FOR ALL USING (auth.role() = 'authenticated');

-- KIT TYPES TABLE POLICIES
CREATE POLICY "Allow public read access" ON kit_types FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access" ON kit_types 
FOR ALL USING (auth.role() = 'authenticated');

-- BADGES TABLE POLICIES
CREATE POLICY "Allow public read access" ON badges FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access" ON badges 
FOR ALL USING (auth.role() = 'authenticated');

-- NAMESETS TABLE POLICIES
CREATE POLICY "Allow public read access" ON namesets FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access" ON namesets 
FOR ALL USING (auth.role() = 'authenticated');

-- PRODUCTS TABLE POLICIES
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access" ON products 
FOR ALL USING (auth.role() = 'authenticated');

-- SALES TABLE POLICIES (only authenticated users can access)
CREATE POLICY "Allow authenticated users to read sales" ON sales 
FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access" ON sales 
FOR ALL USING (auth.role() = 'authenticated');

-- SETTINGS TABLE POLICIES
CREATE POLICY "Allow public read access" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access" ON settings 
FOR ALL USING (auth.role() = 'authenticated');

-- USERS TABLE POLICIES
-- Only authenticated users can read users table
CREATE POLICY "Allow authenticated users to read users" ON users 
FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can modify users table
CREATE POLICY "Allow authenticated users to modify users" ON users 
FOR ALL USING (auth.role() = 'authenticated');

-- Verify policies are created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;