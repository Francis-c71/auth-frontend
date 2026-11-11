import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { highlightAt } from '../lib/progress';
import type { ExperimentStep } from '../types';
import '../styles/procedureHighlight.css';

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Which end of a new step lights first: 'tail' is the end of the sentence, 'head' is its start. */
const NEW_STEP_BUILDS_FROM: 'tail' | 'head' = 'tail';

const STOPS = 9; // gradient samples along each line
const round = (n: number) => Math.round(n * 100) / 100;
const f = (n: number) => n.toFixed(4);

/** Reads a time variable such as "2000ms" or "2s" from the stylesheet. */
function readMs(el: Element, name: string, fallback: number) {
  const value = getComputedStyle(el).getPropertyValue(name).trim();
  if (value.endsWith('ms')) return parseFloat(value);
  if (value.endsWith('s')) return parseFloat(value) * 1000;
  return fallback;
}

function readNumber(el: Element, name: string, fallback: number) {
  const value = parseFloat(getComputedStyle(el).getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
}

/**
 * The gradient for one line. `a` and `b` are where the line starts and ends along the whole step,
 * from 0 (head) to 1 (tail). The strength at each point comes from two moving edges:
 * one forms the highlight, the other drains it.
 */
function gradient(a: number, b: number) {
  const stops = Array.from({ length: STOPS }, (_, k) => {
    const t = k / (STOPS - 1);
    const x = a + t * (b - a); // 0 at the head of the step, 1 at its tail
    const u = 1 - x; // 0 at the tail
    const forming = NEW_STEP_BUILDS_FROM === 'tail' ? u : x;
    const forms = `clamp(0, (var(--e-in) - ${f(forming)}) / var(--ph-spread), 1)`;
    const drains = `clamp(0, (${f(u)} - (var(--e-out) - var(--ph-spread))) / var(--ph-spread), 1)`;
    return `rgb(var(--ph-rgb) / calc(${forms} * ${drains})) ${(t * 100).toFixed(1)}%`;
  });
  return `linear-gradient(90deg, ${stops.join(', ')})`;
}

interface ProcedureTextProps {
  steps: ExperimentStep[];
  cues: number[];
  time: number;
  length: number;
  playing: boolean;
  rate?: number;
  currentIndex: number;
  completed: number;
  className?: string;
}

export function ProcedureText({
  steps,
  cues,
  time,
  length,
  playing,
  rate = 1,
  currentIndex,
  completed,
  className = '',
}: ProcedureTextProps) {
  const box = useRef<HTMLParagraphElement>(null);
  const spans = useRef<(HTMLSpanElement | null)[]>([]);
  const [layout, setLayout] = useState<Box[][]>([]);
  const [fade, setFade] = useState(2000);
  const [lead, setLead] = useState(0.5);

  // Where every step sits, one box per line it occupies.
  const measure = useCallback(() => {
    const parent = box.current;
    if (!parent) return;
    const origin = parent.getBoundingClientRect();
    const next = spans.current.map((span) =>
      span
        ? Array.from(span.getClientRects()).map((r) => ({
            left: round(r.left - origin.left),
            top: round(r.top - origin.top),
            width: round(r.width),
            height: round(r.height),
          }))
        : [],
    );
    setLayout((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, steps]);

  useLayoutEffect(() => {
    if (!box.current) return;
    setFade(readMs(box.current, '--ph-duration', 2000));
    setLead(readNumber(box.current, '--ph-lead', 0.5));
  }, []);

  useEffect(() => {
    const parent = box.current;
    if (!parent) return;
    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    void document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [measure]);

  // One gradient per line. It depends only on where the lines sit, so it is built once per layout.
  const gradients = useMemo(
    () =>
      layout.map((lines) => {
        const total = lines.reduce((sum, l) => sum + l.width, 0);
        let before = 0;
        return lines.map((line) => {
          const a = total > 0 ? before / total : 0;
          before += line.width;
          return gradient(a, total > 0 ? before / total : 1);
        });
      }),
    [layout],
  );

  // While playing, the hand-off is placed around each step's start time.
  // When paused or scrubbing, the highlight goes straight to the right step with a quick fade.
  const leadSeconds = playing ? (fade / 1000) * lead * rate : 0;
  const { index } = highlightAt(cues, time, length, leadSeconds);
  const fadeMs = playing ? fade : 250;
  const started = time > 0;
  const ended = length > 0 && time >= length - 0.05;

  return (
    <p ref={box} className={`ph ${className}`}>
      {steps.map((step, i) => {
        const reached = started && (ended || i <= index);
        const passed = started && (ended || i < index);
        return (layout[i] ?? []).map((line, j) => (
          <span
            key={`${step.id}-${j}`}
            aria-hidden="true"
            className="ph-line"
            style={
              {
                left: line.left,
                top: line.top,
                width: line.width,
                height: line.height,
                backgroundImage: gradients[i]?.[j],
                '--ph-in': reached ? 1 : 0,
                '--ph-out': passed ? 1 : 0,
                transitionDuration: `${fadeMs}ms`,
              } as CSSProperties
            }
          />
        ));
      })}
      {steps.map((step, i) => (
  <Fragment key={step.id}>
    <span
      ref={(el) => {
        spans.current[i] = el;
      }}
      aria-current={i === currentIndex ? 'step' : undefined}
      className={`relative pr-2 pl-0 transition-colors ${
        i === currentIndex
          ? 'text-onAccent'
          : i < completed
            ? 'text-foreground'
            : 'text-soft'
      }`}
      style={{ transitionDuration: `${fadeMs}ms` }}
    >
      {step.procedure}
    </span>
  </Fragment>
))}
    </p>
  );
}