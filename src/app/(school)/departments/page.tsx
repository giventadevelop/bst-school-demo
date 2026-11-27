import { CollectionList, DEPARTMENTS } from '@/components/school/SchoolCollection';
import { readPageParam, readQueryParam } from '@/components/school/ui';

export const metadata = { title: 'Departments' };

export default async function SchoolDepartmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[]; q?: string | string[] }>;
}) {
  const params = await searchParams;
  return (
    <CollectionList
      collection={DEPARTMENTS}
      eyebrow="Faculty"
      intro="Each department shapes its own subject, from the first lessons to the final board examinations."
      page={readPageParam(params?.page)}
      query={readQueryParam(params?.q)}
    />
  );
}
