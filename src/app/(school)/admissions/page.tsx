import SchoolFeePayButton from '@/components/school/SchoolFeePayButton';
import { fetchSchoolResource, type SchoolFeeInvoiceRecord, type SchoolPageRecord } from '@/lib/school/schoolPublic';
import { Article, ButtonLink, Container, EmptyState, PageBanner } from '@/components/school/ui';

export const metadata = { title: 'Admissions' };

function formatMoney(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default async function SchoolAdmissionsPage() {
  const [pages, invoices] = await Promise.all([
    fetchSchoolResource<SchoolPageRecord>('school-pages', {
      'slug.equals': 'admissions',
      'isActive.equals': 'true',
      size: '1',
    }),
    fetchSchoolResource<SchoolFeeInvoiceRecord>('school-fee-invoices', {
      'feeKind.equals': 'ADMISSION',
      'status.equals': 'OPEN',
      sort: 'id,desc',
    }),
  ]);
  const page = pages[0];

  return (
    <>
      <PageBanner
        eyebrow="Join us"
        title={page?.title || 'Admissions'}
        intro={page?.summary}
        crumbs={[{ label: 'Admissions' }]}
      />
      {page?.body && <Article body={page.body} imageUrl={page.imageUrl} />}

      <section id="fees" className="scroll-mt-32 border-t border-sch-border bg-sch-surface-alt/60 py-12 sm:py-16">
        <Container>
          <h2 className="mb-2 font-sch-display text-3xl font-semibold">Admission fees</h2>
          <p className="mb-8 max-w-2xl text-sch-muted">Open admission fees can be paid securely online.</p>
          {invoices.length > 0 ? (
            <ul className="grid gap-5 md:grid-cols-2">
              {invoices.map((invoice) => (
                <li key={invoice.id}>
                  <article className="sch-card flex h-full flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sch-laterite">
                      {[invoice.academicYear, invoice.classLabel].filter(Boolean).join(' · ')}
                    </p>
                    <h3 className="mt-2 font-sch-display text-xl font-semibold">{invoice.title}</h3>
                    <p className="my-4 font-sch-display text-3xl font-semibold text-sch-accent">
                      {formatMoney(Number(invoice.amountDue || 0), invoice.currency || 'INR')}
                    </p>
                    <div className="mt-auto">
                      {invoice.id && <SchoolFeePayButton invoiceId={invoice.id} label="Pay admission fee" />}
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No open admission fee is published." hint="When admissions open, fees will be listed here." />
          )}
          <div className="mt-10">
            <ButtonLink href="/contact" variant="outline">
              Ask the admissions office
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
