"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scrollStore } from "@/lib/scrollStore";
import { mulberry32 } from "@/lib/textures";

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * aSpeed + aPhase) * 0.7;
    p.y += cos(uTime * aSpeed * 0.6 + aPhase * 1.7) * 0.5;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float tw = 0.5 + 0.5 * sin(uTime * aSpeed * 1.3 + aPhase);
    vAlpha = tw;
    float ps = aSize * uPixelRatio * (150.0 / -mv.z);
    gl_PointSize = min(ps, 16.0 * uPixelRatio);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float a = smoothstep(0.5, 0.08, d);
    gl_FragColor = vec4(vec3(0.95, 0.88, 0.72) * vAlpha, a * 0.3);
  }
`;

export default function Dust() {
  const count = useMemo(() => {
    if (typeof window === "undefined") return 70;
    return window.innerWidth < 640 ? 45 : 90;
  }, []);

  const { geometry, material } = useMemo(() => {
    const rand = mulberry32(987654);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() * 2 - 1) * 13;
      positions[i * 3 + 1] = (rand() * 2 - 1) * 8;
      positions[i * 3 + 2] = 2.2 + rand() * 4.5;
      sizes[i] = 1.6 + rand() * 2.4;
      phases[i] = rand() * Math.PI * 2;
      speeds[i] = 0.15 + rand() * 0.4;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
      },
    });

    return { geometry: geo, material: mat };
  }, [count ]);

  const time = useRef(0);
  // Mirror into a ref inside an effect: mutating uniforms from the render
  // loop is the idiomatic R3F pattern and keeps the memoised value
  // immutable as far as React is concerned.
  const live = useRef<{ material: THREE.ShaderMaterial | null }>({ material: null });
  useEffect(() => {
    live.current.material = material;
  }, [material]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state, delta) => {
    if (scrollStore.reducedMotion) return;
    const d = Math.min(delta, 0.05);
    time.current += d;
    const mat = live.current.material;
    if (!mat) return;
    mat.uniforms.uTime.value = time.current;
    mat.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
