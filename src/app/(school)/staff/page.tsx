import { SchoolStaffDirectory } from '@/components/school/SchoolStaffDirectory';
import { readPageParam } from '@/components/school/ui';

export const metadata = { title: 'Staff' };

export default async function SchoolStaffPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  return (
    <SchoolStaffDirectory
      title="Staff directory"
      intro="The teachers, leaders and support team who look after our students every day."
      crumb="Staff directory"
      page={readPageParam(params?.page)}
    />
  );
}
