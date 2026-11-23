'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type Photo = { src: string; alt: string };

export default function SchoolLightboxGrid({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setIndex(null);
    openerRef.current?.focus();
  }, []);
  const step = useCallback(
    (delta: number) => setIndex((current) => (current === null ? current : (current + delta + photos.length) % photos.length)),
    [photos.length]
  );

  const isOpen = index !== null;

  // Runs when the dialog opens or closes, not on every step, so focus goes to Close only once.
  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, step]);

  const current = index === null ? null : photos[index];

  return (
    <>
      <ul className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>li]:mb-4">
        {photos.map((photo, position) => (
          <li key={`${photo.src}-${position}`} className="break-inside-avoid">
            <button
              type="button"
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setIndex(position);
              }}
              className="group block w-full overflow-hidden rounded-xl border border-sch-border bg-sch-surface-alt"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="w-full transition-transform duration-500 group-hover:scale-105"
              />
              <span className="sr-only">Open photo {position + 1} of {photos.length}</span>
            </button>
          </li>
        ))}
      </ul>

      {current && index !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${index + 1} of ${photos.length}`}
          className="sch-on-dark fixed inset-0 z-50 flex items-center justify-center bg-sch-ink/95 p-4"
          onClick={close}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-sch-on-ink/10 text-sch-on-ink hover:bg-sch-on-ink/20"
          >
            <span className="sr-only">Close</span>
            <X aria-hidden className="h-5 w-5" />
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-sch-on-ink/10 text-sch-on-ink hover:bg-sch-on-ink/20"
              >
                <span className="sr-only">Previous photo</span>
                <ChevronLeft aria-hidden className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-sch-on-ink/10 text-sch-on-ink hover:bg-sch-on-ink/20"
              >
                <span className="sr-only">Next photo</span>
                <ChevronRight aria-hidden className="h-6 w-6" />
              </button>
            </>
          )}
          <figure className="max-h-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img src={current.src} alt={current.alt} className="max-h-[82vh] w-auto rounded-lg" />
            <figcaption className="mt-3 text-center text-sm text-sch-on-ink-muted">
              {current.alt ? `${current.alt} · ` : ''}
              {index + 1} / {photos.length}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
