import { LabStage } from './LabStage';
import { TypedText } from './TypedText';
import type { RunStatus } from '../hooks/useExperimentRunner';
import type { SceneState } from '../lab/useLab';
import type { Experiment, Outcome } from '../types';

interface ExperimentTableProps {
  experiment: Experiment;
  outcome: Outcome;
  scene: SceneState;
  currentIndex: number;
  completed: number;
  status: RunStatus;
}

const head = 'border border-border bg-[#181818] px-5 py-3 text-left text-sm font-semibold text-white';
const cell = 'border border-border px-5 py-4 align-top transition-colors duration-300';

/** Lab-notebook layout: procedure and animation | observations | deductions. */
export function ExperimentTable({ experiment, outcome, scene, currentIndex, completed, status }: ExperimentTableProps) {
  const { steps } = experiment;
  const deduction = experiment.deduction[outcome];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
        <caption className="sr-only">{experiment.title}: procedure, observations and deductions</caption>
        <colgroup>
          <col className="w-[46%]" />
          <col className="w-[30%]" />
          <col className="w-[24%]" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className={head}>Procedure(s)</th>
            <th scope="col" className={head}>Observation(s)</th>
            <th scope="col" className={head}>Deduction(s)</th>
          </tr>
        </thead>
  
        <tbody>
          <tr>
          <td className={`${cell} bg-[#101010]`}>
            <div aria-live="polite" className="space-y-3 text-[15px] leading-relaxed">
              
                {steps.map((step, i) => {
                  const active = i === currentIndex;
                  const done = i < completed;
                  return (
                    <span
                      key={step.id}
                      aria-current={active ? 'step' : undefined}
                      className={`transition-colors duration-300 ${
                        active ? 'bg-navyBrand text-amber' : done ? 'text-white/90' : 'text-white/70'
                      }`}
                    >
                      <TypedText text={step.procedure} />
                    </span>
                  );
                })}
              
            </div>
          </td>

            <td className={`${cell} bg-[#101010]`}>
              <div aria-live="polite" className="space-y-3 text-[15px] leading-relaxed">
                {completed === 0 && (
                  <span className="text-white/45">
                    {currentIndex >= 0 ? 'Observing…' : 'Observations are recorded as the test runs.'}
                  </span>
                )}
                {steps.slice(0, completed).map((step) => (
                  <span key={step.id}>
                    <TypedText text={step.observation[outcome]} />
                  </span>
                ))}
                {completed > 0 && completed < steps.length && (
                  <span className="text-white/45">Observing…</span>
                )}
              </div>
            </td>

            <td rowSpan={2} className={`${cell} bg-[#101010]`}>
              <div className="sticky top-6 space-y-4">
                {status === 'done' ? (
                  <>
                    <TypedText text={deduction.result} />
                  </>
                ) : (
                  <p className="text-sm leading-relaxed text-white/45">
                    The deduction is recorded once the test is complete.
                  </p>
                )}
              </div>
            </td>
          </tr>

          <tr>
            <td className={`${cell} bg-[#101010] p-4`}>
              <LabStage scene={scene} />
            </td>
            <td className={`${cell} bg-[#101010]`}>
              <div className="space-y-4">
                <p className="text-sm font-semibold text-white">
                  {status === 'done' ? 'Finished' : `Step ${Math.max(currentIndex + 1, 1)} of ${steps.length}`}
                </p>
                <p aria-live="polite" className="text-[15px] leading-relaxed text-white/80">
                  {scene.caption}
                </p>
                <ol aria-hidden="true" className="flex gap-1.5">
                  {steps.map((step, i) => (
                    <li
                      key={step.id}
                      className={`h-2 flex-1 border border-border ${
                        i < completed ? 'bg-white' : i === currentIndex ? 'bg-white/40' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </ol>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
