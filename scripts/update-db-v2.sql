-- Add criticality and risk columns to bugs table
ALTER TABLE bugs ADD COLUMN IF NOT EXISTS criticality VARCHAR(50) DEFAULT 'media';
ALTER TABLE bugs ADD COLUMN IF NOT EXISTS risk VARCHAR(50) DEFAULT 'medio';
ALTER TABLE bugs ADD COLUMN IF NOT EXISTS responsible_qa VARCHAR(255);
ALTER TABLE bugs ADD COLUMN IF NOT EXISTS responsible_dev VARCHAR(255);

-- Add coverage column to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS coverage INTEGER DEFAULT 0;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_bugs_criticality ON bugs(criticality);
CREATE INDEX IF NOT EXISTS idx_bugs_risk ON bugs(risk);

-- Update existing bugs with default values if they exist
UPDATE bugs SET criticality = 'media' WHERE criticality IS NULL;
UPDATE bugs SET risk = 'medio' WHERE risk IS NULL;
