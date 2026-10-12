import { cn } from '@/lib/cn';

// This file defines two React components: `MiniSpinner` and `FullPageMiniSpinner`.
// The `MiniSpinner` component renders an SVG MiniSpinner icon, which can be customized with additional class names passed via the `className` prop.
// The `FullPageMiniSpinner` component renders a full-page loading MiniSpinner with an optional label for accessibility purposes. 
// It uses the `MiniSpinner` component and centers it on the page with a background color and text color.
// The `cn` utility function is used to combine class names for the MiniSpinner SVG, allowing for conditional styling based on props.
// The `MiniSpinner` component uses the `animate-spin` class to apply a spinning animation to the SVG, 
// and it accepts an optional `className` prop for additional styling. 
// The `FullPageMiniSpinner` component provides a visually centered loading 
// indicator with a screen reader-friendly label, 
// making it suitable for use during data fetching or 
// other asynchronous operations in a React application.


const TICKS = 12;
const DURATION = 1; // seconds per full revolution

// Opacity of a tick at each of the 12 steps: bright head, then a fading tail
const STEPS = "1;0.85;0.7;0.55;0.4;0.3;0.25;0.2;0.15;0.15;0.15;0.15";

export function MiniSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("block size-4 shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: TICKS }, (_, i) => (
        <line
          key={i}
          x1="12"
          y1="2.5"
          x2="12"
          y2="6.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.15"
          transform={`rotate(${i * 30} 12 12)`}
        >
          <animate
            attributeName="opacity"
            values={STEPS}
            calcMode="discrete"
            dur={`${DURATION}s`}
            begin={`${(i * DURATION) / TICKS - DURATION}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}
    </svg>
  );
}

export function FullPageSpinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-white text-blue" role="status">
      <MiniSpinner className="h-8 w-8" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
