-- Create countdowns table
CREATE TABLE countdowns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true
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

-- Enable Row Level Security
ALTER TABLE countdowns ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own countdowns" ON countdowns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own countdowns" ON countdowns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own countdowns" ON countdowns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own countdowns" ON countdowns
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_countdowns_user_id ON countdowns(user_id);
CREATE INDEX idx_countdowns_target_date ON countdowns(target_date);
CREATE INDEX idx_countdowns_active ON countdowns(is_active) WHERE is_active = true;