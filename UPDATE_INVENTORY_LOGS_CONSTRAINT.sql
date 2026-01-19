-- Drop the existing constraint
ALTER TABLE inventory_logs DROP CONSTRAINT IF EXISTS inventory_logs_reference_type_check;

-- Add the new constraint with 'product' included
ALTER TABLE inventory_logs ADD CONSTRAINT inventory_logs_reference_type_check 
CHECK (reference_type IN ('sale', 'return', 'reservation', 'product'));
