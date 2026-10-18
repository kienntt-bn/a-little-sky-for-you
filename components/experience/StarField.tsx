"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scrollStore } from "@/lib/scrollStore";
import { mulberry32 } from "@/lib/textures";

const STAR_COLORS = ["#f3e9d4", "#aebbd6", "#ffffff", "#7f8dab"];

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute vec3 aColor;
  attribute float aNear;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uTwinkleAmp;
  uniform float uBoost;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float tw = 1.0 - uTwinkleAmp * 0.45 + uTwinkleAmp * 0.45 * sin(uTime * aSpeed + aPhase);
    vColor = aColor;
    vAlpha = tw + uBoost * aNear * 1.6;
    // aSize = desired screen px at the 40-unit reference distance
    float ps = aSize * uPixelRatio * (40.0 / -mv.z);
    gl_PointSize = min(ps, 30.0 * uPixelRatio);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float a = smoothstep(0.5, 0.1, d);
    a = pow(a, 2.0);
    gl_FragColor = vec4(vColor * vAlpha, a * 0.95);
  }
`;

export default function StarField() {
  const count = useMemo(() => {
    if (typeof window === "undefined") return 1600;
    const w = window.innerWidth;
    return w < 640 ? 950 : w < 1280 ? 1700 : 2500;
  }, []);

  const { geometry, material } = useMemo(() => {
    const rand = mulberry32(20261020);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const nears = new Float32Array(count);
    const tmp = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const layer = rand();
      let x: number, y: number, z: number, size: number;
      if (layer < 0.62) {
        // far field — tiny, dim, wide spread
        x = (rand() * 2 - 1) * 58;
        y = (rand() * 2 - 1) * 34;
        z = -25 - rand() * 45;
        size = 2.2 + rand() * 2.3;
      } else if (layer < 0.9) {
        // mid field
        x = (rand() * 2 - 1) * 40;
        y = (rand() * 2 - 1) * 24;
        z = -8 - rand() * 17;
        size = 3.5 + rand() * 2.5;
      } else {
        // near field — brighter, reacts to the CTA boost
        x = (rand() * 2 - 1) * 22;
        y = (rand() * 2 - 1) * 14;
        z = -8 + rand() * 9.5;
        size = 6 + rand() * 5;
        nears[i] = 1;
      }
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      sizes[i] = size;
      phases[i] = rand() * Math.PI * 2;
      speeds[i] = 0.35 + rand() * 1.1;

      const hex =
        rand() > 0.93 ? "#e6cc91" : STAR_COLORS[Math.floor(rand() * STAR_COLORS.length)];
      tmp.set(hex);
      const dim = 0.55 + rand() * 0.45;
      colors[i * 3] = tmp.r * dim;
      colors[i * 3 + 1] = tmp.g * dim;
      colors[i * 3 + 2] = tmp.b * dim;
    }

    // a handful of hero stars — larger, warm, slow twinkle
    for (let h = 0; h < 14; h++) {
      const i = Math.floor(rand() * count);
      sizes[i] = 13 + rand() * 7;
      tmp.set(rand() > 0.45 ? "#e6cc91" : "#f3e9d4");
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
      speeds[i] = 0.5 + rand() * 0.6;
      if (positions[i * 3 + 2] > -12) nears[i] = 1;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aNear", new THREE.BufferAttribute(nears, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
        uTwinkleAmp: { value: 1 },
        uBoost: { value: 0 },
      },
    });

    return { geometry: geo, material: mat };
  }, [count]);

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
    const d = Math.min(delta, 0.05);
    time.current += d;
    const mat = live.current.material;
    if (!mat) return;
    mat.uniforms.uTime.value = time.current;
    mat.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    mat.uniforms.uTwinkleAmp.value = scrollStore.reducedMotion ? 0.12 : 1;
    scrollStore.boost = Math.max(0, scrollStore.boost - d * 0.9);
    mat.uniforms.uBoost.value = scrollStore.boost;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
