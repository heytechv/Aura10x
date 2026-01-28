-- Migration: Disable RLS for Local Development
-- Description: This migration disables Row Level Security (RLS) and removes all associated policies for tables used in the application. This is intended for local development environments to simplify database access. DO NOT apply this migration in production.

--
-- Drop policies and disable RLS for each table.
--

-- Table: public.brands
drop policy if exists "Allow public read access to brands" on public.brands;
alter table public.brands disable row level security;

-- Table: public.perfumers
drop policy if exists "Allow public read access to perfumers" on public.perfumers;
alter table public.perfumers disable row level security;

-- Table: public.notes
drop policy if exists "Allow public read access to notes" on public.notes;
alter table public.notes disable row level security;

-- Table: public.accords
drop policy if exists "Allow public read access to accords" on public.accords;
alter table public.accords disable row level security;

-- Table: public.perfumes
drop policy if exists "Allow public read access to perfumes" on public.perfumes;
alter table public.perfumes disable row level security;

-- Table: public.perfume_perfumers
drop policy if exists "Allow public read access to perfume_perfumers" on public.perfume_perfumers;
alter table public.perfume_perfumers disable row level security;

-- Table: public.perfume_notes
drop policy if exists "Allow public read access to perfume_notes" on public.perfume_notes;
alter table public.perfume_notes disable row level security;

-- Table: public.perfume_accords
drop policy if exists "Allow public read access to perfume_accords" on public.perfume_accords;
alter table public.perfume_accords disable row level security;

-- Table: public.user_collection
drop policy if exists "Allow insert for authenticated users" on public.user_collection;
drop policy if exists "Allow read access for owner" on public.user_collection;
drop policy if exists "Allow update for owner" on public.user_collection;
drop policy if exists "Allow delete for owner" on public.user_collection;
alter table public.user_collection disable row level security;
