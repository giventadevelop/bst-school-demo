import Link from 'next/link';
import Image from 'next/image';
import { fetchProfileAffiliationsForLinksServer } from '@/lib/profileSiteServer';
import { SchoolPageFrame } from '@/components/school/ui';

export default async function AffiliationsListPage() {
  const items = await fetchProfileAffiliationsForLinksServer();

  return (
    <SchoolPageFrame
      eyebrow="School life"
      title="Affiliations"
      intro="Boards, communities, and organizations."
      crumbs={[{ label: 'Affiliations' }]}
    >

          {items.length === 0 ? (
            <p className="font-body text-muted-foreground">No affiliations listed yet.</p>
          ) : (
            <ul className="card-grid">
              {items.map((a) => (
                <li key={a.id ?? a.organizationName} className="card stripe c-teal flex gap-4 p-5">
                  {a.logoUrl && (
                    <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image src={a.logoUrl} alt={a.organizationName} fill className="object-contain" unoptimized />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="font-heading font-semibold">{a.organizationName}</h2>
                    {a.role && <p className="text-sm text-primary">{a.role}</p>}
                    {a.description && (
                      <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                    )}
                    {a.url?.trim() && (
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary font-semibold mt-2 inline-block hover:underline"
                      >
                        Visit →
                      </a>
                    )}
                  </div>
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
