-- Golfer onboarding tables for Your Virtual Caddy.
-- Run this in the Supabase SQL Editor after Auth is working.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  handicap numeric,
  average_score numeric,
  driver_carry integer,
  onboarding_completed boolean not null default false
);

alter table public.profiles enable row level security;

create policy "Profiles: select own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Profiles: insert own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Profiles: update own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at current on profile changes.
create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_profiles_updated_at();

-- ---------------------------------------------------------------------------
-- club_distances
-- ---------------------------------------------------------------------------
create table if not exists public.club_distances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  club text not null,
  distance integer not null,
  constraint club_distances_user_club_unique unique (user_id, club),
  constraint club_distances_distance_positive check (distance > 0)
);

create index if not exists club_distances_user_id_idx
  on public.club_distances (user_id);

alter table public.club_distances enable row level security;

create policy "Club distances: select own"
  on public.club_distances for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Club distances: insert own"
  on public.club_distances for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Club distances: update own"
  on public.club_distances for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Club distances: delete own"
  on public.club_distances for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- recent_scores
-- ---------------------------------------------------------------------------
create table if not exists public.recent_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  score integer not null,
  played_at timestamptz not null default now(),
  constraint recent_scores_score_reasonable check (score > 0 and score < 200)
);

create index if not exists recent_scores_user_id_idx
  on public.recent_scores (user_id);

alter table public.recent_scores enable row level security;

create policy "Recent scores: select own"
  on public.recent_scores for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Recent scores: insert own"
  on public.recent_scores for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Recent scores: update own"
  on public.recent_scores for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Recent scores: delete own"
  on public.recent_scores for delete
  to authenticated
  using (auth.uid() = user_id);
