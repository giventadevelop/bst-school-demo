import { fetchEventsForMonthServer } from './ApiServerActions';
import CalendarClient from './CalendarClient';
import { SchoolPageFrame } from '@/components/school/ui';

export default async function CalendarPage({
  searchParams,
}: {
  searchParams?:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}) {
  // Next.js 15+: searchParams may be a Promise — await before reading properties.
  const resolvedSearchParams =
    searchParams && typeof (searchParams as Promise<unknown>).then === 'function'
      ? await searchParams
      : searchParams;

  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;

  const dateParam = typeof resolvedSearchParams?.date === 'string' ? resolvedSearchParams.date : undefined;
  if (dateParam) {
    try {
      const date = new Date(dateParam);
      if (!isNaN(date.getTime())) {
        year = date.getFullYear();
        month = date.getMonth() + 1;
      }
    } catch {
      // Invalid date, use today
    }
  }

  const focusGroup =
    typeof resolvedSearchParams?.focusGroup === 'string' ? resolvedSearchParams.focusGroup : undefined;
  const initialView = typeof resolvedSearchParams?.view === 'string' ? resolvedSearchParams.view : 'month';
  const initialDate = dateParam ? new Date(dateParam) : today;
  const initialEvents = await fetchEventsForMonthServer(year, month, focusGroup);

  return (
    <SchoolPageFrame
      eyebrow="What's happening"
      title="Event Calendar"
      intro="Browse and explore upcoming events across all months."
      crumbs={[{ label: 'Event Calendar' }]}
    >
      <CalendarClient
        initialEvents={initialEvents}
        initialYear={year}
        initialMonth={month}
        focusGroup={focusGroup}
        initialView={initialView as 'month' | 'week' | 'day'}
        initialDate={initialDate}
        homepageDesign
      />
    </SchoolPageFrame>
  );
}
