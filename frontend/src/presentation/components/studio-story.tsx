'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react';
import { IconArrowUpRight, IconBraces, IconDeviceDesktop, IconDeviceMobile } from '@tabler/icons-react';
import type { Education, Profile, Skill } from '@/infrastructure/api/portfolio';

function Word({ word, index, total, progress }: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [index / total, (index + 1) / total], [0.55, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

const statement = 'Lo que ves es diseño. Lo que no ves es ingeniería. Me interesa hacer bien los dos.';
const areas = [
  {
    title: 'Experiencias web',
    detail: 'Interfaces que se sienten tan bien como funcionan.',
    category: 'Frontend',
    icon: IconDeviceDesktop,
  },
  {
    title: 'Backend y datos',
    detail: 'APIs claras y datos que sostienen el producto.',
    category: 'Backend',
    icon: IconBraces,
  },
  {
    title: 'Desarrollo móvil',
    detail: 'Ideas que también caben en la mano.',
    category: 'Móvil',
    icon: IconDeviceMobile,
  },
] as const;

export function StudioStory({ profile, skills, education }: {
  profile: Profile;
  skills: Skill[];
  education: Education[];
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] });
  const words = statement.split(' ');
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: imageProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(imageProgress, [0, 1], ['-10%', '10%']);
  return (
    <>
      <section ref={ref} id="estudio" className="manifesto">
        <span className="section-kicker">DISEÑO Y CÓDIGO, EN LA MISMA MESA</span>
        <h2>
          {words.map((word, index) =>
            reduced ? (
              <span key={index}>{word} </span>
            ) : (
              <Word key={index} word={word} index={index} total={words.length} progress={scrollYProgress} />
            ),
          )}
        </h2>
        <div className="manifesto-tail">
          <span className="bracket-mark" aria-hidden="true">[sb]</span>
          <p>{profile.role}<br />{profile.city}</p>
        </div>
      </section>
      <section className="duo-section">
        <div className="duo-image" ref={imageRef}>
          <motion.div className="duo-image-inner" style={{ y: reduced ? 0 : imageY }}>
            <Image src="/images/studio.webp" alt="Estructuras de metal entrelazadas" fill sizes="100vw" />
          </motion.div>
          <div className="duo-image-shade" />
          <div className="duo-heading">
            <span>SOBRE MÍ</span>
            <h2>Una mirada propia.<br /><span>Muchas formas de construir.</span></h2>
          </div>
        </div>
        <div className="duo-text">
          <span className="duo-number">SB<span>ESTUDIANTE / DESARROLLADOR</span></span>
          <div>
            <h3>Hola, soy Suner.<br />Hago ideas reales.</h3>
            <p>{profile.summary} Actualmente estudio {profile.university}.</p>
            <a href="#contacto">Conversemos <IconArrowUpRight size={19} /></a>
          </div>
        </div>
      </section>
      <section id="servicios" className="craft-section">
        <div className="craft-header">
          <h2>De la idea.<br /><span>Al producto.</span></h2>
          <p>Web, móvil y datos.<br />Una forma de aprender haciendo.</p>
        </div>
        <div className="craft-list">
          {areas.map((area, index) => (
            <motion.a
              href="#contacto"
              className="craft-row"
              key={area.title}
              initial={reduced ? false : { opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.65, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <area.icon className="craft-icon" size={35} stroke={1.3} />
              <div><h3>{area.title}</h3><p>{area.detail}</p></div>
              <span className="craft-detail">
                {skills.filter((skill) => skill.category === area.category).map((skill) => skill.name).join(' / ')}
              </span>
              <IconArrowUpRight className="craft-arrow" size={33} stroke={1.2} />
            </motion.a>
          ))}
        </div>
      </section>
      <section className="formation-section" id="formacion">
        <div className="formation-heading">
          <span className="section-kicker">FORMACIÓN EN MOVIMIENTO</span>
          <h2>Aprender.<br /><span>Construir.</span><br />Repetir.</h2>
        </div>
        <div className="formation-list">
          {education.map((item, index) => (
            <article className="formation-row" key={item.title}>
              <span>0{index + 1}</span>
              <div><h3>{item.title}</h3><p>{item.institution}</p></div>
              <p>{item.detail}</p>
            </article>
          ))}
          <p className="formation-note">También trabajo con {skills.filter((skill) => skill.category === 'Herramientas').map((skill) => skill.name).join(', ')}.</p>
        </div>
      </section>
    </>
  );
}
