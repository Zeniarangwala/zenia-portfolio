/*
  The site's motion layer. Plain TypeScript, no libraries.

  Nothing here runs when the visitor asks for less motion, either through their
  device setting or the "Reduce motion" switch in the site's panel. Both can be
  flipped while the page is open, so every effect checks `calm()` as it runs
  and puts things back to rest when motion is turned off.

  Pointer effects (pattern glow, card tilt, view cursor) only run with a fine
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

/* ---------- Hero pattern: a quiet field of dots and sparkles ---------- */
const canvas = document.querySelector<HTMLCanvasElement>('[data-pattern]');
const ctx = canvas?.getContext('2d');
if (canvas && ctx) {
  const GAP = 30; // px between marks
  const REACH = 150; // px around the mouse that lights up
  let width = 0;
  let height = 0;
  let frame = 0;
  let inView = true;
  let time = 0;
  let last = 0;
  const mouse = { x: -9999, y: -9999, on: 0, target: 0 };
  let colors = { mark: '92 87 106', accent: '46 70 209' };

  const readColors = () => {
    const css = getComputedStyle(root);
    const rgb = (name: string, fallback: string) => {
      const hex = css.getPropertyValue(name).trim().replace('#', '');
      if (hex.length !== 6) return fallback;
      return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ');
    };
    colors = { mark: rgb('--muted', colors.mark), accent: rgb('--accent', colors.accent) };
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };

  const sparkle = (x: number, y: number, r: number, turn: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(turn);
    ctx.beginPath();
    for (let k = 0; k < 4; k++) {
      ctx.rotate(Math.PI / 2);
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(r * 0.12, -r * 0.12, r, 0);
    }
    ctx.fill();
    ctx.restore();
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const wide = width >= 1000;
    const cols = Math.ceil(width / GAP) + 1;
    const rows = Math.ceil(height / GAP) + 1;
    const offX = (width - (cols - 1) * GAP) / 2;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = offX + i * GAP;
        const y = j * GAP;
        // Keep the headline side quieter; the pattern grows toward the right.
        const fade = wide ? 0.3 + 0.7 * clamp((x / width - 0.35) / 0.4, 0, 1) : 0.55;
        // Fade out at the top and bottom edges so the field has no hard border.
        const edge = Math.min(1, y / 60, (height - y) / 60);
        if (edge <= 0) continue;
        // A slow diagonal wave.
        const wave = (Math.sin(i * 0.35 + j * 0.25 - time * 0.6) + 1) / 2;
        // Mouse glow.
        const d = Math.hypot(x - mouse.x, y - mouse.y);
        const glow = mouse.on * Math.max(0, 1 - d / REACH) ** 2 * (0.3 + 0.7 * fade);
        const alpha = (0.1 + wave * 0.16) * fade * edge + glow * 0.6;
        const color = glow > 0.02 ? colors.accent : colors.mark;
        ctx.fillStyle = `rgb(${color} / ${alpha.toFixed(3)})`;
        const isSparkle = (i + j * 3) % 11 === 0;
        if (isSparkle) {
          sparkle(x, y, 3.2 + wave * 1.6 + glow * 3, time * 0.25 + i);
        } else {
          ctx.beginPath();
          ctx.arc(x, y, 1.1 + wave * 0.7 + glow * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  };

  const area = canvas.closest<HTMLElement>('.hero, .about-hero') ?? canvas.parentElement!;

  const tick = (now: number) => {
    frame = 0;
    if (calm() || !inView || document.hidden) return draw();
    const dt = last ? Math.min(now - last, 100) / 1000 : 0;
    last = now;
    time += dt;
    mouse.on = lerp(mouse.on, mouse.target, 0.08);
    draw();
    frame = requestAnimationFrame(tick);
  };
  const start = () => {
    if (frame || calm() || !inView) return;
    last = 0;
    frame = requestAnimationFrame(tick);
  };

  area.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.target = 1;
      start();
    },
    { passive: true },
  );
  area.addEventListener('pointerleave', () => {
    mouse.target = 0;
    start();
  });

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    start();
  }).observe(canvas);
  document.addEventListener('visibilitychange', start);
  // Contrast changes swap the colours; motion changes stop or restart the wave.
  new MutationObserver(() => {
    readColors();
    draw();
  }).observe(root, { attributes: true, attributeFilter: ['data-contrast'] });
  onMotionChange(() => {
    if (calm()) {
      mouse.on = mouse.target = 0;
      draw();
    } else start();
  });
  readColors();
  resize();
  start();
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

/* ---------- About: photo frame drifts with the mouse; sparkle turns with scroll ---------- */
// Only reacts to the visitor (mouse or scroll), so nothing plays on its own.
const archFrame = document.querySelector<HTMLElement>('[data-arch]');
if (archFrame) {
  const hero = archFrame.closest<HTMLElement>('.about-hero') ?? archFrame;
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let frame = 0;
  const paint = () => {
    archFrame.style.setProperty('--ax', `${current.x.toFixed(2)}px`);
    archFrame.style.setProperty('--ay', `${current.y.toFixed(2)}px`);
  };
  const tick = () => {
    current.x = lerp(current.x, target.x, 0.1);
    current.y = lerp(current.y, target.y, 0.1);
    paint();
    const settled = Math.abs(current.x - target.x) < 0.05 && Math.abs(current.y - target.y) < 0.05;
    frame = settled ? 0 : requestAnimationFrame(tick);
  };
  hero.addEventListener('pointermove', (e) => {
    if (calm() || e.pointerType !== 'mouse') return;
    const r = archFrame.getBoundingClientRect();
    // Up to 10px, opposite the mouse, so the outline feels like it sits behind.
    target.x = clamp((r.left + r.width / 2 - e.clientX) / r.width, -1, 1) * 10;
    target.y = clamp((r.top + r.height / 2 - e.clientY) / r.height, -1, 1) * 10;
    if (!frame) frame = requestAnimationFrame(tick);
  });
  hero.addEventListener('pointerleave', () => {
    target.x = target.y = 0;
    if (!frame) frame = requestAnimationFrame(tick);
  });
  scrollEffects.push(() => {
    if (calm()) {
      cancelAnimationFrame(frame);
      frame = 0;
      target.x = target.y = current.x = current.y = 0;
      archFrame.style.removeProperty('--ax');
      archFrame.style.removeProperty('--ay');
      archFrame.style.removeProperty('--spark');
      return;
    }
    archFrame.style.setProperty('--spark', `${(scrollY * 0.25).toFixed(1)}deg`);
  });
}

/* ---------- About: experience timeline draws down as you scroll ---------- */
const timeline = document.querySelector<HTMLElement>('[data-timeline]');
if (timeline) {
  const items = Array.from(timeline.querySelectorAll<HTMLElement>(':scope > li'));
  scrollEffects.push(() => {
    if (calm()) {
      timeline.classList.remove('is-tracking');
      timeline.style.removeProperty('--line');
      items.forEach((li) => li.classList.remove('is-reached'));
      return;
    }
    timeline.classList.add('is-tracking');
    const r = timeline.getBoundingClientRect();
    // The line's tip follows a point 80% down the screen.
    const tip = clamp(innerHeight * 0.8 - r.top, 0, r.height);
    const atBottom = innerHeight + scrollY >= root.scrollHeight - 4;
    const progress = atBottom ? 1 : tip / Math.max(r.height, 1);
    timeline.style.setProperty('--line', progress.toFixed(3));
    items.forEach((li) => {
      const dot = li.offsetTop + 8;
      li.classList.toggle('is-reached', atBottom || dot <= tip);
    });
  });
}

/* ---------- About: Mile Markers, a half marathon run by scrolling ---------- */
// The route draws in, a runner travels it, and the 3, 6 and 9 mile markers
// light up as it passes them, while the distance counts up to 13.1 miles. All of it is
// tied to scroll position, so it moves only when the visitor scrolls. With
// motion off, the route shows complete and every marker is lit.
const miles = document.querySelector<HTMLElement>('[data-miles]');
const routeDraw = miles?.querySelector<SVGPathElement>('.route-draw');
const route = miles?.querySelector<SVGPathElement>('[data-route]');
const runner = miles?.querySelector<SVGCircleElement>('[data-runner]');
const odometer = miles?.querySelector<HTMLElement>('[data-odometer]');
if (miles && routeDraw && route && runner && odometer) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const total = route.getTotalLength();
  const HALF = 13.1; // miles
  const marks = [3, 6, 9].map((mi) => {
    const at = mi / HALF;
    const p = route.getPointAtLength(at * total);
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'mile-mark');
    g.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
    const dot = document.createElementNS(svgNS, 'circle');
    dot.setAttribute('r', '5');
    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('y', '-14');
    label.setAttribute('text-anchor', 'middle');
    label.textContent = `${mi} mi`;
    g.append(dot, label);
    route.after(g);
    return { g, at };
  });
  const flag = miles.querySelector<SVGGElement>('.miles-flag');

  scrollEffects.push(() => {
    let progress = 1;
    if (!calm()) {
      const r = (route.ownerSVGElement ?? miles).getBoundingClientRect();
      const atBottom = innerHeight + scrollY >= root.scrollHeight - 4;
      // Starts once the route peeks in at the bottom of the screen and finishes
      // as it rises to about the middle; the page end always finishes the run.
      progress = atBottom ? 1 : clamp((innerHeight * 0.9 - r.top) / (innerHeight * 0.4), 0, 1);
    }
    const moving = !calm();
    routeDraw.style.strokeDashoffset = String(1 - progress);
    const p = route.getPointAtLength(progress * total);
    runner.setAttribute('cx', p.x.toFixed(1));
    runner.setAttribute('cy', p.y.toFixed(1));
    runner.classList.toggle('is-running', moving && progress > 0.01 && progress < 0.995);
    marks.forEach((m) => m.g.classList.toggle('is-passed', progress >= m.at));
    flag?.classList.toggle('is-up', progress >= 0.995);
    odometer.textContent = (progress * HALF).toFixed(1);
  });
}

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
