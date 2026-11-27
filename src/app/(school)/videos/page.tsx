import { searchSchoolPage } from '@/lib/school/schoolPublic';
import { SCHOOL_VIDEO_SEARCH_FIELDS } from '@/lib/publicTypeaheadSearch';
import { SchoolListSearch } from '@/components/school/SchoolListSearch';
import { Container, EmptyState, PageBanner, SchoolPager, SCHOOL_PAGE_SIZE, readPageParam, readQueryParam } from '@/components/school/ui';

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

export default async function SchoolVideosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[]; q?: string | string[] }>;
}) {
  const params = await searchParams;
  const page = readPageParam(params?.page);
  const query = readQueryParam(params?.q);
  const result = await searchSchoolPage<SchoolVideo>(
    'gallery-youtube-videos',
    { sort: 'displayOrder,asc', 'isActive.equals': 'true' },
    query,
    SCHOOL_VIDEO_SEARCH_FIELDS,
    page,
    SCHOOL_PAGE_SIZE,
  );
  const rows = result.items;
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
        <SchoolListSearch
          label="Search videos"
          placeholder="Search by title or description"
          committedQuery={query}
          pathname="/videos"
          items={videos}
          resource="gallery-youtube-videos"
          containsFields={SCHOOL_VIDEO_SEARCH_FIELDS}
          extraParams={{ sort: 'displayOrder,asc', 'isActive.equals': 'true' }}
          fields={['title', 'description', 'id']}
          commitFields={['title']}
          primaryFields={['title']}
          secondaryFields={['description']}
          primaryFallback="School video"
        />
        {videos.length === 0 ? (
          <EmptyState
            title={query ? 'No videos match that search.' : 'No videos published yet.'}
            hint={query ? 'Try another word, or clear the search.' : 'Recordings appear here after each event.'}
          />
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
        <SchoolPager page={result.page} pageSize={result.pageSize} total={result.total} noun="videos" list={{ pathname: '/videos', query }} />
      </Container>
    </>
  );
}
