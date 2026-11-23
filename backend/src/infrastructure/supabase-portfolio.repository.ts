import { Injectable } from '@nestjs/common';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { ContactMessage, Portfolio, PortfolioRepository, Project } from '../domain/portfolio';

@Injectable()
export class SupabasePortfolioRepository implements PortfolioRepository {
  private readonly client: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
    this.client = createClient(url, key, { auth: { persistSession: false } });
  }

  async getPortfolio(): Promise<Portfolio> {
    const [profile, projects, skills, education] = await Promise.all([
      this.client.from('profile').select('name, full_name, role, city, university, summary, email, whatsapp').eq('id', 1).single(),
      this.client.from('projects').select('slug, name, category, description, device, url, tags, position').order('position'),
      this.client.from('skills').select('name, category, position').order('position'),
      this.client.from('education').select('title, institution, detail, position').order('position'),
    ]);
    const error = profile.error ?? projects.error ?? skills.error ?? education.error;
    if (error) throw new Error(`No se pudo leer el portafolio: ${error.message}`);
    if (!profile.data) throw new Error('Falta el perfil público');
    return {
      profile: {
        name: profile.data.name,
        fullName: profile.data.full_name,
        role: profile.data.role,
        city: profile.data.city,
        university: profile.data.university,
        summary: profile.data.summary,
        email: profile.data.email,
        whatsapp: profile.data.whatsapp,
      },
      projects: (projects.data ?? []) as Project[],
      skills: (skills.data ?? []) as Portfolio['skills'],
      education: (education.data ?? []) as Portfolio['education'],
    };
  }

  async getProject(slug: string): Promise<Project | null> {
    const { data, error } = await this.client
      .from('projects')
      .select('slug, name, category, description, device, url, tags, position')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw new Error(`No se pudo leer el proyecto: ${error.message}`);
    return (data as Project | null) ?? null;
  }

  async saveContact(message: ContactMessage): Promise<void> {
    const { error } = await this.client.from('contact_messages').insert(message);
    if (error) throw new Error(`No se pudo guardar el mensaje: ${error.message}`);
  }
}
