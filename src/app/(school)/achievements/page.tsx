import { searchSchoolPage, type SchoolHighlightRecord } from '@/lib/school/schoolPublic';
import { SCHOOL_HIGHLIGHT_SEARCH_FIELDS } from '@/lib/publicTypeaheadSearch';
import { SchoolListSearch } from '@/components/school/SchoolListSearch';
import { Container, EmptyState, PageBanner, SchoolPager, SCHOOL_PAGE_SIZE, colourAt, readPageParam, readQueryParam } from '@/components/school/ui';

export const metadata = { title: 'Achievements' };

export default async function SchoolAchievementsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[]; q?: string | string[] }>;
}) {
  const params = await searchParams;
  const page = readPageParam(params?.page);
  const query = readQueryParam(params?.q);
  const result = await searchSchoolPage<SchoolHighlightRecord>(
    'school-highlights',
    { sort: 'sortOrder,asc', 'isActive.equals': 'true' },
    query,
    SCHOOL_HIGHLIGHT_SEARCH_FIELDS,
    page,
    SCHOOL_PAGE_SIZE,
  );
  const highlights = result.items;

  const years = new Map<string, SchoolHighlightRecord[]>();
  for (const item of highlights) {
    const year = item.academicYear || '';
    years.set(year, [...(years.get(year) || []), item]);
  }

  return (
    <>
      <PageBanner
        eyebrow="Merit highlights"
        title="Achievements"
        intro="Students and staff whose work has made the whole school proud."
        crumbs={[{ label: 'Achievements' }]}
      />
      <Container className="py-12 sm:py-16">
        <SchoolListSearch
          label="Search achievements"
          placeholder="Search by name, award, or year"
          committedQuery={query}
          pathname="/achievements"
          items={highlights}
          resource="school-highlights"
          containsFields={SCHOOL_HIGHLIGHT_SEARCH_FIELDS}
          extraParams={{ sort: 'sortOrder,asc', 'isActive.equals': 'true' }}
          fields={['personName', 'subtitle', 'academicYear', 'id']}
          commitFields={['personName']}
          primaryFields={['personName']}
          secondaryFields={['subtitle', 'academicYear']}
          primaryFallback="Achievement"
        />
        {highlights.length === 0 && (
          <EmptyState
            title={query ? 'No achievements match that search.' : 'No achievements published yet.'}
            hint={query ? 'Try another word, or clear the search.' : 'Please check back soon.'}
          />
        )}
        {Array.from(years.entries()).map(([year, items]) => (
          <section key={year || 'all'} className="mb-14 last:mb-0">
            {year && <h2 className="h2 mb-8">{year}</h2>}
            <ul className="card-grid">
              {items.map((item, index) => (
                <li key={item.id}>
                  <article className={`card stripe ${colourAt(index)}`}>
                    <div className="card-photo flex aspect-[3/4] items-center justify-center" style={{ background: 'var(--c50, var(--mist))' }}>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" loading="lazy" className="h-full w-full object-contain" />
                      ) : (
                        <div aria-hidden className="ct text-4xl font-bold">
                          {item.personName?.charAt(0) || '·'}
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-4 text-center">
                      <h3 className="h5">{item.personName}</h3>
                      {item.subtitle && <p className="muted mt-1 text-sm">{item.subtitle}</p>}
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <SchoolPager
          page={result.page}
          pageSize={result.pageSize}
          total={result.total}
          noun="achievements"
          list={{ pathname: '/achievements', query }}
        />
      </Container>
    </>
  );
}
