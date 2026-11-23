begin;
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

insert into public.profile (id, name, full_name, role, city, university, summary, email, whatsapp)
values (
  1,
  'Suner Barrera',
  'Osmer Suner Barrera Quiroga',
  'Desarrollador web y móvil',
  'Bolivia',
  'Universidad del Valle · Ingeniería de Sistemas Informáticos (en curso)',
  'Diseño y desarrollo experiencias digitales con una mirada atenta al detalle, desde la interfaz hasta la infraestructura.',
  'suner3833@gmail.com',
  '59167614221'
);

insert into public.projects (slug, name, category, description, device, url, tags, position) values
  ('sucre-turistica', 'Sucre Turística', 'Web',
   'La Ciudad Blanca, al alcance de todos. Una guía digital para descubrir sus lugares, su cultura y sus experiencias.',
   'laptop', 'https://sucreturistica.com.bo/', array['Turismo', 'Experiencia web'], 1),
  ('vixor', 'Vixor', 'Plataformas',
   'Una herramienta directa para descargar videos, audio e imágenes de TikTok. Del enlace al archivo, en una experiencia sencilla.',
   'tablet', 'https://vixor-tiktok-downloader.vercel.app/', array['Herramienta digital', 'Multimedia'], 2),
  ('nexo', 'Nexo', 'Aplicaciones',
   'Tu mundo se convierte en una arena. Una experiencia web que presenta un juego de combate en realidad aumentada para Android.',
   'phone', 'https://nexo-web-opal.vercel.app/', array['Gaming', 'Realidad aumentada'], 3);

insert into public.skills (name, category, position) values
  ('Next.js', 'Frontend', 1),
  ('React', 'Frontend', 2),
  ('TypeScript', 'Frontend', 3),
  ('NestJS', 'Backend', 4),
  ('Node.js', 'Backend', 5),
  ('Supabase / PostgreSQL', 'Backend', 6),
  ('Android', 'Móvil', 7),
  ('Interfaces adaptables', 'Móvil', 8),
  ('Docker', 'Herramientas', 9),
  ('GitHub Actions', 'Herramientas', 10),
  ('Terraform y Ansible', 'Herramientas', 11);

insert into public.education (title, institution, detail, position) values
  ('Ingeniería de Sistemas Informáticos', 'Universidad del Valle', 'Formación universitaria en curso.', 1),
  ('Desarrollo web moderno', 'Aprendizaje y práctica continua', 'Interfaces con React, Next.js, accesibilidad y rendimiento.', 2),
  ('Backend y bases de datos', 'Aprendizaje y práctica continua', 'APIs con NestJS, PostgreSQL y Supabase.', 3),
  ('Desarrollo móvil', 'Aprendizaje y práctica continua', 'Experiencias Android y diseño para pantallas pequeñas.', 4);

commit;
