import { useCallback, useMemo, useRef, useState } from 'react';
import { LIQUID, type TubeTemp } from '@/4_components/lab';
import { REAGENTS, type ReagentKey } from '../data/reagents';

export type Place = 'rack' | 'flame' | 'tap';

export interface TubeState {
  place: Place;
  held: boolean;
  ml: number;
  color: string;
  precipitate: number;
  bubbling: boolean;
  temp: TubeTemp;
}

export interface CylinderState {
  visible: boolean;
  ml: number;
  color: string;
  pouring: boolean;
}

export interface SceneState {
  tube: TubeState;
  cylinder: CylinderState;
  activeBottle: ReagentKey | null;
  flame: boolean;
  tap: boolean;
  stream: boolean;
  caption: string;
}

export const TUBE_CAPACITY_ML = 12;

export const INITIAL_SCENE: SceneState = {
  tube: { place: 'rack', held: false, ml: 0, color: LIQUID.clear, precipitate: 0, bubbling: false, temp: 'normal' },
  cylinder: { visible: false, ml: 0, color: LIQUID.clear, pouring: false },
  activeBottle: null,
  flame: false,
  tap: false,
  stream: false,
  caption: 'Apparatus ready.',
};

/** Thrown inside a running experiment when it is reset or replaced. */
export class CancelledError extends Error {
  constructor() {
    super('Experiment run cancelled');
    this.name = 'CancelledError';
  }
}

/** The commands an experiment step can use. Every async command resolves when its animation ends. */
export interface LabApi {
  wait(ms: number): Promise<void>;
  say(caption: string): void;
  patchTube(patch: Partial<TubeState>): void;
  /** Measure `ml` of a reagent in the cylinder, then pour it into the test tube. */
  addReagent(key: ReagentKey, ml: number): Promise<void>;
  pickUpTube(): Promise<void>;
  releaseTube(): Promise<void>;
  moveTube(place: Place): Promise<void>;
  setFlame(on: boolean): Promise<void>;
  setTap(on: boolean): Promise<void>;
}

const T = { fill: 1300, travel: 1000, pour: 1400, hold: 600 } as const;
const MOVE_CAPTION: Record<Place, string> = {
  rack: 'Returning the tube to the rack',
  flame: 'Holding the tube in the flame',
  tap: 'Taking the tube to the tap',
};

export function useLab(speed = 1) {
  const [scene, setScene] = useState<SceneState>(INITIAL_SCENE);
  const generation = useRef(0);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const lab = useMemo<LabApi>(() => {
    const wait = (ms: number) => {
      const g = generation.current;
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => (g === generation.current ? resolve() : reject(new CancelledError())), ms / speedRef.current);
      });
    };
    const say = (caption: string) => setScene((s) => ({ ...s, caption }));
    const patchTube = (patch: Partial<TubeState>) => setScene((s) => ({ ...s, tube: { ...s.tube, ...patch } }));
    const patchCylinder = (patch: Partial<CylinderState>) => setScene((s) => ({ ...s, cylinder: { ...s.cylinder, ...patch } }));

    return {
      wait,
      say,
      patchTube,

      async addReagent(key, ml) {
        const reagent = REAGENTS[key];
        say(`Measuring ${ml} ml of ${reagent.name}`);
        setScene((s) => ({ ...s, activeBottle: key, cylinder: { visible: true, ml: 0, color: reagent.color, pouring: false } }));
        await wait(500);
        patchCylinder({ ml });
        await wait(T.fill + 400);

        setScene((s) => ({ ...s, activeBottle: null }));
        say(`Pouring ${ml} ml into the test tube`);
        patchCylinder({ pouring: true });
        await wait(T.travel);

        setScene((s) => ({
          ...s,
          stream: true,
          cylinder: { ...s.cylinder, ml: 0 },
          tube: { ...s.tube, ml: s.tube.ml + ml, color: reagent.tint ?? s.tube.color },
        }));
        await wait(T.pour);

        setScene((s) => ({ ...s, stream: false }));
        await wait(250);
        patchCylinder({ pouring: false });
        await wait(T.travel);
        patchCylinder({ visible: false });
        await wait(400);
      },

      async pickUpTube() {
        say('Gripping the test tube with a holder');
        patchTube({ held: true });
        await wait(T.hold + 200);
      },

      async releaseTube() {
        patchTube({ held: false });
        await wait(T.hold + 200);
      },

      async moveTube(place) {
        say(MOVE_CAPTION[place]);
        patchTube({ place });
        await wait(T.travel + 200);
      },

      async setFlame(on) {
        say(on ? 'Lighting the Bunsen burner' : 'Turning off the Bunsen burner');
        setScene((s) => ({ ...s, flame: on }));
        await wait(T.hold);
      },

      async setTap(on) {
        say(on ? 'Turning on the tap' : 'Turning off the tap');
        setScene((s) => ({ ...s, tap: on }));
        await wait(500);
      },
    };
  }, []);

  /** Cancels anything in flight and restores the bench. */
  const reset = useCallback(() => {
    generation.current += 1;
    setScene(INITIAL_SCENE);
  }, []);

  return { scene, lab, reset };
}
