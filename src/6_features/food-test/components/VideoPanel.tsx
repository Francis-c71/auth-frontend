import { RATES, type Playback } from '../hooks/usePlayback';
import type { Recording } from '../types';

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

const button =
  'border border-outline px-3 py-1.5 text-sm font-medium text-foreground hover:bg-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline';

/** The real video when `recording.src` exists. Otherwise a preview player on a timer. */
export function VideoPanel({ recording, playback }: { recording: Recording; playback: Playback }) {
  const { videoRef, time, length, playing, rate, setRate, toggle, seek } = playback;

  if (recording.src) {
    return (
      <video
        ref={videoRef}
        src={recording.src}
        poster={recording.poster}
        controls
        playsInline
        preload="metadata"
        className="block aspect-video w-full border border-border bg-black"
      />
    );
  }

  const ended = time >= length - 0.05;
  const nextRate = RATES[(RATES.indexOf(rate) + 1) % RATES.length];

  return (
    <div className="flex aspect-video flex-col border border-border bg-background">
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-base font-semibold text-foreground">Video coming soon</p>
        <p className="max-w-sm text-sm leading-relaxed text-muted">
          This is a preview. It plays the procedure and observations on a timer, exactly as the video will.
        </p>
      </div>
      <div className="flex items-center gap-3 border-t border-border px-3 py-2">
        <button type="button" onClick={toggle} className={`${button} w-[4.5rem]`}>
          {ended ? 'Replay' : playing ? 'Pause' : 'Play'}
        </button>
        <div className="relative min-w-0 flex-1">
          <input
            type="range"
            min={0}
            max={length}
            step={0.1}
            value={time}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Preview position"
            className="block h-6 w-full cursor-pointer accent-outline"
          />
          {recording.cues.slice(1).map((cue, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 h-3 w-px -translate-y-1/2 bg-outline/60"
              style={{ left: `${(cue / length) * 100}%` }}
            />
          ))}
        </div>
        <span className="hidden text-sm tabular-nums text-soft sm:inline">
          {clock(time)} / {clock(length)}
        </span>
        <button type="button" onClick={() => setRate(nextRate)} aria-label={`Preview speed ${rate} times`} className={button}>
          {rate}×
        </button>
      </div>
    </div>
  );
}