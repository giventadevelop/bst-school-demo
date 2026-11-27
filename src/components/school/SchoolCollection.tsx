import type { ReactNode } from 'react';
import { fetchSchoolResource, searchSchoolPage, type SchoolNamedRecord, type SchoolPageRecord } from '@/lib/school/schoolPublic';
import { SCHOOL_NAMED_SEARCH_FIELDS } from '@/lib/publicTypeaheadSearch';
import { SchoolListSearch } from '@/components/school/SchoolListSearch';
import { Article, Container, EmptyState, FeatureCard, NotFoundBlock, PageBanner, SchoolPager, SCHOOL_PAGE_SIZE, colourAt, type Crumb } from '@/components/school/ui';

type Collection = {
  /** Backend resource, e.g. `school-facilities`. */
  resource: 'school-departments' | 'school-facilities' | 'school-activities';
  /** Route segment, e.g. `facilities`. */
  segment: string;
  /** Plural label for the list page and breadcrumb. */
  label: string;
  /** Singular noun for the not-found message. */
  noun: string;
};

export const DEPARTMENTS: Collection = { resource: 'school-departments', segment: 'departments', label: 'Departments', noun: 'department' };
export const FACILITIES: Collection = { resource: 'school-facilities', segment: 'facilities', label: 'Facilities', noun: 'facility' };
export const ACTIVITIES: Collection = { resource: 'school-activities', segment: 'activities', label: 'Clubs & activities', noun: 'activity' };

function humanize(value?: string) {
  if (!value) return undefined;
  const text = value.replace(/[_-]+/g, ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** List page for departments, facilities or activities, served at `/<segment>`. */
export async function CollectionList({
  collection,
  eyebrow,
  intro,
  groupByKind = false,
  page = 1,
  query = '',
}: {
  collection: Collection;
  eyebrow: string;
  intro: string;
  groupByKind?: boolean;
  page?: number;
  query?: string;
}) {
  const result = await searchSchoolPage<SchoolNamedRecord>(
    collection.resource,
    { sort: 'sortOrder,asc', 'isActive.equals': 'true' },
    query,
    SCHOOL_NAMED_SEARCH_FIELDS,
    page,
    SCHOOL_PAGE_SIZE,
  );
  const rows = result.items;

  const groups = new Map<string, SchoolNamedRecord[]>();
  for (const row of rows) {
    const key = groupByKind ? humanize(row.activityKind) || 'Other' : '';
    groups.set(key, [...(groups.get(key) || []), row]);
  }

  return (
    <>
      <PageBanner eyebrow={eyebrow} title={collection.label} intro={intro} crumbs={[{ label: collection.label }]} />
      <Container className="py-12 sm:py-16">
        <SchoolListSearch
          label={`Search ${collection.label.toLowerCase()}`}
          placeholder="Search by name, summary, or id"
          committedQuery={query}
          pathname={`/${collection.segment}`}
          items={rows}
          resource={collection.resource}
          containsFields={SCHOOL_NAMED_SEARCH_FIELDS}
          extraParams={{ sort: 'sortOrder,asc', 'isActive.equals': 'true' }}
          fields={['name', 'summary', 'body', 'slug', 'activityKind', 'id']}
          commitFields={['name']}
          primaryFields={['name']}
          secondaryFields={['summary']}
          primaryFallback={collection.noun}
        />
        {rows.length === 0 && (
          <EmptyState
            title={query ? `No ${collection.label.toLowerCase()} match that search.` : `No ${collection.label.toLowerCase()} published yet.`}
            hint={query ? 'Try another word, or clear the search.' : 'Please check back soon.'}
          />
        )}
        {Array.from(groups.entries()).map(([kind, items]) => (
          <section key={kind || 'all'} className="mb-12 last:mb-0">
            {kind && groups.size > 1 && <h2 className="h3 mb-6">{kind}</h2>}
            <ul className="card-grid">
              {items.map((row, index) => (
                <li key={row.id}>
                  <FeatureCard
                    href={`/${collection.segment}/${row.slug}`}
                    title={row.name || collection.noun}
                    summary={row.summary}
                    imageUrl={row.imageUrl}
                    tag={groupByKind ? undefined : humanize(row.activityKind)}
                    colour={colourAt(index)}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
        <SchoolPager
          page={result.page}
          pageSize={result.pageSize}
          total={result.total}
          noun={collection.label.toLowerCase()}
          list={{ pathname: `/${collection.segment}`, query }}
        />
      </Container>
    </>
  );
}

/** Detail page for one department, facility or activity, served at `/<segment>/<slug>`. `children` renders below the article. */
export async function CollectionDetail({
  collection,
  slug,
  children,
}: {
  collection: Collection;
  slug: string;
  children?: (row: SchoolNamedRecord) => ReactNode;
}) {
  const rows = await fetchSchoolResource<SchoolNamedRecord>(collection.resource, {
    'slug.equals': slug,
    size: '1',
  });
  const row = rows[0];
  const listHref = `/${collection.segment}`;
  if (!row) {
    return <NotFoundBlock what={collection.noun} backHref={listHref} backLabel={`All ${collection.label.toLowerCase()}`} />;
  }
  return (
    <>
      <PageBanner
        eyebrow={humanize(row.activityKind) || collection.label}
        title={row.name || collection.noun}
        crumbs={[{ label: collection.label, href: listHref }, { label: row.name || collection.noun }]}
      />
      <Article summary={row.summary} body={row.body} imageUrl={row.imageUrl} />
      {children?.(row)}
    </>
  );
}

/** A content page stored in `school-pages`, looked up by slug. */
export async function ContentPage({
  slug,
  eyebrow,
  fallbackTitle,
  crumbs,
  children,
}: {
  slug: string;
  eyebrow?: string;
  fallbackTitle?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  const rows = await fetchSchoolResource<SchoolPageRecord>('school-pages', {
    'slug.equals': slug,
    'isActive.equals': 'true',
    size: '1',
  });
  const row = rows[0];
  if (!row && !fallbackTitle) {
    return <NotFoundBlock what="page" backHref="/" backLabel="Back to the school home page" />;
  }
  const title = row?.title || fallbackTitle || 'Page';
  return (
    <>
      <PageBanner eyebrow={eyebrow} title={title} crumbs={crumbs ?? [{ label: title }]} />
      <Article summary={row?.summary} body={row?.body} imageUrl={row?.imageUrl} />
      {children}
    </>
  );
}
