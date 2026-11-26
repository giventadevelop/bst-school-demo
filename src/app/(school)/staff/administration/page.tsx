import { SchoolStaffDirectory } from '@/components/school/SchoolStaffDirectory';
import { readPageParam } from '@/components/school/ui';

export const metadata = { title: 'Administration' };

export default async function SchoolAdministrationPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  return (
    <SchoolStaffDirectory
      title="Administration"
      intro="The leadership team that runs the school."
      crumb="Administration"
      category="ADMINISTRATION"
      page={readPageParam(params?.page)}
    />
  );
}
