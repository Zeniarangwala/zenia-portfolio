import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const links = {
  email: 'zeniarangwala@gmail.com',
  linkedin: 'https://www.linkedin.com/in/zeniarangwala',
  // TODO: Zenia to confirm — add the file at public/resume.pdf
  resume: '/resume.pdf',
};

// Some image folders are being reorganised (e.g. greyhound/ → greyhound/final/).
// Returns the first path that exists in public/, so links work before and after.
export function asset(...candidates: string[]): string {
  const found = candidates.find((p) => existsSync(join(process.cwd(), 'public', p)));
  return found ?? candidates[0];
}

// Home page card details, keyed by project slug. Titles, covers and alt text
// come from each case study's frontmatter; this only adds the card extras.
// fit: 'cover' fills the card (photos), 'contain' shows the whole image (screens).
interface Card {
  tags: string[];
  fit: 'cover' | 'contain';
  hover: { src: string; fit: 'cover' | 'contain' };
}

export const cards: Record<string, Card> = {
  greyhound: {
    tags: ['Brand Identity', 'Strategy'],
    fit: 'cover',
    hover: {
      src: asset('/images/greyhound/final/postcards.jpg', '/images/greyhound/postcards.jpg'),
      fit: 'cover',
    },
  },
  clearspace: {
    tags: ['UX/UI', 'Mobile app'],
    fit: 'contain',
    hover: { src: '/images/clearspace/form-after-step3.png', fit: 'contain' },
  },
  'arrival-to-approval': {
    tags: ['Service Design', 'IBM Capstone'],
    fit: 'contain',
    hover: { src: '/images/arrival-to-approval/hifi-lesson.png', fit: 'contain' },
  },
  noise: {
    tags: ['Editorial', 'Typography'],
    fit: 'contain',
    hover: { src: '/images/noise/read-this-now-layered.png', fit: 'contain' },
  },
  kidcash: {
    tags: ['UX/UI', 'Mobile app'],
    fit: 'contain',
    hover: { src: '/images/kidcash/screen-goals-and-games.png', fit: 'contain' },
  },
};
