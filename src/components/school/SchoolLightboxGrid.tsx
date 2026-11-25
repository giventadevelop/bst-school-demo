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
      <ul className="card-grid">
        {photos.map((photo, position) => (
          <li key={`${photo.src}-${position}`}>
            <button
              type="button"
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setIndex(position);
              }}
              className="card w-full"
            >
              <span className="card-photo block aspect-[4/3]">
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              </span>
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
          className="sch-on-dark fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'color-mix(in srgb, var(--ink) 95%, transparent)' }}
          onClick={close}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="btn btn-line-light absolute right-4 top-4 h-11 w-11 rounded-full p-0"
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
                className="btn btn-line-light absolute left-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full p-0"
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
                className="btn btn-line-light absolute right-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full p-0"
              >
                <span className="sr-only">Next photo</span>
                <ChevronRight aria-hidden className="h-6 w-6" />
              </button>
            </>
          )}
          <figure className="max-h-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img src={current.src} alt={current.alt} className="max-h-[82vh] w-auto rounded-lg" />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {current.alt ? `${current.alt} · ` : ''}
              {index + 1} / {photos.length}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
