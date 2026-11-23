'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, Preload, useGLTF } from '@react-three/drei';
import { Group, MathUtils } from 'three';
import type { MotionValue } from 'motion/react';
import type { Project } from '@/domain/project';
import { DeviceModel, DEVICE_MODEL_URLS } from './device-model';
import { chapterAt } from '@/presentation/motion/choreography';

type Pose = [x: number, y: number, z: number, rx: number, ry: number, rz: number, scale: number];
const desktopPoses: Pose[][] = [
  [
    [-0.25, -0.25, 0, 0.15, -0.25, -0.09, 1],
    [1.55, -0.05, 0.6, 0.12, -0.25, 0.03, 1.2],
    [-12, 1, -4, 0.6, -1.7, -0.4, 0.55],
    [-14, 2, -5, 0.8, -2, -0.4, 0.4],
  ],
  [
    [1.95, 0.3, 1.9, -0.14, -0.55, 0.24, 0.6],
    [12, 1, -4, 0.3, 1.1, 0.6, 0.6],
    [1.6, 0.02, 0.4, -0.1, -0.4, -0.1, 1],
    [-12, -1, -4, -0.3, -1.5, -0.5, 0.5],
  ],
  [
    [-2.1, -0.28, 2.5, 0.1, 0.35, -0.2, 0.78],
    [-12, -2, -3, -0.5, -1, -0.4, 0.6],
    [12, -1, -4, 0.5, 1.3, 0.5, 0.6],
    [1.65, 0.02, 1.3, -0.07, -0.3, 0.04, 1.35],
  ],
];
const mobilePoses: Pose[][] = [
  [
    [-0.1, 0.6, 0, 0.12, -0.3, -0.12, 0.48],
    [0, -0.75, 0.3, 0.1, -0.2, 0.03, 0.61],
    [-12, 1, -4, 0.6, -1.7, -0.4, 0.4],
    [-12, 2, -5, 0.8, -2, -0.4, 0.4],
  ],
  [
    [0.96, 0.85, 0.9, -0.1, -0.45, 0.2, 0.34],
    [12, 1, -4, 0.3, 1, 0.6, 0.4],
    [0, -0.7, 0.4, -0.1, -0.3, -0.08, 0.68],
    [-12, -1, -4, -0.3, -1.5, -0.5, 0.4],
  ],
  [
    [-0.95, 0.3, 0.9, 0.1, 0.35, -0.18, 0.42],
    [-12, -2, -3, -0.5, -1, -0.4, 0.4],
    [12, -1, -4, 0.5, 1.3, 0.5, 0.4],
    [0, -0.65, 0.6, -0.07, -0.25, 0.03, 0.9],
  ],
];
const stops = [0, 0.28, 0.6, 0.9];

function Rig({
  progress,
  projects,
  reduced,
  paused,
  active,
}: {
  progress: MotionValue<number>;
  projects: readonly Project[];
  reduced: boolean;
  paused: boolean;
  active: boolean;
}) {
  useGLTF(DEVICE_MODEL_URLS);
  const entranceTime = useRef(0);
  const [screensReady, setScreensReady] = useState(reduced);
  const devices = useRef<(Group | null)[]>([]);
  const [selected, setSelected] = useState(() => chapterAt(progress.get()));
  useEffect(() => progress.on('change', (value) => setSelected(chapterAt(value))), [progress]);
  const ring = useRef<Group>(null);
  const hinge = useRef<Group>(null);
  const { size, invalidate } = useThree();
  useEffect(() => progress.on('change', () => invalidate()), [progress, invalidate]);
  // Animate before Html projects its CSS matrices (priority 0), in the same frame.
  useFrame(({ clock, pointer }, delta) => {
    // Measure rendered entrance time, not time spent fetching/compiling assets.
    entranceTime.current += Math.min(delta, 1 / 30);
    if (!screensReady) invalidate();
    if (!screensReady && entranceTime.current >= 0.12) setScreensReady(true);
    const p = progress.get();
    const mobile = size.width < 768;
    let segment = 0;
    while (segment < 2 && p > stops[segment + 1]) segment++;
    const fraction = MathUtils.clamp(
      (p - stops[segment]) / (stops[segment + 1] - stops[segment]),
      0,
      1,
    );
    const t = fraction * fraction * (3 - 2 * fraction);
    const poses = mobile ? mobilePoses : desktopPoses;
    devices.current.forEach((group, i) => {
      if (!group) return;
      const still = chapterAt(p) + 1;
      const a = poses[i][reduced ? still : segment];
      const b = poses[i][reduced ? still : segment + 1];
      const lerp = (axis: number) => MathUtils.lerp(a[axis], b[axis], t);
      const entrance = reduced ? 1 : Math.min(entranceTime.current / 1.6, 1);
      const drift =
        reduced || paused || !active ? 0 : Math.sin(clock.elapsedTime * 0.65 + i) * 0.045;
      group.position.set(lerp(0), lerp(1) + drift - (1 - entrance) * 0.7, lerp(2));
      const follow = reduced || paused || mobile ? 0 : pointer.x * 0.075;
      group.rotation.set(lerp(3), lerp(4) + follow, lerp(5));
      group.scale.setScalar(lerp(6) * (0.9 + entrance * 0.1));
    });
    if (hinge.current)
      hinge.current.rotation.x = reduced
        ? 0
        : Math.pow(1 - Math.min(entranceTime.current / 1.8, 1), 3) * 1.25;
    if (ring.current) {
      ring.current.rotation.set(
        0.3 + (reduced ? 0 : p * 1.6),
        -0.55 + (reduced ? 0 : p * 2.2),
        -0.3 + (reduced || paused ? 0 : clock.elapsedTime * 0.035),
      );
      ring.current.scale.setScalar(mobile ? 0.48 : 1);
      ring.current.position.y = mobile ? 0.55 : 0;
      ring.current.position.z = -5.2 - p * 1.5;
    }
  }, -1);
  return (
    <>
      <group ref={ring} position={[0, 0, -5.2]}>
        <mesh>
          <torusGeometry args={[3.15, 0.055, 16, 160]} />
          <meshPhysicalMaterial color="#b9bbb9" metalness={1} roughness={0.18} clearcoat={1} />
        </mesh>
        <mesh rotation={[0.15, 0.15, 0.3]}>
          <torusGeometry args={[3.4, 0.012, 10, 160]} />
          <meshStandardMaterial
            color="#dbff7a"
            emissive="#829646"
            emissiveIntensity={0.25}
            metalness={0.75}
            roughness={0.3}
          />
        </mesh>
      </group>
      <Preload all />
      {projects.slice(0, 3).map((project, i) => (
        <group
          key={project.slug}
          ref={(node) => {
            devices.current[i] = node;
          }}
        >
          <DeviceModel
            device={project.device}
            url={project.url ?? ''}
            title={project.name}
            interactive={active && selected === i}
            screensReady={screensReady}
            hinge={project.device === 'laptop' ? hinge : undefined}
          />
        </group>
      ))}
    </>
  );
}

export default function CinematicScene({
  progress,
  projects,
  reduced,
  paused,
  active,
}: {
  progress: MotionValue<number>;
  projects: readonly Project[];
  reduced: boolean;
  paused: boolean;
  active: boolean;
}) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [fallbackIndex, setFallbackIndex] = useState(() => Math.max(0, chapterAt(progress.get())));
  useEffect(
    () => progress.on('change', (value) => setFallbackIndex(Math.max(0, chapterAt(value)))),
    [progress],
  );
  const fallbackProject = projects[fallbackIndex] ?? projects[0];
  useEffect(() => {
    const gl = document.createElement('canvas').getContext('webgl2');
    setSupported(Boolean(gl));
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }, []);
  if (supported === false)
    return (
      <div className="cinema-fallback">
        <iframe
          src={fallbackProject.url}
          title={`Sitio real de ${fallbackProject.name}`}
          style={{ width: '100%', height: '100%', border: 0 }}
        />
      </div>
    );
  if (supported === null)
    return (
      <div className="cinema-loading">
        <span />
        Preparando proyectos
      </div>
    );
  return (
    <Canvas
      camera={{ position: [0, 0.55, 10.5], fov: 36, near: 0.1, far: 60 }}
      dpr={[1.5, 2]}
      frameloop={reduced || paused || !active ? 'demand' : 'always'}
      gl={{ antialias: true, alpha: true }}
      aria-label="Escena tridimensional de los proyectos de Suner Barrera"
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[0, 5, 5]} intensity={1.1} />
      <directionalLight position={[-12, 2, 3]} intensity={0.65} color="#e5e8de" />
      <Suspense fallback={null}>
        <Environment resolution={128} frames={1}>
          <Lightformer
            position={[0, 5, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[10, 5, 1]}
            intensity={5}
          />
          <Lightformer
            position={[-12, 0, 3]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[2, 8, 1]}
            intensity={4}
          />
          <Lightformer
            position={[12, 1, 2]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[2, 8, 1]}
            intensity={3}
            color="#d3edab"
          />
        </Environment>
        <Rig
          progress={progress}
          projects={projects}
          reduced={reduced}
          paused={paused}
          active={active}
        />
      </Suspense>
    </Canvas>
  );
}
