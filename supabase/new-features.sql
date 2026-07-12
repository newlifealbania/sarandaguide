-- Newsletter subscribers + contact messages. Run once in the Supabase SQL Editor.

create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;
alter table public.messages enable row level security;

-- Anyone may subscribe or send a message; only the admin can read them
create policy "public subscribe" on public.subscribers for insert with check (true);
create policy "admin read subscribers" on public.subscribers for select using (is_admin());
create policy "public send message" on public.messages for insert with check (true);
create policy "admin read messages" on public.messages for select using (is_admin());
