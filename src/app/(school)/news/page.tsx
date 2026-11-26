import type { ProfileWritingDTO } from '@/types/profileSite';
import { fetchSchoolPage } from '@/lib/school/schoolPublic';
import { getProfileWritingDetailPath } from '@/lib/profileSitePaths';
import { Container, EmptyState, FeatureCard, PageBanner, SchoolPager, SCHOOL_PAGE_SIZE, colourAt, formatDate, readPageParam } from '@/components/school/ui';

export const metadata = { title: 'News' };

export default async function SchoolNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  const page = readPageParam(params?.page);
  const result = await fetchSchoolPage<ProfileWritingDTO>(
    'profile-writings',
    { 'status.equals': 'PUBLISHED', sort: 'displayOrder,asc' },
    page,
    SCHOOL_PAGE_SIZE,
  );
  const articles = result.items.filter((writing) => writing.writingType !== 'EXTERNAL_LINK');

  return (
    <>
      <PageBanner
        eyebrow="From the newsroom"
        title="News"
        intro="Stories, celebrations and announcements from around the school."
        crumbs={[{ label: 'News' }]}
      />
      <Container className="py-12 sm:py-16">
        {articles.length === 0 ? (
          <EmptyState title="No news published yet." hint="Please check back soon." />
        ) : (
          <ul className="card-grid">
            {articles.map((writing, index) => {
              const href = writing.slug?.trim()
                ? `/news/${encodeURIComponent(writing.slug.trim())}`
                : getProfileWritingDetailPath(writing) || '/news';
              return (
                <li key={writing.id ?? writing.slug}>
                  <FeatureCard
                    href={href}
                    title={writing.title}
                    summary={writing.excerpt}
                    imageUrl={writing.featuredImageUrl}
                    tag={writing.publishedAt ? formatDate(writing.publishedAt) : undefined}
                    colour={colourAt(index)}
                  />
                </li>
              );
            })}
          </ul>
        )}
        <SchoolPager page={result.page} pageSize={result.pageSize} total={result.total} noun="stories" hrefFor={(next) => `/news?page=${next}`} />
      </Container>
    </>
  );
}
