import { Fraunces, Manrope } from 'next/font/google';

const display = Fraunces({ subsets: ['latin'], variable: '--font-sch-display', display: 'swap' });
const sans = Manrope({ subsets: ['latin'], variable: '--font-sch-sans', display: 'swap' });

/** Class list that turns an element into a school-themed scope: tokens from school-theme.css plus both fonts. */
export const schoolThemeClass = `school-theme ${display.variable} ${sans.variable}`;
