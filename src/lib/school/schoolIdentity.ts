import { cache } from 'react';

/** Public name, email, and phone. Fixed so a database import cannot swap the header. */
const SCHOOL_NAME = 'BST School Demo';
const SCHOOL_EMAIL = 'office@bstschooldemo.in';
const SCHOOL_PHONE = '+91 98450 22108';

export type SchoolIdentity = {
  name: string;
  description: string;
  phone: string;
  email: string;
  addressLines: string[];
};

/**
 * Public school name and contact details. These do not come from tenant settings or
 * the organization API. Cached per request so the layout and a page share one value.
 */
export const getSchoolIdentity = cache(async (): Promise<SchoolIdentity> => {
  return {
    name: SCHOOL_NAME,
    description: '',
    phone: SCHOOL_PHONE,
    email: SCHOOL_EMAIL,
    addressLines: [],
  };
});
