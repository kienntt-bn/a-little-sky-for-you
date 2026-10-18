"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore, SKY_BOOST_EVENT } from "@/lib/scrollStore";
import StarField from "./StarField";
import Nebula from "./Nebula";
import Moon from "./Moon";
import Dust from "./Dust";
import SkyFallback from "./SkyFallback";

/** Drives the camera from scroll progress + pointer parallax. */
function CameraRig() {
  const target = useRef({ x: 0, y: 0, z: 9 });

  useFrame(({ camera }, delta) => {
    const d = Math.min(delta, 0.05);
    const p = scrollStore.progress;
    const t = target.current;
    const tx = scrollStore.reducedMotion ? 0 : scrollStore.pointer.x * 1.4;
    const ty = scrollStore.reducedMotion ? 0 : scrollStore.pointer.y * 0.9 + p * 0.9;
    const tz = 9 - p * 5.4;

    t.x = THREE.MathUtils.damp(t.x, tx, 2.4, d);
    t.y = THREE.MathUtils.damp(t.y, ty, 2.4, d);
    t.z = THREE.MathUtils.damp(t.z, tz, 2.4, d);

    camera.position.set(t.x, t.y, t.z);
    camera.lookAt(t.x * 0.3, t.y * 0.3 - p * 0.5, -24);
  });

  return null;
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      (canvas as HTMLCanvasElement & { getContext(s: string): unknown }).getContext(
        "experimental-webgl"
      )
    );
  } catch {
    return false;
  }
}

const BACKDROP = [
  "radial-gradient(1100px 700px at 78% 18%, rgba(36,54,92,0.5), transparent 60%)",
  "radial-gradient(900px 620px at 12% 82%, rgba(27,42,82,0.45), transparent 60%)",
  "radial-gradient(520px 380px at 82% 20%, rgba(230,204,145,0.10), transparent 65%)",
  "linear-gradient(180deg, #0a1124 0%, #080d1b 45%, #060a16 100%)",
].join(", ");

export default function SkyExperience() {
  // This component only ever mounts on the client (dynamic ssr:false),
  // so reading the DOM during the lazy initializer is safe.
  const [failed] = useState(() => !hasWebGL());

  useEffect(() => {
    if (failed) return;

    scrollStore.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - window.innerHeight;
      scrollStore.progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      scrollStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scrollStore.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const onBoost = () => {
      scrollStore.boost = 1;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener(SKY_BOOST_EVENT, onBoost);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener(SKY_BOOST_EVENT, onBoost);
    };
  }, [failed]);

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      {/* instant static backdrop — visible before WebGL warms up */}
      <div className="absolute inset-0" style={{ background: BACKDROP }} />
      {!failed && (
        <div className="absolute inset-0">
          <Canvas
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
            camera={{ fov: 55, position: [0, 0, 9], near: 0.1, far: 220 }}
          >
            <color attach="background" args={["#080d1b"]} />
            <ambientLight intensity={0.35} color="#aebbd6" />
            {/* key light from the upper-right-front for gentle lunar modeling */}
            <directionalLight position={[28, 10, 8]} intensity={1.35} color="#fff3da" />
            <Suspense fallback={null}>
              <Nebula />
              <StarField />
              <Dust />
              <Moon />
            </Suspense>
            <CameraRig />
          </Canvas>
        </div>
      )}
      {failed && <SkyFallback />}
    </div>
  );
}
