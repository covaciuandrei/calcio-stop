-- ============================================================================
-- ADD INVENTORY LOGS TABLE
-- Run this migration to add inventory tracking to an existing database
-- ============================================================================

-- Inventory Logs table - tracks all inventory changes
CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Entity being tracked
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('product', 'nameset', 'badge')),
    entity_id UUID NOT NULL,
    entity_name VARCHAR(255) NOT NULL,
    
    -- Size (for products only, NULL for namesets/badges)
    size VARCHAR(50) NULL,
    
    -- The inventory change
    change_type VARCHAR(50) NOT NULL CHECK (change_type IN (
        'sale', 'sale_edit', 'sale_reversal',
        'return', 'return_reversal',
        'manual_adjustment', 
        'initial_stock', 'restock'
    )),
    quantity_before INTEGER NOT NULL,
    quantity_change INTEGER NOT NULL,
    quantity_after INTEGER NOT NULL,
    
    -- Context
    reason TEXT NULL,
    reference_id UUID NULL,
    reference_type VARCHAR(50) NULL CHECK (reference_type IN ('sale', 'return', 'reservation', 'product')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_inventory_logs_entity ON inventory_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_created_at ON inventory_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_change_type ON inventory_logs(change_type);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_reference ON inventory_logs(reference_type, reference_id);

-- Enable Row Level Security
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy - allow all for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON inventory_logs FOR ALL USING (true);

-- ============================================================================
-- CLEANUP FUNCTION (runs monthly to delete logs older than 18 months)
-- ============================================================================

-- Function to delete old logs
CREATE OR REPLACE FUNCTION cleanup_inventory_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM inventory_logs 
  WHERE created_at < NOW() - INTERVAL '18 months';
END;
$$ LANGUAGE plpgsql;

-- Note: To enable automatic cleanup, run this in Supabase SQL Editor:
-- SELECT cron.schedule('cleanup-inventory-logs', '0 3 1 * *', 'SELECT cleanup_inventory_logs()');
-- This runs on the 1st of each month at 3 AM UTC
