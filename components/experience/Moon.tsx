"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scrollStore } from "@/lib/scrollStore";
import { makeRadialTexture } from "@/lib/textures";

const BASE_Y = 7.5;

export default function Moon() {
  const group = useRef<THREE.Group>(null);
  const glowTexture = useMemo(
    () =>
      makeRadialTexture([
        [0, "rgba(243,233,212,0.85)"],
        [0.25, "rgba(243,233,212,0.32)"],
        [0.6, "rgba(230,204,145,0.12)"],
      ]),
    []
  );

  useFrame(() => {
    if (scrollStore.reducedMotion || !group.current) return;
    group.current.position.y = BASE_Y + Math.sin(performance.now() * 0.00018) * 0.35;
  });

  return (
    <group ref={group} position={[12.5, BASE_Y, -36]}>
      <mesh>
        <sphereGeometry args={[2.3, 48, 48]} />
        <meshStandardMaterial color="#ece2c9" roughness={0.95} metalness={0} />
      </mesh>
      {/* thin halo */}
      <sprite scale={[8.5, 8.5, 1]}>
        <spriteMaterial
          map={glowTexture}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}
