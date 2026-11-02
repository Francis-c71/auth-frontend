const EDGE = 'rgba(255,255,255,0.35)';

/** Origin: centre of the base, on the bench. */
export function TestTubeRack() {
  return (
    <g fill="#262626" stroke={EDGE} strokeWidth={1}>
      <rect x={-44} y={-6} width={88} height={6} rx={2} />
      <rect x={-40} y={-76} width={7} height={72} rx={1.5} />
      <rect x={33} y={-76} width={7} height={72} rx={1.5} />
      <rect x={-42} y={-78} width={84} height={8} rx={2} />
    </g>
  );
}
