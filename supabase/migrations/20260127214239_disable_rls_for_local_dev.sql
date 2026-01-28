-- Migration: Disable RLS for Local Development
-- Description: This migration disables Row Level Security (RLS) and removes all associated policies for tables used in the application. This is intended for local development environments to simplify database access. DO NOT apply this migration in production.

--
-- Drop policies and disable RLS for each table.
--

-- Table: public.brands
drop policy if exists "anon_brands_select_policy" on public.brands;
drop policy if exists "authenticated_brands_select_policy" on public.brands;
alter table public.brands disable row level security;

-- Table: public.perfumers
drop policy if exists "anon_perfumers_select_policy" on public.perfumers;
drop policy if exists "authenticated_perfumers_select_policy" on public.perfumers;
alter table public.perfumers disable row level security;

-- Table: public.notes
drop policy if exists "anon_notes_select_policy" on public.notes;
drop policy if exists "authenticated_notes_select_policy" on public.notes;
alter table public.notes disable row level security;

-- Table: public.accords
drop policy if exists "anon_accords_select_policy" on public.accords;
drop policy if exists "authenticated_accords_select_policy" on public.accords;
alter table public.accords disable row level security;

-- Table: public.perfumes
drop policy if exists "anon_perfumes_select_policy" on public.perfumes;
drop policy if exists "authenticated_perfumes_select_policy" on public.perfumes;
alter table public.perfumes disable row level security;

-- Table: public.perfume_perfumers
drop policy if exists "anon_perfume_perfumers_select_policy" on public.perfume_perfumers;
drop policy if exists "authenticated_perfume_perfumers_select_policy" on public.perfume_perfumers;
alter table public.perfume_perfumers disable row level security;

-- Table: public.perfume_notes
drop policy if exists "anon_perfume_notes_select_policy" on public.perfume_notes;
drop policy if exists "authenticated_perfume_notes_select_policy" on public.perfume_notes;
alter table public.perfume_notes disable row level security;

-- Table: public.perfume_accords
drop policy if exists "anon_perfume_accords_select_policy" on public.perfume_accords;
drop policy if exists "authenticated_perfume_accords_select_policy" on public.perfume_accords;
alter table public.perfume_accords disable row level security;

-- Table: public.user_collection
drop policy if exists "anon_user_collection_select_policy" on public.user_collection;
drop policy if exists "anon_user_collection_insert_policy" on public.user_collection;
drop policy if exists "anon_user_collection_update_policy" on public.user_collection;
drop policy if exists "anon_user_collection_delete_policy" on public.user_collection;
drop policy if exists "auth_user_collection_insert_policy" on public.user_collection;
drop policy if exists "auth_user_collection_select_policy" on public.user_collection;
drop policy if exists "auth_user_collection_update_policy" on public.user_collection;
drop policy if exists "auth_user_collection_delete_policy" on public.user_collection;
alter table public.user_collection disable row level security;
