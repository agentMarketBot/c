-- Create countdowns table
CREATE TABLE IF NOT EXISTS countdowns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    target_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS (Row Level Security) policy
ALTER TABLE countdowns ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (you can modify this based on your auth requirements)
CREATE POLICY "Allow all operations for authenticated users" ON countdowns
    FOR ALL USING (true);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_countdowns_updated_at 
    BEFORE UPDATE ON countdowns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to create table if not exists (for app initialization)
CREATE OR REPLACE FUNCTION create_countdowns_table_if_not_exists()
RETURNS TEXT AS $$
BEGIN
    -- This function is just a placeholder since table creation is handled by migrations
    RETURN 'Table already exists or has been created';
END;
$$ LANGUAGE plpgsql;