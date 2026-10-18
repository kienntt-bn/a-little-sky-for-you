"use client";

import { useEffect, useRef } from "react";
import { X, Sparkles } from "lucide-react";
import type { Wish } from "@/content/love-letter";

interface StarRevealProps {
  wish: Wish | null;
  onClose: () => void;
}

/** Floating note panel that appears when a wish-star is opened. */
export default function StarReveal({ wish, onClose }: StarRevealProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!wish) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [wish, onClose]);

  if (!wish) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wish-title"
    >
      <button
        aria-label="Đóng lời nhắn"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#04070f]/70 backdrop-blur-sm"
      />
      <div className="animate-rise-in relative max-h-[82dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-gold/25 bg-deepspace/95 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.65),0_0_60px_rgba(230,204,145,0.08)] sm:p-9">
        <div
          className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(230,204,145,0.28) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-4 top-4 rounded-full p-2 text-mist transition-colors hover:bg-white/5 hover:text-gold"
        >
          <X size={18} />
        </button>

        <div className="mb-4 flex items-center gap-2.5">
          <Sparkles size={15} className="text-gold" aria-hidden="true" />
          <p className="eyebrow">Vì sao {wish.id} / 4</p>
        </div>

        <h3 id="wish-title" className="serif-display mb-5 text-3xl text-gold text-glow-gold">
          {wish.title}
        </h3>

        <p className="text-[1.02rem] leading-[1.85] text-ivory/90">{wish.body}</p>

        <div className="mt-7 flex justify-center">
          <button onClick={onClose} className="btn-ghost text-sm">
            Ngắm sao khác
          </button>
        </div>
      </div>
    </div>
  );
}
