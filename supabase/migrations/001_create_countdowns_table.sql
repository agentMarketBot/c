-- Create countdowns table
create table public.countdowns (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    target_date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS (Row Level Security) policies
alter table public.countdowns enable row level security;

-- Allow anonymous users to read and insert countdowns
create policy "Allow anonymous access" on public.countdowns
    for all using (true);

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger handle_countdowns_updated_at
    before update on public.countdowns
    for each row
    execute function public.handle_updated_at();