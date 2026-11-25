import Link from 'next/link';
import { fetchSchoolResource } from '@/lib/school/schoolPublic';
import { Container, DateBadge, EmptyState, PageBanner, colourAt } from '@/components/school/ui';

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

export default async function SchoolEventsPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [upcoming, past] = await Promise.all([
    fetchSchoolResource<EventRow>('event-details', { sort: 'startDate,asc', 'startDate.greaterThanOrEqual': today }),
    fetchSchoolResource<EventRow>('event-details', { sort: 'startDate,desc', 'startDate.lessThan': today, size: '12' }),
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
          {upcoming.length > 0 ? (
            <EventList events={upcoming} />
          ) : (
            <EmptyState title="No upcoming events." hint="New dates are added here as soon as they are announced." />
          )}
        </section>
        {past.length > 0 && (
          <section>
            <h2 className="h2 mb-6">Recently held</h2>
            <EventList events={past} />
          </section>
        )}
      </Container>
    </>
  );
}
