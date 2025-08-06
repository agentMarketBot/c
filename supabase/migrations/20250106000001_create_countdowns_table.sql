-- Create countdowns table
CREATE TABLE countdowns (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  target_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create an index on target_date for better query performance
CREATE INDEX idx_countdowns_target_date ON countdowns(target_date);

-- Create an index on created_at for ordering
CREATE INDEX idx_countdowns_created_at ON countdowns(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE countdowns ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
-- In production, you would want to restrict this based on user authentication
CREATE POLICY "Allow all operations on countdowns" ON countdowns
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions to authenticated users
GRANT ALL ON countdowns TO authenticated;
GRANT ALL ON countdowns TO anon;