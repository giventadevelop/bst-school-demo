import Link from 'next/link';
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
    <footer className="foot">
      <div className="wrap grid gap-10 pt-16" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))' }}>
        <div className="min-w-0">
          <Link href="/" className="flex items-center gap-3">
            <img src="/school/logo-bst-red.svg" alt="" width={44} height={44} />
            <span className="text-lg font-bold leading-tight">{school.name}</span>
          </Link>
          {school.description && <p className="fm mt-4 max-w-sm text-sm leading-6">{school.description}</p>}
          <address className="fm mt-4 text-sm not-italic leading-6">
            {school.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            {school.phone && (
              <a href={`tel:${school.phone.replace(/\s+/g, '')}`} className="block">
                {school.phone}
              </a>
            )}
            {school.email && (
              <a href={`mailto:${school.email}`} className="block break-all">
                {school.email}
              </a>
            )}
          </address>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="mb-3.5 text-[13px] font-semibold uppercase tracking-[0.1em]">{column.title}</p>
            <div className="flex flex-col">
              {column.links.map((link) => (
                <Link key={link.href} href={link.href} className="fm py-1.5 text-[15px] leading-snug">
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        ))}
      </div>
      <div className="wrap">
        <div className="rule fm mt-12 flex flex-wrap justify-between gap-x-6 gap-y-1.5 border-t py-5 text-[13px] leading-5">
          <span>
            © {new Date().getFullYear()} {school.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
