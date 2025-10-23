-- Add registration control settings to existing database
-- Run this in your Supabase SQL editor

-- Insert the new registration settings
INSERT INTO settings (key, value) VALUES 
    ('registration_enabled', 'true'::jsonb),
    ('maintenance_mode', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Verify the settings were added
SELECT key, value 
FROM settings 
WHERE key IN ('registration_enabled', 'maintenance_mode');
