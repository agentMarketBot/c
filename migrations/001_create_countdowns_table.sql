-- Create the countdowns table
CREATE TABLE IF NOT EXISTS countdowns (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  target_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE countdowns ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows everyone to read and write countdowns
-- In a real app, you'd want to restrict this to authenticated users
CREATE POLICY "Allow public access to countdowns" ON countdowns
  FOR ALL USING (true);

-- Create an index on target_date for efficient querying
CREATE INDEX IF NOT EXISTS idx_countdowns_target_date ON countdowns(target_date);

-- Create an index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_countdowns_created_at ON countdowns(created_at);