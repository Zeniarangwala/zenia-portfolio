export const links = {
  email: 'zeniarangwala@gmail.com',
  linkedin: 'https://www.linkedin.com/in/zeniarangwala',
  resume: '/resume.pdf',
};

// Home page card details, keyed by project slug. Titles, covers and alt text
// come from each case study's frontmatter; this only adds the card extras.
// thumb is the designed 16:10 card image shown at rest; hover crossfades to hover.src.
// fit: 'cover' fills the card (photos), 'contain' shows the whole image (screens).
interface Card {
  tags: string[];
  thumb: string;
  fit: 'cover' | 'contain';
  hover: { src: string; fit: 'cover' | 'contain' };
}

export const cards: Record<string, Card> = {
  greyhound: {
    tags: ['Brand Identity', 'Strategy'],
    thumb: '/images/thumbs/greyhound.webp',
    fit: 'cover',
    hover: { src: '/images/greyhound/final/postcards.webp', fit: 'contain' },
  },
  clearspace: {
    tags: ['UX/UI', 'Mobile app'],
    thumb: '/images/thumbs/clearspace.webp',
    fit: 'cover',
    hover: { src: '/images/clearspace/form-after-step3.png', fit: 'contain' },
  },
  'arrival-to-approval': {
    tags: ['Service Design', 'IBM Capstone'],
    thumb: '/images/thumbs/arrival-to-approval.webp',
    fit: 'cover',
    hover: { src: '/images/arrival-to-approval/hifi-lesson.png', fit: 'contain' },
  },
  noise: {
    tags: ['Editorial', 'Typography'],
    thumb: '/images/thumbs/noise.webp',
    fit: 'cover',
    hover: { src: '/images/noise/read-this-now-layered.png', fit: 'contain' },
  },
  kidcash: {
    tags: ['UX/UI', 'Mobile app'],
    thumb: '/images/thumbs/kidcash.webp',
    fit: 'cover',
    hover: { src: '/images/kidcash/screen-goals-and-games.png', fit: 'contain' },
  },
};
