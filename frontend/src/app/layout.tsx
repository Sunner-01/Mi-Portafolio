import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'http://localhost:3000'),
  ),
  title: 'Suner Barrera | Desarrollo web y móvil',
  description:
    'Portafolio personal de Suner Barrera, estudiante de Ingeniería de Sistemas Informáticos en Univalle. Desarrollo web y móvil.',
  openGraph: {
    title: 'Suner Barrera | Desarrollo web y móvil',
    description: 'Proyectos, habilidades y formación de Suner Barrera.',
    locale: 'es_BO',
    type: 'website',
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://sucreturistica.com.bo" />
        <link rel="preconnect" href="https://vixor-tiktok-downloader.vercel.app" />
        <link rel="preconnect" href="https://nexo-web-opal.vercel.app" />
      </head>
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
