-- Clean RLS Setup for Calcio Stop
-- Run this in your Supabase SQL Editor

-- First, drop existing policies to avoid conflicts
-- Drop old policy names that might exist
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON teams;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON kit_types;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON badges;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON namesets;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON products;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON sales;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON settings;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON leagues;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON orders;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON reservations;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON returns;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON product_images;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON badge_images;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON nameset_images;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON views;

-- Drop new policy names that might exist
DROP POLICY IF EXISTS "Allow public read access" ON teams;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON teams;
DROP POLICY IF EXISTS "Allow public read access" ON kit_types;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON kit_types;
DROP POLICY IF EXISTS "Allow public read access" ON badges;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON badges;
DROP POLICY IF EXISTS "Allow public read access" ON namesets;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON namesets;
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to read sales" ON sales;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON sales;
DROP POLICY IF EXISTS "Allow public read access" ON settings;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON settings;
DROP POLICY IF EXISTS "Allow authenticated users to read users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to modify users" ON users;
DROP POLICY IF EXISTS "Allow public read access" ON leagues;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON leagues;
DROP POLICY IF EXISTS "Allow public read access" ON product_images;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON product_images;
DROP POLICY IF EXISTS "Allow public read access" ON badge_images;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON badge_images;
DROP POLICY IF EXISTS "Allow public read access" ON nameset_images;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON nameset_images;
DROP POLICY IF EXISTS "Allow authenticated users to read orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users full access to orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to read reservations" ON reservations;
DROP POLICY IF EXISTS "Allow authenticated users full access to reservations" ON reservations;
DROP POLICY IF EXISTS "Allow authenticated users to read returns" ON returns;
DROP POLICY IF EXISTS "Allow authenticated users full access to returns" ON returns;
DROP POLICY IF EXISTS "Allow public inserts for view tracking" ON views;
DROP POLICY IF EXISTS "Allow authenticated users to read views" ON views;
DROP POLICY IF EXISTS "Allow authenticated users to manage views" ON views;

-- TEAMS TABLE POLICIES
-- Allow read access for everyone (authenticated and unauthenticated)
CREATE POLICY "teams_public_read" ON teams FOR SELECT USING (true);

-- Allow full access for authenticated users
CREATE POLICY "teams_authenticated_full_access" ON teams 
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- KIT TYPES TABLE POLICIES
CREATE POLICY "kit_types_public_read" ON kit_types FOR SELECT USING (true);
CREATE POLICY "kit_types_authenticated_full_access" ON kit_types 
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- BADGES TABLE POLICIES
CREATE POLICY "badges_public_read" ON badges FOR SELECT USING (true);
CREATE POLICY "badges_authenticated_full_access" ON badges 
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- NAMESETS TABLE POLICIES
CREATE POLICY "namesets_public_read" ON namesets FOR SELECT USING (true);
CREATE POLICY "namesets_authenticated_full_access" ON namesets 
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- PRODUCTS TABLE POLICIES
CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);
CREATE POLICY "products_authenticated_full_access" ON products 
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- SALES TABLE POLICIES (only authenticated users can access)
CREATE POLICY "sales_authenticated_read" ON sales 
FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "sales_authenticated_full_access" ON sales 
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- SETTINGS TABLE POLICIES
CREATE POLICY "settings_public_read" ON settings FOR SELECT USING (true);
CREATE POLICY "settings_authenticated_full_access" ON settings 
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- USERS TABLE POLICIES
-- Only authenticated users can read users table
CREATE POLICY "users_authenticated_read" ON users 
FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can modify users table
-- Note: This allows any authenticated user to modify any user record.
-- Consider restricting to self-modification or admin-only if needed.
CREATE POLICY "users_authenticated_modify" ON users 
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- LEAGUES TABLE POLICIES
CREATE POLICY "leagues_public_read" ON leagues FOR SELECT USING (true);
CREATE POLICY "leagues_authenticated_full_access" ON leagues 
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- PRODUCT IMAGES TABLE POLICIES
CREATE POLICY "product_images_public_read" ON product_images FOR SELECT USING (true);
CREATE POLICY "product_images_authenticated_full_access" ON product_images 
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- BADGE IMAGES TABLE POLICIES
CREATE POLICY "badge_images_public_read" ON badge_images FOR SELECT USING (true);
CREATE POLICY "badge_images_authenticated_full_access" ON badge_images 
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- NAMESET IMAGES TABLE POLICIES
CREATE POLICY "nameset_images_public_read" ON nameset_images FOR SELECT USING (true);
CREATE POLICY "nameset_images_authenticated_full_access" ON nameset_images 
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ORDERS TABLE POLICIES (only authenticated users can access)
CREATE POLICY "orders_authenticated_read" ON orders 
FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "orders_authenticated_full_access" ON orders 
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- RESERVATIONS TABLE POLICIES (only authenticated users can access)
CREATE POLICY "reservations_authenticated_read" ON reservations 
FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "reservations_authenticated_full_access" ON reservations 
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- RETURNS TABLE POLICIES (only authenticated users can access)
CREATE POLICY "returns_authenticated_read" ON returns 
FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "returns_authenticated_full_access" ON returns 
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- VIEWS TABLE POLICIES
-- Allow unauthenticated inserts for view tracking (public analytics)
CREATE POLICY "views_public_insert" ON views 
FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read views
CREATE POLICY "views_authenticated_read" ON views 
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to manage views (update/delete)
CREATE POLICY "views_authenticated_manage" ON views 
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

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