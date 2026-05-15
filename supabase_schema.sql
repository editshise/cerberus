create table if not exists public.cerberus_state (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.cerberus_state enable row level security;

drop policy if exists "cerberus_state_read" on public.cerberus_state;
drop policy if exists "cerberus_state_write" on public.cerberus_state;

create policy "cerberus_state_read"
on public.cerberus_state
for select
using (true);

create policy "cerberus_state_write"
on public.cerberus_state
for all
using (true)
with check (true);

insert into public.cerberus_state (id, data)
values ('cerberus-main', '{}'::jsonb)
on conflict (id) do nothing;
