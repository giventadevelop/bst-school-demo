import { SchoolStaffDirectory } from '@/components/school/SchoolStaffDirectory';

export const metadata = { title: 'Administration' };

export default function SchoolAdministrationPage() {
  return (
    <SchoolStaffDirectory
      title="Administration"
      intro="The leadership team that runs the school."
      crumb="Administration"
      category="ADMINISTRATION"
    />
  );
}
