import bookCover from './book-cover.svg';
import lab from './lab.svg';

/** To use real photos, add the files here and change these two imports. */
export const DASHBOARD_IMAGES = {
  book: { src: bookCover, alt: 'Cover of the practical book' },
  lab: { src: lab, alt: 'A laboratory bench with glassware' },
} as const;