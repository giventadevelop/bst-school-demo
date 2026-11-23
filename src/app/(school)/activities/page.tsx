import { ACTIVITIES, CollectionList } from '@/components/school/SchoolCollection';

export const metadata = { title: 'Activities' };

export default function SchoolActivitiesPage() {
  return (
    <CollectionList
      collection={ACTIVITIES}
      eyebrow="Campus life"
      intro="Clubs, sports and the arts: where students find what they love and practise it together."
      groupByKind
    />
  );
}
