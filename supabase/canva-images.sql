-- Swap three category thumbnails to your own Canva photos of Saranda.
-- Run once in the Supabase SQL Editor (after the site deploy, so the images exist).

update public.categories set image_url = '/images/beach.jpg' where slug = 'beaches';
update public.categories set image_url = '/images/coast-hotels.jpg' where slug = 'hotels-stays';
update public.categories set image_url = '/images/promenade.jpg' where slug = 'things-to-do';
