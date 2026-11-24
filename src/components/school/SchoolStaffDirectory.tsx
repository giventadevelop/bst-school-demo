import { fetchSchoolResource, type SchoolStaffRecord } from '@/lib/school/schoolPublic';
import { Container, EmptyState, PageBanner, PersonCard, TextLink } from '@/components/school/ui';

function humanize(value: string) {
  const text = value.replace(/[_-]+/g, ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function anchor(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export async function SchoolStaffDirectory({
  title,
  intro,
  crumb,
  category,
  stage,
}: {
  title: string;
  intro: string;
  crumb: string;
  category?: string;
  stage?: string;
}) {
  const rows = await fetchSchoolResource<SchoolStaffRecord>('school-staff-members', {
    sort: 'priorityOrder,asc',
    'isActive.equals': 'true',
  });
  const staff = rows.filter((member) => {
    if (category && member.staffCategory !== category) return false;
    if (stage && member.stage !== stage) return false;
    return true;
  });

  const categories = new Map<string, Map<string, SchoolStaffRecord[]>>();
  for (const member of staff) {
    const memberCategory = member.staffCategory || 'STAFF';
    const memberStage = member.stage || '';
    const stages = categories.get(memberCategory) || new Map<string, SchoolStaffRecord[]>();
    stages.set(memberStage, [...(stages.get(memberStage) || []), member]);
    categories.set(memberCategory, stages);
  }

  return (
    <>
      <PageBanner eyebrow="Faculty" title={title} intro={intro} crumbs={[{ label: crumb }]} />
      <Container className="py-12 sm:py-16">
        {staff.length === 0 && <EmptyState title="No staff published yet." hint="Please check back soon." />}

        {categories.size > 1 && (
          <nav aria-label="Staff categories" className="mb-10 flex flex-wrap gap-2">
            {Array.from(categories.keys()).map((name) => (
              <a key={name} href={`#${anchor(name)}`} className="btn btn-outline">
                {humanize(name)}
              </a>
            ))}
          </nav>
        )}

        {Array.from(categories.entries()).map(([name, stages]) => (
          <section key={name} id={anchor(name)} className="mb-14 scroll-mt-32 last:mb-0">
            <h2 className="mb-6 flex items-center gap-4 font-sch-display text-3xl font-semibold">
              {humanize(name)}
              <span aria-hidden className="h-px flex-1 bg-sch-border" />
            </h2>
            {Array.from(stages.entries()).map(([stageName, members]) => (
              <div key={stageName || 'all'} className="mb-8 last:mb-0">
                {stageName && (
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sch-laterite">
                    {humanize(stageName)}
                  </h3>
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

        {!category && !stage && (
          <div className="mt-12 border-t border-sch-border pt-8">
            <TextLink href="/departments" label="Browse by department" />
          </div>
        )}
      </Container>
    </>
  );
}
