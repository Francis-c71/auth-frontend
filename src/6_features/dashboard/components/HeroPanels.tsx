import { useEffect, useState, type ReactNode } from 'react';
import { DASHBOARD_IMAGES } from '../assets/images';

/** True when the viewport is at least `px` wide. */
function useMinWidth(px: number) {
  const query = `(min-width: ${px}px)`;
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    media.addEventListener('change', update);
    update();
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}

function Panel({ image, children }: { image: { src: string; alt: string }; children?: ReactNode }) {
  return (
    <figure className="relative -ml-px flex min-h-[420px] items-end overflow-hidden border border-border first:ml-0">
      <img src={image.src} alt={image.alt} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      {children && <figcaption className="relative z-10 p-8 sm:p-12">{children}</figcaption>}
    </figure>
  );
}

/** The book cover beside the lab. On small screens only the book is rendered. */
export function HeroPanels() {
  const showLab = useMinWidth(768);

  return (
    <div className={`grid w-full ${showLab ? 'grid-cols-2' : 'grid-cols-1'}`}>
      <Panel image={DASHBOARD_IMAGES.book}>
      </Panel>
      {showLab && <Panel image={DASHBOARD_IMAGES.lab} />}
    </div>
  );
}