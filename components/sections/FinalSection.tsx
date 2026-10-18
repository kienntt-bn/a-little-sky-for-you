"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { RotateCcw, Sparkle } from "lucide-react";
import { FINAL_MESSAGE, FINAL_SIGNOFFS } from "@/content/love-letter";
import Reveal from "@/components/ui/Reveal";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface FinalSectionProps {
  onRestart: () => void;
}

export default function FinalSection({ onRestart }: FinalSectionProps) {
  const [revealed, setRevealed] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (!revealed || reduced || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".final-star-core",
        { scale: 0.5, filter: "brightness(1)" },
        {
          scale: 1.45,
          filter: "brightness(2)",
          duration: 0.9,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        }
      );
      gsap.fromTo(
        ".final-burst",
        { scale: 0.4, opacity: 0.9 },
        { scale: 2.8, opacity: 0, duration: 1.7, ease: "power2.out" }
      );
      gsap.from(".final-message > *", {
        opacity: 0,
        y: 24,
        duration: 1,
        stagger: 0.18,
        ease: "power3.out",
        delay: 0.55,
      });
    }, rootRef);
    return () => ctx.revert();
  }, [revealed, reduced]);

  return (
    <section
      id="final"
      ref={rootRef}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 py-28 text-center"
    >
      <Reveal className="max-w-2xl">
        <p className="eyebrow mb-6">Chương cuối · Vì sao bí mật</p>
        <h2 className="serif-display text-4xl text-ivory sm:text-5xl lg:text-6xl">
          Trước khi rời bầu trời này...
        </h2>
      </Reveal>

      <div className="mt-14 flex flex-col items-center">
        <div className="relative mb-12 flex h-28 w-28 items-center justify-center" aria-hidden="true">
          <span className="final-burst absolute inset-0 rounded-full border border-gold/60" />
          <span
            className={`final-star-core block rounded-full transition-all duration-1000 ${
              revealed ? "h-10 w-10" : "h-4 w-4 animate-twinkle"
            }`}
            style={{
              background:
                "radial-gradient(circle at 38% 35%, #fffdf4 0%, #e6cc91 55%, #b98d3e 100%)",
              boxShadow: revealed
                ? "0 0 36px 10px rgba(230,204,145,0.8), 0 0 95px 28px rgba(230,204,145,0.3)"
                : "0 0 12px 3px rgba(230,204,145,0.4)",
            }}
          />
        </div>

        {!revealed ? (
          <Reveal delay={100}>
            <button className="btn-primary" onClick={() => setRevealed(true)}>
              Còn một điều nữa <Sparkle size={16} aria-hidden="true" />
            </button>
          </Reveal>
        ) : (
          <div className="final-message flex max-w-xl flex-col items-center">
            <p className="serif-display text-2xl italic leading-snug text-ivory sm:text-[1.75rem]">
              “{FINAL_MESSAGE}”
            </p>
            <p className="mt-8 text-lg font-medium tracking-wide text-gold text-glow-gold">
              {FINAL_SIGNOFFS[0]}
            </p>
            <p className="mt-2.5 text-sm italic text-muted">{FINAL_SIGNOFFS[1]}</p>
            <button onClick={onRestart} className="btn-ghost mt-14">
              <RotateCcw size={15} aria-hidden="true" /> Xem lại từ đầu
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
