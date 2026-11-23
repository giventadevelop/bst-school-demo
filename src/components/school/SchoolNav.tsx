'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type NavItem = { href: string; label: string };
type NavGroup = { label: string; href?: string; items?: NavItem[] };

/** Main navigation of the school site. All paths are root-level. */
const NAV: NavGroup[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    items: [
      { href: '/about', label: 'Our story' },
      { href: '/about/principals-message', label: "Principal's message" },
      { href: '/academics', label: 'Academics' },
    ],
  },
  {
    label: 'Faculty',
    items: [
      { href: '/staff', label: 'Staff directory' },
      { href: '/departments', label: 'Departments' },
    ],
  },
  {
    label: 'Campus life',
    items: [
      { href: '/facilities', label: 'Facilities' },
      { href: '/activities', label: 'Clubs & activities' },
      { href: '/gallery', label: 'Photo gallery' },
    ],
  },
  {
    label: 'Updates',
    items: [
      { href: '/news', label: 'News' },
      { href: '/events', label: 'Events' },
      { href: '/achievements', label: 'Achievements' },
      { href: '/downloads', label: 'Downloads' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
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
        <div className="wrap flex flex-wrap justify-end gap-x-6 gap-y-1 py-2">
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
            group.href ? (
              <Link
                key={group.label}
                href={group.href}
                className="nav-link"
                aria-current={isActive(pathname, group.href) ? 'page' : undefined}
              >
                {group.label}
              </Link>
            ) : (
              <div
                key={group.label}
                className="relative flex items-stretch"
                onMouseEnter={() => setMenu(group.label)}
                onMouseLeave={() => setMenu(null)}
                onFocus={() => setMenu(group.label)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) setMenu(null);
                }}
              >
                <Link
                  href={group.items?.[0]?.href || '#'}
                  className="nav-link"
                  aria-current={group.items?.some((item) => isActive(pathname, item.href)) ? 'page' : undefined}
                >
                  {group.label}
                </Link>
                {menu === group.label && (
                  <div className="menu">
                    {group.items?.map((item) => (
                      <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? 'page' : undefined}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </nav>

        <Link href="/admissions" className="btn btn-primary ml-auto hidden whitespace-nowrap lg:ml-0 lg:inline-flex">
          Admissions <span aria-hidden="true">→</span>
        </Link>
        <button
          type="button"
          className="btn btn-outline lg:hidden"
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
        >
          {NAV.map((group) => (
            <div key={group.label} className="border-b py-3.5" style={{ borderColor: 'var(--line)' }}>
              {group.href ? (
                <Link href={group.href} className="block text-xl font-semibold no-underline" style={{ color: 'var(--ink)' }}>
                  {group.label}
                </Link>
              ) : (
                <>
                  <p className="text-xl font-semibold">{group.label}</p>
                  <div className="flex flex-col">
                    {group.items?.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex min-h-11 items-center py-2 no-underline"
                        style={{ color: 'var(--body)' }}
                      >
                        {item.label}
                      </Link>
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
