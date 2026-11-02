import { useState } from 'react';
import { Logo } from '@/4_components/ui/Logo';
import { ExperimentTable } from '../components/ExperimentTable';
import { OutcomeSelector } from '../components/OutcomeSelector';
import { nonReducingSugar } from '../experiments/nonReducingSugar';
import { useExperimentRunner } from '../hooks/useExperimentRunner';
import type { Experiment, Outcome } from '../types';

/** Plays one food test. Pass another `experiment` to reuse the page for a different test. */
export function FoodTestPage({ experiment = nonReducingSugar }: { experiment?: Experiment }) {
  const [outcome, setOutcome] = useState<Outcome>('present');
  const { scene, currentIndex, completed, status } = useExperimentRunner(experiment, outcome);

  return (
    <div className="min-h-dvh bg-[#0a0a0a] text-white">
      <header className="border border-border bg-[#111111]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <Logo />
          <span className="text-sm text-white/70">Food tests</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{experiment.title}</h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/75">
          <span className="font-semibold text-white">Aim: </span>
          {experiment.aim}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className="text-sm font-semibold">Sample to test</span>
          <OutcomeSelector value={outcome} labels={experiment.outcomeLabels} onChange={setOutcome} />
        </div>

        <div className="mt-6">
          <ExperimentTable
            experiment={experiment}
            outcome={outcome}
            scene={scene}
            currentIndex={currentIndex}
            completed={completed}
            status={status}
          />
        </div>
      </main>
    </div>
  );
}
