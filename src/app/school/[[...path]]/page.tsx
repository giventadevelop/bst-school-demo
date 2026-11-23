import { redirect } from 'next/navigation';

/** The school pages moved from /school/... to the root. Old links are sent to the new address. */
export default async function LegacySchoolRedirect({ params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  redirect(`/${path.map(encodeURIComponent).join('/')}`);
}
