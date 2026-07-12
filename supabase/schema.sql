-- SarandaGuide.com database schema
-- Run this in Supabase: SQL Editor > New query > paste > Run

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile when someone signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- ============ CATEGORIES ============
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order int not null default 0
);

-- ============ LISTINGS ============
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  description text,
  address text,
  phone text,
  website text,
  email text,
  lat double precision,
  lng double precision,
  price_range text check (price_range in ('€', '€€', '€€€', '€€€€')),
  images jsonb not null default '[]'::jsonb,
  opening_hours text,
  featured boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'published', 'archived')),
  owner_id uuid references public.profiles(id) on delete set null,
  claimed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index listings_category_idx on public.listings(category_id);
create index listings_status_idx on public.listings(status);

-- ============ CLAIMS ============
create table public.claims (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  unique (listing_id, user_id)
);

-- ============ SUBSCRIPTIONS ============
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete set null,
  ls_customer_id text,
  ls_subscription_id text unique,
  plan text check (plan in ('standard', 'featured')),
  status text not null default 'incomplete',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

-- ============ REVIEWS ============
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (listing_id, user_id)
);

-- ============ BLOG POSTS ============
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text, -- markdown
  cover_image text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============ ROW LEVEL SECURITY ============
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.listings enable row level security;
alter table public.claims enable row level security;
alter table public.subscriptions enable row level security;
alter table public.reviews enable row level security;
alter table public.posts enable row level security;

-- Profiles
create policy "read own profile" on public.profiles for select using (auth.uid() = id or is_admin());
create policy "update own profile" on public.profiles for update using (auth.uid() = id);

-- Categories: public read, admin write
create policy "categories public read" on public.categories for select using (true);
create policy "categories admin write" on public.categories for all using (is_admin());

-- Listings: published are public; owners and admins see their own
create policy "listings public read" on public.listings for select
  using (status = 'published' or owner_id = auth.uid() or is_admin());
create policy "listings owner insert" on public.listings for insert
  with check (auth.uid() = owner_id);
create policy "listings owner update" on public.listings for update
  using (owner_id = auth.uid() or is_admin());
create policy "listings admin delete" on public.listings for delete using (is_admin());

-- Claims
create policy "claims own read" on public.claims for select
  using (user_id = auth.uid() or is_admin());
create policy "claims own insert" on public.claims for insert
  with check (user_id = auth.uid());
create policy "claims admin update" on public.claims for update using (is_admin());

-- Subscriptions (written by service role via Stripe webhook)
create policy "subscriptions own read" on public.subscriptions for select
  using (user_id = auth.uid() or is_admin());

-- Reviews
create policy "reviews public read" on public.reviews for select using (true);
create policy "reviews own insert" on public.reviews for insert with check (user_id = auth.uid());
create policy "reviews own update" on public.reviews for update using (user_id = auth.uid());
create policy "reviews own delete" on public.reviews for delete
  using (user_id = auth.uid() or is_admin());

-- Posts: published public, admin write
create policy "posts public read" on public.posts for select using (published or is_admin());
create policy "posts admin write" on public.posts for all using (is_admin());

-- ============ STORAGE (listing photos) ============
-- Do NOT run via SQL. Create the bucket in the dashboard instead:
-- Storage > New bucket > name: listing-images > Public bucket: ON > Save.
-- Then under the bucket's Policies, add a policy allowing INSERT for
-- authenticated users (use the "Allow uploads for authenticated users" template).
