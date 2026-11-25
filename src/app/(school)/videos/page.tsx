import { fetchSchoolResource } from '@/lib/school/schoolPublic';
import { Container, EmptyState, PageBanner } from '@/components/school/ui';

export const metadata = { title: 'Video gallery' };

type SchoolVideo = {
  id?: number;
  title?: string;
  youtubeUrl?: string;
  description?: string;
};

function youtubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=|shorts\/))([A-Za-z0-9_-]{11})/);
  return match?.[1] || null;
}

export default async function SchoolVideosPage() {
  const rows = await fetchSchoolResource<SchoolVideo>('gallery-youtube-videos', {
    sort: 'displayOrder,asc',
    'isActive.equals': 'true',
  });
  const videos = rows
    .map((row) => ({ ...row, id: row.id, videoId: row.youtubeUrl ? youtubeId(row.youtubeUrl) : null }))
    .filter((row) => row.videoId);

  return (
    <>
      <PageBanner
        eyebrow="Media"
        title="Video gallery"
        intro="Recordings of school events, festivals and ceremonies."
        crumbs={[{ label: 'Video gallery' }]}
      />
      <Container className="py-12 sm:py-16">
        {videos.length === 0 ? (
          <EmptyState title="No videos published yet." hint="Recordings appear here after each event." />
        ) : (
          <ul className="card-grid">
            {videos.map((video) => (
              <li key={video.id || video.videoId} className="card overflow-hidden">
                <div className="aspect-video" style={{ background: 'var(--ink)' }}>
                  <iframe
                    title={video.title || 'School video'}
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <h3 className="h5">{video.title || 'School video'}</h3>
                  {video.description && <p className="body mt-2">{video.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
