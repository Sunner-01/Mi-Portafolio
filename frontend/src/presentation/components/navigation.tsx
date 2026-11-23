'use client';
import { useState } from 'react';
import { IconArrowUpRight, IconMenu2, IconX } from '@tabler/icons-react';
export function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <a className="wordmark" href="#inicio" aria-label="Suner Barrera, inicio">
        <span className="brand-symbol">
          s<span>b</span>
        </span>
        suner<span>.</span>
      </a>
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="navigation"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      >
        {open ? <IconX /> : <IconMenu2 />}
      </button>
      <nav id="navigation" className={open ? 'nav open' : 'nav'} aria-label="Navegación principal">
        <a href="#proyectos" onClick={() => setOpen(false)}>
          Proyectos
        </a>
        <a href="#estudio" onClick={() => setOpen(false)}>
          Sobre mí
        </a>
        <a href="#servicios" onClick={() => setOpen(false)}>
          Lo que hago
        </a>
        <a className="nav-contact" href="#contacto" onClick={() => setOpen(false)}>
          Hablemos <IconArrowUpRight size={17} />
        </a>
      </nav>
    </header>
  );
}
