import { Download, FileText } from 'lucide-react';
import type { ProfileMediaAssetDTO } from '@/types/profileSite';
import { fetchSchoolPage } from '@/lib/school/schoolPublic';
import { Container, EmptyState, PageBanner, SchoolPager, SCHOOL_PAGE_SIZE, colourAt, readPageParam } from '@/components/school/ui';

export const metadata = { title: 'Downloads' };

function formatSize(bytes?: number) {
  if (!bytes) return '';
  return bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default async function SchoolDownloadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  const page = readPageParam(params?.page);
  const result = await fetchSchoolPage<ProfileMediaAssetDTO>(
    'profile-media-assets',
    { sort: 'displayOrder,asc', 'isDownloadable.equals': 'true' },
    page,
    SCHOOL_PAGE_SIZE,
  );
  const assets = result.items.filter((asset) => asset.isDownloadable !== false);

  return (
    <>
      <PageBanner
        eyebrow="For parents"
        title="Downloads"
        intro="Circulars, calendars, forms and other documents from the school office."
        crumbs={[{ label: 'Downloads' }]}
      />
      <Container className="py-12 sm:py-16">
        {assets.length === 0 ? (
          <EmptyState title="No downloads available yet." hint="Documents appear here when the office publishes them." />
        ) : (
          <ul className="grid gap-4">
            {assets.map((asset, index) => (
              <li key={asset.id ?? asset.fileUrl}>
                <article className={`card stripe ${colourAt(index)} p-5`}>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="ico" aria-hidden>
                      <FileText className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="h5">{asset.title}</h3>
                      {asset.description && <p className="body mt-1 line-clamp-2">{asset.description}</p>}
                      <p className="muted mt-1 text-sm">
                        {[asset.fileType, formatSize(asset.fileSizeBytes)].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                      <Download aria-hidden className="h-4 w-4" />
                      Download<span className="sr-only">: {asset.title}</span>
                    </a>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
        <SchoolPager
          page={result.page}
          pageSize={result.pageSize}
          total={result.total}
          noun="downloads"
          hrefFor={(next) => `/downloads?page=${next}`}
        />
      </Container>
    </>
  );
}
