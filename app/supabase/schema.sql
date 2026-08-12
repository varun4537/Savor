-- Create a table for public profiles (optional, but good practice)
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  target_weight text, -- Stored as text to be gentle (e.g. "Maintenance", "Slow loss")
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Create a table for meals
create table public.meals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  image_url text, -- Optional, if we upload to Supabase Storage
  transcription text, -- User's voice note
  food_items jsonb, -- Array of strings
  calories_min int,
  calories_max int,
  protein_g int,
  ai_message text,
  mood text, -- "Balanced", "Heavy", "Light"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for meals
alter table public.meals enable row level security;

create policy "Users can view own meals" on public.meals
  for select using (auth.uid() = user_id);

create policy "Users can insert own meals" on public.meals
  for insert with check (auth.uid() = user_id);

-- Storage bucket for food images
insert into storage.buckets (id, name, public) 
values ('food-images', 'food-images', false);

create policy "Authenticated users can upload images"
on storage.objects for insert
with check ( bucket_id = 'food-images' and auth.role() = 'authenticated' );

create policy "Users can view their own images"
on storage.objects for select
using ( bucket_id = 'food-images' and auth.uid() = owner );
