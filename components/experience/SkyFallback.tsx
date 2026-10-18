"use client";

import { useMemo } from "react";
import { mulberry32 } from "@/lib/textures";

/**
 * Pure-CSS night sky used when WebGL is unavailable.
 * All content and interactions keep working on top of it.
 */
export default function SkyFallback() {
  const stars = useMemo(() => {
    const rand = mulberry32(424242);
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      left: `${(rand() * 100).toFixed(2)}%`,
      top: `${(rand() * 100).toFixed(2)}%`,
      size: 1 + rand() * 2.6,
      delay: `${(rand() * 3.4).toFixed(2)}s`,
      opacity: 0.3 + rand() * 0.7,
      gold: rand() > 0.9,
    }));
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(1100px 700px at 78% 18%, rgba(36,54,92,0.55), transparent 60%), radial-gradient(900px 620px at 12% 82%, rgba(27,42,82,0.5), transparent 60%), linear-gradient(180deg, #0a1124 0%, #080d1b 45%, #060a16 100%)",
      }}
    >
      {stars.map((s) => (
        <span
          key={s.id}
          className="sky-fallback-star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDelay: s.delay,
            background: s.gold ? "#e6cc91" : "#fff",
            boxShadow: s.gold ? "0 0 8px 2px rgba(230,204,145,0.7)" : "none",
          }}
        />
      ))}
      {/* CSS moon */}
      <div
        className="absolute rounded-full"
        style={{
          width: 92,
          height: 92,
          right: "12%",
          top: "14%",
          background: "radial-gradient(circle at 38% 35%, #f6efdc 0%, #e8dcc0 70%, #d9cba6 100%)",
          boxShadow: "0 0 60px 18px rgba(243,233,212,0.22)",
        }}
      />
    </div>
  );
}
