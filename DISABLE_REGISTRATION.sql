-- Disable user registration
-- Run this SQL in your Supabase SQL editor or database client

INSERT INTO settings (key, value) 
VALUES ('registration_enabled', 'false'::jsonb)
ON CONFLICT (key) 
DO UPDATE SET value = 'false'::jsonb;

-- Verify the setting was updated
SELECT * FROM settings WHERE key = 'registration_enabled';
