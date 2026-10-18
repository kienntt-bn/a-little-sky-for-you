"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ChevronDown, Sparkles } from "lucide-react";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function HeroSection({ onExplore }: { onExplore: () => void }) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-anim", {
        opacity: 0,
        y: 36,
        duration: 1.35,
        ease: "power3.out",
        stagger: 0.16,
        delay: 0.35,
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  const scrollToWishes = () =>
    document.getElementById("wishes")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="entrance"
      ref={rootRef}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center"
    >
      <p className="hero-anim eyebrow mb-7">20.10 · A little something for you</p>

      <h1 className="hero-anim serif-display max-w-3xl text-6xl text-ivory sm:text-7xl lg:text-[5.4rem]">
        Gửi khách VIP <span className="text-gold text-glow-gold">💎</span>
      </h1>

      <p className="hero-anim mt-7 max-w-xl text-lg leading-relaxed text-mist sm:text-xl">
        Có một bầu trời nhỏ, và vài điều sốp muốn gửi em.
      </p>

      <div className="hero-anim mt-11">
        <button className="btn-primary" onClick={onExplore}>
          Khám phá bầu trời <Sparkles size={16} aria-hidden="true" />
        </button>
      </div>

      <p className="hero-anim mt-7 text-[0.7rem] uppercase tracking-[0.32em] text-muted">
        A little sky, made just for you.
      </p>

      <button
        onClick={scrollToWishes}
        aria-label="Cuộn xuống phần tiếp theo"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 rounded-full p-3 text-mist transition-colors hover:text-gold"
      >
        <ChevronDown size={22} className="animate-scroll-hint" aria-hidden="true" />
      </button>
    </section>
  );
}
