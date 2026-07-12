-- Seed data: categories + a few example listings you can edit or delete.
-- Run AFTER schema.sql

insert into public.categories (name, slug, description, sort_order) values
('Restaurants', 'restaurants', 'From seafood tavernas on the promenade to traditional Albanian oda dining.', 1),
('Hotels & Stays', 'hotels-stays', 'Hotels, guesthouses, apartments and hostels across Saranda and Ksamil.', 2),
('Beaches', 'beaches', 'The best beaches in Saranda, Ksamil and the surrounding riviera.', 3),
('Bars & Nightlife', 'bars-nightlife', 'Cocktail bars, beach clubs and late-night spots.', 4),
('Things to Do', 'things-to-do', 'Boat tours, Butrint, the Blue Eye, day trips and activities.', 5),
('Cafés', 'cafes', 'Coffee, breakfast and brunch spots.', 6),
('Shopping', 'shopping', 'Souvenirs, markets and local products.', 7),
('Services', 'services', 'Car rental, transfers, beauty, fitness and everyday services.', 8);

-- Example listings (status 'published' so the site isn't empty on day one)
insert into public.listings (name, slug, category_id, description, address, price_range, status)
values
(
  'Example Seafood Restaurant',
  'example-seafood-restaurant',
  (select id from public.categories where slug = 'restaurants'),
  'This is an example listing. Edit or delete it from the admin panel, then add real businesses.',
  'Rruga Jonianet, Saranda 9701, Albania',
  '€€',
  'published'
),
(
  'Example Boutique Hotel',
  'example-boutique-hotel',
  (select id from public.categories where slug = 'hotels-stays'),
  'This is an example listing. Edit or delete it from the admin panel.',
  'Rruga Butrinti, Saranda 9701, Albania',
  '€€€',
  'published'
),
(
  'Example Beach Club',
  'example-beach-club',
  (select id from public.categories where slug = 'bars-nightlife'),
  'This is an example listing. Edit or delete it from the admin panel.',
  'Ksamil 9706, Albania',
  '€€',
  'published'
);
