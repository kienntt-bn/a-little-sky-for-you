/**
 * Tiny mutable store shared between the DOM scroll listeners and the
 * React Three Fiber render loop. Kept outside React state on purpose:
 * it changes every frame / scroll tick and must not trigger re-renders.
 */
export const scrollStore = {
  /** 0 → top of page, 1 → bottom of page */
  progress: 0,
  /** normalized pointer position, -1..1 (x right, y up) */
  pointer: { x: 0, y: 0 },
  /** 1 right after the hero CTA is pressed, decays back to 0 */
  boost: 0,
  reducedMotion: false,
};

export const SKY_BOOST_EVENT = "sky:boost";

export function triggerSkyBoost() {
  scrollStore.boost = 1;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SKY_BOOST_EVENT));
  }
}
