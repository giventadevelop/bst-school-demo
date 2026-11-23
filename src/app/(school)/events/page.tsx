import Link from 'next/link';
import { fetchSchoolResource } from '@/lib/school/schoolPublic';
import { Container, DateBadge, EmptyState, PageBanner, formatDate } from '@/components/school/ui';

export const metadata = { title: 'Events' };

type EventRow = { id?: number; title?: string; startDate?: string; description?: string };

function EventList({ events }: { events: EventRow[] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {events.map((event) => (
        <li key={event.id}>
          <Link href={`/events/${event.id}`} className="sch-card flex h-full items-start gap-4 p-4">
            <DateBadge value={event.startDate} />
            <div className="min-w-0">
              <h3 className="font-semibold leading-snug">{event.title}</h3>
              {event.startDate && <p className="text-sm text-sch-laterite">{formatDate(event.startDate)}</p>}
              {event.description && <p className="mt-1 line-clamp-2 text-sm text-sch-muted">{event.description}</p>}
            </div>
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
          <h2 className="mb-6 font-sch-display text-3xl font-semibold">Upcoming</h2>
          {upcoming.length > 0 ? (
            <EventList events={upcoming} />
          ) : (
            <EmptyState title="No upcoming events." hint="New dates are added here as soon as they are announced." />
          )}
        </section>
        {past.length > 0 && (
          <section>
            <h2 className="mb-6 font-sch-display text-3xl font-semibold">Recently held</h2>
            <EventList events={past} />
          </section>
        )}
      </Container>
    </>
  );
}
