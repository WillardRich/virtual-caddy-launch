-- Waitlist table for early-access email capture.
-- Run this in the Supabase SQL Editor.

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  constraint waitlist_email_unique unique (email)
);

alter table public.waitlist enable row level security;

-- Allow anonymous inserts from the landing page (anon key).
create policy "Allow public waitlist inserts"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (true);

-- No public reads — emails stay private.
