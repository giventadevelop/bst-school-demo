import { Download, FileText } from 'lucide-react';
import { fetchDownloadableProfileMediaAssetsServer } from '@/lib/profileSiteServer';
import { Container, EmptyState, PageBanner } from '@/components/school/ui';

export const metadata = { title: 'Downloads' };

function formatSize(bytes?: number) {
  if (!bytes) return '';
  return bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default async function SchoolDownloadsPage() {
  const assets = await fetchDownloadableProfileMediaAssetsServer();

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
          <ul className="divide-y divide-sch-border overflow-hidden rounded-xl border border-sch-border bg-sch-surface">
            {assets.map((asset) => (
              <li key={asset.id ?? asset.fileUrl} className="flex flex-wrap items-center gap-4 p-5">
                <FileText aria-hidden className="h-8 w-8 shrink-0 text-sch-laterite" />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold leading-snug">{asset.title}</h2>
                  {asset.description && <p className="mt-0.5 line-clamp-2 text-sm text-sch-muted">{asset.description}</p>}
                  <p className="mt-1 text-xs uppercase tracking-wide text-sch-muted">
                    {[asset.fileType, formatSize(asset.fileSizeBytes)].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <a
                  href={asset.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <Download aria-hidden className="h-4 w-4" />
                  Download<span className="sr-only">: {asset.title}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
