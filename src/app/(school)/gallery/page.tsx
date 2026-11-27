import { fetchAlbumsForGallery } from '@/app/gallery/ApiServerActions';
import { PUBLIC_GALLERY_ALBUM_SEARCH_FIELDS } from '@/lib/publicTypeaheadSearch';
import { SchoolListSearch } from '@/components/school/SchoolListSearch';
import { Container, EmptyState, FeatureCard, PageBanner, SchoolPager, SCHOOL_PAGE_SIZE, colourAt, readPageParam, readQueryParam } from '@/components/school/ui';

export const metadata = { title: 'Photo gallery' };

export default async function SchoolGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[]; q?: string | string[] }>;
}) {
  const params = await searchParams;
  const page = readPageParam(params?.page);
  const query = readQueryParam(params?.q);
  const { albumsWithMedia, totalAlbums } = await fetchAlbumsForGallery(page - 1, SCHOOL_PAGE_SIZE, query);

  return (
    <>
      <PageBanner
        eyebrow="Campus life"
        title="Photo gallery"
        intro="Albums from festivals, sports days, assemblies and everyday moments."
        crumbs={[{ label: 'Photo gallery' }]}
      />
      <Container className="py-12 sm:py-16">
        <SchoolListSearch
          label="Search albums"
          placeholder="Search by title, place, or description"
          committedQuery={query}
          pathname="/gallery"
          items={albumsWithMedia.map(({ album }) => album)}
          resource="gallery-albums"
          containsFields={PUBLIC_GALLERY_ALBUM_SEARCH_FIELDS}
          extraParams={{ 'isPublic.equals': 'true' }}
          fields={['title', 'description', 'eventLocation', 'albumYear', 'searchText', 'id']}
          commitFields={['title']}
          primaryFields={['title']}
          secondaryFields={['albumYear', 'eventLocation']}
          primaryFallback="Untitled album"
        />
        {albumsWithMedia.length === 0 ? (
          <EmptyState
            title={query ? 'No albums match that search.' : 'No albums published yet.'}
            hint={query ? 'Try another word, or clear the search.' : 'Photos appear here after each event.'}
          />
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
          list={{ pathname: '/gallery', query }}
        />
      </Container>
    </>
  );
}
