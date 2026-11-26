'use client';

import React from 'react';
import GivebutterWidget from '@/components/GivebutterWidget';
import { SchoolPageFrame } from '@/components/school/ui';

/**
 * Donation Page
 * Displays the Givebutter donation widget
 */
export default function DonatePage() {
  return (
    <SchoolPageFrame
      eyebrow="Support"
      title="Support Our Mission"
      intro="Your generous donation helps us continue our mission to preserve and promote Malayali culture across the United States. Every contribution makes a difference."
      crumbs={[{ label: 'Donate' }]}
    >
        <div className="card stripe c-green p-6 md:p-8">
          <GivebutterWidget />
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            All donations are processed securely through Givebutter.
            Your information is protected and your contribution is tax-deductible.
          </p>
        </div>
    </SchoolPageFrame>
  );
}
