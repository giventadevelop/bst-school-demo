import { fetchSchoolResource, type SchoolHighlightRecord } from '@/lib/school/schoolPublic';
import { Container, EmptyState, PageBanner } from '@/components/school/ui';

export const metadata = { title: 'Achievements' };

export default async function SchoolAchievementsPage() {
  const highlights = await fetchSchoolResource<SchoolHighlightRecord>('school-highlights', {
    sort: 'sortOrder,asc',
    'isActive.equals': 'true',
  });

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
        {highlights.length === 0 && <EmptyState title="No achievements published yet." hint="Please check back soon." />}
        {Array.from(years.entries()).map(([year, items]) => (
          <section key={year || 'all'} className="mb-14 last:mb-0">
            {year && (
              <h2 className="mb-8 flex items-center gap-4 font-sch-display text-3xl font-semibold">
                {year}
                <span aria-hidden className="h-px flex-1 bg-sch-border" />
              </h2>
            )}
            <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <li key={item.id} className="text-center">
                  <div className="sch-arch mx-auto h-44 w-36 border-2 border-sch-gold-bright bg-sch-surface-alt">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <div aria-hidden className="flex h-full w-full items-center justify-center font-sch-display text-4xl text-sch-accent">
                        {item.personName?.charAt(0) || '★'}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 font-sch-display text-lg font-semibold">{item.personName}</h3>
                  {item.subtitle && <p className="text-sm text-sch-muted">{item.subtitle}</p>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
    </>
  );
}
