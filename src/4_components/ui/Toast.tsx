
import { useEffect, useState } from 'react';

type ToastProps = {
  message: string;
  onDismiss: () => void;
};

export function ErrorToast({ message, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const animation = requestAnimationFrame(() => {
      setVisible(true);
    });

    const timer = window.setTimeout(() => {
      setVisible(false);
      setMounted(false);
      onDismiss();
    }, 5000);

    return () => {
      cancelAnimationFrame(animation);
      window.clearTimeout(timer);
    };
  }, [message, onDismiss]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[9999] flex justify-center">
      <div
        role="alert"
        className={`pointer-events-auto mt-4 flex w-[calc(100%-2rem)] max-w-md items-center gap-3 rounded-xl border border-red-300 bg-red-100 px-4 py-3 text-red-700 shadow-xl transition-all duration-500 ease-out ${
          visible
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        }`}
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-current font-bold">
          !
        </span>

        <p className="min-w-0 flex-1 break-words text-sm font-medium">
          {message}
        </p>

        <button
          type="button"
          onClick={() => {
            setVisible(false);
            setMounted(false);
            onDismiss();
          }}
          aria-label="Dismiss notification"
          className="shrink-0 rounded p-1 text-xl leading-none hover:bg-red-200"
        >
          ×
        </button>
      </div>
    </div>
  );
}



export function SuccessToast({ message, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => {
      setVisible(true);
    });

    const timer = window.setTimeout(onDismiss, 5000);

    return () => {
      cancelAnimationFrame(animation);
      window.clearTimeout(timer);
    };
  }, [message, onDismiss]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[9999] flex justify-center">
      <div
        role="status"
        className={`pointer-events-auto mt-4 flex w-[calc(100%-2rem)] max-w-md items-center gap-3 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-700 shadow-xl transition-all duration-500 ease-out ${
          visible
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        }`}
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-current font-bold">
          ✓
        </span>

        <p className="min-w-0 flex-1 break-words text-sm font-medium">
          {message}
        </p>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 rounded p-1 text-xl leading-none hover:bg-green-100"
        >
          ×
        </button>
      </div>
    </div>
  );
}
