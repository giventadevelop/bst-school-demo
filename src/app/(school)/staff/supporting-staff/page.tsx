import { SchoolStaffDirectory } from '@/components/school/SchoolStaffDirectory';
import { readPageParam } from '@/components/school/ui';

export const metadata = { title: 'Supporting staff' };

export default async function SchoolSupportingStaffPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  return (
    <SchoolStaffDirectory
      title="Supporting staff"
      intro="The office and support team."
      crumb="Supporting staff"
      category="SUPPORTING"
      page={readPageParam(params?.page)}
    />
  );
}
