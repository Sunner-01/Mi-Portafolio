export type Device = 'laptop' | 'tablet' | 'phone';

export interface Project {
  slug: string;
  name: string;
  category: 'Web' | 'Aplicaciones' | 'Plataformas';
  description: string;
  device: Device;
  url: string;
  tags: string[];
  position: number;
}

export interface Profile {
  name: string;
  fullName: string;
  role: string;
  city: string;
  university: string;
  summary: string;
  email: string;
  whatsapp: string;
}

export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Móvil' | 'Herramientas';
  position: number;
}

export interface Education {
  title: string;
  institution: string;
  detail: string;
  position: number;
}

export interface Portfolio {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  education: Education[];
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export interface PortfolioRepository {
  getPortfolio(): Promise<Portfolio>;
  getProject(slug: string): Promise<Project | null>;
  saveContact(message: ContactMessage): Promise<void>;
}
