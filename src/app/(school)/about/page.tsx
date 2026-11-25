import { ContentPage } from '@/components/school/SchoolCollection';
import { ButtonLink, Container } from '@/components/school/ui';

export const metadata = { title: 'About' };

export default function SchoolAboutPage() {
  return (
    <ContentPage slug="about" eyebrow="Who we are" fallbackTitle="Our story" crumbs={[{ label: 'Our story' }]}>
      <section className="wash c-gold border-t py-12" style={{ borderColor: 'var(--line)' }}>
        <Container className="flex flex-wrap gap-3">
          <ButtonLink href="/about/principals-message">Principal&apos;s message</ButtonLink>
          <ButtonLink href="/academics" variant="outline">
            Academics
          </ButtonLink>
          <ButtonLink href="/facilities" variant="outline">
            Tour the campus
          </ButtonLink>
        </Container>
      </section>
    </ContentPage>
  );
}
