-- Migration: Create Base Catalog Tables
-- Description: Creates the foundational public tables for the perfume catalog that have no dependencies: brands, perfumers, notes, and accords.

--
-- 1. Create brands table
--
create table public.brands (
    id uuid primary key default gen_random_uuid(),
    name text unique not null,
    slug text unique not null,
    website text,
    country text,
    created_at timestamptz default now()
);
comment on table public.brands is 'Stores information about perfume brands.';
-- Enable RLS and define policies
alter table public.brands enable row level security;
create policy "Allow public read access to brands" on public.brands for select using (true);

--
-- 2. Create perfumers table
--
create table public.perfumers (
    id uuid primary key default gen_random_uuid(),
    full_name text not null
);
comment on table public.perfumers is 'Stores information about the creators of perfumes.';
-- Enable RLS and define policies
alter table public.perfumers enable row level security;
create policy "Allow public read access to perfumers" on public.perfumers for select using (true);

--
-- 3. Create notes table
--
create table public.notes (
    id uuid primary key default gen_random_uuid(),
    name text unique not null,
    family text,
    image_path text
);
comment on table public.notes is 'Stores individual fragrance notes (e.g., Bergamot, Cedarwood).';
-- Enable RLS and define policies
alter table public.notes enable row level security;
create policy "Allow public read access to notes" on public.notes for select using (true);

--
-- 4. Create accords table
--
create table public.accords (
    id uuid primary key default gen_random_uuid(),
    name text unique not null
);
comment on table public.accords is 'Stores high-level fragrance accords (e.g., Woody, Floral).';
-- Enable RLS and define policies
alter table public.accords enable row level security;
create policy "Allow public read access to accords" on public.accords for select using (true);
