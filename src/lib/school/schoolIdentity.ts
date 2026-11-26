import { cache } from 'react';
import { fetchWithJwtRetry } from '@/lib/proxyHandler';
import { getApiBaseUrl, getTenantId } from '@/lib/env';
import type { TenantSettingsDTO } from '@/types';

const FALLBACK_LOGO = '/school/logo-bst-red.svg';

export type SchoolIdentity = {
  name: string;
  description: string;
  phone: string;
  email: string;
  logoUrl: string;
  addressLines: string[];
};

function firstSettings(data: unknown): TenantSettingsDTO | null {
  if (Array.isArray(data)) return (data[0] as TenantSettingsDTO) ?? null;
  if (data && typeof data === 'object' && Array.isArray((data as { content?: unknown }).content)) {
    return ((data as { content: TenantSettingsDTO[] }).content[0]) ?? null;
  }
  if (data && typeof data === 'object' && 'tenantId' in data) return data as TenantSettingsDTO;
  return null;
}

/**
 * Name, logo, phone, and email from the current tenant's settings row.
 * Cached per request so the header, footer, and page share one lookup.
 */
export const getSchoolIdentity = cache(async (): Promise<SchoolIdentity> => {
  const empty: SchoolIdentity = {
    name: '',
    description: '',
    phone: '',
    email: '',
    logoUrl: FALLBACK_LOGO,
    addressLines: [],
  };
  try {
    const params = new URLSearchParams({
      'tenantId.equals': getTenantId(),
      size: '1',
    });
    const response = await fetchWithJwtRetry(`${getApiBaseUrl()}/api/tenant-settings?${params}`, {
      cache: 'no-store',
    });
    if (!response.ok) return empty;
    const settings = firstSettings(await response.json());
    if (!settings) return empty;
    return {
      name: settings.tenantName?.trim() || '',
      description: '',
      phone: settings.phoneNumber?.trim() || '',
      email: settings.email?.trim() || '',
      logoUrl: settings.logoImageUrl?.trim() || FALLBACK_LOGO,
      addressLines: [],
    };
  } catch (error) {
    console.error('[getSchoolIdentity]', error);
    return empty;
  }
});
