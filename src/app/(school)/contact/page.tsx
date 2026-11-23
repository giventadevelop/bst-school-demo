import { Mail, MapPin, Phone } from 'lucide-react';
import SchoolContactForm from '@/components/school/SchoolContactForm';
import { getSchoolIdentity } from '@/lib/school/schoolIdentity';
import { Container, PageBanner } from '@/components/school/ui';

export const metadata = { title: 'Contact' };

export default async function SchoolContactPage() {
  const school = await getSchoolIdentity();
  const hasDetails = school.addressLines.length > 0 || school.phone || school.email;

  return (
    <>
      <PageBanner
        eyebrow="Get in touch"
        title="Contact the school office"
        intro="Questions about admissions, fees or school life? Write to us and the office will reply."
        crumbs={[{ label: 'Contact' }]}
      />
      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_1.3fr]">
        <section aria-labelledby="contact-details">
          <h2 id="contact-details" className="font-sch-display text-3xl font-semibold">
            {school.name}
          </h2>
          {hasDetails ? (
            <ul className="mt-6 space-y-5">
              {school.addressLines.length > 0 && (
                <li className="flex gap-4">
                  <MapPin aria-hidden className="mt-1 h-5 w-5 shrink-0 text-sch-laterite" />
                  <address className="not-italic text-sch-muted">
                    {school.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </li>
              )}
              {school.phone && (
                <li className="flex gap-4">
                  <Phone aria-hidden className="mt-1 h-5 w-5 shrink-0 text-sch-laterite" />
                  <a href={`tel:${school.phone.replace(/\s+/g, '')}`} className="font-semibold text-sch-accent hover:underline">
                    {school.phone}
                  </a>
                </li>
              )}
              {school.email && (
                <li className="flex gap-4">
                  <Mail aria-hidden className="mt-1 h-5 w-5 shrink-0 text-sch-laterite" />
                  <a href={`mailto:${school.email}`} className="break-all font-semibold text-sch-accent hover:underline">
                    {school.email}
                  </a>
                </li>
              )}
            </ul>
          ) : (
            <p className="mt-4 text-sch-muted">Contact details have not been published yet. Please use the form.</p>
          )}
        </section>

        <section aria-labelledby="contact-form" className="sch-card p-6 sm:p-8">
          <h2 id="contact-form" className="font-sch-display text-2xl font-semibold">
            Send an enquiry
          </h2>
          <SchoolContactForm />
        </section>
      </Container>
    </>
  );
}
