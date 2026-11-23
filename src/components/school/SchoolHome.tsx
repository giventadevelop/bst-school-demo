import Link from 'next/link';
import { BookOpen, CalendarDays, Download, GraduationCap, Images, MessageSquare, Megaphone } from 'lucide-react';
import { fetchSchoolHome } from '@/lib/school/schoolPublic';
import { getSchoolIdentity } from '@/lib/school/schoolIdentity';
import { fetchPublishedProfileWritingsServer } from '@/lib/profileSiteServer';
import {
  ButtonLink,
  Container,
  DateBadge,
  EmptyState,
  FeatureCard,
  SectionHeading,
  TextLink,
  formatDate,
} from '@/components/school/ui';

function flashText(item: { headline?: string; title?: string }) {
  return item.headline || item.title || '';
}

/** Shortcuts under the hero. All paths are root-level. */
const QUICK_LINKS = [
  { href: '/admissions', label: 'Admissions', note: 'Apply and pay fees', icon: GraduationCap },
  { href: '/academics', label: 'Academics', note: 'Streams and subjects', icon: BookOpen },
  { href: '/events', label: 'Calendar', note: 'What is coming up', icon: CalendarDays },
  { href: '/downloads', label: 'Downloads', note: 'Circulars and forms', icon: Download },
  { href: '/gallery', label: 'Gallery', note: 'Moments on campus', icon: Images },
  { href: '/contact', label: 'Contact', note: 'Reach the office', icon: MessageSquare },
];

/** Decorative arch for the hero: sun over hills and backwater, drawn in CSS so no stock imagery is needed. */
function HeroArch({ imageUrl }: { imageUrl?: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      <div aria-hidden className="absolute -inset-3 rounded-[999px_999px_28px_28px] border border-sch-gold-bright/50" />
      <div className="sch-arch relative aspect-[3/4] border-4 border-sch-gold-bright bg-sch-accent">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div aria-hidden className="relative h-full w-full overflow-hidden bg-gradient-to-b from-sch-gold-bright/90 via-sch-gold-bright/40 to-sch-accent">
            <div className="absolute left-1/2 top-[22%] h-28 w-28 -translate-x-1/2 rounded-full bg-sch-bg/90" />
            <div className="absolute -left-1/4 bottom-[30%] h-1/2 w-[90%] rounded-[50%] bg-sch-accent" />
            <div className="absolute -right-1/4 bottom-[22%] h-1/2 w-[95%] rounded-[50%] bg-sch-accent-strong" />
            <div className="sch-weave absolute inset-x-0 bottom-0 h-[30%] bg-sch-ink" />
            <div className="absolute inset-x-8 bottom-[18%] h-px bg-sch-gold-bright/60" />
            <div className="absolute inset-x-16 bottom-[12%] h-px bg-sch-gold-bright/40" />
          </div>
        )}
      </div>
    </div>
  );
}

export default async function SchoolHome() {
  const [data, school, writings] = await Promise.all([
    fetchSchoolHome(),
    getSchoolIdentity(),
    fetchPublishedProfileWritingsServer(),
  ]);
  const ticker = data.flashes.map(flashText).filter(Boolean);
  const news = writings.filter((writing) => writing.writingType !== 'EXTERNAL_LINK').slice(0, 3);
  const heroImage = data.facilities.find((facility) => facility.imageUrl)?.imageUrl;

  return (
    <>
      {ticker.length > 0 && (
        <div className="overflow-hidden border-b border-sch-border bg-sch-surface-alt" role="region" aria-label="Announcements">
          <Container className="flex items-center gap-4 py-2.5">
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sch-laterite px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sch-on-accent">
              <Megaphone aria-hidden className="h-3.5 w-3.5" />
              Notice
            </span>
            <div className="min-w-0 flex-1 overflow-hidden">
              <ul className="sch-ticker text-sm font-medium text-sch-text">
                {[...ticker, ...ticker].map((text, index) => (
                  <li key={index} aria-hidden={index >= ticker.length} className="whitespace-nowrap">
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </div>
      )}

      <section className="sch-on-dark sch-weave bg-sch-ink text-sch-on-ink">
        <Container className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.25fr_1fr] lg:py-24">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-sch-gold-bright">Welcome to</p>
            <h1 className="font-sch-display text-5xl font-semibold leading-[1.03] sm:text-6xl">{school.name}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sch-on-ink-muted">
              {school.description ||
                'A place where curiosity is welcomed, character is shaped, and every child is known by name.'}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/admissions" variant="gold">
                Start an admission
              </ButtonLink>
              <ButtonLink href="/about" variant="outline-dark">
                Discover our story
              </ButtonLink>
            </div>
          </div>
          <HeroArch imageUrl={heroImage} />
        </Container>
        <div className="sch-kasavu" aria-hidden />
      </section>

      <section aria-label="Quick links" className="border-b border-sch-border bg-sch-surface">
        <Container>
          <ul className="grid grid-cols-2 divide-sch-border sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
            {QUICK_LINKS.map(({ href, label, note, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="group flex h-full flex-col items-start gap-2 px-4 py-6 hover:bg-sch-surface-alt/60">
                  <Icon aria-hidden className="h-6 w-6 text-sch-laterite transition-transform group-hover:-translate-y-0.5" />
                  <span className="font-semibold text-sch-text">{label}</span>
                  <span className="text-xs text-sch-muted">{note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sch-laterite">From the principal&apos;s desk</p>
            <h2 className="font-sch-display text-3xl font-semibold leading-tight sm:text-4xl">
              {data.principal?.title || "Principal's message"}
            </h2>
            {data.principal?.imageUrl && (
              <div className="sch-arch mt-8 w-40 border-4 border-sch-surface shadow-[var(--sch-shadow-card)]">
                <img src={data.principal.imageUrl} alt="" className="aspect-[3/4] w-full object-cover" />
              </div>
            )}
          </div>
          {data.principal ? (
            <div className="border-l-2 border-sch-gold-bright pl-6 sm:pl-10">
              {data.principal.summary && (
                <p className="font-sch-display text-2xl leading-snug text-sch-accent">{data.principal.summary}</p>
              )}
              {data.principal.body && (
                <p className="mt-5 line-clamp-[8] whitespace-pre-wrap text-sch-muted">{data.principal.body}</p>
              )}
              <div className="mt-6">
                <TextLink href="/about/principals-message" label="Read the full message" />
              </div>
            </div>
          ) : (
            <EmptyState
              title="A message from the principal will appear here."
              hint="Publish the school page with the slug principals-message to show it."
            />
          )}
        </Container>
      </section>

      <section className="border-y border-sch-border bg-sch-surface-alt/60 py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Our campus" title="Spaces built for learning" action={{ href: '/facilities', label: 'All facilities' }} />
          {data.facilities.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.facilities.map((facility) => (
                <li key={facility.id}>
                  <FeatureCard
                    href={`/facilities/${facility.slug}`}
                    title={facility.name || 'Facility'}
                    summary={facility.summary}
                    imageUrl={facility.imageUrl}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Facilities will be listed here soon." />
          )}
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="What's happening" title="Upcoming events" action={{ href: '/events', label: 'Full calendar' }} />
            {data.events.length > 0 ? (
              <ul className="space-y-3">
                {data.events.map((event) => (
                  <li key={event.id}>
                    <Link href={`/events/${event.id}`} className="sch-card flex items-center gap-4 p-4">
                      <DateBadge value={event.startDate} />
                      <div className="min-w-0">
                        <p className="font-semibold leading-snug">{event.title}</p>
                        {event.startDate && <p className="text-sm text-sch-muted">{formatDate(event.startDate)}</p>}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No upcoming events." hint="New dates are added here as soon as they are announced." />
            )}
          </div>
          <div>
            <SectionHeading eyebrow="From the newsroom" title="Latest news" action={{ href: '/news', label: 'All news' }} />
            {news.length > 0 ? (
              <ul className="divide-y divide-sch-border border-y border-sch-border">
                {news.map((writing) => (
                  <li key={writing.id ?? writing.slug} className="py-5">
                    {writing.publishedAt && (
                      <p className="text-xs font-semibold uppercase tracking-widest text-sch-laterite">
                        {formatDate(writing.publishedAt)}
                      </p>
                    )}
                    <Link
                      href={writing.slug ? `/news/${encodeURIComponent(writing.slug)}` : '/news'}
                      className="mt-1 block font-sch-display text-xl font-semibold leading-snug hover:text-sch-accent"
                    >
                      {writing.title}
                    </Link>
                    {writing.excerpt && <p className="mt-1.5 line-clamp-2 text-sm text-sch-muted">{writing.excerpt}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No news published yet." />
            )}
          </div>
        </Container>
      </section>

      {data.highlights.length > 0 && (
        <section className="sch-on-dark sch-weave bg-sch-accent-strong py-16 text-sch-on-ink sm:py-24">
          <Container>
            <SectionHeading eyebrow="Merit highlights" title="Our star performers" action={{ href: '/achievements', label: 'All achievements' }} onDark />
            <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {data.highlights.map((item) => (
                <li key={item.id} className="text-center">
                  <div className="sch-arch mx-auto h-40 w-32 border-2 border-sch-gold-bright bg-sch-ink">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <div aria-hidden className="flex h-full w-full items-center justify-center font-sch-display text-4xl text-sch-gold-bright">
                        {item.personName?.charAt(0) || '★'}
                      </div>
                    )}
                  </div>
                  <p className="mt-4 font-sch-display text-lg font-semibold">{item.personName}</p>
                  {item.subtitle && <p className="text-sm text-sch-on-ink-muted">{item.subtitle}</p>}
                  {item.academicYear && <p className="mt-0.5 text-xs text-sch-gold-bright">{item.academicYear}</p>}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-sch-border bg-sch-surface p-8 shadow-[var(--sch-shadow-card)] sm:p-12">
            <div className="max-w-xl">
              <h2 className="font-sch-display text-3xl font-semibold leading-tight">Come and see the school for yourself.</h2>
              <p className="mt-3 text-sch-muted">
                Ask a question, arrange a visit, or begin an application. The office is glad to help.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/admissions">Admissions</ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Contact us
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
