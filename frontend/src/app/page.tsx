import { fetchPortfolio } from '@/infrastructure/api/portfolio';
import { Navigation } from '@/presentation/components/navigation';
import { CinematicPortfolio } from '@/presentation/components/cinematic-portfolio';
import { StudioStory } from '@/presentation/components/studio-story';
import { Contact } from '@/presentation/components/contact';
import { IconArrowUpRight } from '@tabler/icons-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { profile, projects, skills, education } = await fetchPortfolio();
  return (
    <>
      <Navigation />
      <main id="contenido">
        <CinematicPortfolio projects={projects} />
        <StudioStory profile={profile} skills={skills} education={education} />
        <Contact email={profile.email} whatsapp={profile.whatsapp} />
      </main>
      <footer className="new-footer">
        <a href="#inicio" className="footer-word">
          suner<span className="accent">.</span>
          <IconArrowUpRight aria-hidden="true" />
        </a>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Diseño, código y curiosidad.</span>
          <a href="#inicio">
            Volver al inicio <IconArrowUpRight size={16} />
          </a>
        </div>
      </footer>
    </>
  );
}
