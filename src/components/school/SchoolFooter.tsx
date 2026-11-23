import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import type { SchoolIdentity } from '@/lib/school/schoolIdentity';

/** Footer link columns. All paths are root-level. */
const COLUMNS = [
  {
    title: 'The school',
    links: [
      { href: '/about', label: 'Our story' },
      { href: '/about/principals-message', label: "Principal's message" },
      { href: '/academics', label: 'Academics' },
      { href: '/staff', label: 'Staff directory' },
      { href: '/departments', label: 'Departments' },
    ],
  },
  {
    title: 'Campus life',
    links: [
      { href: '/facilities', label: 'Facilities' },
      { href: '/activities', label: 'Clubs & activities' },
      { href: '/gallery', label: 'Photo gallery' },
      { href: '/events', label: 'Events' },
      { href: '/achievements', label: 'Achievements' },
    ],
  },
  {
    title: 'For parents',
    links: [
      { href: '/admissions', label: 'Admissions & fees' },
      { href: '/news', label: 'News' },
      { href: '/downloads', label: 'Downloads' },
      { href: '/contact', label: 'Contact the office' },
    ],
  },
];

export default function SchoolFooter({ school }: { school: SchoolIdentity }) {
  return (
    <footer className="sch-on-dark bg-sch-ink text-sch-on-ink">
      <div className="sch-kasavu" aria-hidden />
      <div className="sch-weave">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-sch-display text-2xl font-semibold">{school.name}</p>
            {school.description && (
              <p className="mt-3 line-clamp-4 max-w-sm text-sm text-sch-on-ink-muted">{school.description}</p>
            )}
            <ul className="mt-6 space-y-3 text-sm text-sch-on-ink-muted">
              {school.addressLines.length > 0 && (
                <li className="flex gap-3">
                  <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-sch-gold-bright" />
                  <address className="not-italic">
                    {school.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </li>
              )}
              {school.phone && (
                <li className="flex gap-3">
                  <Phone aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-sch-gold-bright" />
                  <a href={`tel:${school.phone.replace(/\s+/g, '')}`} className="hover:text-sch-gold-bright">
                    {school.phone}
                  </a>
                </li>
              )}
              {school.email && (
                <li className="flex gap-3">
                  <Mail aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-sch-gold-bright" />
                  <a href={`mailto:${school.email}`} className="break-all hover:text-sch-gold-bright">
                    {school.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sch-gold-bright">{column.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sch-on-ink-muted hover:text-sch-on-ink hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-sch-on-ink/15">
          <p className="mx-auto max-w-[1200px] px-5 py-5 text-xs text-sch-on-ink-muted sm:px-8">
            © {new Date().getFullYear()} {school.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
