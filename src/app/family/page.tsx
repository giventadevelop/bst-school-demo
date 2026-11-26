import Link from 'next/link';
import Image from 'next/image';
import { fetchProfileFamilyMembersServer } from '@/lib/profileSiteServer';
import { SchoolPageFrame } from '@/components/school/ui';
import { PROFILE_FAMILY_RELATIONSHIP_LABELS } from '@/types/profileSite';

export default async function FamilyListPage() {
  const items = await fetchProfileFamilyMembersServer();

  return (
    <SchoolPageFrame
      eyebrow="School life"
      title="Family"
      intro="Spouse, children, parents, siblings, and other family."
      crumbs={[{ label: 'Family' }]}
    >

          {items.length === 0 ? (
            <p className="font-body text-muted-foreground">No family members listed yet.</p>
          ) : (
            <ul className="card-grid">
              {items.map((m) => (
                <li key={m.id ?? m.displayName} className="card stripe c-blue flex gap-4 p-5">
                  {m.photoUrl && (
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden bg-muted">
                      <Image src={m.photoUrl} alt={m.displayName} fill className="object-cover" unoptimized />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="font-heading font-semibold">{m.displayName}</h2>
                    <p className="text-sm text-primary">
                      {PROFILE_FAMILY_RELATIONSHIP_LABELS[m.relationship] ?? m.relationship}
                      {m.roleTitle ? ` · ${m.roleTitle}` : ''}
                    </p>
                    {m.description && (
                      <p className="text-sm text-muted-foreground mt-1">{m.description}</p>
                    )}
                    {m.url?.trim() && (
                      <a
                        href={m.url}
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
