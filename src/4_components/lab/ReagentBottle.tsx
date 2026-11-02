import { useId } from 'react';
import { GLASS } from './liquids';
import { transition } from './motion';

interface ReagentBottleProps {
  label: string;
  color: string;
  /** Highlights the bottle while it is being used. */
  active?: boolean;
}

/** Origin: centre of the base, on the bench. */
export function ReagentBottle({ label, color, active = false }: ReagentBottleProps) {
  const clip = `bottle-clip-${useId().replace(/:/g, '')}`;
  return (
    <g style={{ transform: `translateY(${active ? -6 : 0}px)`, transition: transition('transform', 400) }}>
      <defs>
        <clipPath id={clip}>
          <rect x={-26} y={-76} width={52} height={74} rx={9} />
        </clipPath>
      </defs>
      <rect x={-28} y={-78} width={56} height={78} rx={10} fill={GLASS.fill} />
      <g clipPath={`url(#${clip})`}>
        <rect x={-28} y={-62} width={56} height={62} fill={color} />
      </g>
      <rect x={-28} y={-78} width={56} height={78} rx={10} fill="none" stroke={GLASS.stroke} strokeWidth={1.8} />
      <rect x={-11} y={-94} width={22} height={16} fill="rgba(255,255,255,0.1)" stroke={GLASS.stroke} strokeWidth={1.8} />
      <rect x={-13} y={-102} width={26} height={8} rx={2} fill="#d4d4d8" />
      <rect x={-23} y={-50} width={46} height={26} rx={2} fill="#0b0b0b" stroke="rgba(255,255,255,0.45)" />
      <text x={0} y={-37} fontSize={8.5} fontWeight={600} fill="#fff" textAnchor="middle" dominantBaseline="central">
        {label}
      </text>
      <rect
        x={-33}
        y={-107}
        width={66}
        height={112}
        rx={6}
        fill="none"
        stroke="#fff"
        strokeWidth={1.5}
        strokeDasharray="5 4"
        style={{ opacity: active ? 0.9 : 0, transition: transition('opacity', 300) }}
      />
    </g>
  );
}
