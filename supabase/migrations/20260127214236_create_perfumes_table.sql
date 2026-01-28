-- Migration: Create Perfumes Table
-- Description: Creates the central `perfumes` table, which depends on the `brands` table.

--
-- 1. Create perfumes table
--
create table public.perfumes (
    id uuid primary key default gen_random_uuid(),
    brand_id uuid references public.brands(id),
    name text not null,
    slug text unique not null,
    concentration text,
    gender_official text check (gender_official in ('Male', 'Female', 'Unisex')),
    release_year integer,
    image_path text,
    description text,
    created_at timestamptz default now()
);

comment on table public.perfumes is 'The core table containing detailed information about each perfume.';

--
-- 2. Enable RLS and define policies
--
alter table public.perfumes enable row level security;
create policy "anon_perfumes_select_policy" on public.perfumes for select to anon using (true);
create policy "authenticated_perfumes_select_policy" on public.perfumes for select to authenticated using (true);

--
-- 3. Indexes
--
create index idx_perfumes_brand_id on public.perfumes(brand_id);
create index idx_perfumes_slug on public.perfumes(slug);

-- Enable pg_trgm extension for trigram matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- Create a GIN index on the name for fast text searching
create index idx_perfumes_name_gin on public.perfumes using gin (name gin_trgm_ops);
