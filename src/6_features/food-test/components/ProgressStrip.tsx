interface ProgressStripProps {
  total: number;
  completed: number;
  currentIndex: number;
  started: boolean;
  done: boolean;
}

export function ProgressStrip({ total, completed, currentIndex, started, done }: ProgressStripProps) {
  const label = done ? 'Finished' : started ? `Step ${Math.max(currentIndex + 1, 1)} of ${total}` : 'Press play to begin';
  return (
    <div className="space-y-3">
      <p aria-live="polite" className="text-sm font-semibold text-foreground">
        {label}
      </p>
      <ol aria-hidden="true" className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <li
            key={i}
            className={`h-2 flex-1 border border-outline ${
              i < completed ? 'bg-outline' : i === currentIndex ? 'bg-outline/40' : 'bg-transparent'
            }`}
          />
        ))}
      </ol>
    </div>
  );
}