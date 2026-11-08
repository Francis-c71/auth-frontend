export type Outcome = 'present' | 'absent';

export interface ExperimentStep {
  id: string;
  procedure: string;
  observation: Record<Outcome, string>;
}

export interface Deduction {
  result: string;
}

export interface Recording {
  src?: string;
  poster?: string;
  duration: number;
  cues: number[];
}

export interface Experiment {
  id: string;
  title: string;
  outcomeLabels: Record<Outcome, string>;
  steps: ExperimentStep[];
  recordings: Record<Outcome, Recording>;
  deduction: Record<Outcome, Deduction>;
}