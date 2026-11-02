import { useId, type CSSProperties } from 'react';
import { GLASS } from './liquids';
import { transition } from './motion';

export type TubeTemp = 'normal' | 'hot' | 'cold';

export const TUBE_W = 36;
export const TUBE_H = 150;

const R = TUBE_W / 2;
const r = R - 2;
// Origin (0,0) is the centre of the base; the tube is drawn upwards.
const OUTLINE = `M ${-R} ${-TUBE_H} V ${-R} A ${R} ${R} 0 0 0 ${R} ${-R} V ${-TUBE_H}`;
const INNER = `M ${-r} ${-TUBE_H} V ${-R} A ${r} ${r} 0 0 0 ${r} ${-R} V ${-TUBE_H} Z`;
const STROKE = { normal: GLASS.stroke, hot: 'rgb(255, 170, 90)', cold: 'rgb(130, 200, 255)' } as const;

// Deterministic particle and bubble layouts, so renders are stable.
const PARTICLES = Array.from({ length: 28 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.6789;
  const fa = a - Math.floor(a);
  const fb = b - Math.floor(b);
  return { x: (fa - 0.5) * (TUBE_W - 12), y: -(3 + fb * 38), r: 1.6 + fb * 1.8, t: i / 28 };
});
const BUBBLES = [
  { x: -8, d: 0, r: 2 },
  { x: 5, d: 0.35, r: 2.6 },
  { x: -2, d: 0.7, r: 1.8 },
  { x: 9, d: 0.15, r: 2.2 },
  { x: -11, d: 0.55, r: 1.6 },
  { x: 2, d: 0.9, r: 2.4 },
];

interface TestTubeProps {
  /** Fill fraction, 0 to 1. */
  level: number;
  color: string;
  /** 0 to 1: how much precipitate has settled at the bottom. */
  precipitate?: number;
  bubbling?: boolean;
  temp?: TubeTemp;
}

export function TestTube({ level, color, precipitate = 0, bubbling = false, temp = 'normal' }: TestTubeProps) {
  const clip = `tube-clip-${useId().replace(/:/g, '')}`;
  const fill = Math.min(Math.max(level, 0), 1);
  const surface = (1 - fill) * TUBE_H;

  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={INNER} />
        </clipPath>
      </defs>
      <path d={`${OUTLINE} Z`} fill={GLASS.fill} />
      <g clipPath={`url(#${clip})`}>
        <g style={{ transform: `translateY(${surface}px)`, transition: transition('transform', 1300) }}>
          <rect x={-R} y={-TUBE_H} width={TUBE_W} height={TUBE_H + 2} style={{ fill: color, transition: transition('fill', 1200) }} />
          <rect x={-R} y={-TUBE_H} width={TUBE_W} height={1.8} fill="rgba(255,255,255,0.5)" />
        </g>
        {PARTICLES.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="#6e1a0c"
            style={{ opacity: precipitate > p.t ? 1 : 0, transition: transition('opacity', 900) }}
          />
        ))}
        {bubbling &&
          BUBBLES.map((b, i) => (
            <circle
              key={i}
              className="lab-bubble"
              cx={b.x}
              cy={-6}
              r={b.r}
              fill="rgba(255,255,255,0.85)"
              style={{ animationDelay: `calc(${b.d}s / var(--lab-speed, 1))`, '--rise': `${-Math.max(fill * TUBE_H - 6, 0)}px` } as CSSProperties}
            />
          ))}
      </g>
      <path d={`M -11 ${-TUBE_H + 10} V -30`} stroke={GLASS.shine} strokeWidth={3} strokeLinecap="round" fill="none" />
      <path d={OUTLINE} fill="none" strokeWidth={2} strokeLinecap="round" style={{ stroke: STROKE[temp], transition: transition('stroke', 600) }} />
      <line x1={-R - 3} x2={R + 3} y1={-TUBE_H} y2={-TUBE_H} stroke={GLASS.stroke} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}
