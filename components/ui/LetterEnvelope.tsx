"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MailOpen, Feather } from "lucide-react";
import {
  LETTER_PARAGRAPHS,
  LETTER_SIGNATURE,
  LETTER_SIGNOFF,
  LETTER_TITLE,
} from "@/content/love-letter";
import { useReducedMotion } from "@/lib/useReducedMotion";

function LetterPaper({ instant }: { instant: boolean }) {
  return (
    <div
      className={`letter-paper w-full max-w-2xl px-7 py-10 sm:px-12 sm:py-14 ${
        instant ? "" : "animate-rise-in"
      }`}
    >
      <div className="mb-6 flex items-center gap-2.5">
        <Feather size={15} className="text-[#8a6f3c]" aria-hidden="true" />
        <p className="eyebrow" style={{ color: "#8a6f3c" }}>
          Thư tay · 20.10
        </p>
      </div>

      <h3 className="serif-display mb-8 text-3xl text-[#1c2542] sm:text-4xl">
        {LETTER_TITLE}
      </h3>

      {LETTER_PARAGRAPHS.map((paragraph, i) => (
        <p
          key={i}
          className={`mb-5 font-serif text-[1.08rem] leading-[1.9] text-[#2a3352] ${
            instant ? "" : "animate-rise-in"
          }`}
          style={instant ? undefined : { animationDelay: `${0.4 + i * 0.3}s` }}
        >
          {paragraph}
        </p>
      ))}

      <div
        className={`mt-10 border-t border-[#24365c]/15 pt-7 ${
          instant ? "" : "animate-rise-in"
        }`}
        style={instant ? undefined : { animationDelay: `${0.4 + LETTER_PARAGRAPHS.length * 0.3}s` }}
      >
        <p className="mb-2 font-serif italic text-[#2a3352]">{LETTER_SIGNOFF}</p>
        <p className="serif-display text-xl text-[#8a6f3c]">{LETTER_SIGNATURE}</p>
      </div>
    </div>
  );
}

export default function LetterEnvelope() {
  const [phase, setPhase] = useState<"sealed" | "opening" | "open">("sealed");
  const [instant, setInstant] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (phase !== "opening" || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setPhase("open") });
      tl.to(".envelope-flap", {
        rotationX: -178,
        duration: 0.85,
        ease: "power2.inOut",
      })
        .to(
          ".envelope-seal",
          { opacity: 0, scale: 0.6, duration: 0.4, ease: "power2.in" },
          0.1
        )
        .to(
          ".envelope-letter-peek",
          { yPercent: -72, duration: 0.7, ease: "power2.out" },
          0.55
        )
        .to(
          ".envelope-inner",
          { opacity: 0, y: 26, scale: 0.97, duration: 0.5, ease: "power2.in" },
          1.2
        );
    }, rootRef);
    return () => ctx.revert();
  }, [phase]);

  const open = (skip: boolean) => {
    if (phase !== "sealed") return;
    if (skip || reduced) {
      setInstant(true);
      setPhase("open");
      return;
    }
    setPhase("opening");
  };

  return (
    <div ref={rootRef} className="envelope-scene flex w-full flex-col items-center">
      {phase !== "open" ? (
        <div className="envelope-inner flex flex-col items-center">
          <div className="envelope-body" role="img" aria-label="Phong bì thư ánh trăng">
            <div className="envelope-letter-peek" aria-hidden="true" />
            <div className="envelope-flap" aria-hidden="true" />
            <div className="envelope-seal" aria-hidden="true">
              ✦
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center gap-4">
            <button className="btn-primary" onClick={() => open(false)}>
              Mở thư <MailOpen size={16} aria-hidden="true" />
            </button>
            <button
              onClick={() => open(true)}
              className="text-sm text-muted transition-colors hover:text-gold"
            >
              Đọc ngay, bỏ qua hiệu ứng →
            </button>
          </div>
        </div>
      ) : (
        <LetterPaper instant={instant} />
      )}
    </div>
  );
}
