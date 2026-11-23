import type { Project } from '@/domain/project';

type ApiProject = Pick<Project, 'slug' | 'name' | 'category' | 'description' | 'device' | 'url' | 'tags'>;

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
}

export interface Education {
  title: string;
  institution: string;
  detail: string;
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  education: Education[];
}

function screens(slug: string) {
  const name = slug === 'sucre-turistica' ? 'sucre' : slug;
  return {
    laptop: `/images/${name}.webp`,
    tablet: `/images/${name}-tablet.webp`,
    phone: `/images/${name}-phone.webp`,
  };
}

export function decorateProject(project: ApiProject): Project {
  const assets = screens(project.slug);
  return {
    ...project,
    image: assets[project.device],
    screens: assets,
    concept: false,
  };
}

export async function fetchPortfolio(): Promise<PortfolioData> {
  const base = process.env.API_INTERNAL_URL || 'http://127.0.0.1:4301';
  const response = await fetch(`${base}/portfolio`, { cache: 'no-store' });
  if (!response.ok) throw new Error('No se pudo cargar el portafolio.');
  const data = (await response.json()) as Omit<PortfolioData, 'projects'> & {
    projects: ApiProject[];
  };
  return { ...data, projects: data.projects.map(decorateProject) };
}
