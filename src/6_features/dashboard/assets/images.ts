import coverPage from './coverPage.jpg';
import bioLab from './bioLab.png';

/** To use real photos, add the files here and change these two imports. */
export const DASHBOARD_IMAGES = {
  book: { src: coverPage, alt: 'Cover of the practical book' },
  lab: { src: bioLab, alt: 'A biological laboratory with microscopes' },
} as const;