import Link from 'next/link';
import { fetchSchoolHome } from '@/lib/school/schoolPublic';
import { getSchoolIdentity } from '@/lib/school/schoolIdentity';
import { fetchPublishedProfileWritingsServer } from '@/lib/profileSiteServer';
import {
  ButtonLink,
  Container,
  DateBadge,
  EmptyState,
  SectionHeading,
  colourAt,
  formatDate,
} from '@/components/school/ui';

function flashText(item: { headline?: string; title?: string }) {
  return item.headline || item.title || '';
}

function staffName(person: { firstName?: string; lastName?: string }) {
  return [person.firstName, person.lastName].filter(Boolean).join(' ') || 'Staff member';
}

const QUICK_LINKS = [
  { href: '/admissions', label: 'Admissions', note: 'Apply and pay fees', colour: 'c-red' },
  { href: '/academics', label: 'Academics', note: 'Streams and subjects', colour: 'c-blue' },
  { href: '/events', label: 'Calendar', note: 'What is coming up', colour: 'c-gold' },
  { href: '/downloads', label: 'Downloads', note: 'Circulars and forms', colour: 'c-plum' },
  { href: '/gallery', label: 'Gallery', note: 'Moments on campus', colour: 'c-teal' },
  { href: '/contact', label: 'Contact', note: 'Reach the office', colour: 'c-orange' },
];

const STEPS = [
  { n: '1', title: 'Choose a stream', copy: 'Read the departments and subject combinations, then start an application.', colour: 'c-blue' },
  { n: '2', title: 'Send your documents', copy: 'The office lists what to attach. Upload them from the admissions page.', colour: 'c-gold' },
  { n: '3', title: 'Confirm your place', copy: 'Pay the fee online once the school confirms the seat.', colour: 'c-green' },
];

export default async function SchoolHome() {
  const [data, school, writings] = await Promise.all([
    fetchSchoolHome(),
    getSchoolIdentity(),
    fetchPublishedProfileWritingsServer(),
  ]);
  const ticker = data.flashes.map(flashText).filter(Boolean);
  const news = writings.filter((writing) => writing.writingType !== 'EXTERNAL_LINK').slice(0, 3);
  const heroImage = data.facilities.find((facility) => facility.imageUrl)?.imageUrl;
  const principalImage = data.principal?.imageUrl;

  return (
    <>
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

      <section>
        <Container className="flex flex-wrap items-center gap-10 py-12 sm:py-20">
          <div className="min-w-0 flex-[1_1_420px]">
            <h1 className="h1">{school.name}</h1>
            <p className="lead mt-6 max-w-xl">
              {school.description || 'Admissions, academics, campus life, news and events from the school.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/admissions">Apply</ButtonLink>
              <Link href="/academics" className="btn btn-outline btn-lg">
                Explore the streams
              </Link>
            </div>
          </div>
          <div className="relative min-w-0 flex-[1_1_380px]">
            {heroImage ? (
              <img src={heroImage} alt="" className="aspect-[5/4] min-h-[260px] w-full rounded-lg object-cover" />
            ) : (
              <div className="ph ph-green aspect-[5/4] min-h-[260px] rounded-lg" role="img" aria-label="Campus" />
            )}
          </div>
        </Container>
      </section>

      <section aria-label="Quick links" className="pb-6">
        <Container>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
            {QUICK_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={`tile ${link.colour}`}>
                <span className="ico" aria-hidden="true">
                  →
                </span>
                <b>{link.label}</b>
                <small>{link.note}</small>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="sec">
        <Container className="flex flex-wrap items-start gap-10">
          <div className="max-w-[400px] flex-[1_1_260px]">
            {principalImage ? (
              <img src={principalImage} alt="" className="aspect-[4/5] w-full rounded-lg object-cover" />
            ) : (
              <div className="ph ph-plum aspect-[4/5] rounded-lg" role="img" aria-label="Principal" />
            )}
            <p className="h5 mt-4">{data.principal?.title || "Principal's message"}</p>
          </div>
          <div className="min-w-0 flex-[2_1_420px]">
            <p className="kicker">From the principal&apos;s desk</p>
            {data.principal ? (
              <>
                {data.principal.summary && <p className="mb-5 max-w-[56ch] text-[22px] font-medium leading-snug">{data.principal.summary}</p>}
                {data.principal.body && <p className="body mb-6 line-clamp-[8] max-w-[58ch] whitespace-pre-wrap">{data.principal.body}</p>}
                <ButtonLink href="/about/principals-message" variant="outline">
                  Read the full message
                </ButtonLink>
              </>
            ) : (
              <EmptyState
                title="A message from the principal will appear here."
                hint="Publish the school page with the slug principals-message to show it."
              />
            )}
          </div>
        </Container>
      </section>

      <section className="sec alt">
        <Container>
          <SectionHeading eyebrow="Academics" title="Streams and departments" action={{ href: '/academics', label: 'All departments' }} />
          {data.departments.length > 0 ? (
            <ul className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' }}>
              {data.departments.map((department, index) => (
                <li key={department.id}>
                  <article className={`card stripe ${colourAt(index)}`}>
                    {department.imageUrl ? (
                      <img src={department.imageUrl} alt="" className="aspect-[4/3] w-full object-cover" />
                    ) : (
                      <div className={`ph ph-${['blue', 'gold', 'plum'][index % 3]} aspect-[4/3]`} />
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="h3 mb-2">{department.name}</h3>
                      {department.summary && <p className="body mb-5">{department.summary}</p>}
                      <Link href={`/departments/${department.slug}`} className="btn btn-block mt-auto" style={{ background: 'var(--c50)', color: 'var(--ct)' }}>
                        Subjects and faculty <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Departments will be listed here soon." action={{ href: '/academics', label: 'Academics' }} />
          )}
        </Container>
      </section>

      <section className="sec">
        <Container>
          <p className="kicker">Admissions</p>
          <h2 className="h2 mb-10">How to join in three steps</h2>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))' }}>
            {STEPS.map((step) => (
              <div key={step.n} className={`panel ${step.colour}`}>
                <p className="step-n">{step.n}</p>
                <h3 className="h4 mb-2">{step.title}</h3>
                <p className="body max-w-[38ch]">{step.copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href="/admissions">View admissions</ButtonLink>
          </div>
        </Container>
      </section>

      <section aria-label="The school in numbers" style={{ background: 'var(--band)', color: '#fff' }}>
        <Container className="grid gap-9 py-14" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {[
            { n: String(data.departments.length || data.facilities.length), label: 'Published areas', colour: 'c-blue' },
            { n: String(data.staff.length), label: 'Staff shown', colour: 'c-gold' },
            { n: String(data.highlights.length), label: 'Highlights', colour: 'c-plum' },
            { n: String(data.events.length), label: 'Upcoming events', colour: 'c-green' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.colour} border-t-4 pt-4`} style={{ borderColor: 'var(--c)' }}>
              <p className="stat-n" style={{ color: 'var(--cl, #fff)' }}>
                {stat.n}
              </p>
              <p className="m-0 text-[13px] font-medium uppercase tracking-[0.08em] text-white/85">{stat.label}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="sec">
        <Container className="mb-8">
          <p className="kicker">Campus life</p>
        </Container>
        <div className="band flex min-h-[380px] items-end" style={{ ['--ph1' as string]: '#E8710A', ['--ph2' as string]: '#0B4F3A' }}>
          <Container className="on-dark w-full py-14">
            <h2 className="h1 mb-7 max-w-[16ch] text-[clamp(34px,4.6cqw,64px)]">Life on campus</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/activities" className="btn btn-gold">
                Clubs and activities <span aria-hidden="true">→</span>
              </Link>
              <Link href="/facilities" className="btn btn-line-light">
                Facilities
              </Link>
              <Link href="/gallery" className="btn btn-line-light">
                Photo gallery
              </Link>
            </div>
          </Container>
        </div>
        {data.facilities.length > 0 && (
          <Container className="grid gap-6 pt-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))' }}>
            {data.facilities.slice(0, 4).map((facility, index) => (
              <Link
                key={facility.id}
                href={`/facilities/${facility.slug}`}
                className={`card stripe ${colourAt(index)}`}
                style={{ textDecoration: 'none', color: 'var(--ink)' }}
              >
                {facility.imageUrl ? (
                  <img src={facility.imageUrl} alt="" className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="ph ph-teal aspect-[4/3]" />
                )}
                <div className="px-4 py-4">
                  <p className="h5">
                    {facility.name} <span style={{ color: 'var(--c)' }}>→</span>
                  </p>
                  {facility.summary && <p className="muted text-sm">{facility.summary}</p>}
                </div>
              </Link>
            ))}
          </Container>
        )}
      </section>

      <section className="sec alt">
        <Container className="flex flex-wrap gap-10">
          <div className="max-w-[400px] flex-[1_1_280px]">
            <p className="kicker">Fees</p>
            <h2 className="h2 mb-5">Fees and admissions</h2>
            <p className="body mb-7">Fee invoices published by the office can be paid from the admissions page.</p>
            <ButtonLink href="/admissions">Pay a fee online</ButtonLink>
          </div>
          <div className="panel c-gold min-w-0 flex-[2_1_460px]">
            <p className="h4">Scholarships and questions</p>
            <p className="body mt-3">Ask the office about fee support, documents, and deadlines.</p>
            <div className="mt-6">
              <ButtonLink href="/contact" variant="outline">
                Ask the office
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {data.highlights.length > 0 && (
        <section className="sec">
          <Container>
            <SectionHeading eyebrow="Results" title="Our star performers" action={{ href: '/achievements', label: 'All achievements' }} />
            <ul className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(46%, 200px), 1fr))' }}>
              {data.highlights.slice(0, 4).map((item, index) => (
                <li key={item.id}>
                  <article className={`card stripe ${colourAt(index)}`}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" className="aspect-[3/4] w-full object-cover" />
                    ) : (
                      <div className="ph ph-green aspect-[3/4]" />
                    )}
                    <div className="px-4 py-4">
                      <p className="h5">{item.personName}</p>
                      {item.subtitle && <p className="ct text-sm font-medium">{item.subtitle}</p>}
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section className="sec alt">
        <Container>
          <SectionHeading eyebrow="From the newsroom" title="Latest news" action={{ href: '/news', label: 'All news' }} />
          {news.length > 0 ? (
            <ul className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' }}>
              {news.map((writing, index) => (
                <li key={writing.id ?? writing.slug}>
                  <Link
                    href={writing.slug ? `/news/${encodeURIComponent(writing.slug)}` : '/news'}
                    className={`card ${colourAt(index)}`}
                    style={{ textDecoration: 'none', color: 'var(--ink)' }}
                  >
                    <div className="flex flex-1 flex-col gap-2.5 p-5">
                      {writing.publishedAt && <span className="muted text-[13px]">{formatDate(writing.publishedAt)}</span>}
                      <span className="text-[21px] font-semibold leading-snug">{writing.title}</span>
                      {writing.excerpt && <span className="body text-[15px] leading-6">{writing.excerpt}</span>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No news published yet." />
          )}
        </Container>
      </section>

      <section className="sec">
        <Container className="flex flex-wrap gap-8">
          <div className="max-w-[360px] flex-[1_1_260px]">
            <SectionHeading eyebrow="What's happening" title="Upcoming events" />
            <ButtonLink href="/events" variant="outline">
              Full calendar
            </ButtonLink>
          </div>
          <div className="flex min-w-0 flex-[2_1_460px] flex-col gap-3">
            {data.events.length > 0 ? (
              data.events.map((event, index) => {
                const date = event.startDate ? new Date(event.startDate.includes('T') ? event.startDate : `${event.startDate}T12:00:00`) : null;
                return (
                  <Link key={event.id} href={`/events/${event.id}`} className={`row ${colourAt(index)}`}>
                    <DateBadge value={event.startDate} colour={colourAt(index)} />
                    <span className="min-w-0">
                      <span className="block text-[19px] font-semibold leading-7">{event.title}</span>
                      <span className="muted block text-sm">
                        {date && !Number.isNaN(date.getTime()) ? formatDate(event.startDate) : event.description || ''}
                      </span>
                    </span>
                    <span aria-hidden="true" style={{ color: 'var(--c)', fontSize: 20 }}>
                      →
                    </span>
                  </Link>
                );
              })
            ) : (
              <EmptyState title="No upcoming events." hint="New dates are added here as soon as they are announced." />
            )}
          </div>
        </Container>
      </section>

      {data.staff.length > 0 && (
        <section className="sec alt">
          <Container>
            <SectionHeading eyebrow="Faculty" title="Teachers and mentors" action={{ href: '/staff', label: 'Staff directory' }} />
            <ul className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(46%, 200px), 1fr))' }}>
              {data.staff.map((person, index) => (
                <li key={person.id}>
                  <article className={`card stripe ${colourAt(index)}`}>
                    {person.profileImageUrl ? (
                      <img src={person.profileImageUrl} alt="" className="aspect-square w-full object-cover" />
                    ) : (
                      <div className="ph ph-blue aspect-square" />
                    )}
                    <div className="px-4 py-4">
                      <h3 className="h5">{staffName(person)}</h3>
                      {person.designation && <p className="ct text-sm font-semibold">{person.designation}</p>}
                      {person.subjectName && <p className="muted text-sm">{person.subjectName}</p>}
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section style={{ background: 'var(--cta)', color: 'var(--cta-text)' }}>
        <Container className="flex flex-wrap items-center justify-between gap-8 py-16">
          <h2 className="h1 max-w-[17ch] text-[clamp(34px,4.6cqw,64px)]">Start an admission, or ask the office a question.</h2>
          <div className="on-dark flex flex-wrap gap-3">
            <Link href="/admissions" className="btn btn-lg btn-white">
              Start an admission <span aria-hidden="true">→</span>
            </Link>
            <Link href="/contact" className="btn btn-lg btn-line-light">
              Contact the office
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
