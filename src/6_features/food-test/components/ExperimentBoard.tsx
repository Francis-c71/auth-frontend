
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
const head = 'border-b border-border px-5 py-3 text-xl font-bold text-backgroundtext';
const body = 'flex-1 min-h-[200px] px-5 py-4 text-left font-semibold text-lg leading-8';
const mark = 'box-decoration-clone  px-1.5 py-0.5 transition-colors duration-300';

/**
 * Three columns on large screens (procedure and video | observations | deductions).
 * One column of four boxes below 1024px: procedures, video, observations, deductions.
 */
export function ExperimentBoard({ experiment, outcome, recording, playback, progress }: ExperimentBoardProps) {
  const { steps } = experiment;
  const deduction = experiment.deduction[outcome];
  const { currentIndex, completed, done } = progress;

  
  return (
    <div className="grid grid-cols-1 border-l border-t border-border lg:grid-cols-[minmax(0,46fr)_minmax(0,30fr)_minmax(0,24fr)]">
      <section aria-labelledby="procedure-heading" className={`${cell} lg:col-start-1 lg:row-start-1 min-h-[250px]`}>
        <h2 id="procedure-heading" className={head} >
          <span className="lg:hidden">Procedure(s)</span>
          <span className="hidden lg:inline">Procedure(s)</span>
        </h2>
        <p className={body}>
          {steps.map((step, i) => {
            const active = i === currentIndex;
            return (
              <span
                key={step.id}
                aria-current={active ? 'step' : undefined}
                className={`${mark} ${active ? 'bg-[#195936] rounded-md' : i < completed ? 'text-backgroundtext' : 'text-backgroundtext'}`}
              >
                <TypedText text={step.procedure} instant />{' '}
              </span>
            );
          })}
        </p>
      </section>

      <section aria-labelledby="video-heading" className={`${cell} lg:col-start-1 lg:row-start-2`}>
        <h2 id="video-heading" className={`${head} lg:hidden`}>
          Lab simulation
        </h2>
        <div className="p-0">
          <VideoPanel recording={recording} playback={playback} />
        </div>

      </section>

      <section aria-labelledby="observation-heading" className={`${cell} sm:min-h-[200px] lg:col-start-2 lg:row-start-1`}>
        <h2 id="observation-heading" className={head}>
          Observation(s)
        </h2>
        <div aria-live="polite" className={body}>
          {completed === 0 ? (
            <span className="text-backgroundtext text-sm">
            </span>
          ) : (
            <p>
              {steps
                .slice(0, completed)
                .filter((step) => step.observation[outcome]?.trim())
                .map((step, i, filteredSteps) => {
                  const latest = i === filteredSteps.length - 1 && !done;

                  return (
                    <span
                      key={step.id}
                      className={`${mark} ${latest ? 'bg-background text-backgroundtext' : 'text-backgroundtext'}`}
                    >
                      <TypedText text={step.observation[outcome]} />{' '}
                    </span>
                  );
                })}
            </p>
            
          )}
        </div>
      </section>

      <section aria-labelledby="deduction-heading" className={`${cell} min-h-[200px] lg:col-start-3 lg:row-span-1 lg:row-start-1`}>
        <h2 id="deduction-heading" className={head}>
          Deduction(s)
        </h2>
        <div className={"text-lg font-semibold flex-1 px-5 py-4"}>
          <div className="space-y-4 lg:sticky lg:top-6 text-backgroundtext">
            {done ? (
              <>
                  <TypedText text={deduction.result} />            
              </>
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}