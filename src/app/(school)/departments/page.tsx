import { CollectionList, DEPARTMENTS } from '@/components/school/SchoolCollection';

export const metadata = { title: 'Departments' };

export default function SchoolDepartmentsPage() {
  return (
    <CollectionList
      collection={DEPARTMENTS}
      eyebrow="Faculty"
      intro="Each department shapes its own subject, from the first lessons to the final board examinations."
    />
  );
}
