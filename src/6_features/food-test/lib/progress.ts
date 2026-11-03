export interface Progress {
  /** The step playing now, or -1 before the first step and after the last. */
  currentIndex: number;
  /** How many steps have finished. Their observations are shown. */
  completed: number;
  done: boolean;
}

/** Everything the page shows is a function of the playhead time. */
export function progressAt(cues: number[], time: number, duration: number): Progress {
  const count = cues.length;
  if (duration > 0 && time >= duration - 0.05) return { currentIndex: -1, completed: count, done: true };
  if (time <= 0) return { currentIndex: -1, completed: 0, done: false };

  let currentIndex = -1;
  for (let i = 0; i < count; i++) if (time >= cues[i]) currentIndex = i;
  return { currentIndex, completed: Math.max(currentIndex, 0), done: false };
}