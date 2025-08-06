-- Migration: Create countdowns table
-- This file should be run in your Supabase SQL editor

-- Create the countdowns table
CREATE TABLE IF NOT EXISTS countdowns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create an index on target_date for better query performance
CREATE INDEX IF NOT EXISTS idx_countdowns_target_date ON countdowns(target_date);

-- Create an index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_countdowns_is_active ON countdowns(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE countdowns ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read all countdowns
CREATE POLICY "Allow public read access" ON countdowns
    FOR SELECT USING (true);

-- Create a policy that allows anyone to insert countdowns
CREATE POLICY "Allow public insert access" ON countdowns
    FOR INSERT WITH CHECK (true);

-- Create a policy that allows anyone to update countdowns
CREATE POLICY "Allow public update access" ON countdowns
    FOR UPDATE USING (true);

-- Create a policy that allows anyone to delete countdowns
CREATE POLICY "Allow public delete access" ON countdowns
    FOR DELETE USING (true);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_countdowns_updated_at
    BEFORE UPDATE ON countdowns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();