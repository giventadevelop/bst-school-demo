import { fetchWithJwtRetry } from '@/lib/proxyHandler';
import { getApiBaseUrl, getTenantId } from '@/lib/env';
import type { UserProfileDTO } from '@/types';

/** Profile lookup used by the Stripe webhook. Hits the by-user endpoint. */
export async function fetchUserProfileServer(userId: string): Promise<UserProfileDTO | null> {
  if (!userId) return null;
  const tenantId = getTenantId();
  const url = `${getApiBaseUrl()}/api/user-profiles/by-user/${userId}?tenantId.equals=${tenantId}`;
  try {
    const res = await fetchWithJwtRetry(url, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch user profile for userId ${userId}: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching user profile for userId ${userId}:`, error);
    return null;
  }
}

export async function fetchUserProfileByUserIdServer(userId: string): Promise<UserProfileDTO | null> {
  if (!userId) return null;
  try {
    const params = new URLSearchParams();
    params.append('userId.equals', userId);
    params.append('tenantId.equals', getTenantId());
    params.append('size', '1');
    const res = await fetchWithJwtRetry(`${getApiBaseUrl()}/api/user-profiles?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data[0] as UserProfileDTO;
    if (data && typeof data === 'object' && 'content' in data && Array.isArray((data as { content: unknown }).content)) {
      const content = (data as { content: UserProfileDTO[] }).content;
      return content.length > 0 ? content[0] : null;
    }
    if (data && typeof data === 'object' && 'userId' in data) {
      return data as UserProfileDTO;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
