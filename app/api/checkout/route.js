import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

// Creates a Lemon Squeezy checkout for a listing subscription
export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { listingId, plan } = await request.json();

  // Verify the listing belongs to this user
  const { data: listing } = await supabase
    .from('listings')
    .select('id, name, owner_id')
    .eq('id', listingId)
    .single();
  if (!listing || listing.owner_id !== user.id) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  const variantId =
    plan === 'featured'
      ? process.env.LEMONSQUEEZY_VARIANT_FEATURED
      : process.env.LEMONSQUEEZY_VARIANT_STANDARD;

  const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: user.email,
            custom: {
              user_id: String(user.id),
              listing_id: String(listing.id),
              plan: plan === 'featured' ? 'featured' : 'standard'
            }
          },
          product_options: {
            redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?subscribed=1`
          }
        },
        relationships: {
          store: {
            data: { type: 'stores', id: String(process.env.LEMONSQUEEZY_STORE_ID) }
          },
          variant: { data: { type: 'variants', id: String(variantId) } }
        }
      }
    })
  });

  const json = await res.json();
  if (!res.ok) {
    const message = json?.errors?.[0]?.detail || 'Could not create checkout';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ url: json.data.attributes.url });
}
