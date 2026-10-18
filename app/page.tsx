"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { triggerSkyBoost } from "@/lib/scrollStore";
import ProgressNav from "@/components/ui/ProgressNav";
import HeroSection from "@/components/sections/HeroSection";
import WishesSection from "@/components/sections/WishesSection";
import ConstellationSection from "@/components/sections/ConstellationSection";
import LetterSection from "@/components/sections/LetterSection";
import FinalSection from "@/components/sections/FinalSection";

const SkyExperience = dynamic(() => import("@/components/experience/SkyExperience"), {
  ssr: false,
});

export default function Home() {
  const [resetKey, setResetKey] = useState(0);

  const explore = useCallback(() => {
    // nearby stars flare up, then glide into the wishes
    triggerSkyBoost();
    document.getElementById("wishes")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const restart = useCallback(() => {
    setResetKey((k) => k + 1);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }, []);

  return (
    <div className="relative min-h-dvh bg-midnight font-sans text-ivory">
      <SkyExperience />
      <ProgressNav />
      <main className="relative z-10">
        <HeroSection onExplore={explore} />
        {/* key remount = a fresh journey when the user restarts */}
        <WishesSection key={`wishes-${resetKey}`} />
        <ConstellationSection key={`constellation-${resetKey}`} />
        <LetterSection key={`letter-${resetKey}`} />
        <FinalSection key={`final-${resetKey}`} onRestart={restart} />
      </main>
      <footer className="relative z-10 flex flex-col items-center gap-2.5 px-6 pb-12 pt-6 text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.32em] text-muted">
          A little sky, made just for you ✦
        </p>
        <p className="text-xs text-muted/70">20.10 · Gửi khách VIP 💎</p>
      </footer>
    </div>
  );
}
