import Link from 'next/link';
import { ProfileServiceCard } from '@/components/profile/ProfileServiceCard';
import { SchoolPageFrame } from '@/components/school/ui';
import {
  fetchActiveProfileServicesServer,
  fetchPublishedPublicProfileForPagesServer,
} from '@/lib/profileSiteServer';

export default async function ServicesListPage() {
  const [services, profile] = await Promise.all([
    fetchActiveProfileServicesServer(),
    fetchPublishedPublicProfileForPagesServer(),
  ]);

  return (
    <SchoolPageFrame
      eyebrow="School life"
      title="Services"
      intro="Professional services offered on this site, such as tax consulting and financial consulting."
      crumbs={[{ label: 'Services' }]}
    >

          {services.length === 0 ? (
            <p className="font-body text-muted-foreground">No services listed yet.</p>
          ) : (
            <ul className="card-grid">
              {services.map((service) => (
                <li key={service.id ?? service.slug ?? service.title}>
                  <ProfileServiceCard service={service} bookingUrl={profile?.bookingUrl} />
                </li>
              ))}
            </ul>
          )}

          <p className="mt-10">
            <Link href="/" className="btn btn-text">
              Back to home
            </Link>
          </p>
    </SchoolPageFrame>
  );
}
