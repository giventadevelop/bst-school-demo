'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import PublicOrganicDesignBody from '@/components/PublicOrganicDesignBody';
import EventFlowBanner from '@/components/school/EventFlowBanner';

interface ConditionalLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
  /** School header/footer, shown on every public page that is not part of app/(school). */
  schoolHeader: React.ReactNode;
  schoolFooter: React.ReactNode;
}

// Signed-in and admin areas keep the application header: it carries sign-in, profile and the admin menu.
const ACCOUNT_SECTIONS = [
  '/admin',
  '/profile',
  '/settings',
  '/dashboard',
  '/member-portal',
  '/creator-analytics',
  '/sign-in',
  '/sign-up',
  '/sso-callback',
  '/auth',
];

// Routes served by app/(school). Event and download detail pages are school pages too.
// Deeper event flows (tickets, checkout, register) stay outside the shell and get a banner below.
const SCHOOL_EXACT = ['/', '/events', '/downloads'];

function isSingleSegmentDetail(pathname: string, root: string) {
  if (!pathname.startsWith(`${root}/`)) return false;
  const rest = pathname.slice(root.length + 1);
  return rest.length > 0 && !rest.includes('/');
}
const SCHOOL_SECTIONS = [
  '/about',
  '/academics',
  '/achievements',
  '/activities',
  '/admissions',
  '/contact',
  '/departments',
  '/facilities',
  '/gallery',
  '/news',
  '/pages',
  '/staff',
  '/school',
  '/videos',
];

function isSchoolPath(pathname: string) {
  return (
    SCHOOL_EXACT.includes(pathname) ||
    isSingleSegmentDetail(pathname, '/events') ||
    isSingleSegmentDetail(pathname, '/downloads') ||
    SCHOOL_SECTIONS.some((section) => pathname === section || pathname.startsWith(`${section}/`))
  );
}

/** Public pages that wear the school banner but are not inside the (school) layout. */
const SCHOOL_CHROME_PREFIXES = [
  '/team',
  '/sponsors',
  '/calendar',
  '/polls',
  '/services',
  '/projects',
  '/affiliations',
  '/family',
  '/philanthrop',
  '/donate',
  '/links',
  '/event',
  '/privacy',
  '/terms',
  '/termsofservice',
  '/focus-groups',
  '/pricing',
  '/events/',
  '/downloads/',
];

function usesSchoolChrome(pathname: string) {
  return SCHOOL_CHROME_PREFIXES.some((prefix) =>
    prefix.endsWith('/')
      ? pathname.startsWith(prefix)
      : pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export default function ConditionalLayout({ children, header, footer, schoolHeader, schoolFooter }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Legacy MOSC app at /mosc-old (app/mosc-old)
  const isMoscOldRoute = pathname?.startsWith('/mosc-old') ?? false;
  // Syro apps: /mosc (app/mosc), /mosc-redesign (app/mosc-redesign — rocket home + (syro) subpages)
  const isMoscRoute = (pathname?.startsWith('/mosc') && !pathname?.startsWith('/mosc-old')) ?? false;

  // School site (app/(school)) brings its own header/footer through components/school/SchoolShell
  const isSchoolRoute = isSchoolPath(pathname ?? '');

  // For /mosc-old, /mosc and /school, render children without main app header/footer
  if (isMoscOldRoute || isMoscRoute || isSchoolRoute) {
    return <>{children}</>;
  }

  const isAccountRoute = ACCOUNT_SECTIONS.some(
    (section) => pathname === section || pathname?.startsWith(`${section}/`)
  );

  const pathnameValue = pathname ?? '';
  const schoolChrome = !isAccountRoute && usesSchoolChrome(pathnameValue);
  const isEventFlow = /^\/events\/[^/]+\/.+/.test(pathnameValue);

  // Every other route: page content between a header and a footer.
  // Account/admin areas get the application's own; all remaining public pages get the school's.
  return (
    <>
      {!schoolChrome && <PublicOrganicDesignBody />}
      {isAccountRoute ? header : schoolHeader}
      <div className="flex-1 flex flex-col">
        {isEventFlow ? (
          <div className="school-theme theme-a site">
            <EventFlowBanner />
            <div className="wrap py-12 sm:py-16">{children}</div>
          </div>
        ) : (
          children
        )}
      </div>
      {isAccountRoute ? footer : schoolFooter}
    </>
  );
}
