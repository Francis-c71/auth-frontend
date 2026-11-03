/** Whether the sample contains the substance being tested for. */
export type Outcome = 'present' | 'absent';

export interface ExperimentStep {
  id: string;
  /** Written in the past tense, as in a lab report. */
  procedure: string;
  /** Typed into the observations column when the step ends. */
  observation: Record<Outcome, string>;
}

export interface Deduction {
  result: string;
  explanation: string;
}

/** One filming of the experiment, and when each step begins in it. */
export interface Recording {
  /** Video address. Leave it out until the video exists: the preview player runs instead. */
  src?: string;
  poster?: string;
  /** Length in seconds. For a real video, the file's own length takes over once it loads. */
  duration: number;
  /** The second each step begins, in step order. Needs one entry per step. */
  cues: number[];
}

export interface Experiment {
  id: string;
  title: string;
  aim: string;
  outcomeLabels: Record<Outcome, string>;
  steps: ExperimentStep[];
  /** One recording per outcome, since the endings differ. */
  recordings: Record<Outcome, Recording>;
  deduction: Record<Outcome, Deduction>;
}