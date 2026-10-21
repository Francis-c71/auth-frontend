import type { ReactNode } from 'react';

export function AuthHeading({ title, description }: { title: string; description?: ReactNode }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-white text-center">{title}</h1>
      {description && <p className="mt-2 text-base leading-relaxed text-slate">{description}</p>}
    </div>
  );
}
