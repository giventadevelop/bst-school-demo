# /school design system — components

Direction: **Kerala, not generic.** Backwater green and deep ink for structure, kasavu cream for surfaces, kasavu gold and laterite red as accents. Two signature shapes carry the identity: the **arch** (veranda arches of traditional Kerala school buildings) frames every portrait and the hero, and the **kasavu band** (the gold-edged border of Kerala handloom) closes every dark section. Type: Fraunces (display serif) with Manrope (text).

Tokens: `replica/design/tokens.json` (28 colour pairs, 0 AA failures). Runtime values: `src/app/school/school-theme.css`, scoped to `.school-theme`. Tailwind names: `sch-*` colours and `font-sch-display` / `font-sch-sans` in `tailwind.config.js`. Icons: Lucide (already a dependency). No images, fonts, colours or copy come from the source site.

All primitives are in `src/components/school/ui.tsx` unless noted.

```
PageBanner
  parts     breadcrumb, eyebrow, h1, intro, kasavu band
  tokens    bg ink + weave, text on-ink, eyebrow gold-bright
  a11y      <nav aria-label="Breadcrumb">, aria-current on the last crumb, one h1 per page
  used on   every inner page

SchoolNav (SchoolNav.tsx, client)
  variants  desktop bar with dropdowns, mobile drawer
  states    hover, focus-within (opens dropdown), current page, drawer open
  a11y      skip link in layout, aria-expanded/aria-controls on the menu button, Esc closes, closes on navigation, 44px targets
  used on   S24

SchoolFooter (SchoolFooter.tsx)
  parts     identity + contact, three link columns, copyright
  tokens    bg ink + weave, headings gold-bright, links on-ink-muted
  used on   S24

ButtonLink
  variants  primary (accent), gold, outline, outline-dark
  sizes     min-height 44px, pill radius
  states    default, hover, focus-visible (2px ring: accent on light, gold-bright on dark)

TextLink
  states    hover underline, arrow nudges 4px; onDark variant

SectionHeading
  parts     eyebrow (laterite, or gold-bright on dark), h2 display, optional action link

FeatureCard
  parts     4:3 image or woven monogram fallback, optional tag, title, 3-line summary, "Read more"
  states    hover lift 3px + image zoom, focus-visible, no image
  used on   S01, S04, S06, departments

PersonCard
  parts     arch portrait or initials fallback, name, role (laterite), detail (muted)
  states    no photo
  used on   S10, S11, S12

DateBadge
  parts     day (display) over month (gold-bright) on ink; aria-hidden, the date is repeated as text
  used on   S01, S17

Article
  parts     summary (display, accent), body (pre-wrapped prose, max 720px), optional arch image
  states    no body, no image
  used on   S02, S03, S05, S07, S08, S14

EmptyState / NotFoundBlock
  parts     dashed panel, sentence, hint, optional action
  used on   every list and every detail lookup

SchoolLightboxGrid (client)
  parts     masonry grid of buttons, modal dialog, prev/next, counter
  states    closed, open, single photo (no prev/next)
  a11y      role="dialog" aria-modal, focus moves to Close and returns to the opener, Esc / arrow keys, body scroll locked
  used on   S20

SchoolContactForm (client)
  fields    full name*, email*, phone, subject*, message*
  states    idle, sending (button disabled), sent (role="status"), failed (role="alert")
  a11y      visible labels, native validation, autocomplete tokens
  used on   S23

Announcement ticker (in SchoolHome.tsx)
  states    present, absent; pauses on hover/focus; static and wrapped under prefers-reduced-motion
```

Motion: 140 / 240 / 600ms on `cubic-bezier(.2,.8,.2,1)`. Card lift and the ticker stop under `prefers-reduced-motion`.
