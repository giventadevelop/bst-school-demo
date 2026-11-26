import { auth } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { PollList } from '@/components/polls/PollList';
import { fetchUserProfileServer } from '@/app/profile/ApiServerActions';
import { SchoolPageFrame } from '@/components/school/ui';

export default async function PollsPage() {
  // CRITICAL: Next.js 15+ requires headers() to be awaited before calling auth()
  await headers();
  const authResult = await auth();
  const { userId } = authResult;

  let userProfile = null;
  if (userId) {
    try {
      userProfile = await fetchUserProfileServer(userId);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  return (
    <SchoolPageFrame
      eyebrow="Community voice"
      title="Polls"
      intro="Participate in interactive polls and share your opinions with our community."
      crumbs={[{ label: 'Polls' }]}
    >
      <PollList userId={userProfile?.id} />
    </SchoolPageFrame>
  );
}
