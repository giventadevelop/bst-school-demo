import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-nb-display',
  display: 'swap',
});

const text = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-nb-text',
  display: 'swap',
});

/** Class list for the homepage root: the "notebook" skin (home.css) and its two typefaces. */
export const homeClass = `nb ${display.variable} ${text.variable}`;
