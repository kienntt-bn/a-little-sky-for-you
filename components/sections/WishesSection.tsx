"use client";

import { useCallback, useMemo, useState } from "react";
import { WISHES, type Wish } from "@/content/love-letter";
import { mulberry32 } from "@/lib/textures";
import Reveal from "@/components/ui/Reveal";
import StarReveal from "@/components/ui/StarReveal";

export default function WishesSection() {
  const [open, setOpen] = useState<Wish | null>(null);
  const [openedIds, setOpenedIds] = useState<Set<number>>(new Set());

  const openWish = useCallback((wish: Wish) => {
    setOpen(wish);
    setOpenedIds((prev) => new Set(prev).add(wish.id));
  }, []);

  const closeWish = useCallback(() => setOpen(null), []);

  // faint background specks inside the star-map for extra depth
  const specks = useMemo(() => {
    const rand = mulberry32(112233);
    return Array.from({ length: 42 }, (_, i) => ({
      id: i,
      left: `${(rand() * 100).toFixed(1)}%`,
      top: `${(rand() * 100).toFixed(1)}%`,
      size: 1 + rand() * 2,
      delay: `${(rand() * 3).toFixed(2)}s`,
      opacity: 0.2 + rand() * 0.5,
    }));
  }, []);

  return (
    <section
      id="wishes"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 py-28"
    >
      <Reveal className="max-w-2xl text-center">
        <p className="eyebrow mb-6">Chương một · Lời nhắn</p>
        <h2 className="serif-display text-4xl text-ivory sm:text-5xl lg:text-6xl">
          Bốn vì sao, bốn điều sốp muốn gửi em.
        </h2>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-mist">
          Có những điều không cần nói thật lớn, chỉ cần được gửi đi bằng sự chân
          thành.
        </p>
      </Reveal>

      <Reveal delay={150} className="relative mt-4 h-[56vh] min-h-[380px] w-full max-w-4xl">
        <div className="absolute inset-0" aria-hidden="true">
          {specks.map((s) => (
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
              }}
            />
          ))}
        </div>

        {WISHES.map((wish, i) => (
          <button
            key={wish.id}
            className={`wish-star ${openedIds.has(wish.id) ? "wish-star-opened" : ""}`}
            style={{ left: wish.pos.left, top: wish.pos.top }}
            onClick={() => openWish(wish)}
            aria-label={`Mở lời nhắn: ${wish.title}`}
            aria-haspopup="dialog"
          >
            <span className="relative flex items-center justify-center">
              <span
                className="animate-twinkle inline-block"
                style={{ animationDelay: `${i * 0.7}s` }}
              >
                <span className="wish-star-core" />
              </span>
              <span
                className="wish-star-ring"
                style={{ animationDelay: `${i * 0.55}s` }}
                aria-hidden="true"
              />
            </span>
            <span className="wish-star-label">{wish.label}</span>
          </button>
        ))}
      </Reveal>

      <Reveal delay={100}>
        <p className="mt-2 text-sm tracking-wide text-muted" aria-live="polite">
          {openedIds.size === 0
            ? "Chạm vào một vì sao để mở lời nhắn"
            : `Đã mở ${openedIds.size}/4 vì sao`}
        </p>
      </Reveal>

      <StarReveal wish={open} onClose={closeWish} />
    </section>
  );
}
