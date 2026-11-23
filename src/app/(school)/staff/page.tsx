import { fetchSchoolResource, type SchoolStaffRecord } from '@/lib/school/schoolPublic';
import { Container, EmptyState, PageBanner, PersonCard, TextLink } from '@/components/school/ui';

export const metadata = { title: 'Staff' };

function humanize(value: string) {
  const text = value.replace(/[_-]+/g, ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function anchor(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default async function SchoolStaffPage() {
  const staff = await fetchSchoolResource<SchoolStaffRecord>('school-staff-members', {
    sort: 'priorityOrder,asc',
    'isActive.equals': 'true',
  });

  // category -> stage -> members, in the order the API returns them
  const categories = new Map<string, Map<string, SchoolStaffRecord[]>>();
  for (const member of staff) {
    const category = member.staffCategory || 'STAFF';
    const stage = member.stage || '';
    const stages = categories.get(category) || new Map<string, SchoolStaffRecord[]>();
    stages.set(stage, [...(stages.get(stage) || []), member]);
    categories.set(category, stages);
  }

  return (
    <>
      <PageBanner
        eyebrow="Faculty"
        title="Staff directory"
        intro="The teachers, leaders and support team who look after our students every day."
        crumbs={[{ label: 'Staff directory' }]}
      />
      <Container className="py-12 sm:py-16">
        {staff.length === 0 && <EmptyState title="No staff published yet." hint="Please check back soon." />}

        {categories.size > 1 && (
          <nav aria-label="Staff categories" className="mb-10 flex flex-wrap gap-2">
            {Array.from(categories.keys()).map((category) => (
              <a
                key={category}
                href={`#${anchor(category)}`}
                className="btn btn-outline"
              >
                {humanize(category)}
              </a>
            ))}
          </nav>
        )}

        {Array.from(categories.entries()).map(([category, stages]) => (
          <section key={category} id={anchor(category)} className="mb-14 scroll-mt-32 last:mb-0">
            <h2 className="mb-6 flex items-center gap-4 font-sch-display text-3xl font-semibold">
              {humanize(category)}
              <span aria-hidden className="h-px flex-1 bg-sch-border" />
            </h2>
            {Array.from(stages.entries()).map(([stage, members]) => (
              <div key={stage || 'all'} className="mb-8 last:mb-0">
                {stage && (
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sch-laterite">{humanize(stage)}</h3>
                )}
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((member) => (
                    <li key={member.id}>
                      <PersonCard
                        name={[member.firstName, member.lastName].filter(Boolean).join(' ')}
                        role={member.designation}
                        detail={[
                          member.qualification,
                          member.subjectName,
                          member.classTeacherOf ? `Class teacher: ${member.classTeacherOf}` : '',
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                        imageUrl={member.profileImageUrl}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}

        <div className="mt-12 border-t border-sch-border pt-8">
          <TextLink href="/departments" label="Browse by department" />
        </div>
      </Container>
    </>
  );
}
