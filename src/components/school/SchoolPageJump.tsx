'use client';

import { useEffect, useId, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { schoolListTargetHref, type SchoolListTarget } from '@/components/school/listQuery';

/**
 * Jump straight to a page when a list has more than one page.
 * The parent only renders this when `totalPages` is greater than 1.
 */
export function SchoolPageJump({
  current,
  totalPages,
  list,
  onPage,
}: {
  current: number;
  totalPages: number;
  list?: SchoolListTarget;
  onPage?: (page: number) => void;
}) {
  const router = useRouter();
  const inputId = useId();
  const [value, setValue] = useState(String(current));

  useEffect(() => {
    setValue(String(current));
  }, [current]);

  const go = (event: FormEvent) => {
    event.preventDefault();
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    const target = Math.min(totalPages, Math.max(1, Math.floor(parsed)));
    setValue(String(target));
    if (target === current) return;
    if (onPage) {
      onPage(target);
      return;
    }
    router.push(list ? schoolListTargetHref(list, target) : `?page=${target}`);
  };

  return (
    <form className="school-pager-jump" onSubmit={go}>
      <label htmlFor={inputId}>Go to</label>
      <input
        id={inputId}
        type="number"
        inputMode="numeric"
        min={1}
        max={totalPages}
        value={value}
        aria-label={`Go to page, 1 to ${totalPages}`}
        onChange={(event) => setValue(event.target.value)}
      />
      <button type="submit" className="btn btn-primary school-pager-btn">
        Go
      </button>
    </form>
  );
}
