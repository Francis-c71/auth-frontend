export const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

/** A duration that follows the stage speed multiplier (`--lab-speed`, default 1). */
export const dur = (ms: number) => `calc(${ms}ms / var(--lab-speed, 1))`;

/** CSS transition for one property, speed-aware. */
export const transition = (property: string, ms: number) => `${property} ${dur(ms)} ${EASE}`;
