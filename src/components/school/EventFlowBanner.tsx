'use client';

import { useParams, usePathname } from 'next/navigation';
import { PageBanner } from '@/components/school/ui';

const SECTION_TITLES: Record<string, string> = {
  tickets: 'Tickets',
  'tickets-stripe-web-client': 'Tickets',
  checkout: 'Checkout',
  'manual-checkout': 'Checkout',
  'givebutter-checkout': 'Checkout',
  'eventcube-checkout': 'Checkout',
  'donation-checkout': 'Donation',
  donation: 'Donation',
  offering: 'Offering',
  register: 'Register',
  competitions: 'Competitions',
};

/** School banner for ticket, checkout, register, and competition pages under an event. */
export default function EventFlowBanner() {
  const pathname = usePathname() ?? '';
  const params = useParams();
  const eventId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const parts = pathname.split('/').filter(Boolean);
  const section = parts[2] ?? '';
  const leaf = parts[parts.length - 1] ?? '';
  const title = leaf === 'success' ? 'Confirmation' : SECTION_TITLES[section] || 'Event';

  return (
    <PageBanner
      eyebrow="What's happening"
      title={title}
      crumbs={[
        { label: 'Events', href: '/events' },
        ...(eventId ? [{ label: 'Event', href: `/events/${eventId}` }] : []),
        { label: title },
      ]}
    />
  );
}
