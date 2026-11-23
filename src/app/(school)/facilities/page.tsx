import { CollectionList, FACILITIES } from '@/components/school/SchoolCollection';

export const metadata = { title: 'Facilities' };

export default function SchoolFacilitiesPage() {
  return (
    <CollectionList
      collection={FACILITIES}
      eyebrow="Our campus"
      intro="Laboratories, libraries and shared spaces that give students room to explore."
    />
  );
}
