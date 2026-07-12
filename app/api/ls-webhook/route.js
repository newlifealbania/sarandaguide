import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../lib/supabase/server';

// Lemon Squeezy webhook — keeps subscriptions and listings in sync
export async function POST(request) {
  const rawBody = await request.text();

  // Verify signature (X-Signature = HMAC-SHA256 of the raw body)
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const signature = request.headers.get('x-signature') || '';
  const digest = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const valid =
    signature.length === digest.length &&
    crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  if (!valid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const eventName = payload?.meta?.event_name;
  const custom = payload?.meta?.custom_data || {};

  if (!eventName?.startsWith('subscription_') || !custom.user_id) {
    return NextResponse.json({ received: true });
  }

  const attrs = payload.data.attributes;
  const supabase = createAdminClient();

  await supabase.from('subscriptions').upsert(
    {
      user_id: custom.user_id,
      listing_id: custom.listing_id || null,
      ls_customer_id: String(attrs.customer_id),
      ls_subscription_id: String(payload.data.id),
      plan: custom.plan === 'featured' ? 'featured' : 'standard',
      status: attrs.status,
      current_period_end: attrs.renews_at || attrs.ends_at || null
    },
    { onConflict: 'ls_subscription_id' }
  );

  // Keep the listing in sync with the subscription
  if (custom.listing_id) {
    // 'cancelled' still has paid time left — access ends at 'expired'
    const hasAccess = ['active', 'on_trial', 'past_due', 'cancelled'].includes(attrs.status);
    if (hasAccess) {
      await supabase
        .from('listings')
        .update({ featured: custom.plan === 'featured' })
        .eq('id', custom.listing_id);
    } else if (['expired', 'unpaid'].includes(attrs.status)) {
      await supabase
        .from('listings')
        .update({ featured: false, status: 'archived' })
        .eq('id', custom.listing_id);
    }
  }

  return NextResponse.json({ received: true });
}
