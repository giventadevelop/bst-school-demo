import { SchoolPageFrame } from '@/components/school/ui';

export default function TermsOfServicePage() {
  return (
    <SchoolPageFrame eyebrow="Policies" title="Terms of Service" crumbs={[{ label: 'Terms of Service' }]}>
      <article className="sch-prose card stripe c-blue p-6 sm:p-8">
        <p>By using our service, you agree to the following terms and conditions. Please read them carefully.</p>
        <h2>User Responsibilities</h2>
        <ul>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You agree not to use the service for any unlawful or prohibited activities.</li>
          <li>You are responsible for all activities that occur under your account.</li>
        </ul>
        <h2>Acceptable Use</h2>
        <ul>
          <li>Do not upload or share content that is illegal, harmful, or violates the rights of others.</li>
          <li>Do not attempt to disrupt or compromise the security of the service.</li>
        </ul>
        <h2>Account Termination</h2>
        <ul>
          <li>We reserve the right to suspend or terminate your account if you violate these terms.</li>
          <li>You may terminate your account at any time by contacting support.</li>
        </ul>
        <h2>Disclaimer</h2>
        <p>Our service is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages or losses resulting from your use of the service.</p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at{' '}
          <a href="mailto:support@example.com">support@example.com</a>.
        </p>
      </article>
    </SchoolPageFrame>
  );
}
