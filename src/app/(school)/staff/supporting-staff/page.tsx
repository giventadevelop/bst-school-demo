import { SchoolStaffDirectory } from '@/components/school/SchoolStaffDirectory';
import { readPageParam, readQueryParam } from '@/components/school/ui';

export const metadata = { title: 'Supporting staff' };

export default async function SchoolSupportingStaffPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[]; q?: string | string[] }>;
}) {
  const params = await searchParams;
  return (
    <SchoolStaffDirectory
      title="Supporting staff"
      intro="The office and support team."
      crumb="Supporting staff"
      category="SUPPORTING"
      pathname="/staff/supporting-staff"
      page={readPageParam(params?.page)}
      query={readQueryParam(params?.q)}
    />
  );
}
