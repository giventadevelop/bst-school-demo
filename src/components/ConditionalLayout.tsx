'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import PublicOrganicDesignBody from '@/components/PublicOrganicDesignBody';

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

// Routes served by app/(school). `/events` and `/downloads` match exactly because their
// sub-routes (/events/[id], /downloads/[id]) are still pages of the main application.
const SCHOOL_EXACT = ['/', '/events', '/downloads'];
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
    SCHOOL_SECTIONS.some((section) => pathname === section || pathname.startsWith(`${section}/`))
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

  // Every other route: page content between a header and a footer.
  // Account/admin areas get the application's own; all remaining public pages get the school's.
  return (
    <>
      <PublicOrganicDesignBody />
      {isAccountRoute ? header : schoolHeader}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      {isAccountRoute ? footer : schoolFooter}
    </>
  );
}
