-- Run this ONCE in the Supabase SQL Editor.
-- (Only needed because the original schema used Stripe column names.)
alter table public.subscriptions rename column stripe_customer_id to ls_customer_id;
alter table public.subscriptions rename column stripe_subscription_id to ls_subscription_id;
