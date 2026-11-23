import { ACTIVITIES, CollectionDetail } from '@/components/school/SchoolCollection';

export default async function SchoolActivityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CollectionDetail collection={ACTIVITIES} slug={slug} />;
}
