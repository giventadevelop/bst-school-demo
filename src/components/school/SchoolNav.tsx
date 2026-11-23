'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, LogIn, Mail, Menu, Phone, X } from 'lucide-react';

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

  useEffect(() => {
    setOpen(false);
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
    <header className="sticky top-0 z-40">
      <div className="sch-on-dark hidden bg-sch-ink text-sch-on-ink-muted md:block">
        <div className="mx-auto flex max-w-[1200px] items-center justify-end gap-6 px-8 py-1.5 text-xs">
            {phone && (
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-1.5 hover:text-sch-gold-bright">
                <Phone aria-hidden className="h-3.5 w-3.5" />
                {phone}
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:text-sch-gold-bright">
                <Mail aria-hidden className="h-3.5 w-3.5" />
                {email}
              </a>
            )}
            <Link href="/sign-in" className="inline-flex items-center gap-1.5 font-semibold text-sch-on-ink hover:text-sch-gold-bright">
              <LogIn aria-hidden className="h-3.5 w-3.5" />
              Sign in
            </Link>
          </div>
      </div>

      <div className="border-b border-sch-border bg-sch-bg/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden
              className="sch-arch flex h-11 w-9 shrink-0 items-center justify-center bg-sch-accent font-sch-display text-lg font-semibold text-sch-gold-bright"
            >
              {schoolName.charAt(0)}
            </span>
            <span className="truncate font-sch-display text-lg font-semibold leading-tight text-sch-text sm:text-xl">
              {schoolName}
            </span>
          </Link>

          <nav aria-label="School" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((group) =>
                group.href ? (
                  <li key={group.label}>
                    <Link
                      href={group.href}
                      aria-current={isActive(pathname, group.href) ? 'page' : undefined}
                      className="rounded-full px-3.5 py-2 text-sm font-semibold text-sch-text hover:bg-sch-surface-alt aria-[current=page]:text-sch-accent"
                    >
                      {group.label}
                    </Link>
                  </li>
                ) : (
                  <li key={group.label} className="group relative">
                    <button
                      type="button"
                      aria-haspopup="true"
                      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold hover:bg-sch-surface-alt ${
                        group.items?.some((item) => isActive(pathname, item.href)) ? 'text-sch-accent' : 'text-sch-text'
                      }`}
                    >
                      {group.label}
                      <ChevronDown aria-hidden className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                    </button>
                    <ul className="invisible absolute left-0 top-full w-60 translate-y-1 rounded-xl border border-sch-border bg-sch-surface p-2 opacity-0 shadow-[var(--sch-shadow-pop)] transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      {group.items?.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                            className="block rounded-lg px-3 py-2.5 text-sm text-sch-text hover:bg-sch-surface-alt aria-[current=page]:font-semibold aria-[current=page]:text-sch-accent"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/admissions"
              className="hidden min-h-[44px] items-center rounded-full bg-sch-accent px-5 text-sm font-semibold text-sch-on-accent transition-colors hover:bg-sch-accent-strong sm:inline-flex"
            >
              Admissions
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="school-mobile-nav"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sch-border text-sch-text lg:hidden"
            >
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
              {open ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav
          id="school-mobile-nav"
          aria-label="School (mobile)"
          className="max-h-[calc(100vh-76px)] overflow-y-auto border-b border-sch-border bg-sch-bg px-5 pb-8 pt-4 shadow-[var(--sch-shadow-pop)] lg:hidden"
        >
          <ul className="space-y-5">
            {NAV.map((group) => (
              <li key={group.label}>
                {group.href ? (
                  <Link href={group.href} className="block py-1 font-sch-display text-xl font-semibold text-sch-text">
                    {group.label}
                  </Link>
                ) : (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sch-laterite">{group.label}</p>
                    <ul className="mt-2 border-l-2 border-sch-border pl-4">
                      {group.items?.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                            className="block py-2 text-base text-sch-text aria-[current=page]:font-semibold aria-[current=page]:text-sch-accent"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/admissions"
            className="mt-6 flex min-h-[48px] items-center justify-center rounded-full bg-sch-accent text-sm font-semibold text-sch-on-accent"
          >
            Admissions
          </Link>
          <Link
            href="/sign-in"
            className="mt-3 flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-sch-accent text-sm font-semibold text-sch-accent"
          >
            <LogIn aria-hidden className="h-4 w-4" />
            Sign in
          </Link>
        </nav>
      )}
    </header>
  );
}
