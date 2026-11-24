import Link from 'next/link';
import type { ReactNode } from 'react';
import { fetchSchoolHome } from '@/lib/school/schoolPublic';
import { getSchoolIdentity } from '@/lib/school/schoolIdentity';
import { fetchPublishedProfileWritingsServer } from '@/lib/profileSiteServer';
import { Container, formatDate } from '@/components/school/ui';
import ExpandableMessage from '@/components/school/home/ExpandableMessage';
import HomeMotion from '@/components/school/home/HomeMotion';
import { homeClass } from '@/components/school/home/homeFonts';
import './home/home.css';

function flashText(item: { headline?: string; title?: string }) {
  return item.headline || item.title || '';
}

function staffName(person: { firstName?: string; lastName?: string }) {
  return [person.firstName, person.lastName].filter(Boolean).join(' ') || 'Staff member';
}

function eventDate(value?: string) {
  if (!value) return null;
  const date = new Date(value.includes('T') ? value : `${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * The line shown large beside the principal's portrait: the summary when it is short,
 * otherwise the shortest sentence of the message that still reads as a full thought (40 to 160 characters).
 */
function pullQuote(summary?: string, body?: string) {
  const short = summary?.trim();
  if (short && short.length <= 180) return short;
  const pieces = (body || short || '').replace(/\s+/g, ' ').split(/(?<=[.!?])\s+(?=[A-Z])/);
  // "St. Joseph" and "etc. Some" are not sentence ends: rejoin a piece that stops on a short abbreviation.
  const sentences: string[] = [];
  for (const piece of pieces) {
    const previous = sentences[sentences.length - 1];
    if (previous && /(^|\s)[A-Za-z]{1,3}\.$/.test(previous)) sentences[sentences.length - 1] = `${previous} ${piece}`;
    else sentences.push(piece);
  }
  const candidates = sentences.map((sentence) => sentence.trim()).filter((sentence) => sentence.length >= 40 && sentence.length <= 160);
  return candidates.sort((a, b) => a.length - b.length)[0] || '';
}

const QUICK_LINKS: { href: string; label: string; note: string; bg: string; icon: ReactNode }[] = [
  { href: '/admissions', label: 'Admissions', note: 'Apply and pay fees', bg: '#ffd9dc', icon: <><path d="M3 9l9-5 9 5-9 5z" /><path d="M7 11.5V16c3 2 7 2 10 0v-4.5" /></> },
  { href: '/academics', label: 'Academics', note: 'Streams and subjects', bg: '#dcebfa', icon: <path d="M4 5h7v14H4zM13 5h7v14h-7z" /> },
  { href: '/events', label: 'Calendar', note: 'What is coming up', bg: '#fff3cf', icon: <><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M4 10h16M9 3v5M15 3v5" /></> },
  { href: '/downloads', label: 'Downloads', note: 'Circulars and forms', bg: '#e9defa', icon: <path d="M12 4v11M7 11l5 5 5-5M5 20h14" /> },
  { href: '/gallery', label: 'Gallery', note: 'Moments on campus', bg: '#d9f1e5', icon: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 16l5-5 4 4 3-3 6 6" /></> },
  { href: '/contact', label: 'Contact', note: 'Reach the office', bg: '#ffe3cc', icon: <path d="M4 5h16v11H9l-5 4z" /> },
];

const STEPS = [
  { title: 'Choose a stream', copy: 'Read the departments and subject combinations, then start an application.' },
  { title: 'Send your documents', copy: 'The office lists what to attach. Upload them from the admissions page.' },
  { title: 'Confirm your place', copy: 'Pay the fee online once the school confirms the seat.' },
];

/** One section of the notebook sheet: its name in the margin, its content on the page. */
function Block({ label, note, children }: { label: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section className="nb-block">
      <div className="nb-label">
        <h2>
          {label}
          {note && <small>{note}</small>}
        </h2>
      </div>
      <div className="nb-body">{children}</div>
    </section>
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
  const principal = data.principal;
  const quote = pullQuote(principal?.summary, principal?.body);
  const messageParagraphs = (principal?.body || '')
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const facilities = data.facilities.slice(0, 4);
  const numbers = [
    { n: data.departments.length || data.facilities.length, label: 'Published areas' },
    { n: data.staff.length, label: 'Staff shown' },
    { n: data.highlights.length, label: 'Highlights' },
    { n: data.events.length, label: 'Upcoming events' },
  ];

  return (
    <>
      {/* The notice bar sits outside the notebook skin and keeps the site's own styling. */}
      {ticker.length > 0 && (
        <section aria-label="Announcements" style={{ background: 'var(--gold-50)', borderBottom: '1px solid rgba(138,90,0,.2)' }}>
          <Container className="flex items-baseline gap-3.5 py-2.5 text-sm leading-6">
            <span className="tag t-solid shrink-0">Notice</span>
            <span className="min-w-0">
              {ticker[0]}
              {data.flashes[0]?.linkUrl && (
                <>
                  {' '}
                  <Link href={data.flashes[0].linkUrl} className="whitespace-nowrap font-semibold">
                    Open →
                  </Link>
                </>
              )}
            </span>
          </Container>
        </section>
      )}

      <div className={homeClass}>
      <HomeMotion />
      <section className="nb-hero">
        <div className="nb-wrap">
          <div>
            <h1>{school.name}</h1>
            <p className="nb-lead">{school.description || 'Admissions, academics, campus life, news and events from the school.'}</p>
            <div className="nb-cta">
              <Link href="/admissions" className="nb-btn nb-btn-sun">
                Apply
              </Link>
              <Link href="/academics" className="nb-btn nb-btn-ghost-light">
                Explore the streams
              </Link>
            </div>
          </div>
          <div className="nb-hero-art">
            {heroImage ? <img src={heroImage} alt="" /> : <div className="nb-ph" role="img" aria-label="Campus" />}
            {data.events.length > 0 && (
              <div className="nb-board">
                <h2>
                  Coming up <Link href="/events">Full calendar</Link>
                </h2>
                <ul>
                  {data.events.slice(0, 3).map((event) => {
                    const date = eventDate(event.startDate);
                    return (
                      <li key={event.id}>
                        <time dateTime={event.startDate}>
                          <b>{date ? date.getDate() : '–'}</b>
                          {date ? date.toLocaleDateString('en-IN', { month: 'short' }) : ''}
                        </time>
                        <Link href={`/events/${event.id}`}>{event.title}</Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
      <svg className="nb-wave" viewBox="0 0 1200 46" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0 0h1200v10c-200 44-400 44-600 18S200 2 0 34z" />
      </svg>

      <div className="nb-wrap">
        <div className="nb-sheet">
          <Block label="Start here" note="Six shortcuts">
            <div className="nb-quick">
              {QUICK_LINKS.map((link) => (
                <Link key={link.href} href={link.href} style={{ ['--bg' as string]: link.bg }}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {link.icon}
                  </svg>
                  <span>
                    <b>{link.label}</b>
                    <small>{link.note}</small>
                  </span>
                </Link>
              ))}
            </div>
          </Block>

          <Block label="From the principal's desk">
            {principal ? (
              <div className="nb-principal">
                <figure>
                  {principal.imageUrl ? <img src={principal.imageUrl} alt="" /> : <div className="nb-ph" role="img" aria-label="Principal" />}
                  <figcaption>{principal.title || "Principal's message"}</figcaption>
                </figure>
                <div>
                  {quote && <p className="nb-quote">{quote}</p>}
                  <ExpandableMessage paragraphs={messageParagraphs} />
                  <div className="nb-actions">
                    <Link href="/about/principals-message" className="nb-btn nb-btn-ghost">
                      Read the full message
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <p className="nb-empty">
                A message from the principal will appear here. Publish the school page with the slug principals-message to show it.
              </p>
            )}
          </Block>

          <Block
            label="Academics"
            note={
              <Link href="/academics" className="nb-more">
                All departments
              </Link>
            }
          >
            <h3 className="nb-big">Streams and departments</h3>
            {data.departments.length > 0 ? (
              <ul className="nb-depts">
                {data.departments.map((department) => (
                  <li key={department.id}>
                    <article>
                      {department.imageUrl ? <img src={department.imageUrl} alt="" /> : <div className="nb-ph" />}
                      <div>
                        <h3>{department.name}</h3>
                        {department.summary && <p>{department.summary}</p>}
                        <Link href={`/departments/${department.slug}`} className="nb-btn nb-btn-navy">
                          Subjects and faculty
                        </Link>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="nb-empty">
                Departments will be listed here soon.{' '}
                <Link href="/academics" className="nb-more">
                  Academics
                </Link>
              </p>
            )}
          </Block>

          <Block label="Admissions">
            <h3 className="nb-big">How to join in three steps</h3>
            <ol className="nb-steps">
              {STEPS.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </li>
              ))}
            </ol>
            <div className="nb-after-steps">
              <Link href="/admissions" className="nb-btn nb-btn-navy">
                View admissions
              </Link>
            </div>
          </Block>

          <Block label="The school in numbers">
            <div className="nb-numbers">
              {numbers.map((stat) => (
                <div key={stat.label}>
                  <b>{stat.n}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </Block>

          <Block label="Campus life">
            <h3 className="nb-big">Life on campus</h3>
            {facilities.length > 0 && (
              <div className="nb-facilities">
                {facilities.map((facility) => (
                  <Link key={facility.id} href={`/facilities/${facility.slug}`}>
                    {facility.imageUrl ? <img src={facility.imageUrl} alt="" /> : <div className="nb-ph" />}
                    <span>
                      <b>{facility.name}</b>
                      {facility.summary && <small>{facility.summary}</small>}
                    </span>
                  </Link>
                ))}
              </div>
            )}
            <div className="nb-campus-links">
              <Link href="/activities" className="nb-btn nb-btn-sun">
                Clubs and activities
              </Link>
              <Link href="/facilities" className="nb-btn nb-btn-ghost">
                Facilities
              </Link>
              <Link href="/gallery" className="nb-btn nb-btn-ghost">
                Photo gallery
              </Link>
            </div>
          </Block>

          <Block label="Fees">
            <div className="nb-fees">
              <div>
                <h3>Fees and admissions</h3>
                <p>Fee invoices published by the office can be paid from the admissions page.</p>
                <Link href="/admissions" className="nb-btn nb-btn-navy">
                  Pay a fee online
                </Link>
              </div>
              <div>
                <h3>Scholarships and questions</h3>
                <p>Ask the office about fee support, documents, and deadlines.</p>
                <Link href="/contact" className="nb-btn nb-btn-ghost">
                  Ask the office
                </Link>
              </div>
            </div>
          </Block>

          {data.highlights.length > 0 && (
            <Block
              label="Results"
              note={
                <Link href="/achievements" className="nb-more">
                  All achievements
                </Link>
              }
            >
              <h3 className="nb-big">Our star performers</h3>
              <ul className="nb-stars">
                {data.highlights.slice(0, 4).map((item) => (
                  <li key={item.id}>
                    {item.imageUrl ? <img src={item.imageUrl} alt="" /> : <div className="nb-ph" />}
                    <h3>{item.personName}</h3>
                    {item.subtitle && <p>{item.subtitle}</p>}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          <Block
            label="From the newsroom"
            note={
              <Link href="/news" className="nb-more">
                All news
              </Link>
            }
          >
            <h3 className="nb-big">Latest news</h3>
            {news.length > 0 ? (
              <ul className="nb-news">
                {news.map((writing) => (
                  <li key={writing.id ?? writing.slug}>
                    <Link href={writing.slug ? `/news/${encodeURIComponent(writing.slug)}` : '/news'}>
                      {writing.publishedAt && <time dateTime={writing.publishedAt}>{formatDate(writing.publishedAt)}</time>}
                      <h3>{writing.title}</h3>
                      {writing.excerpt && <p>{writing.excerpt}</p>}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="nb-empty">No news published yet.</p>
            )}
          </Block>

          <Block
            label="What's happening"
            note={
              <Link href="/events" className="nb-more">
                Full calendar
              </Link>
            }
          >
            <h3 className="nb-big">Upcoming events</h3>
            {data.events.length > 0 ? (
              <ul className="nb-events">
                {data.events.map((event) => {
                  const date = eventDate(event.startDate);
                  return (
                    <li key={event.id}>
                      <Link href={`/events/${event.id}`}>
                        <time dateTime={event.startDate}>
                          {date ? date.getDate() : '–'}
                          {date && <small>{date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</small>}
                        </time>
                        <span>
                          <b>{event.title}</b>
                          {!date && event.description && <span>{event.description}</span>}
                        </span>
                        <i>View event</i>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="nb-empty">No upcoming events. New dates are added here as soon as they are announced.</p>
            )}
          </Block>

          {data.staff.length > 0 && (
            <Block
              label="Faculty"
              note={
                <Link href="/staff" className="nb-more">
                  Staff directory
                </Link>
              }
            >
              <h3 className="nb-big">Teachers and mentors</h3>
              <ul className="nb-faculty">
                {data.staff.map((person) => (
                  <li key={person.id}>
                    {person.profileImageUrl ? <img src={person.profileImageUrl} alt="" /> : <div className="nb-ph" />}
                    <h3>{staffName(person)}</h3>
                    <p>
                      {person.designation && <b>{person.designation}</b>}
                      {person.designation && person.subjectName && <br />}
                      {person.subjectName}
                    </p>
                  </li>
                ))}
              </ul>
            </Block>
          )}
        </div>
      </div>

      <section className="nb-closing">
        <div className="nb-wrap">
          <h2>Start an admission, or ask the office a question.</h2>
          <div>
            <Link href="/admissions" className="nb-btn nb-btn-navy">
              Start an admission
            </Link>
            <Link href="/contact" className="nb-btn nb-btn-ghost">
              Contact the office
            </Link>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
