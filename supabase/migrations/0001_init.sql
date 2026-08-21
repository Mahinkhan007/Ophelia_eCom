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
  -- derived, not app-set: guarantees this always reflects user_id, even if
  -- a future code path forgets to pass one explicitly. Query/report on this
  -- directly, e.g. `select checkout_type, count(*) from orders group by 1`.
  checkout_type text generated always as (case when user_id is null then 'guest' else 'member' end) stored,
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

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_checkout_type_idx on public.orders(checkout_type);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

-- GUEST checkout: user_id is null, no auth session required to insert.
-- MEMBER checkout: user_id must match the authenticated caller — a signed-in
-- user can never write an order under someone else's id.
create policy "Guest checkout can create an order" on public.orders
  for insert with check (user_id is null);

create policy "Members can create their own order" on public.orders
  for insert with check (auth.uid() = user_id);

-- Guests never get SELECT access (RLS has no session to match — by design,
-- the guest confirmation page reads the order back from sessionStorage
-- instead of Supabase). Only a signed-in member can list their own orders.
create policy "Members view own orders" on public.orders
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

create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- line items inherit their order's guest/member status: an item can only be
-- attached to an order the caller was just allowed to create above.
create policy "Guest checkout can add items to its own order" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id is null
    )
  );

create policy "Members can add items to their own order" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "Members view own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );
