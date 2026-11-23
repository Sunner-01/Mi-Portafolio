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
