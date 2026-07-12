-- Category thumbnails + example listing photos (free Unsplash images).
-- Run once in the Supabase SQL Editor. Replace any URL later with your own photos.

update public.categories set image_url = 'https://images.unsplash.com/photo-1717947607191-821c632e684a?auto=format&fit=crop&w=800&q=70' where slug = 'restaurants';
update public.categories set image_url = 'https://images.unsplash.com/photo-1693562142975-6a5e4b4d9039?auto=format&fit=crop&w=800&q=70' where slug = 'hotels-stays';
update public.categories set image_url = 'https://images.unsplash.com/photo-1742244002755-067b34f9f1c6?auto=format&fit=crop&w=800&q=70' where slug = 'beaches';
update public.categories set image_url = 'https://images.unsplash.com/photo-1677517497394-87d635cf7e10?auto=format&fit=crop&w=800&q=70' where slug = 'bars-nightlife';
update public.categories set image_url = 'https://images.unsplash.com/photo-1592992845413-787a46384be5?auto=format&fit=crop&w=800&q=70' where slug = 'things-to-do';
update public.categories set image_url = 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=70' where slug = 'cafes';
update public.categories set image_url = 'https://images.unsplash.com/photo-1621945956756-3f24f0d2233b?auto=format&fit=crop&w=800&q=70' where slug = 'shopping';
update public.categories set image_url = 'https://images.unsplash.com/photo-1623167428954-be47340e0812?auto=format&fit=crop&w=800&q=70' where slug = 'services';

-- Placeholder photos for the 3 example listings
update public.listings set images = '["https://images.unsplash.com/photo-1658742758848-e9496d31a8b6?auto=format&fit=crop&w=1200&q=70"]'::jsonb where slug = 'example-seafood-restaurant';
update public.listings set images = '["https://images.unsplash.com/photo-1705405999485-188af37e0462?auto=format&fit=crop&w=1200&q=70"]'::jsonb where slug = 'example-boutique-hotel';
update public.listings set images = '["https://images.unsplash.com/photo-1610213536458-34b4320c3545?auto=format&fit=crop&w=1200&q=70"]'::jsonb where slug = 'example-beach-club';
