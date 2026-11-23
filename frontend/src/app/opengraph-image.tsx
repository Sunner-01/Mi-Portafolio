import { ImageResponse } from 'next/og';
export const alt = 'Suner Barrera. Desarrollo web y móvil.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#101110',
        color: '#eeeee7',
        display: 'flex',
        flexDirection: 'column',
        padding: '65px 85px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', fontSize: 32, letterSpacing: -2 }}>suner.</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: 100,
          letterSpacing: -6,
          lineHeight: 1.05,
          marginTop: 85,
        }}
      >
        <span>Web y móvil con</span>
        <span style={{ color: '#c3de8b' }}>otra dimensión.</span>
      </div>
      <div style={{ display: 'flex', fontSize: 20, color: '#a0a39a', marginTop: 45 }}>
        Suner Barrera · Ingeniería de Sistemas Informáticos
      </div>
    </div>,
    size,
  );
}
