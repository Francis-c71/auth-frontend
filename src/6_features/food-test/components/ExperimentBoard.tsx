import { ProgressStrip } from './ProgressStrip';
import { TypedText } from './TypedText';
import { VideoPanel } from './VideoPanel';
import type { Playback } from '../hooks/usePlayback';
import type { Progress } from '../lib/progress';
import type { Experiment, Outcome, Recording } from '../types';

interface ExperimentBoardProps {
  experiment: Experiment;
  outcome: Outcome;
  recording: Recording;
  playback: Playback;
  progress: Progress;
}

const cell = 'flex min-w-0 flex-col border-b border-r border-border bg-background';
const head = 'border-b border-border px-5 py-3 text-sm font-semibold text-foreground';
const body = 'flex-1 px-5 py-4 text-[15px] leading-8';
const mark = 'box-decoration-clone px-1.5 py-0.5 transition-colors duration-300';

/**
 * Three columns on large screens (procedure and video | observations | deductions).
 * One column of four boxes below 1024px: procedures, video, observations, deductions.
 */
export function ExperimentBoard({ experiment, outcome, recording, playback, progress }: ExperimentBoardProps) {
  const { steps } = experiment;
  const deduction = experiment.deduction[outcome];
  const { currentIndex, completed, done } = progress;

  const strip = (
    <ProgressStrip
      total={steps.length}
      completed={completed}
      currentIndex={currentIndex}
      started={playback.time > 0}
      done={done}
    />
  );

  return (
    <div className="grid grid-cols-1 border-l border-t border-border lg:grid-cols-[minmax(0,46fr)_minmax(0,30fr)_minmax(0,24fr)]">
      <section aria-labelledby="procedure-heading" className={`${cell} lg:col-start-1 lg:row-start-1`}>
        <h2 id="procedure-heading" className={head}>
          <span className="lg:hidden">Procedures</span>
          <span className="hidden lg:inline">Procedure and video</span>
        </h2>
        <p className={body}>
          {steps.map((step, i) => {
            const active = i === currentIndex;
            return (
              <span
                key={step.id}
                aria-current={active ? 'step' : undefined}
                className={`${mark} ${active ? 'bg-accent font-medium text-onAccent' : i < completed ? 'text-foreground' : 'text-soft'}`}
              >
                <TypedText text={step.procedure} instant />{' '}
              </span>
            );
          })}
        </p>
      </section>

      <section aria-labelledby="video-heading" className={`${cell} lg:col-start-1 lg:row-start-2`}>
        <h2 id="video-heading" className={`${head} lg:hidden`}>
          Video
        </h2>
        <div className="p-4">
          <VideoPanel recording={recording} playback={playback} />
        </div>
        <div className="border-t border-border px-5 py-4 lg:hidden">{strip}</div>
      </section>

      <section aria-labelledby="observation-heading" className={`${cell} lg:col-start-2 lg:row-start-1`}>
        <h2 id="observation-heading" className={head}>
          Observations
        </h2>
        <div aria-live="polite" className={body}>
          {completed === 0 ? (
            <span className="text-muted">
              {playback.playing ? 'Observing…' : 'Observations are recorded as the video plays.'}
            </span>
          ) : (
            <p>
              {steps.slice(0, completed).map((step, i) => {
                const latest = i === completed - 1 && !done;
                return (
                  <span key={step.id} className={`${mark} ${latest ? 'bg-accent font-medium text-onAccent' : 'text-foreground'}`}>
                    <TypedText text={step.observation[outcome]} />{' '}
                  </span>
                );
              })}
              {!done && <span className="px-1.5 text-muted">Observing…</span>}
            </p>
          )}
        </div>
      </section>

      <section aria-label="Progress" className="hidden min-w-0 border-b border-r border-border bg-background px-5 py-4 lg:col-start-2 lg:row-start-2 lg:block">
        {strip}
      </section>

      <section aria-labelledby="deduction-heading" className={`${cell} lg:col-start-3 lg:row-span-2 lg:row-start-1`}>
        <h2 id="deduction-heading" className={head}>
          Deductions
        </h2>
        <div className="flex-1 px-5 py-4">
          <div className="space-y-4 lg:sticky lg:top-6">
            {done ? (
              <>
                <p className="border border-border bg-accent px-4 py-3 text-base font-bold text-onAccent">
                  <TypedText text={deduction.result} />
                </p>
                <p className="text-sm leading-relaxed text-soft">
                  <TypedText text={deduction.explanation} speed={14} />
                </p>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-muted">The deduction is recorded when the video ends.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}