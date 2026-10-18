"use client";

import Reveal from "@/components/ui/Reveal";
import LetterEnvelope from "@/components/ui/LetterEnvelope";

export default function LetterSection() {
  return (
    <section
      id="letter"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 py-28"
    >
      <Reveal className="mb-14 max-w-2xl text-center">
        <p className="eyebrow mb-6">Chương ba · Bức thư</p>
        <h2 className="serif-display text-4xl text-ivory sm:text-5xl lg:text-6xl">
          Một lời nhắn dành riêng cho em.
        </h2>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-mist">
          Giữa bầu trời đầy sao, có một điều sốp muốn nói thật chậm.
        </p>
      </Reveal>

      <Reveal delay={120} className="flex w-full justify-center">
        <LetterEnvelope />
      </Reveal>
    </section>
  );
}
