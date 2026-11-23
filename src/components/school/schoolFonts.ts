import { Noto_Sans_Malayalam, Roboto } from 'next/font/google';

/** Direction A type: Roboto for the interface, Noto Sans Malayalam for Malayalam lines. */
export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-roboto',
  display: 'swap',
});

export const malayalam = Noto_Sans_Malayalam({
  subsets: ['malayalam'],
  weight: ['400', '600', '800'],
  variable: '--font-malayalam',
  display: 'swap',
});

/** Class list for the school shell: Direction A tokens, both fonts, and the design-system root. */
export const schoolThemeClass = `school-theme theme-a site ${roboto.variable} ${malayalam.variable}`;

/** Class list for the document body so the rest of the app uses the same type. */
export const appFontClass = `${roboto.className} ${roboto.variable} ${malayalam.variable}`;
