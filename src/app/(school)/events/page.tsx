import Link from 'next/link';
import { fetchSchoolPage } from '@/lib/school/schoolPublic';
import { Container, DateBadge, EmptyState, PageBanner, SchoolPager, SCHOOL_PAGE_SIZE, colourAt, readPageParam } from '@/components/school/ui';

export const metadata = { title: 'Events' };

type EventRow = { id?: number; title?: string; startDate?: string; description?: string };

function EventList({ events }: { events: EventRow[] }) {
  return (
    <ul className="grid gap-3">
      {events.map((event, index) => (
        <li key={event.id}>
          <Link href={`/events/${event.id}`} className={`row ${colourAt(index)}`}>
            <DateBadge value={event.startDate} colour={colourAt(index)} />
            <span className="min-w-0">
              <h3 className="h5">{event.title}</h3>
              {event.description && <p className="muted mt-1 line-clamp-2 text-sm">{event.description}</p>}
            </span>
            <span className="btn btn-text">View</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function SchoolEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ upcoming?: string | string[]; past?: string | string[] }>;
}) {
  const params = await searchParams;
  const upcomingPage = readPageParam(params?.upcoming);
  const pastPage = readPageParam(params?.past);
  const today = new Date().toISOString().slice(0, 10);
  const [upcoming, past] = await Promise.all([
    fetchSchoolPage<EventRow>(
      'event-details',
      { sort: 'startDate,asc', 'startDate.greaterThanOrEqual': today },
      upcomingPage,
      SCHOOL_PAGE_SIZE,
    ),
    fetchSchoolPage<EventRow>(
      'event-details',
      { sort: 'startDate,desc', 'startDate.lessThan': today },
      pastPage,
      SCHOOL_PAGE_SIZE,
    ),
  ]);

  return (
    <>
      <PageBanner
        eyebrow="What's happening"
        title="Events"
        intro="Assemblies, festivals, meets and open days across the school year."
        crumbs={[{ label: 'Events' }]}
      />
      <Container className="py-12 sm:py-16">
        <section className="mb-14">
          <h2 className="h2 mb-6">Upcoming</h2>
          {upcoming.items.length > 0 ? (
            <EventList events={upcoming.items} />
          ) : (
            <EmptyState title="No upcoming events." hint="New dates are added here as soon as they are announced." />
          )}
          <SchoolPager
            page={upcoming.page}
            pageSize={upcoming.pageSize}
            total={upcoming.total}
            noun="upcoming events"
            hrefFor={(page) => `/events?upcoming=${page}&past=${pastPage}`}
          />
        </section>
        <section>
          <h2 className="h2 mb-6">Recently held</h2>
          {past.items.length > 0 ? (
            <EventList events={past.items} />
          ) : (
            <EmptyState title="No past events yet." hint="Earlier celebrations appear here once they have been held." />
          )}
          <SchoolPager
            page={past.page}
            pageSize={past.pageSize}
            total={past.total}
            noun="past events"
            hrefFor={(page) => `/events?upcoming=${upcomingPage}&past=${page}`}
          />
        </section>
      </Container>
    </>
  );
}
