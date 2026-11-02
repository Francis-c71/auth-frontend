import type { LabApi } from './lab/useLab';

/** Whether the sample contains the substance being tested for. */
export type Outcome = 'present' | 'absent';

export interface ExperimentStep {
  id: string;
  /** Written in the past tense, as in a lab report. */
  procedure: string;
  /** Drives the apparatus. The runner waits for it to finish. */
  run: (lab: LabApi, outcome: Outcome) => Promise<void>;
  /** Written into the observations column when the step finishes. */
  observation: Record<Outcome, string>;
}

export interface Deduction {
  result: string;
}

export interface Experiment {
  id: string;
  title: string;
  outcomeLabels: Record<Outcome, string>;
  steps: ExperimentStep[];
  deduction: Record<Outcome, Deduction>;
}
