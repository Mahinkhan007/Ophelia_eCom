-- Ophelia eCOM — initial schema: profiles, orders, order_items
-- Run this once in the Supabase SQL Editor (or `supabase db push`).

create extension if not exists pgcrypto;

-- ---------- profiles (user details) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address text,
  city text,
  postal_code text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users select own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- orders (transactions) ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  order_number text not null unique,
  status text not null default 'paid',
  customer_name text not null,
  customer_email text,
  customer_address text,
  customer_city text,
  customer_phone text,
  subtotal numeric not null default 0,
  total numeric not null default 0,
  promo_code text,
  transaction_id text not null,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- guest checkout is allowed: user_id may be null, but if set it must match the caller
create policy "Anyone can create an order" on public.orders
  for insert with check (user_id is null or auth.uid() = user_id);

create policy "Users view own orders" on public.orders
  for select using (auth.uid() = user_id);

-- ---------- order_items (line items per transaction) ----------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  variant text,
  qty integer not null,
  unit_price numeric not null,
  line_total numeric not null
);

alter table public.order_items enable row level security;

create policy "Anyone can add items to an order they just created" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id is null or o.user_id = auth.uid())
    )
  );

create policy "Users view own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );
