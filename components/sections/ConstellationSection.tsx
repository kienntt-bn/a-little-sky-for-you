"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Check } from "lucide-react";
import {
  CONSTELLATION_POINTS,
  CONSTELLATION_SEGMENTS,
} from "@/content/love-letter";
import { mulberry32 } from "@/lib/textures";
import Reveal from "@/components/ui/Reveal";

const VIEW_W = 600;
const VIEW_H = 420;
const PATH_D = "M110,300 L245,175 L385,265 L505,130 Z";

export default function ConstellationSection() {
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const lineRefs = useRef<Array<SVGLineElement | null>>([]);
  const prevVisited = useRef<Set<string>>(new Set());

  const select = (id: string) => {
    setSelectedId(id);
    setVisited((prev) => new Set(prev).add(id));
  };

  // draw newly completed segments with a stroke animation
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const prev = prevVisited.current;
    CONSTELLATION_SEGMENTS.forEach(([a, b], i) => {
      const pa = CONSTELLATION_POINTS[a];
      const pb = CONSTELLATION_POINTS[b];
      const nowDone = visited.has(pa.id) && visited.has(pb.id);
      const wasDone = prev.has(pa.id) && prev.has(pb.id);
      const line = lineRefs.current[i];
      if (!line) return;
      if (nowDone && !wasDone) {
        if (reduced) {
          gsap.set(line, { strokeDashoffset: 0 });
        } else {
          gsap.fromTo(
            line,
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }
          );
        }
      } else if (!nowDone) {
        gsap.set(line, { strokeDashoffset: 1 });
      }
    });
    prevVisited.current = new Set(visited);
  }, [visited]);

  const bgStars = useMemo(() => {
    const rand = mulberry32(777001);
    return Array.from({ length: 26 }, (_, i) => ({
      id: i,
      cx: rand() * VIEW_W,
      cy: rand() * VIEW_H,
      r: 0.8 + rand() * 1.6,
      delay: `${(rand() * 3.2).toFixed(2)}s`,
      opacity: 0.25 + rand() * 0.55,
    }));
  }, []);

  const selected = CONSTELLATION_POINTS.find((p) => p.id === selectedId) ?? null;
  const complete = visited.size === CONSTELLATION_POINTS.length;

  return (
    <section
      id="constellation"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 py-28"
    >
      <Reveal className="max-w-2xl text-center">
        <p className="eyebrow mb-6">Chương hai · Chòm sao</p>
        <h2 className="serif-display text-4xl text-ivory sm:text-5xl lg:text-6xl">
          Một chòm sao mang tên khách VIP.
        </h2>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-mist">
          Nếu ghép những điều tốt đẹp lại với nhau, có lẽ chúng ta sẽ có một bầu
          trời thật đẹp.
        </p>
      </Reveal>

      <Reveal delay={150} className="mt-10 w-full max-w-2xl">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-auto w-full"
          role="group"
          aria-label="Chòm sao tương tác gồm bốn điểm: Bình yên, Sức khỏe, Tự tin, Niềm vui"
        >
          {/* background specks */}
          {bgStars.map((s) => (
            <circle
              key={s.id}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="#aebbd6"
              opacity={s.opacity}
              className="animate-twinkle"
              style={{
                animationDelay: s.delay,
                transformBox: "fill-box",
                transformOrigin: "center",
              }}
            />
          ))}

          {/* travelling lights along the constellation path */}
          {[0, -2.7, -5.3].map((begin, i) => (
            <circle key={i} r={2.4} fill="#e6cc91" opacity={0.85}>
              <animateMotion dur="8s" begin={`${begin}s`} repeatCount="indefinite" path={PATH_D} />
            </circle>
          ))}

          {/* segments */}
          {CONSTELLATION_SEGMENTS.map(([a, b], i) => {
            const pa = CONSTELLATION_POINTS[a];
            const pb = CONSTELLATION_POINTS[b];
            return (
              <line
                key={i}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                pathLength={1}
                stroke="#e6cc91"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeDasharray="1"
                strokeDashoffset={1}
                opacity={0.75}
              />
            );
          })}

          {/* main points */}
          {CONSTELLATION_POINTS.map((p) => {
            const isVisited = visited.has(p.id);
            const isSelected = selectedId === p.id;
            return (
              <g key={p.id}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isVisited ? 17 : 11}
                  fill="none"
                  stroke="#e6cc91"
                  strokeOpacity={isVisited ? 0.55 : 0.2}
                  strokeWidth={1}
                />
                <circle
                  className="constellation-point"
                  cx={p.x}
                  cy={p.y}
                  r={isVisited ? 7 : 5}
                  fill={isVisited ? "#e6cc91" : "#aebbd6"}
                  tabIndex={0}
                  role="button"
                  aria-label={`${p.name} — chạm để xem lời chúc`}
                  onClick={() => select(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      select(p.id);
                    }
                  }}
                  style={
                    isVisited
                      ? { filter: "drop-shadow(0 0 9px rgba(230,204,145,0.95))" }
                      : undefined
                  }
                />
                <text
                  x={p.x}
                  y={p.y + 30}
                  textAnchor="middle"
                  fill={isSelected ? "#e6cc91" : "#7f8dab"}
                  fontSize={13}
                  letterSpacing={2.5}
                  style={{ textTransform: "uppercase" }}
                >
                  {p.name}
                </text>
              </g>
            );
          })}
        </svg>
      </Reveal>

      <div className="mt-6 min-h-[7.5rem] w-full max-w-xl text-center">
        {selected ? (
          <div key={selected.id} className="animate-rise-in">
            <p className="eyebrow mb-3">{selected.name}</p>
            <p className="text-lg leading-relaxed text-ivory/90">{selected.wish}</p>
          </div>
        ) : (
          <p className="text-muted">
            Chạm vào từng điểm sao để khám phá bốn điều tốt đẹp.
          </p>
        )}
      </div>

      <p className="mt-2 text-sm tracking-wide text-muted" aria-live="polite">
        Đã khám phá {visited.size}/{CONSTELLATION_POINTS.length} điểm sao
      </p>

      {complete && (
        <div className="animate-rise-in mt-8 flex max-w-xl flex-col items-center gap-3 text-center">
          <p className="flex items-center gap-2 text-sm font-medium tracking-wide text-gold">
            <Check size={15} aria-hidden="true" /> Chòm sao đã hoàn thiện
          </p>
          <p className="serif-display text-2xl italic leading-snug text-ivory/95 sm:text-[1.7rem]">
            “Mong những điều tốt đẹp ấy sẽ luôn tìm được đường đến với em.”
          </p>
        </div>
      )}
    </section>
  );
}
