'use client';

import { useEffect } from 'react';

/** Parts of the homepage that rise into place when they are scrolled to. Neighbours are staggered. */
const REVEAL = [
  '.nb-big',
  '.nb-empty',
  '.nb-quick > a',
  '.nb-principal > *',
  '.nb-depts > li',
  '.nb-steps > li',
  '.nb-numbers',
  '.nb-facilities > a',
  '.nb-fees > div',
  '.nb-stars > li',
  '.nb-news > li',
  '.nb-events > li',
  '.nb-faculty > li',
  '.nb-closing h2',
].join(',');

/**
 * Adds the homepage's scroll effects (styles in home.css). Renders nothing.
 * Only parts below the fold are tagged, so nothing already on screen flickers, and without
 * JavaScript the page simply shows everything. Under reduced motion the reveal is a plain fade
 * and the figures do not count.
 */
export default function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.nb');
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const targets = Array.from(root.querySelectorAll<HTMLElement>(REVEAL)).filter(
      (element) => element.getBoundingClientRect().top > window.innerHeight,
    );
    for (const element of targets) {
      const index = element.parentElement ? Array.from(element.parentElement.children).indexOf(element) : 0;
      element.style.setProperty('--i', String(index % 4));
      element.setAttribute('data-nb-reveal', '');
    }

    // The figures count up from zero the first time they are seen, and always end on the real value.
    const countUp = (element: HTMLElement) => {
      const end = Number(element.textContent);
      if (!Number.isInteger(end) || end <= 0) return;
      const started = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - started) / 900, 1);
        element.textContent = String(Math.round(end * (1 - (1 - progress) ** 3)));
        if (progress < 1) requestAnimationFrame(tick);
        else element.textContent = String(end);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          if (element.hasAttribute('data-nb-reveal')) element.classList.add('is-in');
          if (!reduced && element.classList.contains('nb-numbers')) element.querySelectorAll<HTMLElement>('b').forEach(countUp);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    targets.forEach((element) => observer.observe(element));
    const numbers = root.querySelector<HTMLElement>('.nb-numbers');
    // No counting under reduced motion: the figures just stay as they are.
    if (numbers && !reduced && !targets.includes(numbers)) observer.observe(numbers);

    return () => {
      observer.disconnect();
      for (const element of targets) {
        element.removeAttribute('data-nb-reveal');
        element.classList.remove('is-in');
      }
    };
  }, []);

  return null;
}
