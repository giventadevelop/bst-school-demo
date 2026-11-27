import { SchoolStaffDirectory } from '@/components/school/SchoolStaffDirectory';
import { readPageParam, readQueryParam } from '@/components/school/ui';

export const metadata = { title: 'Teaching (KG)' };

export default async function SchoolTeachingKgPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[]; q?: string | string[] }>;
}) {
  const params = await searchParams;
  return (
    <SchoolStaffDirectory
      title="Teaching (KG)"
      intro="Kindergarten teachers."
      crumb="Teaching (KG)"
      category="TEACHING"
      stage="KG"
      pathname="/staff/teaching-kg"
      page={readPageParam(params?.page)}
      query={readQueryParam(params?.q)}
    />
  );
}
