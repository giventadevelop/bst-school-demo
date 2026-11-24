import { SchoolStaffDirectory } from '@/components/school/SchoolStaffDirectory';

export const metadata = { title: 'Supporting staff' };

export default function SchoolSupportingStaffPage() {
  return (
    <SchoolStaffDirectory
      title="Supporting staff"
      intro="The office and support team."
      crumb="Supporting staff"
      category="SUPPORTING"
    />
  );
}
