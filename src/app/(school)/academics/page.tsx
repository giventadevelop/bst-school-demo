import Link from 'next/link';
import { ContentPage } from '@/components/school/SchoolCollection';
import { Container, EmptyState, SectionHeading, colourAt } from '@/components/school/ui';
import { fetchSchoolResource, type SchoolNamedRecord } from '@/lib/school/schoolPublic';

export const metadata = { title: 'Academics' };

export default async function SchoolAcademicsPage() {
  const departments = await fetchSchoolResource<SchoolNamedRecord>('school-departments', {
    sort: 'sortOrder,asc',
    'isActive.equals': 'true',
  });

  return (
    <ContentPage slug="academics" eyebrow="Learning here" fallbackTitle="Academics" crumbs={[{ label: 'Academics' }]}>
      <section className="sec">
        <Container>
          <SectionHeading eyebrow="Subjects" title="Departments" action={{ href: '/departments', label: 'All departments' }} />
          {departments.length > 0 ? (
            <ul className="card-grid">
              {departments.map((department, index) => (
                <li key={department.id}>
                  <Link href={`/departments/${department.slug}`} className={`tile ${colourAt(index)}`}>
                    <b>{department.name}</b>
                    <small>Subjects and faculty</small>
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
