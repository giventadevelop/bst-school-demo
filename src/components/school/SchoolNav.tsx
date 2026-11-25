'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type NavItem = { href: string; label: string; items?: NavItem[] };
type NavGroup = { label: string; href?: string; items?: NavItem[] };

/**
 * Labels match the original Christ Nagar menu.
 * Index links and records that are not in that menu stay on their own pages and are not listed here.
 */
const NAV: NavGroup[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About Us',
    href: '/about',
    items: [{ href: '/about/principals-message', label: "Principal's Message" }],
  },
  {
    label: 'Facilities',
    href: '/facilities',
    items: [
      { href: '/facilities/information-center', label: 'Information Center' },
      { href: '/facilities/library', label: 'Library' },
      { href: '/facilities/chemistry-lab', label: 'Chemistry Lab' },
      { href: '/facilities/biology-lab', label: 'Biology Lab' },
      { href: '/facilities/physics-lab', label: 'Physics Lab' },
      { href: '/facilities/computer-lab', label: 'Computer Lab' },
      { href: '/facilities/music-room', label: 'Music Room' },
      { href: '/facilities/bus', label: 'Bus Facilities' },
    ],
  },
  { label: 'Achievements', href: '/achievements' },
  {
    label: 'Activities',
    href: '/activities',
    items: [
      { href: '/activities/band', label: 'Band' },
      { href: '/activities/ncc', label: 'NCC' },
      { href: '/activities/quiz-club', label: 'Quiz Club' },
      { href: '/activities/roller-skating', label: 'Roller Skating' },
      { href: '/activities/chess', label: 'Chess' },
      { href: '/activities/karate', label: 'Karate' },
      { href: '/activities/basketball', label: 'Basketball' },
      { href: '/activities/aerobics', label: 'Aerobics' },
    ],
  },
  {
    label: 'Updates',
    href: '/news',
    items: [
      { href: '/news', label: 'News' },
      { href: '/downloads', label: 'Downloads' },
    ],
  },
  {
    label: 'Media',
    href: '/gallery',
    items: [
      { href: '/gallery', label: 'Photo Gallery' },
      { href: '/videos', label: 'Video Gallery' },
    ],
  },
  {
    label: 'Faculty',
    href: '/staff',
    items: [
      { href: '/staff/administration', label: 'Administration' },
      {
        href: '/departments',
        label: 'Teaching',
        items: [
          { href: '/departments/english', label: 'DEPARTMENT OF ENGLISH' },
          { href: '/departments/malayalam', label: 'Department of Malayalam' },
          { href: '/departments/hindi', label: 'Department of Hindi' },
          { href: '/departments/history-geography', label: 'Department of History' },
          { href: '/departments/geography', label: 'DEPARTMENT OF GEOGRAPHY' },
          { href: '/departments/physics', label: 'Department of Physics' },
          { href: '/departments/chemistry', label: 'Department of Chemistry' },
          { href: '/departments/biology', label: 'Department of Biology' },
          { href: '/departments/commerce', label: 'Department of Commerce' },
          { href: '/departments/general-science', label: 'DEPARTMENT OF GENERAL SCIENCE' },
          { href: '/departments/mathematics', label: 'Department of Mathematics' },
          { href: '/departments/german', label: 'DEPARTMENT OF GERMAN' },
          { href: '/departments/computer-science', label: 'Department of Computer Science' },
          { href: '/departments/physical-training', label: 'Department of Physical Training' },
          { href: '/departments/art-music-dance', label: 'DEPARTMENT OF YOGA, ART, DANCE, MUSIC, BAND & NCC' },
          { href: '/departments/librarian', label: 'LIBRARIAN' },
        ],
      },
      { href: '/staff/teaching-kg', label: 'Teaching (KG)' },
      { href: '/staff/supporting-staff', label: 'Supporting Staff' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

function Chevron({ direction = 'down' }: { direction?: 'down' | 'right' }) {
  return (
    <svg className="nav-chevron" viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
      {direction === 'right' ? (
        <path d="M7.5 5 12.5 10 7.5 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

function itemActive(pathname: string, item: NavItem) {
  return isActive(pathname, item.href) || !!item.items?.some((child) => isActive(pathname, child.href));
}

export default function SchoolNav({
  schoolName,
  phone,
  email,
}: {
  schoolName: string;
  phone?: string;
  email?: string;
}) {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40" style={{ background: 'var(--ground)' }}>
      <div className="topbar">
        <div className="wrap flex flex-wrap justify-end gap-x-6 gap-y-1">
          {phone && <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>}
          {email && <a href={`mailto:${email}`}>{email}</a>}
          <Link href="/sign-in" className="font-semibold">
            Sign in
          </Link>
        </div>
      </div>

      <div className="nav min-h-[76px] gap-7 px-[clamp(20px,5cqw,64px)]">
        <Link href="/" className="flex min-w-0 items-center gap-3 no-underline" style={{ color: 'var(--ink)' }}>
          <img src="/school/logo-bst-red.svg" alt="" width={44} height={44} className="shrink-0" />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-lg font-bold">{schoolName}</span>
            <span className="muted text-xs font-medium uppercase tracking-[0.08em]">School</span>
          </span>
        </Link>

        <nav aria-label="School" className="ml-auto hidden items-stretch gap-7 self-stretch lg:flex">
          {NAV.map((group) =>
            group.items ? (
              <div
                key={group.label}
                className={`nav-drop relative flex items-stretch${dismissed === group.label ? ' is-dismissed' : ''}`}
                onMouseEnter={() => setMenu(group.label)}
                onMouseLeave={() => {
                  setMenu(null);
                  setDismissed((current) => (current === group.label ? null : current));
                }}
                onFocus={() => setMenu(group.label)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) setMenu(null);
                }}
                onClick={(event) => {
                  const link = (event.target as HTMLElement).closest('a');
                  if (!link) return;
                  setMenu(null);
                  setDismissed(group.label);
                  link.blur();
                }}
              >
                <Link
                  href={group.href || group.items[0]?.href || '#'}
                  className="nav-link"
                  aria-current={group.items.some((item) => itemActive(pathname, item)) || (group.href ? isActive(pathname, group.href) : false) ? 'page' : undefined}
                  aria-haspopup="true"
                  aria-expanded={menu === group.label}
                >
                  {group.label}
                  <Chevron />
                </Link>
                <div className="menu">
                    {group.items?.map((item) =>
                      item.items ? (
                        <div key={item.href} className="has-sub">
                          <Link href={item.href} aria-current={itemActive(pathname, item) ? 'page' : undefined}>
                            {item.label}
                            <Chevron direction="right" />
                          </Link>
                          <div className="submenu">
                            {item.items.map((child) => (
                              <Link key={child.href} href={child.href} aria-current={isActive(pathname, child.href) ? 'page' : undefined}>
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? 'page' : undefined}>
                          {item.label}
                        </Link>
                      )
                    )}
                  </div>
              </div>
            ) : (
              <Link
                key={group.label}
                href={group.href || '/'}
                className="nav-link"
                aria-current={group.href && isActive(pathname, group.href) ? 'page' : undefined}
              >
                {group.label}
              </Link>
            )
          )}
        </nav>

        <Link href="/admissions" className="btn btn-primary ml-auto hidden whitespace-nowrap lg:ml-0 lg:inline-flex">
          Admissions <span aria-hidden="true">→</span>
        </Link>
        <button
          type="button"
          className="btn btn-outline nav-toggle lg:hidden"
          aria-expanded={open}
          aria-controls="school-mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav
          id="school-mobile-nav"
          aria-label="School (mobile)"
          className="max-h-[calc(100vh-112px)] overflow-y-auto border-b px-[clamp(20px,5cqw,64px)] pb-7 pt-2 lg:hidden"
          style={{ background: 'var(--ground)', borderColor: 'var(--line)', boxShadow: 'var(--shadow-lift)' }}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest('a')) setOpen(false);
          }}
        >
          {NAV.map((group) => (
            <div key={group.label} className="border-b py-3.5" style={{ borderColor: 'var(--line)' }}>
              {!group.items ? (
                <Link href={group.href || '/'} className="block text-xl font-semibold no-underline" style={{ color: 'var(--ink)' }}>
                  {group.label}
                </Link>
              ) : (
                <>
                  <p className="flex items-center gap-2 text-xl font-semibold">
                    {group.label}
                    <Chevron />
                  </p>
                  <div className="flex flex-col">
                    {group.items?.map((item) => (
                      <div key={item.href}>
                        <Link
                          href={item.href}
                          className="flex min-h-11 items-center py-2 no-underline"
                          style={{ color: 'var(--body)' }}
                        >
                          {item.label}
                        </Link>
                        {item.items?.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex min-h-11 items-center py-2 pl-4 no-underline"
                            style={{ color: 'var(--body)' }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
          <Link href="/admissions" className="btn btn-primary btn-block mt-5">
            Admissions <span aria-hidden="true">→</span>
          </Link>
          <Link href="/sign-in" className="btn btn-outline btn-block mt-3">
            Sign in
          </Link>
        </nav>
      )}
    </header>
  );
}
