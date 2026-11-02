import type { CSSProperties } from 'react';
import {
  BunsenBurner,
  CYL_FOOT,
  CYL_H,
  LabStyles,
  MeasuringCylinder,
  ReagentBottle,
  Tap,
  TestTube,
  TestTubeRack,
  TubeHolder,
  TUBE_H,
  transition,
} from '@/4_components/lab';
import { BOTTLE_ORDER, REAGENTS } from '../data/reagents';
import { TUBE_CAPACITY_ML, type Place, type SceneState, type TubeState } from '../lab/useLab';

const WIDTH = 760;
const HEIGHT = 460;
const BENCH_Y = 410;

const BOTTLE_X = [50, 120, 190, 260];
const RACK = { x: 400, y: BENCH_Y };
const BURNER_X = 540;
const TAP = { x: 650, y: 96 };

/** Where the base of the test tube sits for each place. */
const PLACES: Record<Place, { x: number; y: number }> = {
  rack: RACK,
  flame: { x: BURNER_X, y: 258 },
  tap: { x: 668, y: 340 },
};
const LIFT = 42;

/** The cylinder's origin is its lip. */
const CYLINDER_REST = { x: 345, y: BENCH_Y - (CYL_H + CYL_FOOT) };
const CYLINDER_POUR = { x: 398, y: 212 };

const LABELS: { x: number; text: string }[] = [
  { x: 155, text: 'Reagents' },
  { x: 400, text: 'Test tube rack' },
  { x: BURNER_X, text: 'Bunsen burner' },
  { x: 684, text: 'Sink' },
];

function tubeOrigin(tube: TubeState) {
  const place = PLACES[tube.place];
  return tube.place === 'rack' && tube.held ? { x: place.x, y: place.y - LIFT } : place;
}

/** The apparatus on the bench. Purely visual: everything it shows comes from `scene`. */
export function LabStage({ scene, speed = 1 }: { scene: SceneState; speed?: number }) {
  const { tube, cylinder } = scene;
  const tubePos = tubeOrigin(tube);
  const lip = cylinder.pouring ? CYLINDER_POUR : CYLINDER_REST;
  const streamTop = CYLINDER_POUR.y + 4;
  const streamBottom = BENCH_Y - Math.min(tube.ml / TUBE_CAPACITY_ML, 1) * TUBE_H;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Laboratory bench with reagent bottles, a measuring cylinder, a test tube rack, a Bunsen burner and a tap"
      className="block h-auto w-full border border-border bg-[#0b0b0b]"
      style={{ '--lab-speed': speed } as CSSProperties}
    >
      <LabStyles />

      <rect x={0} y={BENCH_Y} width={WIDTH} height={HEIGHT - BENCH_Y} fill="#151515" />
      <line x1={0} x2={WIDTH} y1={BENCH_Y} y2={BENCH_Y} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
      <path d="M 612 392 H 752 L 744 410 H 620 Z" fill="#1c1c1c" stroke="rgba(255,255,255,0.4)" />

      <g transform={`translate(${TAP.x} ${TAP.y})`}>
        <Tap running={scene.tap} streamLength={392 - TAP.y} />
      </g>
      <g transform={`translate(${RACK.x} ${RACK.y})`}>
        <TestTubeRack />
      </g>
      {BOTTLE_ORDER.map((key, i) => (
        <g key={key} transform={`translate(${BOTTLE_X[i]} ${BENCH_Y})`}>
          <ReagentBottle label={REAGENTS[key].label} color={REAGENTS[key].color} active={scene.activeBottle === key} />
        </g>
      ))}
      <g transform={`translate(${BURNER_X} ${BENCH_Y})`}>
        <BunsenBurner lit={scene.flame} />
      </g>

      <g
        style={{
          transform: `translate(${lip.x}px, ${lip.y}px)`,
          opacity: cylinder.visible ? 1 : 0,
          transition: `${transition('transform', 1000)}, ${transition('opacity', 400)}`,
        }}
      >
        <MeasuringCylinder level={cylinder.ml} color={cylinder.color} tilt={cylinder.pouring ? 100 : 0} />
      </g>

      <rect
        x={CYLINDER_POUR.x - 1.75}
        y={streamTop}
        width={3.5}
        height={Math.max(streamBottom - streamTop, 0)}
        style={{
          fill: cylinder.color,
          transformBox: 'fill-box',
          transformOrigin: '50% 0%',
          transform: `scaleY(${scene.stream ? 1 : 0})`,
          transition: transition('transform', 200),
        }}
      />

      <g style={{ transform: `translate(${tubePos.x}px, ${tubePos.y}px)`, transition: transition('transform', 1000) }}>
        <TestTube
          level={tube.ml / TUBE_CAPACITY_ML}
          color={tube.color}
          precipitate={tube.precipitate}
          bubbling={tube.bubbling}
          temp={tube.temp}
        />
        <TubeHolder visible={tube.held} />
      </g>

      {LABELS.map((l) => (
        <text key={l.text} x={l.x} y={436} fontSize={12} fill="rgba(255,255,255,0.65)" textAnchor="middle">
          {l.text}
        </text>
      ))}
    </svg>
  );
}
