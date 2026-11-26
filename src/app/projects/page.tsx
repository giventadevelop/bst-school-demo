import Link from 'next/link';
import Image from 'next/image';
import { fetchProfileProjectsServer } from '@/lib/profileSiteServer';
import { SchoolPageFrame } from '@/components/school/ui';
import { parseOutcomeMetrics } from '@/lib/profileSiteClient';

export default async function ProjectsListPage() {
  const projects = await fetchProfileProjectsServer();

  return (
    <SchoolPageFrame
      eyebrow="School life"
      title="Projects"
      intro="Case studies and selected work."
      crumbs={[{ label: 'Projects' }]}
    >

          {projects.length === 0 ? (
            <p className="font-body text-muted-foreground">No projects listed yet.</p>
          ) : (
            <ul className="card-grid">
              {projects.map((p) => {
                const metrics = parseOutcomeMetrics(p.outcomeMetricsJson);
                return (
                  <li key={p.id ?? p.slug ?? p.title}>
                    <article className="card stripe c-plum overflow-hidden flex flex-col h-full">
                      {p.coverImageUrl && (
                        <div className="relative w-full h-40 bg-muted">
                          <Image src={p.coverImageUrl} alt="" fill className="object-cover" unoptimized />
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <h2 className="font-heading font-semibold text-lg mb-1">{p.title}</h2>
                        {p.role && <p className="text-sm text-primary mb-2">{p.role}</p>}
                        {p.summary && (
                          <p className="font-body text-sm text-muted-foreground mb-4">{p.summary}</p>
                        )}
                        {metrics.length > 0 && (
                          <dl className="grid grid-cols-2 gap-3 mb-4">
                            {metrics.slice(0, 4).map((m) => (
                              <div key={`${m.label}-${m.value}`} className="bg-muted/60 rounded-lg px-3 py-2">
                                <dt className="font-caption text-xs text-muted-foreground">{m.label}</dt>
                                <dd className="font-heading font-semibold text-foreground">{m.value}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                        {p.projectUrl?.trim() && (
                          <a
                            href={p.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary font-semibold mt-auto hover:underline"
                          >
                            View project →
                          </a>
                        )}
                      </div>
                    </article>
                  </li>
                );
              })}
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
