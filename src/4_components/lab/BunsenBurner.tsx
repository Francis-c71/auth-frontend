import { transition } from './motion';

const EDGE = 'rgba(255,255,255,0.35)';

/** Origin: centre of the base, on the bench. Flame tip reaches about 190 above the origin. */
export function BunsenBurner({ lit }: { lit: boolean }) {
  return (
    <g>
      <path d="M -8 -8 C -40 -8 -40 -30 -66 -30" stroke="#3b3b3b" strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M -34 0 Q -34 -10 -20 -12 H 20 Q 34 -10 34 0 Z" fill="#2b2f36" stroke={EDGE} />
      <rect x={-7} y={-62} width={14} height={52} fill="#444a54" stroke={EDGE} />
      <rect x={-11} y={-68} width={22} height={14} rx={2} fill="#6b7280" stroke={EDGE} />
      <ellipse cx={0} cy={-61} rx={3.5} ry={2.5} fill="#0b0b0b" />
      <rect x={-8} y={-110} width={16} height={44} fill="#585f6b" stroke={EDGE} />
      <rect x={-9.5} y={-113} width={19} height={4} rx={1.5} fill="#9ca3af" />
      <g
        style={{
          transformBox: 'fill-box',
          transformOrigin: '50% 100%',
          transform: lit ? 'scaleY(1)' : 'scaleY(0.05)',
          opacity: lit ? 1 : 0,
          transition: `${transition('transform', 500)}, ${transition('opacity', 400)}`,
        }}
      >
        <ellipse cx={0} cy={-150} rx={22} ry={44} fill="rgba(120,190,255,0.12)" />
        <g className="lab-flicker">
          <path d="M 0 -112 C -13 -128 -12 -156 0 -190 C 12 -156 13 -128 0 -112 Z" fill="rgba(140,200,255,0.55)" />
          <path d="M 0 -112 C -7 -122 -6 -138 0 -150 C 6 -138 7 -122 0 -112 Z" fill="#3b82f6" />
        </g>
      </g>
    </g>
  );
}
