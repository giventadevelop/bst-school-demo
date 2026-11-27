import { ACTIVITIES, CollectionList } from '@/components/school/SchoolCollection';
import { readPageParam, readQueryParam } from '@/components/school/ui';

export const metadata = { title: 'Activities' };

export default async function SchoolActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[]; q?: string | string[] }>;
}) {
  const params = await searchParams;
  return (
    <CollectionList
      collection={ACTIVITIES}
      eyebrow="Campus life"
      intro="Clubs, sports and the arts: where students find what they love and practise it together."
      groupByKind
      page={readPageParam(params?.page)}
      query={readQueryParam(params?.q)}
    />
  );
}
