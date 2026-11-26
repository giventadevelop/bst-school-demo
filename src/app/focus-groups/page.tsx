import { getAppUrl } from '@/lib/env';
import FocusGroupsGridWithSearch from './FocusGroupsGridWithSearch';
import { SchoolPageFrame } from '@/components/school/ui';

async function fetchEventsForGroup(baseUrl: string, groupId: number) {
  try {
    const res = await fetch(`${baseUrl}/api/proxy/event-details?focusGroupId.equals=${groupId}&isActive.equals=true&sort=startDate,asc&size=3`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function FocusGroupsPage() {
  const baseUrl = getAppUrl();
  const sort = 'name,asc';
  const size = 50;

  let groups: any[] = [];
  let total = 0;
  try {
    const res = await fetch(`${baseUrl}/api/proxy/focus-groups?isActive.equals=true&page=0&size=${size}&sort=${encodeURIComponent(sort)}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      groups = Array.isArray(data) ? data : [];
      total = Number(res.headers.get('x-total-count') || groups.length || 0);
    }
  } catch { }

  const groupsWithEvents = await Promise.all(
    groups.map(async (group) => {
      const events = group?.id ? await fetchEventsForGroup(baseUrl, group.id) : [];
      return { ...group, events };
    })
  );

  return (
    <SchoolPageFrame
      eyebrow="Community circles"
      title="Focus Groups"
      intro="Explore our specialized groups and their upcoming activities."
      crumbs={[{ label: 'Focus Groups' }]}
    >
      <FocusGroupsGridWithSearch groups={groupsWithEvents} total={total} />
    </SchoolPageFrame>
  );
}
