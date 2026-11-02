import { useEffect, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Writes text out one character at a time, like a student filling in a notebook. */
export function TypedText({ text, speed = 22 }: { text: string; speed?: number }) {
  const [count, setCount] = useState(() => (prefersReducedMotion() ? text.length : 0));

  useEffect(() => {
    setCount(prefersReducedMotion() ? text.length : 0);
  }, [text]);

  useEffect(() => {
    if (count >= text.length) return;
    const id = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(id);
  }, [count, text, speed]);

  return (
    <>
      <span aria-hidden="true">{text.slice(0, count)}</span>{'  '}
      <span className="sr-only">{text}</span>
    </>
  );
}
