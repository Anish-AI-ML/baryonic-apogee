-- Supabase Database Schema Setup for Baryonic Apogee

-- 1. Create a table for public profiles tied to Supabase Auth
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  name text,
  company text,
  city text,
  mobile text,
  service text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create a table for Projects (Works)
create table public.projects (
  id bigint primary key generated always as identity,
  title text not null,
  cat text,
  "desc" text,
  tech text,
  image text,
  status text default 'Planning',
  "clientId" text, -- This matches the current email-based lookup in the code
  "shareLink" text,
  attachments text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Turn on Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.projects enable row level security;

-- 4. Create RLS Policies for Profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- 5. Create RLS Policies for Projects
create policy "Projects are viewable by everyone." on projects
  for select using (true);

-- Usually, only an admin would insert/update projects. 
-- For now, we'll allow authenticated users for simplicity, or restricted to a specific 'admin' role if set.
create policy "Admins can manage projects." on projects
  for all using (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );
-- Note: If you haven't set your profile role to 'admin' yet, you may need to manually update it in the Supabase Dashboard.

-- 6. Create a secure trigger to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name', -- We'll pass name via user metadata
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
-- 7. Create a table for Global Site Stats (Visitor Count)
create table public.site_stats (
  id int primary key default 1,
  visitor_count bigint default 1284,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed initial value if it doesn't exist
insert into public.site_stats (id, visitor_count) values (1, 1284)
on conflict (id) do nothing;

-- 8. Enable RLS for site_stats
alter table public.site_stats enable row level security;

create policy "Public can view and update visitor count." on site_stats
  for all using (true);
