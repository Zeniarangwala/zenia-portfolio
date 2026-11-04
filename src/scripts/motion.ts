/*
  The site's motion layer. Plain TypeScript, no libraries.

  Nothing here runs when the visitor asks for less motion, either through their
  device setting or the "Reduce motion" switch in the site's panel. Both can be
  flipped while the page is open, so every effect checks `calm()` as it runs
  and puts things back to rest when motion is turned off.

  Pointer effects (tile parallax, card tilt, view cursor) only run with a fine
  pointer, so phones and tablets get the static page plus scroll effects.
*/

const root = document.documentElement;
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

const calm = () => reducedQuery.matches || root.dataset.motion === 'reduce';
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Calls every listener when motion is switched on or off. */
const motionListeners: Array<() => void> = [];
const onMotionChange = (fn: () => void) => motionListeners.push(fn);
const notifyMotion = () => motionListeners.forEach((fn) => fn());
reducedQuery.addEventListener('change', notifyMotion);
new MutationObserver(notifyMotion).observe(root, { attributes: true, attributeFilter: ['data-motion'] });

/** One rAF-throttled scroll handler shared by every scroll effect. */
const scrollEffects: Array<() => void> = [];
let scrollQueued = false;
const runScrollEffects = () => {
  scrollQueued = false;
  scrollEffects.forEach((fn) => fn());
};
const queueScroll = () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(runScrollEffects);
};
addEventListener('scroll', queueScroll, { passive: true });
addEventListener('resize', queueScroll);
onMotionChange(queueScroll);

/* ---------- Header mark: turns as you scroll down the page ---------- */
const mark = document.querySelector<SVGElement>('[data-spin]');
if (mark) {
  scrollEffects.push(() => {
    if (calm()) {
      mark.style.removeProperty('--spin');
      return;
    }
    const max = root.scrollHeight - innerHeight;
    const progress = max > 0 ? scrollY / max : 0;
    mark.style.setProperty('--spin', `${(progress * 360).toFixed(1)}deg`);
  });
}

/* ---------- Hero tiles: drift with the pointer and scroll, by depth ---------- */
const collage = document.querySelector<HTMLElement>('[data-collage]');
if (collage) {
  const tiles = Array.from(collage.querySelectorAll<HTMLElement>('.tile'));
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let scrollOffset = 0;
  let frame = 0;

  const paint = () => {
    tiles.forEach((tile) => {
      const depth = Number(tile.dataset.depth || 0.5);
      const x = current.x * depth;
      const y = current.y * depth - scrollOffset * depth;
      tile.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
    });
  };

  const tick = () => {
    current.x = lerp(current.x, target.x, 0.08);
    current.y = lerp(current.y, target.y, 0.08);
    paint();
    const settled = Math.abs(current.x - target.x) < 0.05 && Math.abs(current.y - target.y) < 0.05;
    frame = settled ? 0 : requestAnimationFrame(tick);
  };
  const start = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  addEventListener(
    'pointermove',
    (e) => {
      if (calm() || !finePointer.matches || e.pointerType !== 'mouse') return;
      // ±22px at the screen edges, scaled per tile by depth.
      target.x = (e.clientX / innerWidth - 0.5) * 44;
      target.y = (e.clientY / innerHeight - 0.5) * 44;
      start();
    },
    { passive: true },
  );
  document.addEventListener('mouseleave', () => {
    if (calm()) return;
    target.x = 0;
    target.y = 0;
    start();
  });

  scrollEffects.push(() => {
    if (calm()) {
      cancelAnimationFrame(frame);
      frame = 0;
      target.x = target.y = current.x = current.y = scrollOffset = 0;
      tiles.forEach((tile) => (tile.style.translate = ''));
      return;
    }
    // Tiles rise at different speeds as the hero scrolls away.
    scrollOffset = clamp(scrollY, 0, innerHeight) * 0.12;
    paint();
  });
}

/* ---------- Ticker: slides sideways with scroll ---------- */
const ticker = document.querySelector<HTMLElement>('[data-ticker]');
const track = document.querySelector<HTMLElement>('[data-ticker-track]');
if (ticker && track) {
  scrollEffects.push(() => {
    if (calm()) {
      track.style.translate = '';
      return;
    }
    const rect = ticker.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    // Moves about a third of a screen width while it crosses the viewport.
    const progress = (innerHeight - rect.top) / (innerHeight + rect.height);
    track.style.translate = `${(-progress * innerWidth * 0.35).toFixed(1)}px 0`;
  });
}

/* ---------- Footer line: words fill in as it scrolls into view ---------- */
document.querySelectorAll<HTMLElement>('[data-words]').forEach((line) => {
  const text = line.textContent?.trim() ?? '';
  line.setAttribute('aria-label', text);
  line.textContent = '';
  const words = text.split(/\s+/).map((word, i, all) => {
    const span = document.createElement('span');
    span.className = 'word';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = word;
    line.append(span, i < all.length - 1 ? ' ' : '');
    return span;
  });

  scrollEffects.push(() => {
    if (calm()) {
      words.forEach((w) => w.style.removeProperty('--fill'));
      line.classList.remove('is-filling');
      return;
    }
    line.classList.add('is-filling');
    const top = line.getBoundingClientRect().top;
    const atBottom = innerHeight + scrollY >= root.scrollHeight - 4;
    // From 95% down the screen to 60%; the page end always finishes it.
    const progress = atBottom ? 1 : clamp((innerHeight * 0.95 - top) / (innerHeight * 0.35), 0, 1);
    words.forEach((w, i) => {
      const start = (i / words.length) * 0.7;
      const t = clamp((progress - start) / 0.3, 0, 1);
      w.style.setProperty('--fill', t.toFixed(3));
    });
  });
});

/* ---------- Work cards: tilt toward the pointer, with a light sheen ---------- */
const cards = Array.from(document.querySelectorAll<HTMLElement>('.card'));
cards.forEach((card) => {
  const media = card.querySelector<HTMLElement>('.card-media');
  if (!media) return;
  let frame = 0;
  let px = 0.5;
  let py = 0.5;

  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    media.style.removeProperty('--rx');
    media.style.removeProperty('--ry');
    media.style.removeProperty('--gx');
    media.style.removeProperty('--gy');
    card.classList.remove('is-tilting');
  };

  card.addEventListener('pointermove', (e) => {
    if (calm() || e.pointerType !== 'mouse') return reset();
    const rect = media.getBoundingClientRect();
    px = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    py = clamp((e.clientY - rect.top) / rect.height, 0, 1);
    card.classList.add('is-tilting');
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      // Up to 5° each way; the lead card is wider, so it tilts a touch less.
      const max = card.matches(':first-child') ? 3 : 5;
      media.style.setProperty('--ry', `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
      media.style.setProperty('--rx', `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
      media.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
      media.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
    });
  });
  card.addEventListener('pointerleave', reset);
  onMotionChange(() => calm() && reset());
});

/* ---------- "View" cursor: a cobalt bubble that follows the pointer over project images ---------- */
// The card's link stretches over the whole card, so the image itself never gets
// pointer events. Instead each card checks whether the pointer is over its image.
if (cards.length) {
  const bubble = document.createElement('div');
  bubble.className = 'view-cursor';
  bubble.setAttribute('aria-hidden', 'true');
  bubble.innerHTML = 'View <span>→</span>';
  document.body.append(bubble);

  const pos = { x: 0, y: 0 };
  const goal = { x: 0, y: 0 };
  let frame = 0;
  let owner: HTMLElement | null = null;

  const place = () => {
    bubble.style.translate = `${pos.x.toFixed(1)}px ${pos.y.toFixed(1)}px`;
  };
  const tick = () => {
    pos.x = lerp(pos.x, goal.x, 0.3);
    pos.y = lerp(pos.y, goal.y, 0.3);
    place();
    frame = owner ? requestAnimationFrame(tick) : 0;
  };
  const hide = () => {
    owner?.classList.remove('is-viewing');
    owner = null;
    bubble.classList.remove('is-visible');
  };
  const overMedia = (card: HTMLElement, x: number, y: number) => {
    const r = card.querySelector('.card-media')?.getBoundingClientRect();
    return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };
  const show = (card: HTMLElement, x: number, y: number) => {
    if (owner !== card) {
      hide();
      owner = card;
      card.classList.add('is-viewing');
      pos.x = x;
      pos.y = y;
      place();
      bubble.classList.add('is-visible');
    }
    goal.x = x;
    goal.y = y;
    if (!frame) frame = requestAnimationFrame(tick);
  };

  cards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      if (calm() || !finePointer.matches || e.pointerType !== 'mouse') return hide();
      if (overMedia(card, e.clientX, e.clientY)) show(card, e.clientX, e.clientY);
      else if (owner === card) hide();
    });
    card.addEventListener('pointerleave', hide);
  });
  addEventListener('blur', hide);
  // Scrolling moves the page under a still pointer, so check it is still over the image.
  addEventListener(
    'scroll',
    () => {
      if (owner && !overMedia(owner, goal.x, goal.y)) hide();
    },
    { passive: true },
  );
  onMotionChange(() => calm() && hide());
}

runScrollEffects();
