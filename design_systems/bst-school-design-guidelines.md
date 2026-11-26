# BST School — design guidelines

A briefing for anyone (including an AI) building screens in this app. Match the school that is already on screen. Do not invent a new palette, a new type scale, or a third visual language.

The public site has two related looks. They share a shell and a Kerala colour family. They do not share type, radius, or mood. Pick one surface before you write a class.

| Surface | Where | Root classes | Look |
|---|---|---|---|
| Homepage notebook | `/` only | `.nb` inside `.school-theme.theme-a.site` | A ruled exercise book: navy, sun yellow, a red margin, playful geometry |
| Inner pages | Every other school page | `.school-theme.theme-a.site` | White paper, school red for actions, Kerala tints on banners, bands, and items. Roboto, tight corners |

Sources of truth:

- Homepage: [`src/components/school/SchoolHome.tsx`](../src/components/school/SchoolHome.tsx), [`src/components/school/home/home.css`](../src/components/school/home/home.css), [`src/components/school/home/homeFonts.ts`](../src/components/school/home/homeFonts.ts)
- Inner pages: [`src/styles/school-ds.css`](../src/styles/school-ds.css), [`src/components/school/ui.tsx`](../src/components/school/ui.tsx), [`src/components/school/SchoolShell.tsx`](../src/components/school/SchoolShell.tsx), [`src/components/school/schoolFonts.ts`](../src/components/school/schoolFonts.ts)

Shell class on every school page: `school-theme theme-a site`, plus Roboto and Noto Sans Malayalam CSS variables. The homepage adds `nb` and the notebook font variables on the page root, not on the shell.

---

## How to use this file

1. Decide the surface. A new block on `/` uses `nb-*`. A new block on About, Admissions, News, Staff, or any inner page uses the Direction A classes (`btn`, `card`, `kicker`, `h2`, `wrap`, `sec`).
2. Reuse the class that already exists. Add a modifier only when the existing component cannot express the job.
3. Read colour, type, and radius from the tokens below. Do not hard-code a new hex when a token is listed.
4. Keep the notebook inside `.nb`. The header recolour (navy links, sun underline, pill buttons) applies only while `.nb` is on screen (`:has(.nb)`). Do not copy those header overrides onto inner pages. The navy footer is the shared shell, not a homepage override.
5. Stay inside `.school-theme`. The rest of this repository contains other products. They are listed at the end so they are not copied by accident.

Direction B in `school-ds.css` (warm ground, green lead) is defined and unused. Do not apply `theme-b`.

---

## Creative direction

The school should feel like a well-kept prospectus a family can trust, with enough warmth that it still belongs in Kerala.

On the homepage the metaphor is literal: a white sheet with a red margin line, section names written in the margin, and the day’s news set in a confident display face. The hero is a navy stage. Sun yellow is the hand that points: the primary button, the portrait frame, the ribbon on a star student, the closing band. Sky, mint, and sun-soft take turns as card grounds so a row of departments never looks like one grey grid.

Inside the site the metaphor tightens. White paper, school red for action, hairline rules, small radius. Kerala colour is on the page, not only on a stripe: the banner is a blue wash with a tricolour edge, a content band may take one tint, and each card, date, or person takes one colour from the rotation. The tricolour tick (red, gold, green) on every eyebrow, and the same split as a 4px bar on the banner, is the school’s signature. Do not paint a whole section in several strong colours at once.

### Principles

- **One job per colour.** A strong tone is for text and fills on white. Its 50-tint is a ground. Do not paint a section in five strong colours at once.
- **Photography is full colour and fully readable.** Event art and campus photos are contained or cropped with a stated focal point. People are not sliced through the face. A missing photo gets a labelled stand-in, never a broken image.
- **Type does the hierarchy.** Size, weight, and a little negative tracking. Not colour alone, not uppercase everywhere.
- **Space is generous and even.** Sections breathe. Cards sit on an 8px rhythm inside the prospectus. The notebook uses larger, rounder gaps.
- **Motion lifts.** Cards rise a few pixels. They do not bounce, spin, or parallax. Entrances fade and rise. `prefers-reduced-motion` removes travel; pointer feedback on the homepage may stay, because the visitor asked for it.
- **Malayalam sits beside Latin.** Noto Sans Malayalam is loaded with Roboto. Malayalam lines use `.ml`. Do not substitute a Latin face for Malayalam text.
- **Empty is designed.** A missing principal’s message, an empty news list, or an unpublished page is a dashed or tinted panel with a sentence and a way forward. It is not a blank hole.

Voice of the interface: plain, specific, adult. “Apply”, “Subjects and faculty”, “Ask the office”. Not slogans, not exclamation marks.

---

## Colour

### Homepage notebook

Scoped to `.nb`. Use the variable, not a fresh hex.

| Token | Value | Role |
|---|---|---|
| `--nb-navy` | `#16264c` | Hero, numbers band, navy buttons, ink of the notebook |
| `--nb-navy-2` | `#22386b` | Hero orb, navy hover, photo stand-in |
| `--nb-sun` | `#ffc53d` | Primary action, portrait ring, star ribbon, closing band, nav underline on `/` |
| `--nb-sun-soft` | `#fff3cf` | Warm card ground, date chips, fees panel |
| `--nb-red` | `#b1040e` | Margin line, margin labels, dates in news and events |
| `--nb-sky` | `#dcebfa` | Cool card ground, faculty ring, lead news story |
| `--nb-mint` | `#d9f1e5` | Third card ground in a repeating trio |
| `--nb-paper` | `#f4f7fb` | Page ground behind the sheet, quiet panels |
| `--nb-muted` | `#51607f` | Secondary notes, roles |
| `--nb-body` | `#2c3a5e` | Paragraphs on the sheet |
| `--nb-line` | `#d5deeb` | Rules, dashed empty states |
| Lead on navy | `#d6e0f5` | Hero lede, number captions |

Sun hover is `#ffd466`. Department and quick-link grounds rotate sky, sun-soft, mint. Do not add a fourth tint.

The sheet is white. The page behind it is paper. The margin rule is 2px red at 75% opacity, sitting at `--nb-margin` (176px). On small screens the rule moves to a 4px strip on the left edge.

### Inner pages (Direction A)

Tokens live on `.school-theme` in `school-ds.css`. Theme A maps them to roles:

| Role | Token | Value |
|---|---|---|
| Ground | `--ground` | `#FFFFFF` |
| Alternate band | `--ground-alt` / `--mist` | `#F6F6F6` |
| Ink | `--ink` | `#1E1E1E` |
| Body | `--body` | `rgba(30,30,30,.76)` |
| Muted | `--muted` | `rgba(30,30,30,.68)` |
| Hairline | `--line` | `rgba(30,30,30,.14)` |
| Action, links, kicker | `--red` / `--cta` / `--kicker` | `#B1040E` |
| Action hover / pressed | `--red-600` / `--red-700` | `#8F030B` / `#750209` |
| Action tint | `--red-50` / `--red-100` | `#FBEAEB` / `#F6D0D2` |
| Top bar | `--topbar` / `--topbar-text` | `#1E1E1E` / `#E9E9E9` |
| Footer ground | `--foot` | `#16264c` |
| Focus | `--focus` | `#0F5E9C` (becomes navy `#16264c` only while `.nb` is present) |

Kerala accents. Each has a strong tone (text and fills on white, meant to clear WCAG AA) and a 50-tint for grounds. Gold and marigold use a darker text tone, because the bright fill fails as text.

| Class | Strong | Tint | Text on tint |
|---|---|---|---|
| `.c-red` | `#B1040E` | `#FBEAEB` | `#750209` |
| `.c-green` | `#0B6B4B` | `#E6F3EC` | `#095A3F` |
| `.c-blue` | `#0F5E9C` | `#E5F0F9` | `#0C4D82` |
| `.c-gold` | `#F2B01E` | `#FDF3D8` | `#8A5A00` |
| `.c-plum` | `#8E2C6B` | `#F5E6EF` | `#762357` |
| `.c-teal` | `#0E7C86` | `#E1F3F4` | `#0B666E` |
| `.c-orange` | `#E8710A` | `#FDEBD9` | `#9A4A00` |

Rotate card colours with `colourAt()` in `ui.tsx`: blue, gold, plum, green, teal, orange. Red stays the action colour. Do not put red in that rotation.

Gold and orange fills (`.ico`, `.step-n`, `.date`) use ink text, not white.

Notice bar above the notebook (announcements) is the one Direction A fragment on `/`: gold tint ground, `.tag.t-solid` reading “Notice”. It sits outside `.nb` on purpose.

---

## Type

### Homepage

Loaded in `homeFonts.ts` as CSS variables on `.nb`.

- **Display** — Bricolage Grotesque, weights 500, 700, 800. Variable `--font-nb-display`. Headlines, big numbers, section titles, dates.
- **Text** — Instrument Sans, weights 400, 500, 600. Variable `--font-nb-text`. Body, buttons, captions. Malayalam falls through `--font-malayalam`.

| Role | Spec | Class |
|---|---|---|
| Hero title | 800, `clamp(46px, 7vw, 92px)`, line-height 0.95, tracking `-0.03em`, max 9ch, balanced wrap | `.nb-hero h1` |
| Hero lede | 20px / 1.5, max 34ch, colour `#d6e0f5` | `.nb-lead` |
| Sheet headline | 800, `clamp(30px, 3.6vw, 46px)` / 1.05, tracking `-0.02em`, max 20ch | `.nb-big` |
| Margin label | 700 17px display, red, sticky | `.nb-label h2` |
| Margin note | 500 14px text, muted | `.nb-label h2 small` |
| Quote | 500, `clamp(21px, 2.1vw, 26px)` / 1.4 display | `.nb-quote` |
| Closing line | 800, `clamp(32px, 4.4vw, 58px)` / 1, tracking `-0.025em`, max 16ch | `.nb-closing h2` |
| Body | 17px / 1.6 | `.nb` |
| Buttons | 600 16px text | `.nb-btn` |

### Inner pages

Roboto via `--font-roboto`, with Noto Sans Malayalam in the stack. Malayalam passages add `.ml`.

The scale is fixed in `school-ds.css`. Do not invent steps between these.

| Class | Spec |
|---|---|
| `.h1` | 800, `clamp(42px, 5.6cqw, 80px)` / 1.04, tracking `-0.025em`, balanced |
| `.h2` | 600, `clamp(30px, 3.4cqw, 44px)` / 1.14, tracking `-0.015em` |
| `.h3` | 600, `clamp(26px, 2.5cqw, 36px)` / 1.2, tracking `-0.01em` |
| `.h4` | 600 24px / 1.25 |
| `.h5` | 600 18px / 1.3 |
| `.lead` | 400, `clamp(17px, 1.5cqw, 20px)` / 1.6, body colour |
| Body | 16px / 26px |
| `.kicker` | 600 13px / 16px, tracking `0.1em`, uppercase |
| `.btn` | 600 16px / 20px |
| `.tag` | 600 12px / 16px, tracking `0.06em`, uppercase |
| Table heads | 600 12px, tracking `0.08em`, uppercase, muted |
| `.sch-prose` | 16px / 26px, max 70ch, pre-wrap so editorial line breaks survive |

Page banners use `.h2.pagehead-title`: Georgia, 700, navy `#16325c`, `clamp(36px, 4.6cqw, 56px)` / 1.05. Reserve `.h1` for a true cover headline.

A gold underline on a word is `.hl`: a gold band behind the lower third of the glyphs, not a CSS `text-decoration`.

---

## Structure and space

### Frame

- Inner pages: `.wrap` is max 1280px, side padding `clamp(20px, 5cqw, 64px)`.
- Homepage sheet: `.nb-wrap` is max 1200px, side padding 28px (18px under 960px).
- Sections: `.sec` pads `clamp(56px, 7cqw, 104px)` vertically. `.alt` switches the band to mist.
- The 8px grid is the inner-page module: 8px radius, 4px button radius, gaps of 8, 16, 24, 32. Do not introduce 12px radii on prospectus cards.

### Homepage sequence

Read top to bottom. This order is the page.

1. **Chrome** — ink top bar, white nav. On `/` the nav’s active colour and header buttons switch to navy and sun. The top bar itself stays ink.
2. **Notice** — optional gold strip, outside the notebook.
3. **Hero** — navy, two columns (1.05 / 0.95), 56px gap, 72px top and 96px bottom. A soft navy circle sits off the top-right corner. Campus photo is 5:4 with a heavy bottom-left radius (`28px 28px 28px 120px`). A white notice board overlaps the photo, bottom-left.
4. **Wave** — a 46px navy wave hands the hero to the sheet.
5. **Sheet** — white, 22px radius, soft navy shadow. Red margin at 176px. Each `.nb-block` is `margin | body`, divided by a hairline. Labels stick while the section is in view.
6. **Blocks**, in order: shortcuts, principal, academics, admissions, numbers, campus, fees, star performers (if any), news, events, faculty (if any).
7. **Closing** — full-bleed sun band, navy type, navy and ghost buttons. 60px vertical padding.

Under 960px the margin collapses, blocks stack, the label stops sticking, and the notice board sits in normal flow under the photo. Admissions steps stack into one rounded column. Numbers, stars, and faculty become two columns.

### Inner-page sequence

1. Sticky header (top bar + nav).
2. Page banner: `.pagehead.c-blue`. A pale blue wash, a full-width `.edge` (4px red / gold / green), then the breadcrumb pill, `.kicker`, navy `.h2.pagehead-title`, optional `.lead` (max about 40rem). The campus photo fades in from the right, and a light wave closes the bottom.
3. Content in `.wrap` / `.sec`. Lists of people, departments, news, and albums are `.card-grid`: one column, then two equal columns from 640px. Long copy is `.sch-prose` beside an optional 4:5 portrait, copy column capped near 720px. A band behind plain content may be one `.wash` plus one `.c-*` (gold on the About actions, green behind fees, blue behind department faculty). A grid of already-tinted tiles stays on white.
4. `.foot` in navy, four-ish columns, white type, sky descriptions, a legal line ruled in 18% white.

An event detail page, a download detail page, and any other public page outside the original school list uses this same banner and card grid. The old flyer hero is not used on the school site. Ticket, checkout, register, donation, and competition pages keep their payment widgets and form fields, and wear the same banner and `.wrap` / `.btn` chrome.

---

## Shape, shadow, motion

### Inner pages

- Buttons: `--radius-btn: 4px`, min-height 44px, 2px transparent border so outline and fill share a box. Large: `.btn-lg`.
- Cards and panels: `--radius-card: 8px`. Card shadow is a 1px contact shadow plus a wide soft shadow (`--shadow-card`). Hover lifts the card 10px into `--shadow-lift` and scales a photo inside `.card-photo` to 1.07. As a card enters the viewport it rises 28px and fades from 45% opacity (`.card` uses a view timeline). The photograph stays readable the whole time. Reduced motion removes the rise, the lift, and the photo scale.
- Striped cards add a 4px top border in the item colour (`.card.stripe`).
- Quotes use the same 4px top stripe, plus a Georgia quotation mark at 35% opacity.
- Focus: 3px solid `--focus`, 2px offset. On dark grounds the ring is white.
- Scroll reveal on `.card` (and the unused `.rv` alias) is that same rise, only when `prefers-reduced-motion: no-preference` and the browser supports view timelines. Content is never fully hidden. Reduced motion kills transitions and hover travel.

### Homepage

- Buttons are pills (`border-radius: 999px`), min-height 48px. Header buttons on `/` become pills too.
- Sheet, departments, fees, numbers, news: 16–22px radii. The principal portrait is a capsule (`120px 120px 18px 18px`) with a 6px sun border. Faculty are circles with a 5px sky ring that turns sun on hover.
- Campus mosaic: 16:10 photos; every first and fourth image gets a large bottom-left radius (`70px`), so the grid is not a set of identical rectangles.
- Admissions is three joined squares. The middle square drops 18px, like a hopscotch court. First cell sky, middle sun-soft, last mint. Numbers are a CSS counter at 800 / 54px.
- Stars wear a sun ribbon (`clip-path` pennant) at the top-right of the photo.
- Hero load is a staggered rise (title, lede, buttons, photo pop, then the board). The board then floats 8px on a 6s loop. The hero orb drifts. Sections tagged `data-nb-reveal` by `HomeMotion.tsx` rise in as they enter, staggered by `--i` at 80ms.
- Hover lifts 2–6px and adds a navy-tinted shadow. Department photos scale inside their frame. Sun and navy buttons get a sheen. Reduced motion: no entrance travel (a fade remains), no float, no drift. Hover lifts stay.

Do not add scroll-jacking, marquee on the notebook, or infinite motion on inner pages except the existing announcement ticker (`.sch-ticker`), which pauses on hover and stops under reduced motion.

---

## Components

Build with the class named here. The component in `ui.tsx` is the inner-page implementation; the `nb-*` class is the homepage implementation.

### Chrome

**Top bar** (`.topbar`). Ink bar, 13px, contact and sign-in aligned to the end of `.wrap`. Links inherit the bar colour and underline on hover. It does not recolour on the homepage.

**Nav** (`.nav`). White, min-height 76px, 1px bottom rule. Logo is `/school/logo-bst-red.svg` at 44px, school name in 18px bold, the word “School” in muted uppercase at 0.08em. Links are `.nav-link`: 500 15px, a 3px bottom border that appears in red on hover and current. Dropdowns (`.menu`) hang from `.nav-drop`, white, 4px red top border, 8px bottom radius, lift shadow. Choosing a link closes that dropdown at once (`.nav-drop.is-dismissed`); it opens again only after the pointer leaves and comes back. Nested `.submenu` opens to the right. Below `lg`, a `.btn-outline` toggle reveals a stacked menu; targets are at least 44px tall.

On `/` only: current and hover links go navy with a sun underline; header `.btn-primary` and `.btn-outline` become pills in navy; menus take a sun top border and a sky hover.

**Footer** (`.foot`). Navy ground (`--foot`, `#16264c`) on every school page, including `/`. White type. Descriptions and column links (`.fm`) are `#d6e0f5`. Column titles are 13px uppercase at 0.1em and inherit white. A top rule (`.rule`) at 18% white holds the legal line at 13px. The logo is the white mark. Focus rings on the footer are white.

**Skip link.** First focusable control in the shell: “Skip to content”, visually hidden until focus, then a primary button.

### Buttons and links

Inner pages, class `.btn` plus one variant:

| Variant | Look | Use |
|---|---|---|
| `.btn-primary` | Red fill, white label | The one action: Apply, Pay, Submit |
| `.btn-outline` | Red border and label, red-50 hover | Secondary |
| `.btn-green` | Green fill | A positive confirm that is not the brand action |
| `.btn-gold` | Gold fill, ink label | A highlight action on a dark or photo band |
| `.btn-white` | White fill, ink label | On a dark band |
| `.btn-line-light` | White border and label | On a dark band, secondary |
| `.btn-text` | No chrome, red label, gap grows on hover | “Read more →” |
| `.btn-block` | Full width, label and arrow apart | Mobile menu actions |
| disabled | `#E4E4E4` fill, `#6B6B6B` label | Unavailable |

`ButtonLink` always appends an arrow. Do not add a second icon system.

Homepage, class `.nb-btn`:

| Variant | Look | Use |
|---|---|---|
| `.nb-btn-sun` | Sun fill, navy label | Apply, the pointing action |
| `.nb-btn-navy` | Navy fill, white label | Enter a section |
| `.nb-btn-ghost` | Navy border | A quiet partner to navy or sun |
| `.nb-btn-ghost-light` | Translucent white border, white label; hover turns sun | Secondary on the navy hero |

`.nb-more` is a 600-weight underline, 4px offset, for “All departments” in the margin note. It is not a button.

One primary action per cluster. A sun button and a navy button may sit together. Two sun buttons may not.

### Kickers, banners, headings

**Kicker** (`.kicker`). Uppercase label with a 28×4px bar before the words: red, gold, green in equal thirds. 16px below the bar before the heading. On dark bands use `.kicker.light` or `.on-dark .kicker` so the words are white. The bar stays tricolour. Do not recolour the bar per section.

**Page banner.** `PageBanner` (`.pagehead.c-blue`), the header directly under `#school-main`. Ground is a pale wash, `#f7fbfe` into `#e8f2fa`. The 4px `.edge` stays the tricolour signature. Copy sits in `.pagehead-copy` (max 40rem) on the left. Order is fixed: breadcrumb, `.kicker`, `.h2.pagehead-title`, optional `.lead`. The kicker is unchanged: the section label, such as “From the principal’s desk”, keeps the tricolour tick. The title is Georgia, navy `#16325c`, heavier than a section `.h2`, and it is still not `.h1`. `.pagehead-photo` is the campus photograph (`/images/school-banner-ribbon/school-banner-ribobn image.webp`), covered on the right, masked so it fades into the wash, and held near 42% opacity. Under 768px it occupies only the right half, so the title stays clear of the building. A pale wave (`.pagehead-wave`) runs along the bottom. It is decorative, `aria-hidden`, and still. No line drawings sit on the photograph.

**Section heading.** `SectionHeading`: kicker plus `.h2`, optional `TextLink` aligned to the bottom of the row.

**Breadcrumb.** `.crumbs` is a white pill (`border-radius: 999px`, 18px once it wraps on a narrow screen) with a hairline navy border and a soft shadow. Home is a grey text link, the same weight and colour as the other ancestors. Separators are grey chevrons. Ancestor crumbs are grey. The current page is text (`aria-current="page"`), bold navy, with no tint chip, and it ellipsizes rather than widening the page. The trail wraps inside the pill. Hierarchy, hrefs, and labels come from the page; the component does not invent crumbs.

### Cards, tiles, numbers, quotes, rows

**Card** (`.card`). White, 1px line, 8px radius, soft shadow, column flex. A list of cards uses `.card-grid`: one column, then two equal columns from 640px, and every card in the row is the same height. Hover lifts the card 10px and, when the photo sits in `.card-photo`, scales that photo to 1.07. Entering the viewport rises the card 28px from 45% opacity. `.card.stripe` plus a `.c-*` class sets the top stripe and the tint variables (`--c`, `--c50`, `--ct`).

**Person card** (`PersonCard`). Square photo on the tint, or initials in the tint’s text colour. Name in `.h5`, role in `.ct` at semibold 14px, detail muted. In `.card-grid` the square grows with the two-column width, so every portrait in the row is the same size.

**Feature card** (`FeatureCard`). 5:4 image (or `.ph` stand-in) in `.card-photo`, optional `.tag.t-solid` at the top-left, title, three-line summary, “Read more →”. The whole card is the link. The wider two-column frame is what makes the photograph larger.

**Tile** (`.tile`). Tint ground, no border until hover, then a 1px border in `--c` and a 3px lift. Title 600 17px, note 13px muted. Optional `.ico`: 36px circle, white glyph, ink glyph on gold and orange.

**Step number** (`.step-n`). 64px circle, 800 26px, the item colour. This is the inner-page step, not the homepage hopscotch.

**Stat** (`.stat-n`). 800, `clamp(40px, 5cqw, 64px)`, tabular numbers, tight tracking.

**Quote** (`.quote`). Tint ground, 4px colour top, generous padding, decorative quotation mark.

**Date chip** (`.date` / `DateBadge`). 72px square, 8px radius, day at 800 28px, month uppercase 12px. Default colour `.c-red`. Format dates `en-IN` (day, long month, year).

**Event row** (`.row`). Three columns: date chip, title, a trailing action. White, 8px radius, 1px line. Hover shifts 4px to the right and takes the item colour on the border.

**Panel** (`.panel`). Tint ground, 8px radius, 28px padding. Empty states use `.panel.c-red`.

**Highlight** (`.hl`). Gold marker behind a phrase in running text.

### Tags

`.tag` is a small uppercase pill-rectangle (4px radius, not a full pill). Tints: `.t-red`, `.t-green`, `.t-blue`, `.t-gold`, `.t-plum`, `.t-teal`, `.t-orange`. `.t-solid` is red with white type, for “Notice” and for a label sitting on a photo.

### Forms

Stack with `.field`: label (500 14px) then control, 6px gap.

`.input`: white, min-height 48px, 4px radius, border `rgba(30,30,30,.45)`, 16px type. Hover goes to ink. Focus drops the browser outline and uses a blue border plus a 3px blue glow. Invalid is a 2px red border. Disabled is `#EEE` on `#CCC`. Placeholder is 55% ink. Error copy is `.err`: 500 13px, `--red-700`.

`.seg` is a joined pair or set of choices, 4px outer radius. The checked label fills green with white type. `.radio` is a 20px control, `accent-color` red, row min-height 44px.

Do not restyle inputs with Tailwind rings. The focus treatment above is the system.

### Tables

`.table` is full width, 15px. Heads are uppercase, muted, with a 2px bottom rule. Cells have a 1px rule. The footer row is 700 weight and has no bottom rule. Numbers use `.num`: tabular figures, right aligned, nowrap.

### Article

`Article`: summary in `.h4` (max 56ch), body in `.sch-prose`, optional 4:5 image in a `rounded-lg` frame. On large screens the frame is a fixed 20rem column so the photograph stays the same size on every content page. Below that it stays capped at `max-w-sm`. If nothing is published, say so in `.muted`. Do not render an empty heading.

### Homepage blocks

These exist only inside `.nb`.

**Hero and notice board.** School name as the hero title. Lede under it. Sun “Apply” plus ghost-light “Explore the streams”. Photo or `.nb-ph`. `.nb-board` lists three dates: sun-soft date tile, dashed rules, “Full calendar” in the board header. The board floats after it arrives.

**Notebook block.** `Block` in `SchoolHome`: `.nb-block` > `.nb-label` (red sticky title, optional note) + `.nb-body`. A section without a `.nb-big` headline is allowed when the content is the headline (shortcuts, numbers).

**Quick links** (`.nb-quick`). Three columns. Each link is icon well plus title (700 18px display) plus 14.5px note. The icon well is 44px, 12px radius, tint from `--bg`, stroke navy. Hover lifts the card and tips the icon.

**Principal** (`.nb-principal`). 230px portrait column, then a display quote (max 34ch), expandable message (`.nb-msg`, 62ch, body colour), ghost “Read the full message”. No portrait record: `.nb-empty`.

**Departments** (`.nb-depts`). Auto-fit from 240px. Card grounds cycle sky, sun-soft, mint. Photo 4:3, focal point `50% 20%`. Name at 800 26px. Navy button pinned to the bottom of the card.

**Admissions steps** (`.nb-steps`). Three joined cells, CSS-numbered, middle cell dropped. A navy button follows, with extra space (`.nb-after-steps`) so it clears the dropped cell.

**Numbers** (`.nb-numbers`). Four equal cells on navy, 20px radius. Figure 800 56px in sun, tabular. Caption 15.5px in the lede blue. Hairline between cells.

**Campus** (`.nb-facilities`). Two columns, 16:10, alternating corner radius. Name 700 21px under the photo, summary in body colour. A row of sun and ghost buttons underneath (`.nb-campus-links`).

**Fees** (`.nb-fees`). Two 20px panels. First is sun-soft, second is paper. 800 26px title, copy max 36ch, one button each.

**Star performers** (`.nb-stars`). Four portraits, 3:4, 16px radius, sun pennant. Name clamps to four lines. Subtitle in muted 14.5px.

**News** (`.nb-news`). Lead story spans two rows on sky; the rest sit on paper in a 1.3 / 1 column. Date in red 600 14.5px. Lead title up to 32px. Excerpt clamps to three lines. Hover: white ground, navy border, 4px lift.

**Events** (`.nb-events`). Full-width rows, hairlines, three columns: day at 800 30px with a red month, title at 700 21px, “View event” at the end. Hover washes paper and indents the row. The trailing label hides under 960px.

**Faculty** (`.nb-faculty`). Four columns. 128px circles. Name 700 18px. Designation in red 600, subject in muted.

**Closing** (`.nb-closing`). Sun band, display headline max 16ch, navy button plus ghost button.

**Empty** (`.nb-empty`). Dashed 2px line, 16px radius, 30px padding, muted colour. Say what will appear and, when you can, link to the page that publishes it.

### Images

- **Cover and campus.** `object-fit: cover` with an explicit aspect ratio and, where the subject is a person or a building top, `object-position` toward the top (`50% 20%` on department cards). Do not use a fixed pixel height that slices unpredictable uploads.
- **Hero and mosaic.** The odd corner radius is part of the mark. Keep it on the hero (bottom-left 120px) and on the mosaic’s first and fourth frames. Do not put that radius on inner-page cards.
- **Portraits on inner pages.** Person cards are square and covered. Article asides are 4:5, covered, and 20rem wide from the `lg` breakpoint. If a head is being cut, switch that one frame to `object-contain` on a tint ground (`.c50` or `--mist`) rather than cropping harder.
- **Homepage people.** Principal is covered inside the sun capsule. Faculty are covered circles. Stars are covered 3:4. Initials are an inner-page fallback (`PersonCard`), not a notebook pattern.
- **Missing photo.** Homepage: `.nb-ph` (navy gradient). Inner pages: `.ph` plus a `ph-*` colour, with the landscape texture and a monospace `.ph-label` when the slot is a designed placeholder. Never a grey broken-image icon.
- **Logo.** Red mark in the header (`logo-bst-red.svg`). White mark in the footer on every school page (`logo-bst-white.svg`).

---

## Do and don’t

**Do**

- Put new school UI inside `.school-theme.theme-a.site`.
- Use `nb-*` on `/` and Direction A classes everywhere else.
- Take hex values from the tables above or from the CSS variables they name.
- Keep one strong action colour per cluster: red inside the site, sun or navy on the notebook.
- Give every interactive control a visible focus ring and a 44px minimum target (48px on notebook buttons).
- Write dates with `en-IN`. Use tabular figures for stats and prices.
- Leave a designed empty state when data can be missing.
- Honour `prefers-reduced-motion`.

**Don’t**

- Don’t apply `.nb` or the homepage header overrides (navy links, sun underline, pill buttons) outside `/`. The navy footer is shared and already lives on `.foot`.
- Don’t apply `theme-b`.
- Don’t import the organic modernist homepage (`body.modernist-home`, `.mh-*`, terracotta `#c67139`, cream `#f5ead8`) onto school pages.
- Don’t import MOSC sacred styling (Crimson Text, `sacred-shadow`, parchment `#F5F1E8`) onto school pages.
- Don’t import admin Tailwind button groups (blue-100 squares, `hover:scale-105` action tiles) onto school pages.
- Don’t restyle school pages with shadcn `Button` or a new Tailwind palette.
- Don’t set a new font for headlines on inner pages. Roboto is the prospectus face. Bricolage and Instrument Sans belong to `.nb`.
- Don’t make cards share one colour. Rotate `colourAt`, or the sky / sun-soft / mint trio on the notebook.
- Don’t crop a poster or a face to fill a frame when the content is the picture. Contain it, or set the focal point.
- Don’t hide content until an animation finishes. Reveals start visible enough to read if motion never runs.
