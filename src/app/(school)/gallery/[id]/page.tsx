import { fetchAlbumWithMedia } from '@/app/gallery/ApiServerActions';
import SchoolLightboxGrid from '@/components/school/SchoolLightboxGrid';
import { Container, EmptyState, NotFoundBlock, PageBanner } from '@/components/school/ui';

export default async function SchoolAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const albumId = Number(id);
  const result = Number.isInteger(albumId) && albumId > 0 ? await fetchAlbumWithMedia(albumId) : null;
  if (!result) {
    return <NotFoundBlock what="album" backHref="/gallery" backLabel="All albums" />;
  }

  const photos = result.media
    .filter((item) => item.fileUrl)
    .map((item) => ({ src: item.fileUrl as string, alt: item.altText || item.title || '' }));

  return (
    <>
      <PageBanner
        eyebrow={[result.album.albumYear, result.album.eventLocation].filter(Boolean).join(' · ') || 'Album'}
        title={result.album.title}
        intro={result.album.description}
        crumbs={[{ label: 'Photo gallery', href: '/gallery' }, { label: result.album.title }]}
      />
      <Container className="py-12 sm:py-16">
        {photos.length > 0 ? (
          <SchoolLightboxGrid photos={photos} />
        ) : (
          <EmptyState title="This album has no photos yet." action={{ href: '/gallery', label: 'All albums' }} />
        )}
      </Container>
    </>
  );
}
