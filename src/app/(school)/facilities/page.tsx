import { CollectionList, FACILITIES } from '@/components/school/SchoolCollection';
import { readPageParam, readQueryParam } from '@/components/school/ui';

export const metadata = { title: 'Facilities' };

export default async function SchoolFacilitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[]; q?: string | string[] }>;
}) {
  const params = await searchParams;
  return (
    <CollectionList
      collection={FACILITIES}
      eyebrow="Our campus"
      intro="Laboratories, libraries and shared spaces that give students room to explore."
      page={readPageParam(params?.page)}
      query={readQueryParam(params?.q)}
    />
  );
}
