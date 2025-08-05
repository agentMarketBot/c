-- Create countdowns table
CREATE TABLE countdowns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_countdowns_updated_at
    BEFORE UPDATE ON countdowns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE countdowns ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
-- In production, you'd want to restrict based on user authentication
CREATE POLICY "Enable read access for all users" ON countdowns
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON countdowns
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON countdowns
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON countdowns
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_countdowns_target_date ON countdowns(target_date);
CREATE INDEX idx_countdowns_created_at ON countdowns(created_at);

-- Insert some sample data
INSERT INTO countdowns (title, description, target_date) VALUES
    ('New Year 2026', 'Countdown to the new year!', '2026-01-01 00:00:00+00'),
    ('Summer Vacation', 'Can''t wait for vacation time', '2025-06-15 09:00:00+00'),
    ('Project Deadline', 'Important work milestone', '2025-08-15 17:00:00+00');