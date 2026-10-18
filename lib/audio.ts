// Singleton background-music manager for the gift site.
//
// Browsers block audible autoplay before a user gesture, so the page tries
// `startMusic()` on load and — when that is rejected — retries on the
// visitor's first tap or keypress. Volume fades in gently instead of
// starting at full blast.

const TRACK_SRC = "/audio/yeu-em-rat-nhieu.mp3";
const TARGET_VOLUME = 0.6;
const FADE_MS = 2800;

let audio: HTMLAudioElement | null = null;
let fadeTimer: number | null = null;
let unavailable = false;
let backgroundPaused = false;

type Listener = (playing: boolean) => void;
const listeners = new Set<Listener>();

function emit(playing: boolean) {
  listeners.forEach((l) => l(playing));
}

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined" || unavailable) return null;
  if (!audio) {
    audio = new Audio(TRACK_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audio.addEventListener("play", () => emit(true));
    audio.addEventListener("pause", () => emit(false));
    audio.addEventListener("error", () => {
      unavailable = true;
      if (fadeTimer) {
        window.clearInterval(fadeTimer);
        fadeTimer = null;
      }
      emit(false);
    });
  }
  return audio;
}

/** Subscribe to play/pause state. Returns an unsubscribe function. */
export function onMusicStateChange(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** True when the track failed to load (the toggle should hide itself). */
export function isMusicUnavailable(): boolean {
  return unavailable;
}

function fadeTo(target: number, ms: number) {
  const a = getAudio();
  if (!a) return;
  if (fadeTimer) window.clearInterval(fadeTimer);
  const steps = 30;
  const from = a.volume;
  const delta = (target - from) / steps;
  let i = 0;
  fadeTimer = window.setInterval(() => {
    i += 1;
    a.volume = Math.min(Math.max(from + delta * i, 0), 1);
    if (i >= steps && fadeTimer) {
      window.clearInterval(fadeTimer);
      fadeTimer = null;
    }
  }, ms / steps);
}

/** Attempt to start the music. Resolves false when the browser blocks it. */
export async function startMusic(): Promise<boolean> {
  const a = getAudio();
  if (!a) return false;
  if (!a.paused) return true;
  try {
    await a.play();
    fadeTo(TARGET_VOLUME, FADE_MS);
    return true;
  } catch {
    return false;
  }
}

export function stopMusic() {
  const a = getAudio();
  if (!a) return;
  if (fadeTimer) {
    window.clearInterval(fadeTimer);
    fadeTimer = null;
  }
  a.pause();
}

/** Toggle playback. Resolves to the new playing state. */
export async function toggleMusic(): Promise<boolean> {
  const a = getAudio();
  if (!a) return false;
  if (a.paused) return startMusic();
  stopMusic();
  return false;
}

/**
 * Pause politely when the tab goes to the background and resume when it
 * comes back — but only if the music was playing (never override a manual
 * mute from the toggle).
 */
export function onVisibilityChange() {
  const a = getAudio();
  if (!a) return;
  if (document.hidden) {
    if (!a.paused) {
      backgroundPaused = true;
      stopMusic();
    }
  } else if (backgroundPaused) {
    backgroundPaused = false;
    void startMusic();
  }
}
