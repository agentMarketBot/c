-- Create countdowns table
CREATE TABLE IF NOT EXISTS public.countdowns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    target_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.countdowns ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (in a real app, you'd want user-specific policies)
CREATE POLICY "Allow read access to all countdowns" ON public.countdowns
    FOR SELECT USING (true);

CREATE POLICY "Allow insert access to all countdowns" ON public.countdowns
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to all countdowns" ON public.countdowns
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to all countdowns" ON public.countdowns
    FOR DELETE USING (true);

-- Create index on target_date for efficient sorting
CREATE INDEX IF NOT EXISTS idx_countdowns_target_date ON public.countdowns(target_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_countdowns_updated_at 
    BEFORE UPDATE ON public.countdowns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();