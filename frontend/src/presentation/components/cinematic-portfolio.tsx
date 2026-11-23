'use client';

import dynamic from 'next/dynamic';
import { Component, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  useInView,
  type MotionValue,
} from 'motion/react';
import {
  IconArrowUpRight,
  IconArrowDown,
  IconPlayerPause,
  IconPlayerPlay,
} from '@tabler/icons-react';
import type { Project } from '@/domain/project';
import { CHAPTER_STOPS, ARRIVAL_EASE, chapterAt } from '@/presentation/motion/choreography';
import { usePageVisible } from '@/presentation/hooks/use-page-visible';

const Scene = dynamic(() => import('./cinematic-scene'), {
  ssr: false,
  loading: () => (
    <div className="cinema-loading" role="status">
      <span />
      Preparando proyectos
    </div>
  ),
});

class SceneBoundary extends Component<{ children: ReactNode; url: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="cinema-fallback">
        <iframe
          src={this.props.url}
          title="Sitio real del proyecto seleccionado"
          style={{ width: '100%', height: '100%', border: 0 }}
        />
      </div>
    ) : (
      this.props.children
    );
  }
}

function ProjectChapter({
  project,
  index,
  progress,
  selected,
  reduced,
}: {
  project: Project;
  index: number;
  progress: MotionValue<number>;
  selected: boolean;
  reduced: boolean;
}) {
  const center = CHAPTER_STOPS[index];
  const opacity = useTransform(
    progress,
    [center - 0.16, center - 0.07, center + 0.07, center + 0.15],
    [0, 1, 1, index === 2 ? 1 : 0],
  );
  const y = useTransform(
    progress,
    [center - 0.16, center - 0.06, center + 0.07, center + 0.15],
    [55, 0, 0, -45],
  );
  const clipPath = useTransform(
    progress,
    [center - 0.16, center - 0.06],
    ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'],
  );
  return (
    <>
      <motion.div
        className="cinema-chapter-background"
        aria-hidden="true"
        style={{ opacity: reduced ? Number(selected) : opacity, y: reduced ? 0 : y }}
      >
        <span className="chapter-numeral">0{index + 1}</span>
      </motion.div>
      <motion.article
        className="cinema-chapter"
        style={{
          opacity: reduced ? Number(selected) : opacity,
          y: reduced ? 0 : y,
          pointerEvents: selected ? 'auto' : 'none',
        }}
        aria-hidden={!selected}
        inert={!selected}
      >
        <motion.h2 style={{ clipPath: reduced ? undefined : clipPath }}>{project.name}</motion.h2>
        <span className="chapter-category">{project.tags.join(' / ')}</span>
        <p>{project.description}</p>
        <a href={project.url} target="_blank" rel="noopener noreferrer" className="chapter-link">
          Explorar proyecto <IconArrowUpRight size={21} />
          <span className="sr-only">(abre otra pestaña)</span>
        </a>
      </motion.article>
    </>
  );
}

export function CinematicPortfolio({ projects }: { projects: readonly Project[] }) {
  const track = useRef<HTMLElement>(null);
  const reduced = Boolean(useReducedMotion());
  const inView = useInView(track);
  const pageVisible = usePageVisible();
  const [paused, setPaused] = useState(false);
  const [chapter, setChapter] = useState(-1);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 95, damping: 30, restDelta: 0.0001 });
  const progress = reduced ? scrollYProgress : smooth;
  const heroOpacity = useTransform(progress, [0, 0.1, 0.18], [1, 1, 0]);
  const heroY = useTransform(progress, [0, 0.22], [0, -110]);
  const titleScale = useTransform(progress, [0, 0.22], [1, 1.12]);
  useMotionValueEvent(progress, 'change', (value) =>
    setChapter((current) => (current === chapterAt(value) ? current : chapterAt(value))),
  );

  function goTo(index: number) {
    if (!track.current) return;
    const top = window.scrollY + track.current.getBoundingClientRect().top;
    const distance = track.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + distance * (index < 0 ? 0 : CHAPTER_STOPS[index]),
      behavior: reduced ? 'instant' : 'smooth',
    });
  }

  if (!projects.length)
    return (
      <section id="inicio" className="fallback-projects">
        <h1>Suner Barrera</h1>
        <p>Estoy preparando mis proyectos.</p>
        <a href="#contacto">Hablemos</a>
      </section>
    );
  const current = projects[Math.max(0, chapter)] ?? projects[0];
  return (
    <section ref={track} className="cinema-track" id="inicio">
      <span id="proyectos" className="project-anchor" />
      <div className="cinema-stage">
        <div className="cinema-halo" />
        <motion.div
          className="cinema-brand"
          style={{
            opacity: reduced ? Number(chapter === -1) : heroOpacity,
            y: reduced ? 0 : heroY,
            scale: reduced ? 1 : titleScale,
          }}
          aria-hidden="true"
        >
          <motion.span
            initial={false}
            animate={
              reduced
                ? undefined
                : { clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'], y: [45, 0] }
            }
            transition={{ duration: 1.1, ease: ARRIVAL_EASE }}
          >
            SUNER<span className="brand-period">.</span>
          </motion.span>
        </motion.div>
        <div className="cinema-canvas">
          <SceneBoundary url={current.url ?? ''}>
            <Scene
              progress={progress}
              projects={projects}
              reduced={reduced}
              paused={paused}
              active={inView && pageVisible}
            />
          </SceneBoundary>
        </div>
        <motion.div
          className="cinema-intro"
          style={{
            opacity: reduced ? Number(chapter === -1) : heroOpacity,
            y: reduced ? 0 : heroY,
            pointerEvents: chapter === -1 ? 'auto' : 'none',
          }}
          aria-hidden={chapter !== -1}
          inert={chapter !== -1}
        >
          <h1>
            Código con
            <br />
            <em>otra dimensión.</em>
          </h1>
          <div className="cinema-intro-right">
            <p>
              Soy Suner Barrera, estudiante de Ingeniería de Sistemas Informáticos.
              <br />
              Desarrollo experiencias web y móviles con atención al detalle.
            </p>
            <button onClick={() => goTo(0)} className="explore-work">
              Explorar mis proyectos <IconArrowDown size={17} />
            </button>
          </div>
        </motion.div>
        {projects.slice(0, 3).map((project, index) => (
          <ProjectChapter
            key={project.slug}
            project={project}
            index={index}
            progress={progress}
            selected={chapter === index}
            reduced={reduced}
          />
        ))}
        <nav className="cinema-dock" aria-label="Explorar proyectos">
          <button
            className={chapter === -1 ? 'selected' : ''}
            onClick={() => goTo(-1)}
            aria-label="Volver a la portada"
            aria-pressed={chapter === -1}
          >
            SB
          </button>
          <div className="dock-divider" />
          {projects.slice(0, 3).map((project, index) => (
            <button
              key={project.slug}
              className={chapter === index ? 'selected' : ''}
              aria-pressed={chapter === index}
              onClick={() => goTo(index)}
            >
              <span className="dock-number">0{index + 1}</span>
              {project.name}
            </button>
          ))}
          <button
            className="dock-pause"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? 'Activar movimiento ambiental' : 'Pausar movimiento ambiental'}
          >
            {paused ? <IconPlayerPlay size={15} /> : <IconPlayerPause size={15} />}
          </button>
          <motion.div className="dock-progress" style={{ scaleX: progress }} />
        </nav>
      </div>
      <noscript>
        <div className="fallback-projects">
          {projects.map((project) => (
            <article key={project.slug}>
              <h2>{project.name}</h2>
              <p>{project.description}</p>

              <a href={project.url}>Explorar proyecto</a>
            </article>
          ))}
        </div>
      </noscript>
    </section>
  );
}
