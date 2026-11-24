import { SchoolStaffDirectory } from '@/components/school/SchoolStaffDirectory';

export const metadata = { title: 'Teaching (KG)' };

export default function SchoolTeachingKgPage() {
  return (
    <SchoolStaffDirectory
      title="Teaching (KG)"
      intro="Kindergarten teachers."
      crumb="Teaching (KG)"
      category="TEACHING"
      stage="KG"
    />
  );
}
