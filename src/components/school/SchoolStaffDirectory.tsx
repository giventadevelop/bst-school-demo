import { fetchSchoolResource, type SchoolStaffRecord } from '@/lib/school/schoolPublic';
import { matchesPublicSearchFields } from '@/lib/publicTypeaheadSearch';
import { SchoolListSearch } from '@/components/school/SchoolListSearch';
import { Container, EmptyState, PageBanner, PersonCard, SchoolPager, SCHOOL_PAGE_SIZE, TextLink, colourAt } from '@/components/school/ui';

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
  page = 1,
  query = '',
  pathname,
}: {
  title: string;
  intro: string;
  crumb: string;
  category?: string;
  stage?: string;
  page?: number;
  query?: string;
  pathname: string;
}) {
  const rows = await fetchSchoolResource<SchoolStaffRecord>('school-staff-members', {
    sort: 'priorityOrder,asc',
    'isActive.equals': 'true',
    size: '200',
  });
  const directory = rows.filter((member) => {
    if (category && member.staffCategory !== category) return false;
    if (stage && member.stage !== stage) return false;
    return true;
  });
  const staffFields = (member: SchoolStaffRecord) => [
    member.firstName,
    member.lastName,
    member.designation,
    member.qualification,
    member.subjectName,
    member.classTeacherOf,
    member.bio,
    member.staffCategory,
    member.stage,
    member.id,
  ];
  const staff = directory.filter((member) => matchesPublicSearchFields(staffFields(member), query));
  const totalPages = Math.max(1, Math.ceil(staff.length / SCHOOL_PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  const visible = staff.slice((current - 1) * SCHOOL_PAGE_SIZE, current * SCHOOL_PAGE_SIZE);

  const categories = new Map<string, Map<string, SchoolStaffRecord[]>>();
  for (const member of visible) {
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
        <SchoolListSearch
          label="Search staff"
          placeholder="Search by name, subject, or role"
          committedQuery={query}
          pathname={pathname}
          items={directory}
          fields={['firstName', 'lastName', 'designation', 'qualification', 'subjectName', 'classTeacherOf', 'bio', 'staffCategory', 'stage', 'id']}
          commitFields={['firstName', 'lastName']}
          primaryFields={['firstName', 'lastName']}
          secondaryFields={['designation', 'subjectName']}
          primaryFallback="Staff member"
        />
        {staff.length === 0 && (
          <EmptyState
            title={query ? 'No staff match that search.' : 'No staff published yet.'}
            hint={query ? 'Try another word, or clear the search.' : 'Please check back soon.'}
          />
        )}

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
            <h2 className="h2 mb-6">{humanize(name)}</h2>
            {Array.from(stages.entries()).map(([stageName, members]) => (
              <div key={stageName || 'all'} className="mb-8 last:mb-0">
                {stageName && <h3 className="kicker">{humanize(stageName)}</h3>}
                <ul className="card-grid">
                  {members.map((member, index) => (
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
                        colour={colourAt(index)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}

        <SchoolPager
          page={current}
          pageSize={SCHOOL_PAGE_SIZE}
          total={staff.length}
          noun="staff"
          list={{ pathname, query }}
        />

        {!category && !stage && (
          <div className="mt-12 border-t pt-8" style={{ borderColor: 'var(--line)' }}>
            <TextLink href="/departments" label="Browse by department" />
          </div>
        )}
      </Container>
    </>
  );
}
