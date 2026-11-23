export type Device = 'laptop' | 'tablet' | 'phone';
export type ProjectCategory = 'Web' | 'Aplicaciones' | 'Plataformas';
export interface Project {
  readonly slug: string;
  readonly name: string;
  readonly category: ProjectCategory;
  readonly description: string;
  readonly device: Device;
  readonly image: string;
  readonly screens: Readonly<Record<Device, string>>;
  readonly url?: string;
  readonly tags: readonly string[];
  readonly concept: boolean;
}
export interface ProjectRepository {
  getAll(): readonly Project[];
}
