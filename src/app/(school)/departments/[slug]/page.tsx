import { CollectionDetail, DEPARTMENTS } from '@/components/school/SchoolCollection';
import { Container, PersonCard } from '@/components/school/ui';
import { fetchSchoolResource, type SchoolStaffRecord } from '@/lib/school/schoolPublic';

export default async function SchoolDepartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const staff = await fetchSchoolResource<SchoolStaffRecord>('school-staff-members', {
    sort: 'priorityOrder,asc',
    'isActive.equals': 'true',
  });

  return (
    <CollectionDetail collection={DEPARTMENTS} slug={slug}>
      {(department) => {
        const name = department.name?.trim().toLowerCase();
        const members = name ? staff.filter((member) => member.subjectName?.trim().toLowerCase() === name) : [];
        if (members.length === 0) return null;
        return (
          <section className="border-t border-sch-border bg-sch-surface-alt/60 py-12 sm:py-16">
            <Container>
              <h2 className="mb-8 font-sch-display text-3xl font-semibold">Faculty</h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <li key={member.id}>
                    <PersonCard
                      name={[member.firstName, member.lastName].filter(Boolean).join(' ')}
                      role={member.designation}
                      detail={member.qualification}
                      imageUrl={member.profileImageUrl}
                    />
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        );
      }}
    </CollectionDetail>
  );
}
