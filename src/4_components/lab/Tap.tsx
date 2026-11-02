import { transition } from './motion';

const EDGE = 'rgba(255,255,255,0.4)';

interface TapProps {
  running: boolean;
  /** Length of the water stream in px. */
  streamLength?: number;
}

/** Origin: the spout tip. The riser goes up from here and off the top of the stage. */
export function Tap({ running, streamLength = 296 }: TapProps) {
  return (
    <g>
      <g
        style={{
          transformBox: 'fill-box',
          transformOrigin: '50% 0%',
          transform: `scaleY(${running ? 1 : 0})`,
          transition: transition('transform', 400),
        }}
      >
        <line x1={0} x2={0} y1={0} y2={streamLength} stroke="rgba(140,205,255,0.35)" strokeWidth={4} />
        <line className="lab-flow" x1={0} x2={0} y1={0} y2={streamLength} stroke="rgba(170,220,255,0.95)" strokeWidth={2.5} strokeDasharray="10 6" />
      </g>
      <rect x={42} y={-120} width={14} height={82} fill="#9ca3af" stroke={EDGE} />
      <rect x={-6} y={-52} width={62} height={14} rx={3} fill="#9ca3af" stroke={EDGE} />
      <rect x={-6} y={-52} width={12} height={46} rx={2} fill="#9ca3af" stroke={EDGE} />
      <rect x={-8} y={-8} width={16} height={8} rx={2} fill="#6b7280" stroke={EDGE} />
      <g style={{ transformBox: 'fill-box', transformOrigin: '50% 50%', transform: `rotate(${running ? 90 : 0}deg)`, transition: transition('transform', 400) }}>
        <rect x={30} y={-76} width={38} height={8} rx={3} fill="#d4d4d8" stroke={EDGE} />
      </g>
    </g>
  );
}
