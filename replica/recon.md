# Recon map — school website (integration into `/school`)

**Source:** local static mirror at `C:\project_workspace\christ-nagar-school\christnagarschoolicse.edu.in` (read from disk only; the live site was not fetched).
**Target:** this project, new pages under `/school` only. Additive. No new backend, no new endpoints.
**Recon date:** 2026-11-23

## 1. Scope

| question | answer |
| --- | --- |
| Which app, which platform | A K-12 school's public website (WordPress + Elementor mirror), responsive web |
| Which slice | The whole public site: about, facilities, activities, academics, faculty, news, events, galleries, downloads, contact |
| Who it is for | A Kerala school tenant of this multi-tenant project, rendered under `/school` |

What is taken: information architecture, page types, user flows, the kinds of data shown.
What is not taken: theme, CSS, colours, fonts, logos, photographs, PDFs, marketing copy, staff and student names.

## 2. Sources

| source | location | what it gave |
| --- | --- | --- |
| Home page | `index.html` | section order, quick links, announcement bar, footer |
| Content pages | `<slug>/index.html` (about 120 real pages) | page types and their fields |
| Post-type exports | `wp-json/wp/v2/{pages,posts,events,achievements,photo_gallery,video_gallery}` | the content types and their fields |
| Lightbox/attachment pages | 43 nested `index.html` files | nothing new (single-image views); folded into the album screen |

No login, forms backend, or private API was read. The mirror has 2,259 images and 2 PDFs; none are reused.

## 3. Screen inventory

Routes are the proposed routes in this project. "Count" is how many source pages share the template.

| ID | screen | proposed route | purpose | key components | count | states to build |
| --- | --- | --- | --- | --- | --- | --- |
| S01 | Home | `/school` | Front door: who the school is, what is new, where to go | announcement bar, quick-link strip, hero, history intro, vision/mission/aims tabs, principal's message teaser, quote band, facilities carousel, latest news (3), upcoming events, star performers | 1 | filled; no announcement; no news; no events; no performers; mobile |
| S02 | About | `/school/about` | History, vision, mission, motto | page banner, long-form prose, value cards | 1 | filled; mobile |
| S03 | Principal's message | `/school/about/principals-message` | A letter from the principal | portrait, prose, signature block | 1 | filled; no portrait |
| S04 | Facilities index | `/school/facilities` | Entry to the 8 facilities (source has only a menu; an index page is added) | card grid | new | filled; empty |
| S05 | Facility detail | `/school/facilities/[slug]` | One facility: description and photos | banner, prose, image strip, optional download link (bus routes) | 8 | filled; no images; not found |
| S06 | Activities index | `/school/activities` | Entry to clubs, sports, arts, programmes | filterable card grid (clubs / sports / arts / uniformed / collaborations) | new | filled; filter with no results |
| S07 | Activity detail | `/school/activities/[slug]` | One activity or club | banner, prose, image strip | about 27 | filled; no images; not found |
| S08 | Academics | `/school/academics` | Streams offered (ISC), languages offered, stage structure | stream cards (core/optional subjects, careers), language table | 2 | filled |
| S09 | Faculty hub | `/school/faculty` | Entry to administration, departments, KG teaching, support staff | section cards, department list | new | filled |
| S10 | Administration | `/school/faculty/administration` | Leadership team | person cards (photo, name, role) | 1 | filled; empty; no photo |
| S11 | Department | `/school/faculty/departments/[slug]` | Teachers of one department | person grid (photo, name, qualification) | 16 | filled; empty; no photo; not found |
| S12 | Support staff | `/school/faculty/support-staff` | Office and support team | person grid (photo, name, role) | 1 | filled; empty |
| S13 | News list | `/school/news` | All news, newest first | post cards (image, title, date, read more) | 1 | filled; empty; paginated |
| S14 | News article | `/school/news/[slug]` | One article | title, date, featured image, prose, image gallery, share | 11 | filled; no images; not found |
| S15 | Achievements list | `/school/achievements` | Awards and recognitions | post cards | 1 | filled; empty |
| S16 | Achievement detail | `/school/achievements/[slug]` | One achievement | same as S14 | 4 | filled; not found |
| S17 | Events list | `/school/events` | Upcoming and past events (source shows these only on the home page) | date-badge list | new | filled; none upcoming; empty |
| S18 | Event detail | `/school/events/[id]` | One event: title, date, short note | date badge, prose | 5 | filled; not found |
| S19 | Photo gallery | `/school/gallery` | Albums, newest first | album cover grid (cover, title, year) | 1 | filled; empty |
| S20 | Photo album | `/school/gallery/[slug]` | One album | masonry grid, lightbox with prev/next and keyboard | 30 | filled; empty album; lightbox open; not found |
| S21 | Video gallery | `/school/videos` | Embedded event videos | video card grid, click-to-load embed | 1 (+10 single) | filled; empty |
| S22 | Downloads | `/school/downloads` | Circulars, term calendars, bus routes | grouped file list (title, period, download) | 1 | filled; empty |
| S23 | Contact | `/school/contact` | Address, phone, email, map, enquiry form | info block, map embed, form (name, email, subject, phone, message) | 1 | idle; validating; sending; sent; failed |
| S24 | Shell | (layout for all of `/school/**`) | Header, mega-menu, footer, floating contact shortcuts | top bar (phone, email), 9-item nav with 3-level dropdowns, mobile drawer, footer, floating WhatsApp/phone/social | — | desktop; mobile drawer; active item |
| S25 | Not found | `/school/**` unknown slug | Recover from a bad link | message, links home | — | — |

External hand-offs seen on the home page (links only, not rebuilt): online fee payment, admission registration, bus registration, parent portal, mobile app store listing, newsletter flipbook.

## 4. User flows

```
F01 Prospective parent evaluates the school                              (4 clicks)
    S01 home -> S02 about -> S08 academics -> S05 facility -> S23 contact
    edge: arrives on mobile; map embed blocked; form fails to send

F02 Parent starts an admission                                           (1 click)
    S01 home -> quick link "Admissions" -> existing admission/enquiry flow in this project
    edge: admissions closed (announcement absent); no admission flow configured

F03 Parent catches up on school news                                     (2 clicks)
    S01 home -> S13 news list -> S14 article -> image lightbox
    edge: no news yet; article removed (S25)

F04 Parent browses event photos                                          (3 clicks)
    S01 -> S19 gallery -> S20 album -> lightbox (prev/next, Esc)
    edge: album with no images; very large album (50+)

F05 Parent finds a teacher or department                                 (3 clicks)
    S24 nav Faculty -> S09 hub -> S11 department
    edge: department with no staff listed

F06 Parent downloads a circular or bus route                             (2 clicks)
    S24 nav Updates -> S22 downloads -> file opens
    edge: no files published

F07 Visitor sends an enquiry                                             (2 clicks + form)
    S24 nav Contact -> S23 -> fill 5 fields -> submit -> confirmation
    edge: invalid email; empty required field; backend rejects; double submit

F08 Student explores clubs and sports                                    (2 clicks)
    S24 nav Activities -> S06 index -> S07 detail
    edge: filter returns nothing

F09 Visitor checks what is coming up                                     (1 click)
    S01 "What's happening" -> S17 events -> S18 event
    edge: no upcoming events
```

Happy-path clicks to beat: F01 4, F03 2, F04 3, F05 3, F06 2, F07 2.
The source hides facilities, activities and faculty behind menu-only parents (`#` links); the new index pages S04, S06, S09 and S17 remove a dead end from each.

## 5. Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| Top bar | phone, email, social | — | S24 |
| Main nav | 3-level dropdown, mobile drawer | hover, focus, open, active | S24 |
| Announcement bar | single line, with link | present, absent | S01 |
| Quick-link strip | 6 actions (fee, admission, bus, portal, routes, newsletter) | external-link marker | S01 |
| Hero | image with headline and two actions | — | S01 |
| Page banner | title + breadcrumb | — | all inner pages |
| Tabs / value cards | vision, mission, aims | selected | S01, S02 |
| Quote band | quotation + attribution | — | S01 |
| Feature card | image, title, excerpt, link | hover | S01, S04, S06 |
| Person card | photo, name, role or qualification | no photo (initials) | S10, S11, S12 |
| Post card | image, title, date, read more | no image | S01, S13, S15 |
| Date-badge row | day/month badge, title, note | past, upcoming | S01, S17 |
| Album cover | cover, title, count | no cover | S19 |
| Image grid + lightbox | masonry, prev/next, counter | loading, open, keyboard | S14, S20 |
| Video card | poster, title, click-to-load embed | idle, playing | S21 |
| File row | title, period, size, download | — | S22 |
| Stream card | core subjects, optional subjects, careers | — | S08 |
| Contact form | 5 fields | idle, invalid, sending, sent, failed | S23 |
| Map embed | — | loading, blocked | S23 |
| Floating contact dock | WhatsApp, phone, social | collapsed, expanded | S24 |
| Footer | about, quick links, contact, social | — | S24 |
| Empty state | icon, sentence, action | — | every list |
| Breadcrumb | — | — | all inner pages |

## 6. Inferred data model

Inferred from page fields and the exported post types. No schema is created from this: the build maps each entity to an **existing** API in this project (see `replica/api-map.md`).

```
SchoolProfile   name, tagline, address, phones[], email, social links, map location, logo
                evidence: S24 top bar and footer, S23 contact block          confidence: high

Announcement    text, link, active window
                evidence: S01 announcement bar                               confidence: medium

Page            slug, title, body, images[], group (about | facility | activity | academics)
                evidence: 60+ wp pages sharing one template (S02-S08)        confidence: high

StaffMember     name, role or qualification, photo, group (administration | department:<x> | kg | support), order
                evidence: S10, S11 (16 departments), S12                     confidence: high

NewsPost        slug, title, published date, featured image, body, images[]
                evidence: S13, S14, wp posts                                 confidence: high

Achievement     slug, title, date, image, body
                evidence: S15, S16, wp achievements                          confidence: high

Event           title, date, short description
                evidence: S01 "What's happening", S18, wp events             confidence: high

PhotoAlbum      slug, title, date or year, cover, images[]
                evidence: S19, S20, wp photo_gallery                         confidence: high

Video           title, video URL (hosted on a video platform)
                evidence: S21, wp video_gallery                              confidence: high

Download        title, period, file URL
                evidence: S22, bus routes link                               confidence: medium (only 2 files seen)

StarPerformer   name, class/year, photo
                evidence: S01 "Our star performers"                          confidence: medium

Enquiry         name, email, subject, phone, message
                evidence: S23 form fields                                    confidence: high
```

## 7. What is not cloned

| item | why |
| --- | --- |
| Name, logo, crest, motto, religious order branding | Trademarks and identity of a real institution |
| Photographs (2,259), PDFs, newsletter | The school's own assets; many show children |
| Staff and student names, qualifications | Personal data of real people; data comes from this project's APIs instead |
| Page copy | Rewritten originally |
| Fee payment, admission, bus registration, parent portal | Third-party hosted systems; linked to this project's own equivalents where they exist |
| Theme, CSS, fonts | A new design system replaces them |

## 8. Size

25 screens (13 templates), 9 flows, 12 entities.
Hard parts: (1) mapping twelve content types onto APIs that already exist without adding endpoints; (2) the three-level navigation on mobile; (3) an accessible lightbox for large albums.
Size: **M** as an integration, because there is no backend work.

## 9. Next step

The usual next step is `/replica-architect`. It is **skipped** here on purpose: this is an integration, so the stack, schema and API are the ones this project already has. Next is `/replica-design`, then `/replica-build` against `replica/api-map.md`.
