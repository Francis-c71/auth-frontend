import { transition } from './motion';

/** Drawn in the test tube's coordinate space (origin: tube base). The handle points left. */
export function TubeHolder({ visible }: { visible: boolean }) {
  return (
    <g pointerEvents="none" style={{ opacity: visible ? 1 : 0, transition: transition('opacity', 500) }}>
      <path d="M -20 -122 L -96 -168 M -20 -112 L -96 -158" stroke="#b9bec6" strokeWidth={3} strokeLinecap="round" fill="none" />
      <g transform="translate(-96 -163) rotate(-149)">
        <rect x={0} y={-6} width={44} height={12} rx={5} fill="#5b4636" stroke="rgba(255,255,255,0.35)" />
      </g>
      <rect x={-23} y={-124} width={46} height={14} rx={3} fill="#9ca3ad" stroke="rgba(255,255,255,0.55)" />
      <line x1={-23} x2={23} y1={-117} y2={-117} stroke="rgba(0,0,0,0.45)" strokeWidth={1} />
    </g>
  );
}
