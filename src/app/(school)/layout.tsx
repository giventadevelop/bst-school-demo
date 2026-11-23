import type { ReactNode } from 'react';
import SchoolShell from '@/components/school/SchoolShell';

export default function SchoolLayout({ children }: { children: ReactNode }) {
  return <SchoolShell>{children}</SchoolShell>;
}
