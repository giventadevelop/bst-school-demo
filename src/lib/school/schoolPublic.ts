import { fetchWithJwtRetry } from '@/lib/proxyHandler';
import { getApiBaseUrl, getTenantId } from '@/lib/env';
import { applyContainsTokens, matchesPublicSearchFields, normalizePublicSearchQuery } from '@/lib/publicTypeaheadSearch';

export type SchoolPageRecord = {
  id?: number;
  slug?: string;
  title?: string;
  summary?: string;
  body?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type SchoolStaffRecord = {
  id?: number;
  staffCategory?: string;
  stage?: string;
  firstName?: string;
  lastName?: string;
  designation?: string;
  qualification?: string;
  subjectName?: string;
  classTeacherOf?: string;
  profileImageUrl?: string;
  bio?: string;
  priorityOrder?: number;
  isActive?: boolean;
};

export type SchoolNamedRecord = {
  id?: number;
  name?: string;
  slug?: string;
  summary?: string;
  body?: string;
  imageUrl?: string;
  activityKind?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type SchoolHighlightRecord = {
  id?: number;
  personName?: string;
  subtitle?: string;
  imageUrl?: string;
  academicYear?: string;
};

export type SchoolFeeInvoiceRecord = {
  id?: number;
  title?: string;
  academicYear?: string;
  feeKind?: string;
  studentName?: string;
  classLabel?: string;
  payerName?: string;
  payerEmail?: string;
  payerPhone?: string;
  amountDue?: number;
  currency?: string;
  status?: string;
};

export type NewsFlashRecord = {
  id?: number;
  headline?: string;
  title?: string;
  linkUrl?: string;
  link?: string;
};

function asList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const record = data as { content?: T[]; _embedded?: Record<string, unknown> };
    if (Array.isArray(record.content)) return record.content;
    const embedded = record._embedded;
    if (embedded) {
      const list = Object.values(embedded).find((value) => Array.isArray(value));
      if (Array.isArray(list)) return list as T[];
    }
  }
  return [];
}

export async function fetchSchoolResource<T>(path: string, query: Record<string, string> = {}): Promise<T[]> {
  const page = await fetchSchoolPage<T>(path, query, 1, Number(query.size || 100));
  return page.items;
}

export type SchoolPageResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

/** One page of a school list, keeping the backend total for the pager. */
export async function fetchSchoolPage<T>(
  path: string,
  query: Record<string, string> = {},
  page = 1,
  pageSize = 8,
): Promise<SchoolPageResult<T>> {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 8;
  try {
    const params = new URLSearchParams({
      'tenantId.equals': getTenantId(),
      ...query,
      page: String(safePage - 1),
      size: String(safeSize),
    });
    const response = await fetchWithJwtRetry(`${getApiBaseUrl()}/api/${path}?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!response.ok) return { items: [], total: 0, page: safePage, pageSize: safeSize };
    const data = await response.json();
    const items = asList<T>(data);
    const headerTotal = Number(response.headers.get('x-total-count'));
    const bodyTotal =
      data && typeof data === 'object' && !Array.isArray(data)
        ? Number((data as { totalElements?: number }).totalElements)
        : NaN;
    let total = Number.isFinite(headerTotal) && headerTotal > 0 ? headerTotal : Number.isFinite(bodyTotal) ? bodyTotal : items.length;
    if (total < items.length) total = items.length;
    return { items, total, page: safePage, pageSize: safeSize };
  } catch (error) {
    console.error(`[school] ${path}`, error);
    return { items: [], total: 0, page: safePage, pageSize: safeSize };
  }
}

function mergeSchoolSearchItems<T extends { id?: number | string | null }>(lists: T[][], limit: number): T[] {
  const byKey = new Map<string, T>();
  for (const list of lists) {
    for (const item of list) {
      const key = item.id != null ? `id:${item.id}` : null;
      if (!key || byKey.has(key)) continue;
      byKey.set(key, item);
    }
  }
  return Array.from(byKey.values()).slice(0, limit);
}

/**
 * One page of a school list. An empty search is the normal list.
 * A search runs the same parallel `.contains` fields as the typeahead menu, plus a numeric id match.
 */
export async function searchSchoolPage<T extends { id?: number | string | null }>(
  path: string,
  query: Record<string, string>,
  search: string,
  containsFields: readonly string[],
  page = 1,
  pageSize = 8,
): Promise<SchoolPageResult<T>> {
  const trimmed = search.trim();
  if (!trimmed) return fetchSchoolPage<T>(path, query, page, pageSize);

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 8;
  const { phrase } = normalizePublicSearchQuery(trimmed);

  const run = async (field: string | null, apply: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams({
      'tenantId.equals': getTenantId(),
      ...query,
      page: String(safePage - 1),
      size: String(safeSize),
    });
    apply(params);
    try {
      const response = await fetchWithJwtRetry(`${getApiBaseUrl()}/api/${path}?${params.toString()}`, {
        cache: 'no-store',
      });
      if (!response.ok) return { items: [] as T[], total: 0 };
      const data = await response.json();
      const items = asList<T>(data);
      // Some criteria are accepted but ignored, which returns the whole list.
      // Keep a field job only when every row actually contains the query.
      if (field) {
        const matched = items.filter((item) =>
          matchesPublicSearchFields(
            [item && typeof item === 'object' ? (item as Record<string, unknown>)[field] as string : ''],
            trimmed,
          ),
        );
        if (matched.length !== items.length) return { items: [] as T[], total: 0 };
      }
      const headerTotal = Number(response.headers.get('x-total-count'));
      const total = Number.isFinite(headerTotal) && headerTotal >= 0 ? headerTotal : items.length;
      return { items, total };
    } catch (error) {
      console.error(`[school] ${path} search`, error);
      return { items: [] as T[], total: 0 };
    }
  };

  const jobs: Promise<{ items: T[]; total: number }>[] = [];
  if (phrase) {
    for (const field of containsFields) {
      jobs.push(run(field, (params) => applyContainsTokens(params, field, trimmed)));
    }
  }
  if (/^\d+$/.test(trimmed)) {
    jobs.push(run(null, (params) => params.set('id.equals', trimmed)));
  }
  if (jobs.length === 0) return fetchSchoolPage<T>(path, query, page, pageSize);

  const results = await Promise.all(jobs);
  const items = mergeSchoolSearchItems(
    results.map((result) => result.items),
    safeSize,
  );
  const total = Math.max(items.length, ...results.map((result) => result.total));
  return { items, total, page: safePage, pageSize: safeSize };
}

export async function fetchSchoolHome() {
  const today = new Date().toISOString().slice(0, 10);
  const [flashes, principalPages, facilities, highlights, events, departments, staff] = await Promise.all([
    fetchSchoolResource<NewsFlashRecord>('news-flashes', { sort: 'id,desc', 'isActive.equals': 'true' }),
    fetchSchoolResource<SchoolPageRecord>('school-pages', {
      'slug.equals': 'principals-message',
      'isActive.equals': 'true',
      size: '1',
    }),
    fetchSchoolResource<SchoolNamedRecord>('school-facilities', {
      sort: 'sortOrder,asc',
      'isActive.equals': 'true',
    }),
    fetchSchoolResource<SchoolHighlightRecord>('school-highlights', {
      sort: 'sortOrder,asc',
      'isActive.equals': 'true',
    }),
    fetchSchoolResource<{ id?: number; title?: string; startDate?: string; description?: string }>('event-details', {
      sort: 'startDate,asc',
      'startDate.greaterThanOrEqual': today,
    }),
    fetchSchoolResource<SchoolNamedRecord>('school-departments', {
      sort: 'sortOrder,asc',
      'isActive.equals': 'true',
    }),
    fetchSchoolResource<SchoolStaffRecord>('school-staff-members', {
      sort: 'priorityOrder,asc',
      'isActive.equals': 'true',
    }),
  ]);
  return {
    flashes,
    principal: principalPages[0] || null,
    facilities: facilities.slice(0, 8),
    highlights: highlights.slice(0, 8),
    events: events.slice(0, 6),
    departments: departments.slice(0, 3),
    staff: staff.slice(0, 4),
  };
}
