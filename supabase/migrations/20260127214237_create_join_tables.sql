-- Migration: Create All Join Tables
-- Description: Creates the many-to-many join tables for perfumes to perfumers, notes, and accords.

--
-- 1. Create perfume_perfumers join table
--
create table public.perfume_perfumers (
    perfume_id uuid not null references public.perfumes(id) on delete cascade,
    perfumer_id uuid not null references public.perfumers(id) on delete cascade,
    primary key (perfume_id, perfumer_id)
);
comment on table public.perfume_perfumers is 'Join table linking perfumes to their creators (perfumers).';
-- Enable RLS and define policies
alter table public.perfume_perfumers enable row level security;
create policy "anon_perfume_perfumers_select_policy" on public.perfume_perfumers for select to anon using (true);
create policy "authenticated_perfume_perfumers_select_policy" on public.perfume_perfumers for select to authenticated using (true);
-- Indexes
create index idx_perfume_perfumers_perfume on public.perfume_perfumers(perfume_id);
create index idx_perfume_perfumers_perfumer on public.perfume_perfumers(perfumer_id);


--
-- 2. Create perfume_notes join table
--
create table public.perfume_notes (
    perfume_id uuid references public.perfumes(id) on delete cascade,
    note_id uuid references public.notes(id) on delete cascade,
    pyramid_level text check (pyramid_level in ('top', 'middle', 'base', 'linear')),
    prominence integer default 1,
    primary key (perfume_id, note_id)
);
comment on table public.perfume_notes is 'Join table linking perfumes to their specific notes within the fragrance pyramid.';
-- Enable RLS and define policies
alter table public.perfume_notes enable row level security;
create policy "anon_perfume_notes_select_policy" on public.perfume_notes for select to anon using (true);
create policy "authenticated_perfume_notes_select_policy" on public.perfume_notes for select to authenticated using (true);
-- Indexes
create index idx_perfume_notes_perfume on public.perfume_notes(perfume_id);


--
-- 3. Create perfume_accords join table
--
create table public.perfume_accords (
    perfume_id uuid references public.perfumes(id) on delete cascade,
    accord_id uuid references public.accords(id) on delete cascade,
    potency_value integer not null,
    primary key (perfume_id, accord_id)
);
comment on table public.perfume_accords is 'Join table linking perfumes to their dominant accords.';
-- Enable RLS and define policies
alter table public.perfume_accords enable row level security;
create policy "anon_perfume_accords_select_policy" on public.perfume_accords for select to anon using (true);
create policy "authenticated_perfume_accords_select_policy" on public.perfume_accords for select to authenticated using (true);
-- Indexes
create index idx_perfume_accords_perfume on public.perfume_accords(perfume_id);
