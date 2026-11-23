import { fetchProfileWritingBySlugServer } from '@/lib/profileSiteServer';
import { Article, Container, NotFoundBlock, PageBanner, TextLink, formatDate } from '@/components/school/ui';

export default async function SchoolNewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const writing = await fetchProfileWritingBySlugServer(decodeURIComponent(slug));
  if (!writing) {
    return <NotFoundBlock what="article" backHref="/news" backLabel="All news" />;
  }

  return (
    <>
      <PageBanner
        eyebrow={writing.publishedAt ? formatDate(writing.publishedAt) : 'News'}
        title={writing.title}
        crumbs={[{ label: 'News', href: '/news' }, { label: writing.title }]}
      />
      <Article summary={writing.excerpt} body={writing.body} imageUrl={writing.featuredImageUrl} />
      <Container className="pb-16">
        <TextLink href="/news" label="More news" />
      </Container>
    </>
  );
}
