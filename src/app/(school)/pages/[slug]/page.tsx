import { ContentPage } from '@/components/school/SchoolCollection';

export default async function SchoolContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentPage slug={slug} />;
}
