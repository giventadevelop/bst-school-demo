import { notFound } from 'next/navigation';
import { Download } from 'lucide-react';
import { fetchProfileMediaAssetByIdServer } from '@/lib/profileSiteServer';
import { Container, PageBanner } from '@/components/school/ui';

interface DownloadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DownloadDetailPage({ params }: DownloadDetailPageProps) {
  const { id } = await params;
  const numericId = Number(id);
  if (!numericId || Number.isNaN(numericId)) {
    notFound();
  }
  const asset = await fetchProfileMediaAssetByIdServer(numericId);
  if (!asset || asset.isDownloadable === false) {
    notFound();
  }

  return (
    <>
      <PageBanner
        eyebrow="For parents"
        title={asset.title || 'Download'}
        intro={asset.fileType || undefined}
        crumbs={[
          { label: 'Downloads', href: '/downloads' },
          { label: asset.title || 'Download' },
        ]}
      />
      <Container className="py-12 sm:py-16">
        <article className="card stripe c-blue p-6 sm:p-8">
          {asset.coverImageUrl && (
            <img src={asset.coverImageUrl} alt="" className="mb-6 h-auto w-full rounded-2xl object-contain" />
          )}
          {asset.description && <div className="sch-prose mb-6">{asset.description}</div>}
          <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <Download aria-hidden className="h-4 w-4" />
            Download file
          </a>
        </article>
      </Container>
    </>
  );
}
