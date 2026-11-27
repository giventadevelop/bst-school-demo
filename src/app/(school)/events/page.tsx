import Link from 'next/link';
import { searchSchoolPage } from '@/lib/school/schoolPublic';
import { PUBLIC_EVENT_SEARCH_FIELDS } from '@/lib/publicTypeaheadSearch';
import { SchoolListSearch } from '@/components/school/SchoolListSearch';
import { Container, DateBadge, EmptyState, PageBanner, SchoolPager, SCHOOL_PAGE_SIZE, colourAt, readPageParam, readQueryParam } from '@/components/school/ui';

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
  searchParams: Promise<{ upcoming?: string | string[]; past?: string | string[]; q?: string | string[] }>;
}) {
  const params = await searchParams;
  const upcomingPage = readPageParam(params?.upcoming);
  const pastPage = readPageParam(params?.past);
  const query = readQueryParam(params?.q);
  const today = new Date().toISOString().slice(0, 10);
  const [upcoming, past] = await Promise.all([
    searchSchoolPage<EventRow>(
      'event-details',
      { sort: 'startDate,asc', 'startDate.greaterThanOrEqual': today },
      query,
      PUBLIC_EVENT_SEARCH_FIELDS,
      upcomingPage,
      SCHOOL_PAGE_SIZE,
    ),
    searchSchoolPage<EventRow>(
      'event-details',
      { sort: 'startDate,desc', 'startDate.lessThan': today },
      query,
      PUBLIC_EVENT_SEARCH_FIELDS,
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
        <SchoolListSearch
          label="Search events"
          placeholder="Search by title, place, description, or id"
          committedQuery={query}
          pathname="/events"
          items={[...upcoming.items, ...past.items]}
          resource="event-details"
          containsFields={PUBLIC_EVENT_SEARCH_FIELDS}
          fields={['searchText', 'title', 'caption', 'description', 'location', 'id']}
          commitFields={['title']}
          primaryFields={['title']}
          secondaryFields={['startDate']}
          primaryFallback="Untitled event"
        />
        <section className="mb-14">
          <h2 className="h2 mb-6">Upcoming</h2>
          {upcoming.items.length > 0 ? (
            <EventList events={upcoming.items} />
          ) : (
            <EmptyState
              title={query ? 'No upcoming events match that search.' : 'No upcoming events.'}
              hint={query ? 'Try another word, or clear the search.' : 'New dates are added here as soon as they are announced.'}
            />
          )}
          <SchoolPager
            page={upcoming.page}
            pageSize={upcoming.pageSize}
            total={upcoming.total}
            noun="upcoming events"
            list={{ pathname: '/events', query, param: 'upcoming', extra: { past: pastPage > 1 ? pastPage : undefined } }}
          />
        </section>
        <section>
          <h2 className="h2 mb-6">Recently held</h2>
          {past.items.length > 0 ? (
            <EventList events={past.items} />
          ) : (
            <EmptyState
              title={query ? 'No past events match that search.' : 'No past events yet.'}
              hint={query ? 'Try another word, or clear the search.' : 'Earlier celebrations appear here once they have been held.'}
            />
          )}
          <SchoolPager
            page={past.page}
            pageSize={past.pageSize}
            total={past.total}
            noun="past events"
            list={{ pathname: '/events', query, param: 'past', extra: { upcoming: upcomingPage > 1 ? upcomingPage : undefined } }}
          />
        </section>
      </Container>
    </>
  );
}
