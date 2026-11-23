import type { ProjectCategory, ProjectRepository } from '@/domain/project';
export function getProjects(repository: ProjectRepository, category?: ProjectCategory) {
  const projects = repository.getAll();
  return category ? projects.filter((project) => project.category === category) : projects;
}
