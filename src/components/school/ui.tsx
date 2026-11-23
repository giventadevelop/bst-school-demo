import Link from 'next/link';
import type { ReactNode } from 'react';

/** Shared, server-safe building blocks. Visuals come from school-ds.css (Direction A). */

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`wrap ${className}`}>{children}</div>;
}

export type Crumb = { label: string; href?: string };

export function PageBanner({
  eyebrow,
  title,
  intro,
  crumbs = [],
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  crumbs?: Crumb[];
}) {
  return (
    <header className="alt">
      <Container className="py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="muted mb-6 text-sm">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/">Home</Link>
            </li>
            {crumbs.map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                <span aria-hidden="true">/</span>
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span aria-current="page">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="kicker">{eyebrow}</p>}
        <h1 className="h2">{title}</h1>
        {intro && <p className="lead mt-4 max-w-2xl">{intro}</p>}
      </Container>
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  action,
  onDark = false,
}: {
  eyebrow?: string;
  title: string;
  action?: { href: string; label: string };
  onDark?: boolean;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className={`kicker ${onDark ? 'light' : ''}`}>{eyebrow}</p>}
        <h2 className="h2">{title}</h2>
      </div>
      {action && <TextLink href={action.href} label={action.label} onDark={onDark} />}
    </div>
  );
}

export function TextLink({ href, label, onDark = false }: { href: string; label: string; onDark?: boolean }) {
  return (
    <Link href={href} className={`btn btn-text ${onDark ? 'btn-line-light' : ''}`}>
      {label} <span aria-hidden="true">→</span>
    </Link>
  );
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'gold' | 'outline' | 'outline-dark';
}) {
  const styles = {
    primary: 'btn-primary',
    gold: 'btn-gold',
    outline: 'btn-outline',
    'outline-dark': 'btn-line-light',
  }[variant];
  return (
    <Link href={href} className={`btn ${styles}`}>
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: { href: string; label: string } }) {
  return (
    <div className="panel c-red">
      <p className="h5">{title}</p>
      {hint && <p className="body mt-2">{hint}</p>}
      {action && (
        <div className="mt-4">
          <TextLink href={action.href} label={action.label} />
        </div>
      )}
    </div>
  );
}

export function NotFoundBlock({ what, backHref, backLabel }: { what: string; backHref: string; backLabel: string }) {
  return (
    <Container className="py-20">
      <EmptyState
        title={`We couldn't find that ${what}.`}
        hint="It may have been moved or unpublished."
        action={{ href: backHref, label: backLabel }}
      />
    </Container>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

const CARD_COLOURS = ['c-blue', 'c-gold', 'c-plum', 'c-green', 'c-teal', 'c-orange'] as const;

export function colourAt(index: number) {
  return CARD_COLOURS[index % CARD_COLOURS.length];
}

export function PersonCard({
  name,
  role,
  detail,
  imageUrl,
  colour = 'c-blue',
}: {
  name: string;
  role?: string;
  detail?: string;
  imageUrl?: string;
  colour?: string;
}) {
  return (
    <article className={`card stripe ${colour}`}>
      <div className="aspect-square bg-[var(--c50,#F6F6F6)]">
        {imageUrl ? (
          <img src={imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div aria-hidden className="ct flex h-full w-full items-center justify-center text-3xl font-bold">
            {initials(name) || '·'}
          </div>
        )}
      </div>
      <div className="px-4 py-4">
        <h3 className="h5">{name}</h3>
        {role && <p className="ct text-sm font-semibold">{role}</p>}
        {detail && <p className="muted text-sm">{detail}</p>}
      </div>
    </article>
  );
}

export function FeatureCard({
  href,
  title,
  summary,
  imageUrl,
  tag,
  colour = 'c-green',
}: {
  href: string;
  title: string;
  summary?: string;
  imageUrl?: string;
  tag?: string;
  colour?: string;
}) {
  return (
    <Link href={href} className={`card stripe ${colour}`} style={{ textDecoration: 'none', color: 'var(--ink)' }}>
      <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 3', background: 'var(--mist)' }}>
        {imageUrl ? (
          <img src={imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="ph ph-green absolute inset-0" />
        )}
        {tag && <span className="tag t-solid absolute left-3 top-3">{tag}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="h5">{title}</h3>
        {summary && <p className="body line-clamp-3 text-[15px] leading-6">{summary}</p>}
        <span className="btn btn-text mt-auto">Read more <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  );
}

export function parseDate(value?: string | null): Date | null {
  if (!value?.trim()) return null;
  const date = new Date(value.includes('T') ? value : `${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value?: string | null): string {
  const date = parseDate(value);
  if (!date) return value || '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function DateBadge({ value, colour = 'c-red' }: { value?: string | null; colour?: string }) {
  const date = parseDate(value);
  return (
    <div aria-hidden className={`date ${colour}`}>
      <b>{date ? date.getDate() : '–'}</b>
      <span>{date ? date.toLocaleDateString('en-IN', { month: 'short' }) : ''}</span>
    </div>
  );
}

/** Title, summary and body of a school content record, with an optional lead image. */
export function Article({ summary, body, imageUrl }: { summary?: string; body?: string; imageUrl?: string }) {
  return (
    <Container className="py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,720px)_1fr]">
        <div>
          {summary && <p className="h4 mb-6 max-w-[56ch]">{summary}</p>}
          {body ? (
            <div className="sch-prose">{body}</div>
          ) : (
            !summary && <p className="muted">Details for this page have not been published yet.</p>
          )}
        </div>
        {imageUrl && (
          <div className="lg:justify-self-end">
            <img src={imageUrl} alt="" className="aspect-[4/5] w-full max-w-sm rounded-lg object-cover" />
          </div>
        )}
      </div>
    </Container>
  );
}
