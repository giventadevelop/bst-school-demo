import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProfileServiceCard } from '@/components/profile/ProfileServiceCard';
import { SchoolPageFrame } from '@/components/school/ui';
import {
  fetchProfileServiceBySlugServer,
  fetchPublishedPublicProfileForPagesServer,
} from '@/lib/profileSiteServer';

interface ServiceSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceSlugPage({ params }: ServiceSlugPageProps) {
  const { slug } = await params;
  const [service, profile] = await Promise.all([
    fetchProfileServiceBySlugServer(decodeURIComponent(slug)),
    fetchPublishedPublicProfileForPagesServer(),
  ]);
  if (!service) {
    notFound();
  }

  return (
    <SchoolPageFrame
      eyebrow="School life"
      title={service.title || 'Service'}
      crumbs={[{ label: 'Services', href: '/services' }, { label: service.title || 'Service' }]}
    >
      <ProfileServiceCard service={service} bookingUrl={profile?.bookingUrl} variant="detail" />
      <p className="mt-8">
        <Link href="/services" className="btn btn-text">
          Back to services
        </Link>
      </p>
    </SchoolPageFrame>
  );
}
