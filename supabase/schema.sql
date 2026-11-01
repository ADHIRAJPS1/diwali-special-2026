-- Run in the Supabase SQL editor. The service role key is used only by Next.js server routes.
create table if not exists public.celebrations (
  visitor_hash text primary key,
  celebrated_at timestamptz not null default now()
);

create or replace view public.celebration_totals as
  select count(*)::bigint as total from public.celebrations;

create or replace function public.record_celebration(visitor_hash text)
returns void language sql security definer set search_path = '' as $$
  insert into public.celebrations (visitor_hash) values (record_celebration.visitor_hash)
  on conflict (visitor_hash) do nothing;
$$;

create table if not exists public.participant_messages (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text check (char_length(name) <= 100),
  phone text check (char_length(phone) <= 30),
  email text check (char_length(email) <= 254),
  age smallint check (age is null or age between 18 and 120),
  message text not null check (char_length(message) between 1 and 500),
  consent boolean not null check (consent = true)
);

alter table public.celebrations enable row level security;
alter table public.participant_messages enable row level security;
revoke all on public.celebrations, public.participant_messages from anon, authenticated;
revoke all on function public.record_celebration(text) from public, anon, authenticated;
grant usage on schema public to service_role;
grant select on public.celebration_totals to service_role;
grant execute on function public.record_celebration(text) to service_role;
grant insert on public.participant_messages to service_role;
