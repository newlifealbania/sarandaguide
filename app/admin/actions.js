'use server';
import { revalidatePath } from 'next/cache';
import { createClient, createAdminClient } from '../../lib/supabase/server';

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error('Not an admin');
  return createAdminClient();
}

export async function setListingStatus(listingId, status) {
  const db = await requireAdmin();
  await db.from('listings').update({ status }).eq('id', listingId);
  revalidatePath('/admin');
  revalidatePath('/listings');
  revalidatePath('/');
}

export async function resolveClaim(claimId, approve) {
  const db = await requireAdmin();
  const { data: claim } = await db.from('claims').select('*').eq('id', claimId).single();
  if (!claim) return;

  await db.from('claims').update({ status: approve ? 'approved' : 'rejected' }).eq('id', claimId);

  if (approve) {
    await db
      .from('listings')
      .update({ owner_id: claim.user_id, claimed: true })
      .eq('id', claim.listing_id);
  }
  revalidatePath('/admin');
}

export async function savePost(formData) {
  const db = await requireAdmin();
  const id = formData.get('id');
  const post = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    cover_image: formData.get('cover_image') || null,
    published: formData.get('published') === 'on'
  };
  if (id) await db.from('posts').update(post).eq('id', id);
  else await db.from('posts').insert(post);
  revalidatePath('/admin');
  revalidatePath('/blog');
  revalidatePath('/');
}

export async function deletePost(postId) {
  const db = await requireAdmin();
  await db.from('posts').delete().eq('id', postId);
  revalidatePath('/admin');
  revalidatePath('/blog');
}
