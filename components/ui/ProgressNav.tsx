"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "@/content/love-letter";

export default function ProgressNav() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-42% 0px -42% 0px" }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Điều hướng các phân đoạn"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3.5 md:flex"
    >
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() =>
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
          }
          aria-label={`Đi tới: ${label}`}
          className="group relative flex items-center justify-center p-1.5"
        >
          <span
            className={`block h-2 w-2 rounded-full transition-all duration-300 ${
              active === id
                ? "scale-150 bg-gold shadow-[0_0_12px_rgba(230,204,145,0.85)]"
                : "bg-mist/30 group-hover:bg-mist/70"
            }`}
          />
          <span className="pointer-events-none absolute right-8 whitespace-nowrap rounded-lg border border-white/5 bg-deepspace/95 px-3 py-1.5 text-xs tracking-wide text-mist opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100">
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
