/** Keyframes used by the apparatus. Render once inside the stage <svg>. */
export function LabStyles() {
  return (
    <style>{`
      @keyframes lab-rise { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: .9; } 100% { transform: translateY(var(--rise)); opacity: 0; } }
      @keyframes lab-flicker { 0%, 100% { transform: scale(1, 1); } 50% { transform: scale(.94, 1.07); } }
      @keyframes lab-flow { to { stroke-dashoffset: -32; } }
      .lab-bubble { animation: lab-rise calc(1.1s / var(--lab-speed, 1)) linear infinite; }
      .lab-flicker { transform-box: fill-box; transform-origin: 50% 100%; animation: lab-flicker calc(.22s / var(--lab-speed, 1)) ease-in-out infinite; }
      .lab-flow { animation: lab-flow calc(.5s / var(--lab-speed, 1)) linear infinite; }
      @media (prefers-reduced-motion: reduce) { .lab-bubble, .lab-flicker, .lab-flow { animation: none; } }
    `}</style>
  );
}
