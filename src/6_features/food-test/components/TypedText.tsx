import { useEffect, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

interface TypedTextProps {
  text: string;
  speed?: number;
  /** Show the full text immediately, with no typing. */
  instant?: boolean;
}

/** Writes text out one character at a time, like a student filling in a notebook. */
export function TypedText({ text, speed = 22, instant = false }: TypedTextProps) {
  const showAll = instant || prefersReducedMotion();
  const [count, setCount] = useState(() => (showAll ? text.length : 0));

  useEffect(() => {
    setCount(showAll ? text.length : 0);
  }, [text, showAll]);

  useEffect(() => {
    if (showAll || count >= text.length) return;
    const id = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(id);
  }, [count, text, speed, showAll]);

  return (
    <>
      <span aria-hidden="true">{text.slice(0, count)}</span>{' '}
      <span className="sr-only">{text} </span>
    </>
)

}