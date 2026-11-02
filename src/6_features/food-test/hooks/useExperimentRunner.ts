import { useCallback, useEffect, useState } from 'react';
import { CancelledError, useLab } from '../lab/useLab';
import type { Experiment, Outcome } from '../types';

export type RunStatus = 'running' | 'done';

/**
 * Plays an experiment step by step. Restarts whenever the experiment or outcome changes.
 * `restart` is the hook for the replay control; pause and next-step can be added here
 * without touching the apparatus or the table.
 */
export function useExperimentRunner(experiment: Experiment, outcome: Outcome) {
  const { scene, lab, reset } = useLab();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [completed, setCompleted] = useState(0);
  const [status, setStatus] = useState<RunStatus>('running');

  const start = useCallback(async () => {
    reset();
    setCurrentIndex(-1);
    setCompleted(0);
    setStatus('running');
    try {
      await lab.wait(600);
      for (const [index, step] of experiment.steps.entries()) {
        setCurrentIndex(index);
        await step.run(lab, outcome);
        setCompleted(index + 1);
        await lab.wait(1400); // time to read the observation
      }
      setCurrentIndex(-1);
      lab.say('Experiment complete.');
      setStatus('done');
    } catch (error) {
      if (!(error instanceof CancelledError)) throw error;
    }
  }, [experiment, outcome, lab, reset]);

  useEffect(() => {
    void start();
    return reset;
  }, [start, reset]);

  return { scene, currentIndex, completed, status, restart: start };
}
