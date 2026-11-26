import type { ReactNode } from 'react';
import SchoolNav from '@/components/school/SchoolNav';
import SchoolFooter from '@/components/school/SchoolFooter';
import SchoolSocialRail from '@/components/school/SchoolSocialRail';
import { schoolThemeClass } from '@/components/school/schoolFonts';
import { getSchoolIdentity } from '@/lib/school/schoolIdentity';
import './school-theme.css';

/** Theme wrapper, header and footer of the school site. Used by the layout of the (school) route group. */
export default async function SchoolShell({ children }: { children: ReactNode }) {
  const school = await getSchoolIdentity();

  return (
    <div className={`${schoolThemeClass} flex min-h-screen flex-col`}>
      <a
        href="#school-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:btn focus:btn-primary"
      >
        Skip to content
      </a>
      <SchoolNav schoolName={school.name} phone={school.phone} email={school.email} logoUrl={school.logoUrl} />
      <SchoolSocialRail />
      <main id="school-main" className="flex-1">
        {children}
      </main>
      <SchoolFooter school={school} />
    </div>
  );
}

/**
 * The school header on its own, for pages outside the (school) route group (event details, checkout, team…).
 * The wrapper is `display: contents`, so the theme tokens apply to the header only and the page keeps its own styling.
 */
export async function SchoolSiteHeader() {
  const school = await getSchoolIdentity();
  return (
    <div className={`${schoolThemeClass} contents`}>
      <SchoolNav schoolName={school.name} phone={school.phone} email={school.email} logoUrl={school.logoUrl} />
    </div>
  );
}

/** The school footer on its own, for pages outside the (school) route group. */
export async function SchoolSiteFooter() {
  const school = await getSchoolIdentity();
  return (
    <div className={`${schoolThemeClass} contents`}>
      <SchoolFooter school={school} />
    </div>
  );
}
