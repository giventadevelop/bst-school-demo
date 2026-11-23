import { CollectionDetail, FACILITIES } from '@/components/school/SchoolCollection';

export default async function SchoolFacilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CollectionDetail collection={FACILITIES} slug={slug} />;
}
