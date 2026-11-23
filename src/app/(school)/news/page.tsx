import Link from 'next/link';
import { fetchPublishedProfileWritingsServer } from '@/lib/profileSiteServer';
import { getProfileWritingDetailPath } from '@/lib/profileSitePaths';
import { Container, EmptyState, PageBanner, formatDate } from '@/components/school/ui';

export const metadata = { title: 'News' };

export default async function SchoolNewsPage() {
  const writings = await fetchPublishedProfileWritingsServer();
  const articles = writings.filter((writing) => writing.writingType !== 'EXTERNAL_LINK');

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
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((writing) => {
              const href = writing.slug?.trim()
                ? `/news/${encodeURIComponent(writing.slug.trim())}`
                : getProfileWritingDetailPath(writing) || '/news';
              return (
                <li key={writing.id ?? writing.slug}>
                  <Link href={href} className="sch-card group flex h-full flex-col overflow-hidden">
                    <div className="aspect-[16/10] overflow-hidden bg-sch-surface-alt">
                      {writing.featuredImageUrl ? (
                        <img
                          src={writing.featuredImageUrl}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div aria-hidden className="sch-weave h-full w-full bg-sch-accent" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {writing.publishedAt && (
                        <p className="text-xs font-semibold uppercase tracking-widest text-sch-laterite">
                          {formatDate(writing.publishedAt)}
                        </p>
                      )}
                      <h2 className="mt-2 font-sch-display text-xl font-semibold leading-snug group-hover:text-sch-accent">
                        {writing.title}
                      </h2>
                      {writing.excerpt && <p className="mt-2 line-clamp-3 text-sm text-sch-muted">{writing.excerpt}</p>}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </>
  );
}
