# SarandaGuide.com — Setup Guide

Your new site is a modern directory built with Next.js (the website), Supabase (accounts + database + photo storage) and Lemon Squeezy (subscription payments — it also handles VAT/tax for you). Everything below is one-time setup. After that, you run the whole site from the built-in admin panel, no code needed.

## What the site does

Travelers browse listings by category, search, read your travel guide articles, and leave reviews. Business owners sign up, add a new listing (or claim an existing one), pay a monthly subscription (Standard €9.99 / Featured €19.99 — change these to whatever you like in Lemon Squeezy), and manage their own page. You approve new listings and claims from the admin panel, and write blog articles there too. If a business stops paying, their listing is automatically unpublished.

## Step 1 — Supabase ✅ (done)

1. supabase.com → New project `sarandaguide`.
2. SQL Editor → run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Storage → New bucket `listing-images` (Public ON) → add an INSERT policy for authenticated users with definition `bucket_id = 'listing-images'`.
4. Project Settings → API → copy Project URL, `anon` key, `service_role` key.

## Step 2 — Lemon Squeezy

1. Log in at https://app.lemonsqueezy.com. Make sure your store is set up and activated (Settings → Stores). Note your **Store ID** (the number shown next to your store).
2. **Products → New product**: name "Standard Listing", price €9.99, billing: Subscription, monthly → Publish. Open the product and copy the **Variant ID** (in the variant's settings/URL).
3. Create a second product "Featured Listing", €19.99/month subscription → copy its Variant ID.
4. **Settings → API → Create API key** → copy it.

## Step 3 — Deploy to Vercel (free tier is fine)

1. Put this code on GitHub: create an account at https://github.com, make a new repository `sarandaguide`, and upload this folder.
2. Go to https://vercel.com → sign up with GitHub → "Add New Project" → import the `sarandaguide` repo.
3. Before deploying, add the **Environment Variables** (from `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — from Step 1
   - `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`, `LEMONSQUEEZY_VARIANT_STANDARD`, `LEMONSQUEEZY_VARIANT_FEATURED` — from Step 2
   - `LEMONSQUEEZY_WEBHOOK_SECRET` — leave blank for now, filled in Step 4
   - `NEXT_PUBLIC_SITE_URL` — `https://sarandaguide.com`
4. Deploy. You'll get a temporary URL like `sarandaguide.vercel.app` to test with.

## Step 4 — Lemon Squeezy webhook (connects payments to the site)

1. In Lemon Squeezy: **Settings → Webhooks → Add endpoint (+)**.
2. Callback URL: `https://sarandaguide.com/api/ls-webhook`
3. Signing secret: type a long random string (save it).
4. Select events: `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_resumed`, `subscription_expired`.
5. Save → paste the same signing secret into Vercel as `LEMONSQUEEZY_WEBHOOK_SECRET` → redeploy.

## Step 5 — Point your domain (in Hostinger)

1. In Vercel: Project → **Settings → Domains** → add `sarandaguide.com` and `www.sarandaguide.com`.
2. In Hostinger hPanel → Domains → sarandaguide.com → DNS / Name Servers: change the `@` A record to `76.76.21.21` and add CNAME `www` → `cname.vercel-dns.com` (Vercel shows the exact values).
3. Wait up to an hour. The old WordPress site keeps working until DNS switches. Cancel the Hostinger hosting plan only after the new site works — keep the domain registration.

## Step 6 — Make yourself admin

1. Visit your site → Sign in → create an account with your email.
2. In Supabase: **Table Editor → profiles** → find your row → change `role` from `user` to `admin` → save.
3. Your dashboard now shows an "Admin panel" button: approve listings and claims, publish/unpublish anything, write blog articles.

## Running the site day-to-day

Everything happens in the admin panel at `/admin`. Business owners handle their own pages. Money arrives in your Lemon Squeezy account and pays out to your bank (Lemon Squeezy handles VAT/tax paperwork as merchant of record).

To change prices: edit the products in Lemon Squeezy. To change wording/design: ask Claude — the code is yours.

## Testing payments before going live

Lemon Squeezy has **Test mode** (toggle in the bottom-left of their dashboard). Create the two products in test mode too, use a test-mode API key + webhook, and pay with card `4242 4242 4242 4242` (any future date, any CVC). When the flow works, switch to live mode values in Vercel.
