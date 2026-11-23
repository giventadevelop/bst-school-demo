import { ContentPage } from '@/components/school/SchoolCollection';

export const metadata = { title: "Principal's message" };

export default function SchoolPrincipalsMessagePage() {
  return (
    <ContentPage
      slug="principals-message"
      eyebrow="From the principal's desk"
      fallbackTitle="Principal's message"
      crumbs={[{ label: 'Our story', href: '/about' }, { label: "Principal's message" }]}
    />
  );
}
