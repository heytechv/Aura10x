-- Supabase Seed Script
-- Generated on 2026-01-29

-- This script provides sample data for the Aura project.
-- It includes data for brands, perfumers, notes, accords, perfumes,
-- and the relationships between them.

-- To use this script:
-- 1. Navigate to the SQL Editor in your Supabase project dashboard.
-- 2. Paste the entire content of this script.
-- 3. Click "Run".

-- Before running, ensure your database schema matches the structure
-- defined in the migration files.

-- Clear existing data to prevent conflicts
-- Use TRUNCATE ... RESTART IDENTITY CASCADE to reset sequences and clear dependent tables.
truncate table public.brands, public.perfumers, public.notes, public.accords, public.perfumes cascade;

--
-- Seed Data for `brands` table (5 brands)
--
insert into public.brands (name, slug, website, country) values
('Chanel', 'chanel', 'https://www.chanel.com', 'France'),
('Dior', 'dior', 'https://www.dior.com', 'France'),
('Tom Ford', 'tom-ford', 'https://www.tomford.com', 'USA'),
('Creed', 'creed', 'https://creedboutique.com', 'France'),
('Guerlain', 'guerlain', 'https://www.guerlain.com', 'France');

--
-- Seed Data for `perfumers` table (5 perfumers)
--
insert into public.perfumers (full_name) values
('Olivier Polge'),
('Jacques Cavallier'),
('François Demachy'),
('Alberto Morillas'),
('Thierry Wasser');

--
-- Seed Data for `accords` table (10 accords)
--
insert into public.accords (name) values
('Citrus'),
('Woody'),
('Aromatic'),
('Fresh Spicy'),
('Amber'),
('Aquatic'),
('Fruity'),
('Floral'),
('Green'),
('Warm Spicy');

--
-- Seed Data for `notes` table (30 notes)
--
insert into public.notes (name, family, image_path) values
-- Citrus
('Bergamot', 'Citrus', 'https://fimgs.net/mdimg/ingredients/3.jpg'),
('Sicilian Lemon', 'Citrus', 'https://fimgs.net/mdimg/ingredients/19.jpg'),
('Grapefruit', 'Citrus', 'https://fimgs.net/mdimg/ingredients/17.jpg'),
-- Spices
('Pink Pepper', 'Spices', 'https://fimgs.net/mdimg/ingredients/401.jpg'),
('Black Pepper', 'Spices', 'https://fimgs.net/mdimg/ingredients/132.jpg'),
('Cardamom', 'Spices', 'https://fimgs.net/mdimg/ingredients/134.jpg'),
('Nutmeg', 'Spices', 'https://fimgs.net/mdimg/ingredients/137.jpg'),
('Ginger', 'Spices', 'https://fimgs.net/mdimg/ingredients/136.jpg'),
-- Aromatic
('Mint', 'Aromatic', 'https://fimgs.net/mdimg/ingredients/31.jpg'),
('Lavender', 'Aromatic', 'https://fimgs.net/mdimg/ingredients/8.jpg'),
('Sage', 'Aromatic', 'https://fimgs.net/mdimg/ingredients/120.jpg'),
-- Woods
('Cedarwood', 'Woods', 'https://fimgs.net/mdimg/ingredients/106.jpg'),
('Sandalwood', 'Woods', 'https://fimgs.net/mdimg/ingredients/108.jpg'),
('Vetiver', 'Woods', 'https://fimgs.net/mdimg/ingredients/110.jpg'),
('Patchouli', 'Woods', 'https://fimgs.net/mdimg/ingredients/107.jpg'),
('Oud', 'Woods', 'https://fimgs.net/mdimg/ingredients/420.jpg'),
-- Resins & Balsams
('Amber', 'Resins & Balsams', 'https://fimgs.net/mdimg/ingredients/113.jpg'),
('Incense', 'Resins & Balsams', 'https://fimgs.net/mdimg/ingredients/143.jpg'),
('Labdanum', 'Resins & Balsams', 'https://fimgs.net/mdimg/ingredients/117.jpg'),
('Olibanum', 'Resins & Balsams', 'https://fimgs.net/mdimg/ingredients/144.jpg'),
-- Sweet & Gourmand
('Vanilla', 'Sweet & Gourmand', 'https://fimgs.net/mdimg/ingredients/104.jpg'),
('Tonka Bean', 'Sweet & Gourmand', 'https://fimgs.net/mdimg/ingredients/112.jpg'),
-- Musk, Amber, Animalic
('Ambroxan', 'Musk, Amber, Animalic', 'https://fimgs.net/mdimg/ingredients/970.jpg'),
('White Musk', 'Musk, Amber, Animalic', 'https://fimgs.net/mdimg/ingredients/149.jpg'),
('Leather', 'Musk, Amber, Animalic', 'https://fimgs.net/mdimg/ingredients/290.jpg'),
-- Flowers
('Jasmine', 'Flowers', 'https://fimgs.net/mdimg/ingredients/5.jpg'),
('Rose', 'Flowers', 'https://fimgs.net/mdimg/ingredients/133.jpg'),
('Geranium', 'Flowers', 'https://fimgs.net/mdimg/ingredients/154.jpg'),
-- Fruits, Vegetables & Nuts
('Pineapple', 'Fruits, Vegetables & Nuts', 'https://fimgs.net/mdimg/ingredients/319.jpg'),
('Apple', 'Fruits, Vegetables & Nuts', 'https://fimgs.net/mdimg/ingredients/205.jpg'),
-- Greens, Herbs & Fougeres
('Oakmoss', 'Greens, Herbs & Fougeres', 'https://fimgs.net/mdimg/ingredients/111.jpg');

--
-- Seed Data for `perfumes` table (20 perfumes)
--
insert into public.perfumes (brand_id, name, slug, concentration, gender_official, release_year, image_path, description)
select
    b.id,
    p.name,
    p.slug,
    p.concentration,
    p.gender_official,
    p.release_year,
    p.image_path,
    p.description
from
    (values
        ('Chanel', 'Bleu de Chanel Eau de Parfum', 'bleu-de-chanel-edp', 'EDP', 'Male', 2014, 'https://fimgs.net/mdimg/perfume/375x500.20323.jpg', 'A woody, aromatic fragrance for the man who defies convention.'),
        ('Dior', 'Sauvage Eau de Parfum', 'sauvage-edp', 'EDP', 'Male', 2018, 'https://fimgs.net/mdimg/perfume/375x500.48021.jpg', 'A radical freshness, with a raw and noble composition.'),
        ('Creed', 'Aventus', 'aventus', 'EDP', 'Male', 2010, 'https://fimgs.net/mdimg/perfume/375x500.9828.jpg', 'A sophisticated blend for individuals who savor a life well-lived.'),
        ('Tom Ford', 'Tuscan Leather', 'tuscan-leather', 'EDP', 'Unisex', 2007, 'https://fimgs.net/mdimg/perfume/375x500.1853.jpg', 'A primal and sophisticated scent with notes of leather and suede.'),
        ('Guerlain', 'L''Homme Idéal Eau de Parfum', 'lhomme-ideal-edp', 'EDP', 'Male', 2016, 'https://fimgs.net/mdimg/perfume/375x500.37943.jpg', 'The intelligence of a woody-oriental fragrance with a captivating almond trail.'),
        ('Chanel', 'Coco Mademoiselle', 'coco-mademoiselle', 'EDP', 'Female', 2001, 'https://fimgs.net/mdimg/perfume/375x500.611.jpg', 'A spirited and voluptuous fragrance, the essence of a free and audacious woman.'),
        ('Dior', 'J''adore', 'jadore', 'EDP', 'Female', 1999, 'https://fimgs.net/mdimg/perfume/375x500.213.jpg', 'A grand floral fragrance that is both luminous and sensual.'),
        ('Tom Ford', 'Black Orchid', 'black-orchid', 'EDP', 'Unisex', 2006, 'https://fimgs.net/mdimg/perfume/375x500.1018.jpg', 'A luxurious and sensual fragrance of rich, dark accords and an alluring potion of black orchids and spice.'),
        ('Guerlain', 'Shalimar', 'shalimar', 'EDP', 'Female', 1925, 'https://fimgs.net/mdimg/perfume/375x500.1033.jpg', 'The first oriental fragrance in history, a mythical scent with bergamot, iris, and vanilla notes.'),
        ('Chanel', 'Allure Homme Sport', 'allure-homme-sport', 'EDT', 'Male', 2004, 'https://fimgs.net/mdimg/perfume/375x500.13.jpg', 'A fresh, invigorating fragrance that evokes a man of action.'),
        ('Dior', 'Homme Intense', 'dior-homme-intense', 'EDP', 'Male', 2011, 'https://fimgs.net/mdimg/perfume/375x500.12020.jpg', 'A noble, sophisticated, and powerful scent with a heart of iris.'),
        ('Creed', 'Green Irish Tweed', 'green-irish-tweed', 'EDP', 'Male', 1985, 'https://fimgs.net/mdimg/perfume/375x500.559.jpg', 'A classic fragrance that combines woody freshness and pure masculinity.'),
        ('Tom Ford', 'Oud Wood', 'oud-wood', 'EDP', 'Unisex', 2007, 'https://fimgs.net/mdimg/perfume/375x500.1822.jpg', 'A masterful blend of exotic woods and spices.'),
        ('Guerlain', 'Vetiver', 'guerlain-vetiver', 'EDT', 'Male', 1961, 'https://fimgs.net/mdimg/perfume/375x500.1039.jpg', 'A reference for vetiver-based fragrances, embodying natural elegance.'),
        ('Chanel', 'N°5', 'no-5', 'EDP', 'Female', 1921, 'https://fimgs.net/mdimg/perfume/375x500.1019.jpg', 'The very essence of femininity. A powdery floral bouquet.'),
        ('Dior', 'Fahrenheit', 'fahrenheit', 'EDT', 'Male', 1988, 'https://fimgs.net/mdimg/perfume/375x500.5.jpg', 'A fragrance of contrasts, both warm and cold, delicate and powerful.'),
        ('Tom Ford', 'Neroli Portofino', 'neroli-portofino', 'EDP', 'Unisex', 2011, 'https://fimgs.net/mdimg/perfume/375x500.11728.jpg', 'A vibrant and sparkling fragrance that captures the cool breezes of the Italian Riviera.'),
        ('Creed', 'Royal Oud', 'royal-oud', 'EDP', 'Unisex', 2011, 'https://fimgs.net/mdimg/perfume/375x500.12749.jpg', 'A stylish and warm fougère fragrance with a beautiful kaleidoscope of woody, aromatic green and spicy nuances.'),
        ('Guerlain', 'Mon Guerlain', 'mon-guerlain', 'EDP', 'Female', 2017, 'https://fimgs.net/mdimg/perfume/375x500.42433.jpg', 'A tribute to today’s femininity - a strong, free and sensual femininity.'),
        ('Chanel', 'Chance Eau Tendre', 'chance-eau-tendre', 'EDT', 'Female', 2010, 'https://fimgs.net/mdimg/perfume/375x500.8209.jpg', 'A delicate and radiant fragrance with a fruity-floral heart.')
    ) as p(brand_name, name, slug, concentration, gender_official, release_year, image_path, description)
join public.brands b on p.brand_name = b.name;

--
-- Seed Data for Relationships
--

--
-- Seed Data for `perfume_perfumers`
--
insert into public.perfume_perfumers (perfume_id, perfumer_id) values
((select id from public.perfumes where slug = 'bleu-de-chanel-edp'), (select id from public.perfumers where full_name = 'Jacques Cavallier')),
((select id from public.perfumes where slug = 'sauvage-edp'), (select id from public.perfumers where full_name = 'François Demachy')),
((select id from public.perfumes where slug = 'aventus'), (select id from public.perfumers where full_name = 'Olivier Polge')),
((select id from public.perfumes where slug = 'tuscan-leather'), (select id from public.perfumers where full_name = 'Alberto Morillas')),
((select id from public.perfumes where slug = 'lhomme-ideal-edp'), (select id from public.perfumers where full_name = 'Thierry Wasser')),
((select id from public.perfumes where slug = 'coco-mademoiselle'), (select id from public.perfumers where full_name = 'Jacques Cavallier')),
((select id from public.perfumes where slug = 'jadore'), (select id from public.perfumers where full_name = 'François Demachy')),
((select id from public.perfumes where slug = 'black-orchid'), (select id from public.perfumers where full_name = 'Alberto Morillas')),
((select id from public.perfumes where slug = 'shalimar'), (select id from public.perfumers where full_name = 'Thierry Wasser')),
((select id from public.perfumes where slug = 'allure-homme-sport'), (select id from public.perfumers where full_name = 'Jacques Cavallier'));

--
-- Seed Data for `perfume_accords`
--
insert into public.perfume_accords (perfume_id, accord_id, potency_value) values
-- Bleu de Chanel EDP
((select id from public.perfumes where slug = 'bleu-de-chanel-edp'), (select id from public.accords where name = 'Citrus'), 90),
((select id from public.perfumes where slug = 'bleu-de-chanel-edp'), (select id from public.accords where name = 'Amber'), 85),
((select id from public.perfumes where slug = 'bleu-de-chanel-edp'), (select id from public.accords where name = 'Woody'), 80),
((select id from public.perfumes where slug = 'bleu-de-chanel-edp'), (select id from public.accords where name = 'Aromatic'), 75),
((select id from public.perfumes where slug = 'bleu-de-chanel-edp'), (select id from public.accords where name = 'Fresh Spicy'), 70),
-- Sauvage EDP
((select id from public.perfumes where slug = 'sauvage-edp'), (select id from public.accords where name = 'Fresh Spicy'), 95),
((select id from public.perfumes where slug = 'sauvage-edp'), (select id from public.accords where name = 'Amber'), 88),
((select id from public.perfumes where slug = 'sauvage-edp'), (select id from public.accords where name = 'Citrus'), 82),
((select id from public.perfumes where slug = 'sauvage-edp'), (select id from public.accords where name = 'Aromatic'), 70),
-- Aventus
((select id from public.perfumes where slug = 'aventus'), (select id from public.accords where name = 'Fruity'), 92),
((select id from public.perfumes where slug = 'aventus'), (select id from public.accords where name = 'Woody'), 85),
((select id from public.perfumes where slug = 'aventus'), (select id from public.accords where name = 'Citrus'), 80),
-- Tuscan Leather
((select id from public.perfumes where slug = 'tuscan-leather'), (select id from public.accords where name = 'Woody'), 98),
((select id from public.perfumes where slug = 'tuscan-leather'), (select id from public.accords where name = 'Fruity'), 80),
((select id from public.perfumes where slug = 'tuscan-leather'), (select id from public.accords where name = 'Amber'), 75),
-- L'Homme Idéal EDP
((select id from public.perfumes where slug = 'lhomme-ideal-edp'), (select id from public.accords where name = 'Amber'), 90),
((select id from public.perfumes where slug = 'lhomme-ideal-edp'), (select id from public.accords where name = 'Fruity'), 85),
((select id from public.perfumes where slug = 'lhomme-ideal-edp'), (select id from public.accords where name = 'Woody'), 78);

--
-- Seed Data for `perfume_notes`
--
insert into public.perfume_notes (perfume_id, note_id, pyramid_level, prominence) values
-- Bleu de Chanel EDP
((select id from public.perfumes where slug = 'bleu-de-chanel-edp'), (select id from public.notes where name = 'Grapefruit'), 'top', 5),
((select id from public.perfumes where slug = 'bleu-de-chanel-edp'), (select id from public.notes where name = 'Sicilian Lemon'), 'top', 4),
((select id from public.perfumes where slug = 'bleu-de-chanel-edp'), (select id from public.notes where name = 'Mint'), 'top', 3),
((select id from public.perfumes where slug = 'bleu-de-chanel-edp'), (select id from public.notes where name = 'Ginger'), 'middle', 4),
((select id from public.perfumes where slug = 'bleu-de-chanel-edp'), (select id from public.notes where name = 'Jasmine'), 'middle', 2),
((select id from public.perfumes where slug = 'bleu-de-chanel-edp'), (select id from public.notes where name = 'Incense'), 'base', 5),
((select id from public.perfumes where slug = 'bleu-de-chanel-edp'), (select id from public.notes where name = 'Cedarwood'), 'base', 4),
((select id from public.perfumes where slug = 'bleu-de-chanel-edp'), (select id from public.notes where name = 'Sandalwood'), 'base', 4),
-- Sauvage EDP
((select id from public.perfumes where slug = 'sauvage-edp'), (select id from public.notes where name = 'Bergamot'), 'top', 5),
((select id from public.perfumes where slug = 'sauvage-edp'), (select id from public.notes where name = 'Lavender'), 'middle', 4),
((select id from public.perfumes where slug = 'sauvage-edp'), (select id from public.notes where name = 'Nutmeg'), 'middle', 3),
((select id from public.perfumes where slug = 'sauvage-edp'), (select id from public.notes where name = 'Ambroxan'), 'base', 5),
((select id from public.perfumes where slug = 'sauvage-edp'), (select id from public.notes where name = 'Vanilla'), 'base', 4),
-- Aventus
((select id from public.perfumes where slug = 'aventus'), (select id from public.notes where name = 'Pineapple'), 'top', 5),
((select id from public.perfumes where slug = 'aventus'), (select id from public.notes where name = 'Bergamot'), 'top', 4),
((select id from public.perfumes where slug = 'aventus'), (select id from public.notes where name = 'Apple'), 'top', 3),
((select id from public.perfumes where slug = 'aventus'), (select id from public.notes where name = 'Rose'), 'middle', 3),
((select id from public.perfumes where slug = 'aventus'), (select id from public.notes where name = 'Patchouli'), 'middle', 2),
((select id from public.perfumes where slug = 'aventus'), (select id from public.notes where name = 'Oakmoss'), 'base', 5),
((select id from public.perfumes where slug = 'aventus'), (select id from public.notes where name = 'Amber'), 'base', 4),
((select id from public.perfumes where slug = 'aventus'), (select id from public.notes where name = 'White Musk'), 'base', 4);

-- End of script
select 'Seed data successfully inserted.' as status;
