'use client';

import { useEffect, useMemo, useState, type RefObject } from 'react';
import { Html, useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Group, Mesh, MeshStandardMaterial, Shape, ShapeGeometry } from 'three';
import type { Device } from '@/domain/project';

export const DEVICE_MODEL_URLS = ['laptop-lid', 'laptop-base', 'tablet', 'phone'].map(
  (name) => `/models/macbook/${name}.glb?v=1`,
);

const displays = {
  laptop: {
    width: 3.453530908,
    height: 1.942611136,
    pixels: 1440,
    radius: 0.026,
    z: -0.034,
    y: 0.075,
  },
  tablet: { width: 2.41, height: 3.16, pixels: 820, radius: 0.085, z: 0.035, y: 0 },
  phone: { width: 1.07, height: 2.31, pixels: 390, radius: 0.095, z: 0.042, y: 0 },
} as const;

// Start all requests together instead of serial Suspense retries.
if (typeof window !== 'undefined') {
  for (const name of ['laptop-lid', 'laptop-base', 'tablet', 'phone']) {
    useGLTF.preload(`/models/macbook/${name}.glb?v=1`);
  }
}

function ModelPart({ name }: { name: string }) {
  const { scene } = useGLTF(`/models/macbook/${name}.glb?v=1`);
  const gl = useThree((state) => state.gl);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        if (material instanceof MeshStandardMaterial && material.map) {
          material.map.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
          material.map.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [scene, gl]);
  return <primitive object={model} />;
}

function LiveScreen({
  device,
  url,
  title,
  interactive,
  ready,
}: {
  device: Device;
  url: string;
  title: string;
  interactive: boolean;
  ready: boolean;
}) {
  const gl = useThree((state) => state.gl);
  const portal = useMemo(() => ({ current: gl.domElement.parentElement! }), [gl]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!ready) return;
    // Begin after the first prepared frames; keep requests close together.
    const delay = device === 'laptop' ? 0 : device === 'tablet' ? 120 : 240;
    const timer = window.setTimeout(() => setLoaded(true), delay);
    return () => window.clearTimeout(timer);
  }, [ready, device]);
  const display = displays[device];
  const pixelHeight = (display.pixels * display.height) / display.width;
  const geometry = useMemo(() => {
    const { width: w, height: h, radius: r } = display;
    const s = new Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return new ShapeGeometry(s, 12);
  }, [display]);
  return (
    <Html
      portal={portal}
      wrapperClass="device-screen-projection"
      transform
      occlude="blending"
      geometry={<primitive object={geometry} attach="geometry" />}
      distanceFactor={(400 * display.width) / display.pixels}
      position={[0, display.y, display.z]}
      zIndexRange={[16777271, 0]}
      pointerEvents={interactive ? 'auto' : 'none'}
      style={{ width: display.pixels, height: pixelHeight, backfaceVisibility: 'hidden' }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'clip',
          contain: 'paint',
          isolation: 'isolate',
          borderRadius: (display.radius / display.width) * display.pixels,
          background: '#101110',
        }}
      >
        {loaded && (
          <iframe
            src={url}
            title={`Sitio real de ${title}`}
            tabIndex={interactive ? 0 : -1}
            aria-hidden={!interactive}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{
              display: 'block',
              // Keep the native desktop gutter outside the mobile display crop.
              // The site remains live and receives normal wheel/touch scrolling.
              width: device === 'laptop' ? '100%' : 'calc(100% + 8px)',
              height: '100%',
              border: 0,
              background: '#101110',
              pointerEvents: interactive ? 'auto' : 'none',
            }}
          />
        )}
      </div>
    </Html>
  );
}

export function DeviceModel({
  device,
  url,
  title,
  interactive,
  hinge,
  screensReady,
}: {
  device: Device;
  url: string;
  title: string;
  interactive: boolean;
  hinge?: RefObject<Group | null>;
  screensReady: boolean;
}) {
  const laptop = device === 'laptop';
  // Preserve the original hinge pivot and all parent animation transforms.
  return (
    <group>
      <group ref={hinge} position={[0, laptop ? -1.125 : 0, 0]}>
        <group position={[0, laptop ? 1.125 : 0, 0]}>
          <ModelPart name={laptop ? 'laptop-lid' : device} />
          <LiveScreen
            device={device}
            url={url}
            title={title}
            interactive={interactive}
            ready={screensReady}
          />
        </group>
      </group>
      {laptop && <ModelPart name="laptop-base" />}
    </group>
  );
}
