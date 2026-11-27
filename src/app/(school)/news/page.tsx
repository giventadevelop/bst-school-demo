import type { ProfileWritingDTO } from '@/types/profileSite';
import { searchSchoolPage } from '@/lib/school/schoolPublic';
import { SCHOOL_NEWS_SEARCH_FIELDS } from '@/lib/publicTypeaheadSearch';
import { getProfileWritingDetailPath } from '@/lib/profileSitePaths';
import { SchoolListSearch } from '@/components/school/SchoolListSearch';
import { Container, EmptyState, FeatureCard, PageBanner, SchoolPager, SCHOOL_PAGE_SIZE, colourAt, formatDate, readPageParam, readQueryParam } from '@/components/school/ui';

export const metadata = { title: 'News' };

export default async function SchoolNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[]; q?: string | string[] }>;
}) {
  const params = await searchParams;
  const page = readPageParam(params?.page);
  const query = readQueryParam(params?.q);
  const result = await searchSchoolPage<ProfileWritingDTO>(
    'profile-writings',
    { 'status.equals': 'PUBLISHED', sort: 'displayOrder,asc' },
    query,
    SCHOOL_NEWS_SEARCH_FIELDS,
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
        <SchoolListSearch
          label="Search news"
          placeholder="Search by title, story, or id"
          committedQuery={query}
          pathname="/news"
          items={articles}
          resource="profile-writings"
          containsFields={SCHOOL_NEWS_SEARCH_FIELDS}
          extraParams={{ 'status.equals': 'PUBLISHED', sort: 'displayOrder,asc' }}
          fields={['title', 'excerpt', 'body', 'slug', 'publicationName', 'id']}
          commitFields={['title']}
          primaryFields={['title']}
          secondaryFields={['excerpt']}
          primaryFallback="Untitled story"
        />
        {articles.length === 0 ? (
          <EmptyState
            title={query ? 'No stories match that search.' : 'No news published yet.'}
            hint={query ? 'Try another word, or clear the search.' : 'Please check back soon.'}
          />
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
        <SchoolPager page={result.page} pageSize={result.pageSize} total={result.total} noun="stories" list={{ pathname: '/news', query }} />
      </Container>
    </>
  );
}
