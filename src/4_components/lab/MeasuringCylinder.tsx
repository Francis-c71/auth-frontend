import { useId } from 'react';
import { GLASS } from './liquids';
import { transition } from './motion';

export const CYL_W = 38;
export const CYL_H = 170;
/** The foot extends this far below the body. */
export const CYL_FOOT = 5;
const BOTTOM = 10; // gap between the base and the 0 mark
const TOP = 16; // gap between the top mark and the lip

const OUTLINE = `M ${-CYL_W} 0 V ${CYL_H - 8} Q ${-CYL_W} ${CYL_H} ${-CYL_W + 8} ${CYL_H} H -8 Q 0 ${CYL_H} 0 ${CYL_H - 8} V 0`;
const INNER = `M ${-CYL_W + 2} 0 V ${CYL_H - 8} Q ${-CYL_W + 2} ${CYL_H - 2} ${-CYL_W + 10} ${CYL_H - 2} H -10 Q -2 ${CYL_H - 2} -2 ${CYL_H - 8} V 0 Z`;

interface MeasuringCylinderProps {
  maxMl?: number;
  /** Volume in ml. */
  level: number;
  color: string;
  /** Degrees, clockwise, about the lip. Above 45 the liquid banks against the lip-side wall. */
  tilt?: number;
}

/** Origin: the lip (top right corner). The body hangs down and to the left. */
export function MeasuringCylinder({ maxMl = 10, level, color, tilt = 0 }: MeasuringCylinderProps) {
  const clip = `cyl-clip-${useId().replace(/:/g, '')}`;
  const pxPerMl = (CYL_H - BOTTOM - TOP) / maxMl;
  const yAt = (ml: number) => CYL_H - BOTTOM - ml * pxPerMl;
  const fraction = Math.min(Math.max(level / maxMl, 0), 1);
  const liquid =
    tilt > 45
      ? `translate(${-fraction * (CYL_W - 8)}px, 0px) rotate(${-tilt}deg)`
      : `translate(${-CYL_W / 2}px, ${yAt(level)}px) rotate(0deg)`;

  return (
    <g style={{ transform: `rotate(${tilt}deg)`, transition: transition('transform', 900) }}>
      <defs>
        <clipPath id={clip}>
          <path d={INNER} />
        </clipPath>
      </defs>
      <path d={`${OUTLINE} Z`} fill={GLASS.fill} />
      <g clipPath={`url(#${clip})`}>
        <g style={{ transform: liquid, transition: transition('transform', 1300) }}>
          <rect x={-260} y={0} width={520} height={300} style={{ fill: color, transition: transition('fill', 600) }} />
          <rect x={-260} y={0} width={520} height={1.8} fill="rgba(255,255,255,0.5)" />
        </g>
      </g>
      {Array.from({ length: maxMl * 2 + 1 }, (_, i) => {
        const ml = i / 2;
        const major = Number.isInteger(ml);
        const y = yAt(ml);
        return (
          <g key={i}>
            <line x1={-CYL_W + 1} x2={-CYL_W + (major ? 13 : 7)} y1={y} y2={y} stroke="rgba(255,255,255,0.9)" strokeWidth={major ? 1.2 : 0.8} />
            {major && (
              <text x={-CYL_W + 16} y={y} fontSize={7.5} fill="rgba(255,255,255,0.9)" dominantBaseline="central">
                {ml}
              </text>
            )}
          </g>
        );
      })}
      <text x={-CYL_W + 16} y={6} fontSize={7.5} fill="rgba(255,255,255,0.9)" dominantBaseline="central">
        mL
      </text>
      <path d={`M -6 8 V ${CYL_H - 20}`} stroke={GLASS.shine} strokeWidth={2.5} strokeLinecap="round" fill="none" />
      <path d={OUTLINE} fill="none" stroke={GLASS.stroke} strokeWidth={2} strokeLinejoin="round" />
      <path d="M 0 0 L 6 -3" stroke={GLASS.stroke} strokeWidth={2} strokeLinecap="round" />
      <rect x={-CYL_W - 8} y={CYL_H - 2} width={CYL_W + 16} height={CYL_FOOT + 2} rx={3} fill="rgba(255,255,255,0.12)" stroke={GLASS.stroke} />
    </g>
  );
}
