import { CollectionDetail, DEPARTMENTS } from '@/components/school/SchoolCollection';
import { Container, PersonCard, colourAt } from '@/components/school/ui';
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
          <section className="wash c-blue sec">
            <Container>
              <h2 className="h2 mb-8">Faculty</h2>
              <ul className="card-grid">
                {members.map((member, index) => (
                  <li key={member.id}>
                    <PersonCard
                      name={[member.firstName, member.lastName].filter(Boolean).join(' ')}
                      role={member.designation}
                      detail={member.qualification}
                      imageUrl={member.profileImageUrl}
                      colour={colourAt(index)}
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
