'use client';

import { useState, type FormEvent } from 'react';
import { IconArrowUpRight, IconBrandWhatsapp } from '@tabler/icons-react';

export function Contact({ email, whatsapp }: { email: string; whatsapp: string }) {
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent('Hola, Suner. Vi tu portafolio y quiero conversar sobre un proyecto.')}`;

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus('');
    const form = event.currentTarget;
    const values = new FormData(form);
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.get('name'),
          email: values.get('email'),
          message: values.get('message'),
        }),
      });
      if (!response.ok) throw new Error('No se pudo enviar el mensaje. Inténtalo de nuevo.');
      form.reset();
      setStatus('Mensaje recibido. Te responderé pronto.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo enviar el mensaje.');
    } finally {
      setPending(false);
    }
  }
  return (
    <section id="contacto" className="contact-section">
      <div className="contact-heading">
        <h2>
          Hagamos que
          <br />
          <span>pase.</span>
        </h2>
        <a
          className="contact-arrow"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hablemos por WhatsApp"
        >
          <IconArrowUpRight stroke={1} />
        </a>
      </div>
      <div className="contact-bottom">
        <p>
          Cuéntame qué quieres construir.
          <br />
          Te responderé personalmente.
        </p>
        <div className="contact-channels">
          <a
            className="contact-email"
            href={`mailto:${email}?subject=${encodeURIComponent('Hablemos de mi proyecto')}`}
          >
            {email}
          </a>
          <a className="text-link" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <IconBrandWhatsapp size={19} stroke={1.5} />
            WhatsApp <IconArrowUpRight size={18} />
          </a>
        </div>
      </div>
      <form className="contact-form" onSubmit={send}>
        <div className="contact-form-heading">
          <span className="section-kicker">ESCRÍBEME</span>
          <p>Una idea, una pregunta o un proyecto. Aquí empieza la conversación.</p>
        </div>
        <div className="contact-form-fields">
          <label>Tu nombre<input name="name" autoComplete="name" minLength={2} maxLength={100} required /></label>
          <label>Tu correo<input name="email" type="email" autoComplete="email" required /></label>
          <label className="contact-message">Mensaje<textarea name="message" rows={3} minLength={10} maxLength={2000} required /></label>
        </div>
        <div className="contact-form-footer">
          <button type="submit" disabled={pending}>{pending ? 'Enviando…' : 'Enviar mensaje'} <IconArrowUpRight size={17} /></button>
          <p role="status" aria-live="polite">{status}</p>
        </div>
      </form>
    </section>
  );
}

