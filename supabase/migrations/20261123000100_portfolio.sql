create table public.profile (
  id integer primary key check (id = 1),
  name text not null,
  full_name text not null,
  role text not null,
  city text not null,
  university text not null,
  summary text not null,
  email text not null,
  whatsapp text not null
);

create table public.projects (
  slug text primary key,
  name text not null,
  category text not null check (category in ('Web', 'Aplicaciones', 'Plataformas')),
  description text not null,
  device text not null check (device in ('laptop', 'tablet', 'phone')),
  url text not null check (url ~ '^https://'),
  tags text[] not null default '{}',
  position integer not null unique
);

create table public.skills (
  id bigint generated always as identity primary key,
  name text not null unique,
  category text not null check (category in ('Frontend', 'Backend', 'Móvil', 'Herramientas')),
  position integer not null unique
);

create table public.education (
  id bigint generated always as identity primary key,
  title text not null,
  institution text not null,
  detail text not null,
  position integer not null unique
);

create table public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 2 and 100),
  email text not null,
  message text not null check (char_length(message) between 10 and 2000),
  created_at timestamptz not null default now()
);

alter table public.profile enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.education enable row level security;
alter table public.contact_messages enable row level security;

create policy "Leer perfil" on public.profile for select to anon, authenticated using (true);
create policy "Leer proyectos" on public.projects for select to anon, authenticated using (true);
create policy "Leer habilidades" on public.skills for select to anon, authenticated using (true);
create policy "Leer formación" on public.education for select to anon, authenticated using (true);

revoke all on public.contact_messages from anon, authenticated;
grant select on public.profile, public.projects, public.skills, public.education to anon, authenticated;
