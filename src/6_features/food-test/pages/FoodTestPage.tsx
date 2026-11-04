// When the videos arrive
// Set src, poster, duration and cues for 
// each outcome in nonReducingSugar.ts, 
// with one cue per step, in seconds. 
// The preview box is replaced by a normal video with native controls, 
// and nothing else changes.

import { useState } from 'react';
import { Logo } from '@/4_components/ui/Logo';
import { ExperimentBoard } from '../components/ExperimentBoard';
import { OutcomeSelector } from '../components/OutcomeSelector';
import { nonReducingSugar } from '../experiments/nonReducingSugar';
import { usePlayback } from '../hooks/usePlayback';
import { progressAt } from '../lib/progress';
import type { Experiment, Outcome } from '../types';

/** One playthrough. The page gives it a new `key` per outcome, so a new sample starts clean. */
function Session({ experiment, outcome }: { experiment: Experiment; outcome: Outcome }) {
  const recording = experiment.recordings[outcome];
  const playback = usePlayback({ duration: recording.duration, hasVideo: Boolean(recording.src) });
  const progress = progressAt(recording.cues, playback.time, playback.length);

  return (
    <ExperimentBoard experiment={experiment} outcome={outcome} recording={recording} playback={playback} progress={progress} />
  );
}

/** Plays one food test. Pass another `experiment` to reuse the page for a different test. */
export function FoodTestPage({ experiment = nonReducingSugar }: { experiment?: Experiment }) {
  const [outcome, setOutcome] = useState<Outcome>('present');

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <Logo />       
        </div>
      </header>

      <main className="flex-1 bg-panel">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <h1 className="text-xl font-bold tracking-tight text-paneltext sm:text-2xl">{experiment.title}</h1>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <OutcomeSelector value={outcome} labels={experiment.outcomeLabels} onChange={setOutcome} />
          </div>
          <div className="mt-6">
            <Session key={outcome} experiment={experiment} outcome={outcome} />
          </div>
        </div>
      </main>
    </div>
  );
}