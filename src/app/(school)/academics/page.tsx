import Link from 'next/link';
import { ContentPage } from '@/components/school/SchoolCollection';
import { Container, EmptyState, SectionHeading } from '@/components/school/ui';
import { fetchSchoolResource, type SchoolNamedRecord } from '@/lib/school/schoolPublic';

export const metadata = { title: 'Academics' };

export default async function SchoolAcademicsPage() {
  const departments = await fetchSchoolResource<SchoolNamedRecord>('school-departments', {
    sort: 'sortOrder,asc',
    'isActive.equals': 'true',
  });

  return (
    <ContentPage slug="academics" eyebrow="Learning here" fallbackTitle="Academics" crumbs={[{ label: 'Academics' }]}>
      <section className="border-t border-sch-border bg-sch-surface-alt/60 py-12 sm:py-16">
        <Container>
          <SectionHeading eyebrow="Subjects" title="Departments" action={{ href: '/departments', label: 'All departments' }} />
          {departments.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((department) => (
                <li key={department.id}>
                  <Link
                    href={`/departments/${department.slug}`}
                    className="sch-card flex items-center justify-between gap-3 px-5 py-4 font-semibold"
                  >
                    {department.name}
                    <span aria-hidden className="text-sch-gold">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No departments published yet." />
          )}
        </Container>
      </section>
    </ContentPage>
  );
}
