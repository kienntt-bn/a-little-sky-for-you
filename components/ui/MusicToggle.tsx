"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isMusicUnavailable, onMusicStateChange, toggleMusic } from "@/lib/audio";

/**
 * Floating music toggle (bottom-left). Hides itself when the track
 * cannot be loaded, so it never shows a dead control.
 */
export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(
    () =>
      onMusicStateChange((p) => {
        setPlaying(p);
        if (isMusicUnavailable()) setHidden(true);
      }),
    []
  );

  if (hidden) return null;

  return (
    <button
      type="button"
      onClick={() => void toggleMusic()}
      aria-label={playing ? "Tắt nhạc nền" : "Bật nhạc nền"}
      title={playing ? "Tắt nhạc nền" : "Bật nhạc nền"}
      className={`fixed bottom-5 left-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ${
        playing
          ? "border-gold/50 bg-midnight/60 text-gold shadow-[0_0_20px_rgba(230,204,145,0.28)]"
          : "border-mist/25 bg-midnight/60 text-mist/70 hover:border-gold/40 hover:text-gold"
      }`}
    >
      {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}
