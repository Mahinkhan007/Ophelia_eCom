-- Ophelia eCOM — loyalty points
-- Run this once in the Supabase SQL Editor (0001_init.sql must already be applied).
--
-- Design: no stored points balance. 1 ORD spent = 1 point, and since reward
-- lines are always inserted at 0 ORD, `orders.total` already IS "points
-- earned from that order" with no extra bookkeeping. Balance = sum of a
-- member's past order totals, minus points already spent on reward lines
-- (order_items.is_reward = true). Computed on read (src/lib/loyalty.js);
-- enforced on write by the trigger below so it can't be gamed by calling
-- the API directly.

alter table public.order_items
  add column if not exists is_reward boolean not null default false,
  add column if not exists points_cost integer;

-- Reward items are tied to a specific signed-in account's points, so they
-- can only ever attach to a member order. Replace the old guest policy
-- (which allowed any item, reward or not) with one that excludes rewards.
drop policy if exists "Guest checkout can add items to its own order" on public.order_items;
drop policy if exists "Guest checkout can add non-reward items to its own order" on public.order_items;
create policy "Guest checkout can add non-reward items to its own order" on public.order_items
  for insert with check (
    not is_reward
    and exists (select 1 from public.orders o where o.id = order_id and o.user_id is null)
  );

-- Server-side balance check, independent of anything the client sends.
-- Balance is computed from the member's PRIOR orders only (id <> the order
-- currently being placed), so a first-time purchase can't fund a reward in
-- the same checkout it's earning points from.
create or replace function public.enforce_loyalty_balance()
returns trigger as $$
declare
  v_user_id uuid;
  v_earned numeric;
  v_spent integer;
begin
  if not new.is_reward then
    return new;
  end if;

  select user_id into v_user_id from public.orders where id = new.order_id;
  if v_user_id is null then
    raise exception 'Loyalty rewards require a signed-in member order';
  end if;

  select coalesce(sum(total), 0) into v_earned
    from public.orders
    where user_id = v_user_id and id <> new.order_id;

  select coalesce(sum(oi.points_cost), 0) into v_spent
    from public.order_items oi
    join public.orders o on o.id = oi.order_id
    where o.user_id = v_user_id and oi.is_reward;

  if (v_earned - v_spent) < coalesce(new.points_cost, 0) then
    raise exception 'Insufficient loyalty points balance';
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_enforce_loyalty_balance on public.order_items;
create trigger trg_enforce_loyalty_balance
  before insert on public.order_items
  for each row execute function public.enforce_loyalty_balance();
