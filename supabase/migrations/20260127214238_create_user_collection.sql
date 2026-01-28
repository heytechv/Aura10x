-- Migration: Create User Collection Table
-- Description: Creates the `user_collection` table for private user data.

--
-- 1. Create user_collection table
--
create table public.user_collection (
    user_id uuid not null references auth.users(id) on delete cascade,
    perfume_id uuid not null references public.perfumes(id) on delete cascade,
    added_at timestamptz default now(),
    primary key (user_id, perfume_id)
);

comment on table public.user_collection is 'Stores the personal perfume collection for each user.';

--
-- 2. Enable RLS and define policies
--
alter table public.user_collection enable row level security;

-- Policies for anonymous users (deny all)
create policy "anon_user_collection_select_policy" on public.user_collection for select to anon using (false);
create policy "anon_user_collection_insert_policy" on public.user_collection for insert to anon with check (false);
create policy "anon_user_collection_update_policy" on public.user_collection for update to anon using (false);
create policy "anon_user_collection_delete_policy" on public.user_collection for delete to anon using (false);

-- Policies for authenticated users
create policy "auth_user_collection_insert_policy" on public.user_collection for insert to authenticated with check (auth.uid() = user_id);
create policy "auth_user_collection_select_policy" on public.user_collection for select to authenticated using (auth.uid() = user_id);
create policy "auth_user_collection_update_policy" on public.user_collection for update to authenticated using (auth.uid() = user_id);
create policy "auth_user_collection_delete_policy" on public.user_collection for delete to authenticated using (auth.uid() = user_id);

--
-- 3. Indexes
--
create index idx_user_collection_user on public.user_collection(user_id);
