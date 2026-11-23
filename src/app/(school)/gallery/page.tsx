import Link from 'next/link';
import { fetchAlbumsForGallery } from '@/app/gallery/ApiServerActions';
import { Container, EmptyState, PageBanner } from '@/components/school/ui';

export const metadata = { title: 'Photo gallery' };

export default async function SchoolGalleryPage() {
  const { albumsWithMedia } = await fetchAlbumsForGallery(0, 48);

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
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albumsWithMedia.map(({ album, media, totalMediaCount }) => {
              const cover = album.coverImageUrl || media.find((item) => item.fileUrl)?.fileUrl;
              return (
                <li key={album.id}>
                  <Link href={`/gallery/${album.id}`} className="sch-card group block overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden bg-sch-surface-alt">
                      {cover ? (
                        <img
                          src={cover}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div aria-hidden className="sch-weave h-full w-full bg-sch-accent" />
                      )}
                      <span className="tag t-solid absolute bottom-3 right-3">
                        {totalMediaCount} {totalMediaCount === 1 ? 'photo' : 'photos'}
                      </span>
                    </div>
                    <div className="p-5">
                      <h2 className="font-sch-display text-xl font-semibold leading-snug group-hover:text-sch-accent">{album.title}</h2>
                      <p className="mt-1 text-sm text-sch-muted">
                        {[album.albumYear, album.eventLocation].filter(Boolean).join(' · ')}
                      </p>
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
