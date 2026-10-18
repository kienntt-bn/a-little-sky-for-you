"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scrollStore } from "@/lib/scrollStore";
import { makeRadialTexture } from "@/lib/textures";

interface Blob {
  pos: [number, number, number];
  size: [number, number];
  opacity: number;
  inner: string;
  mid: string;
  spin: number;
}

const BLOBS: Blob[] = [
  {
    pos: [-22, 10, -62],
    size: [76, 48],
    opacity: 0.5,
    inner: "rgba(54,78,132,0.55)",
    mid: "rgba(36,54,92,0.26)",
    spin: 0.02,
  },
  {
    pos: [24, -12, -66],
    size: [68, 44],
    opacity: 0.42,
    inner: "rgba(44,66,116,0.5)",
    mid: "rgba(30,46,86,0.24)",
    spin: -0.016,
  },
  {
    // faint warm wisp — the only gold in the far background
    pos: [4, 8, -70],
    size: [92, 58],
    opacity: 0.3,
    inner: "rgba(230,204,145,0.15)",
    mid: "rgba(230,204,145,0.06)",
    spin: 0.012,
  },
];

function NebulaBlob({ blob }: { blob: Blob }) {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useMemo(
    () => makeRadialTexture([[0, blob.inner], [0.45, blob.mid]]),
    [blob.inner, blob.mid]
  );

  useFrame((_, delta) => {
    if (scrollStore.reducedMotion || !ref.current) return;
    ref.current.rotation.z += delta * blob.spin;
  });

  return (
    <mesh ref={ref} position={blob.pos}>
      <planeGeometry args={blob.size} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={blob.opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function Nebula() {
  return (
    <group>
      {BLOBS.map((blob, i) => (
        <NebulaBlob key={i} blob={blob} />
      ))}
    </group>
  );
}
