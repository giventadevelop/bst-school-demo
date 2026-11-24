import { SchoolStaffDirectory } from '@/components/school/SchoolStaffDirectory';

export const metadata = { title: 'Staff' };

export default function SchoolStaffPage() {
  return (
    <SchoolStaffDirectory
      title="Staff directory"
      intro="The teachers, leaders and support team who look after our students every day."
      crumb="Staff directory"
    />
  );
}
