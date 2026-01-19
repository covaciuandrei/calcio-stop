-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the cleanup function to run on the 1st of every month at midnight
-- Note: This requires the pg_cron extension to be enabled and configured on the Supabase project
-- You can run this in the Supabase SQL Editor

SELECT cron.schedule(
  'cleanup_inventory_logs_monthly', -- Job name
  '0 0 1 * *',                      -- Schedule (monthly)
  $$SELECT cleanup_inventory_logs()$$ -- SQL command
);

-- To verify the job is scheduled:
-- SELECT * FROM cron.job;

-- To unschedule:
-- SELECT cron.unschedule('cleanup_inventory_logs_monthly');
