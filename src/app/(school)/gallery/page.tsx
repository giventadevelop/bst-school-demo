import { fetchAlbumsForGallery } from '@/app/gallery/ApiServerActions';
import { Container, EmptyState, FeatureCard, PageBanner, SchoolPager, SCHOOL_PAGE_SIZE, colourAt, readPageParam } from '@/components/school/ui';

export const metadata = { title: 'Photo gallery' };

export default async function SchoolGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  const page = readPageParam(params?.page);
  const { albumsWithMedia, totalAlbums } = await fetchAlbumsForGallery(page - 1, SCHOOL_PAGE_SIZE);

  return (
    <>
      <PageBanner
        eyebrow="Campus life"
        title="Photo gallery"
        intro="Albums from festivals, sports days, assemblies and everyday moments."
        crumbs={[{ label: 'Photo gallery' }]}
      />
      <Container className="py-12 sm:py-16">
        {albumsWithMedia.length === 0 ? (
          <EmptyState title="No albums published yet." hint="Photos appear here after each event." />
        ) : (
          <ul className="card-grid">
            {albumsWithMedia.map(({ album, media, totalMediaCount }, index) => {
              const cover = album.coverImageUrl || media.find((item) => item.fileUrl)?.fileUrl;
              const place = [album.albumYear, album.eventLocation].filter(Boolean).join(' · ');
              return (
                <li key={album.id}>
                  <FeatureCard
                    href={`/gallery/${album.id}`}
                    title={album.title}
                    summary={place || undefined}
                    imageUrl={cover}
                    tag={`${totalMediaCount} ${totalMediaCount === 1 ? 'photo' : 'photos'}`}
                    colour={colourAt(index)}
                  />
                </li>
              );
            })}
          </ul>
        )}
        <SchoolPager
          page={page}
          pageSize={SCHOOL_PAGE_SIZE}
          total={totalAlbums || albumsWithMedia.length}
          noun="albums"
          hrefFor={(next) => `/gallery?page=${next}`}
        />
      </Container>
    </>
  );
}
