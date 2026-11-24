import { cache } from 'react';
import { fetchTenantOrganizationForProfilePagesServer } from '@/lib/profileSiteServer';

/** E2E tenants are named like "[E2E] Demo 1786902446152". Show the school name on the public site. */
function publicSchoolName(raw: string | null | undefined): string {
  const name = raw?.trim() || 'Our School';
  if (/^\[E2E\]\s+Demo\b/.test(name)) return 'BST Demo School';
  return name;
}

export type SchoolIdentity = {
  name: string;
  description: string;
  phone: string;
  email: string;
  addressLines: string[];
};

/**
 * Name and contact details of the school, read from the tenant organization record that the
 * rest of the application already uses. Cached per request so the layout and a page share one call.
 */
export const getSchoolIdentity = cache(async (): Promise<SchoolIdentity> => {
  const org = await fetchTenantOrganizationForProfilePagesServer();
  const street = [org?.addressLine1, org?.addressLine2].filter(Boolean).join(', ');
  const locality = [org?.city, org?.stateProvince, org?.zipCode].filter(Boolean).join(', ');
  return {
    name: publicSchoolName(org?.organizationName),
    description: org?.description?.trim() || '',
    phone: org?.contactPhone?.trim() || '',
    email: org?.contactEmail?.trim() || '',
    addressLines: [street, locality, org?.country || ''].filter(Boolean),
  };
});
