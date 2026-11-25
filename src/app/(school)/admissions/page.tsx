import SchoolFeePayButton from '@/components/school/SchoolFeePayButton';
import { fetchSchoolResource, type SchoolFeeInvoiceRecord, type SchoolPageRecord } from '@/lib/school/schoolPublic';
import { Article, ButtonLink, Container, EmptyState, PageBanner, colourAt } from '@/components/school/ui';

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

      <section id="fees" className="wash c-green sec scroll-mt-32">
        <Container>
          <h2 className="h2 mb-2">Admission fees</h2>
          <p className="body mb-8 max-w-2xl">Open admission fees can be paid securely online.</p>
          {invoices.length > 0 ? (
            <ul className="card-grid">
              {invoices.map((invoice, index) => (
                <li key={invoice.id}>
                  <article className={`card stripe ${colourAt(index)} h-full p-6`}>
                    <p className="tag t-red">
                      {[invoice.academicYear, invoice.classLabel].filter(Boolean).join(' · ') || 'Admission'}
                    </p>
                    <h3 className="h5 mt-3">{invoice.title}</h3>
                    <p className="stat-n ct">
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
