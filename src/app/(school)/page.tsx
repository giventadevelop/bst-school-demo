import type { Metadata } from 'next';
import SchoolHome from '@/components/school/SchoolHome';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Admissions, academics, campus life, news and events from the school.',
};

/** The school site is the main flow: its home page is the root of the application. */
export default function HomePage() {
  return <SchoolHome />;
}
