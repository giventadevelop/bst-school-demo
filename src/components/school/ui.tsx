import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

/** Shared, server-safe building blocks for the school site. Styling comes from the `sch-*` tokens. */

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 ${className}`}>{children}</div>;
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
    <header className="sch-on-dark sch-weave bg-sch-ink text-sch-on-ink">
      <Container className="pb-12 pt-10 sm:pb-16 sm:pt-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-sch-on-ink-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-sch-gold-bright">
                Home
              </Link>
            </li>
            {crumbs.map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                <ChevronRight aria-hidden className="h-3.5 w-3.5" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-sch-gold-bright">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-sch-on-ink">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sch-gold-bright">{eyebrow}</p>
        )}
        <h1 className="max-w-3xl font-sch-display text-4xl font-semibold leading-[1.1] sm:text-5xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sch-on-ink-muted">{intro}</p>}
      </Container>
      <div className="sch-kasavu" aria-hidden />
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
        {eyebrow && (
          <p
            className={`mb-2 text-xs font-semibold uppercase tracking-[0.2em] ${
              onDark ? 'text-sch-gold-bright' : 'text-sch-laterite'
            }`}
          >
            {eyebrow}
          </p>
        )}
        <h2 className="font-sch-display text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
      </div>
      {action && <TextLink href={action.href} label={action.label} onDark={onDark} />}
    </div>
  );
}

export function TextLink({ href, label, onDark = false }: { href: string; label: string; onDark?: boolean }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline ${
        onDark ? 'text-sch-gold-bright' : 'text-sch-accent'
      }`}
    >
      {label}
      <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
    primary: 'bg-sch-accent text-sch-on-accent hover:bg-sch-accent-strong',
    gold: 'bg-sch-gold-bright text-sch-ink hover:brightness-95',
    outline: 'border border-sch-accent text-sch-accent hover:bg-sch-accent hover:text-sch-on-accent',
    'outline-dark': 'border border-sch-on-ink/50 text-sch-on-ink hover:border-sch-gold-bright hover:text-sch-gold-bright',
  }[variant];
  return (
    <Link
      href={href}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${styles}`}
    >
      {children}
    </Link>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: { href: string; label: string } }) {
  return (
    <div className="rounded-xl border border-dashed border-sch-border-input/60 bg-sch-surface-alt/50 px-6 py-12 text-center">
      <p className="font-sch-display text-xl font-semibold">{title}</p>
      {hint && <p className="mx-auto mt-2 max-w-md text-sm text-sch-muted">{hint}</p>}
      {action && (
        <div className="mt-5">
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

export function PersonCard({
  name,
  role,
  detail,
  imageUrl,
}: {
  name: string;
  role?: string;
  detail?: string;
  imageUrl?: string;
}) {
  return (
    <article className="sch-card flex items-center gap-4 p-4">
      <div className="sch-arch h-20 w-16 shrink-0 bg-sch-surface-alt">
        {imageUrl ? (
          <img src={imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div aria-hidden className="flex h-full w-full items-center justify-center font-sch-display text-lg font-semibold text-sch-accent">
            {initials(name) || '·'}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold leading-snug">{name}</h3>
        {role && <p className="text-sm text-sch-laterite">{role}</p>}
        {detail && <p className="mt-0.5 text-sm text-sch-muted">{detail}</p>}
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
}: {
  href: string;
  title: string;
  summary?: string;
  imageUrl?: string;
  tag?: string;
}) {
  return (
    <Link href={href} className="sch-card group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-sch-surface-alt">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div aria-hidden className="sch-weave flex h-full w-full items-center justify-center bg-sch-accent">
            <span className="font-sch-display text-5xl font-semibold text-sch-gold-bright">{title.charAt(0)}</span>
          </div>
        )}
        {tag && (
          <span className="absolute left-3 top-3 rounded-full bg-sch-ink px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sch-on-ink">
            {tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-sch-display text-xl font-semibold leading-snug group-hover:text-sch-accent">{title}</h3>
        {summary && <p className="mt-2 line-clamp-3 text-sm text-sch-muted">{summary}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-sch-accent">
          Read more
          <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
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

export function DateBadge({ value }: { value?: string | null }) {
  const date = parseDate(value);
  return (
    <div
      aria-hidden
      className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-sch-ink text-sch-on-ink"
    >
      <span className="font-sch-display text-2xl font-semibold leading-none">{date ? date.getDate() : '–'}</span>
      <span className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-sch-gold-bright">
        {date ? date.toLocaleDateString('en-IN', { month: 'short' }) : ''}
      </span>
    </div>
  );
}

/** Title, summary and body of a school content record, with an optional lead image. */
export function Article({ summary, body, imageUrl }: { summary?: string; body?: string; imageUrl?: string }) {
  return (
    <Container className="py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,720px)_1fr]">
        <div>
          {summary && <p className="mb-6 font-sch-display text-2xl leading-snug text-sch-accent">{summary}</p>}
          {body ? (
            <div className="sch-prose">{body}</div>
          ) : (
            !summary && <p className="text-sch-muted">Details for this page have not been published yet.</p>
          )}
        </div>
        {imageUrl && (
          <div className="lg:justify-self-end">
            <div className="sch-arch w-full max-w-sm border-4 border-sch-surface shadow-[var(--sch-shadow-pop)]">
              <img src={imageUrl} alt="" className="aspect-[3/4] w-full object-cover" />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
