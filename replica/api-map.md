# /school — existing API map (Step 0) and how each page uses it

No endpoint, proxy route, server action or type was added to the backend layer. Every call below already existed.

> **Route update (2026-11-23):** the school site is now the root of the application. Its pages live in
> `src/app/(school)/` and are served without the `/school` prefix, so every `/school/x` path in this file now reads `/x`
> (`/school` itself is `/`). Old `/school/...` URLs redirect through `src/app/school/[[...path]]/page.tsx`.
> Seven existing index pages with the same names were replaced: `about`, `achievements`, `contact`, `downloads`,
> `events`, `gallery`, `news`. Their originals are kept in `replica/replaced-root-pages/`. Sub-routes such as
> `/events/[id]/**` and `/downloads/[id]` and the helper files in `src/app/gallery/` were not touched.
> `src/middleware.ts` lists the new root paths as public, and `school-theme.css` moved to `src/components/school/`.

## The school data layer

`src/lib/school/schoolPublic.ts` — `fetchSchoolResource<T>(path, query)` does
`GET {API_BASE}/api/{path}?tenantId.equals=<tenant>&size=100&...query` through `fetchWithJwtRetry`
(JWT + `X-Tenant-ID`, one retry on 401) and returns `[]` on any failure. `fetchSchoolHome()` bundles the five home calls.

| Endpoint | Record type | Used by |
| --- | --- | --- |
| `school-pages` (by `slug.equals`) | `SchoolPageRecord` | `/school/about` (slug `about`), `/school/about/principals-message` (`principals-message`), `/school/academics` (`academics`), `/school/admissions` (`admissions`), `/school/pages/[slug]`, home |
| `school-staff-members` | `SchoolStaffRecord` | `/school/staff`, `/school/departments/[slug]` (matched on `subjectName`) |
| `school-departments` | `SchoolNamedRecord` | `/school/departments`, `/school/departments/[slug]`, `/school/academics` |
| `school-facilities` | `SchoolNamedRecord` | `/school/facilities`, `/school/facilities/[slug]`, home |
| `school-activities` | `SchoolNamedRecord` | `/school/activities`, `/school/activities/[slug]` |
| `school-highlights` | `SchoolHighlightRecord` | `/school/achievements`, home |
| `school-fee-invoices` | `SchoolFeeInvoiceRecord` | `/school/admissions` |
| `news-flashes` | `NewsFlashRecord` | home announcement ticker |
| `event-details` | inline | `/school/events`, home (cards link to the existing `/events/[id]`) |

Fee payment is unchanged: `SchoolFeePayButton` → `POST /api/school/fee-checkout` → Razorpay → `POST /api/webhooks/razorpay`.

## Existing non-school layers reused

| Function / route | File | Used by |
| --- | --- | --- |
| `fetchTenantOrganizationForProfilePagesServer` | `src/lib/profileSiteServer.ts` | school name, phone, email, address (header, footer, home, contact) via `src/lib/school/schoolIdentity.ts` |
| `fetchPublishedProfileWritingsServer`, `fetchProfileWritingBySlugServer` | `src/lib/profileSiteServer.ts` | `/school/news`, `/school/news/[slug]`, home |
| `fetchDownloadableProfileMediaAssetsServer` | `src/lib/profileSiteServer.ts` | `/school/downloads` |
| `fetchAlbumsForGallery`, `fetchAlbumWithMedia` | `src/app/gallery/ApiServerActions.ts` | `/school/gallery`, `/school/gallery/[id]` |
| `POST /api/proxy/contact-form-email` + `buildContactFormPayload` | `src/pages/api/proxy/contact-form-email`, `src/lib/contactForm.ts` | `/school/contact` form (subject and phone are folded into the message body) |

## Recon entity → data source

| Recon entity | Source | Gap |
| --- | --- | --- |
| SchoolProfile | `tenant-organizations` | no social links, no map coordinates |
| Announcement | `news-flashes` | — |
| Page | `school-pages` | one image per page |
| StaffMember | `school-staff-members` | — |
| NewsPost | `profile-writings` | no per-article image list |
| Achievement / StarPerformer | `school-highlights` | no body text, so no detail page |
| Event | `event-details` | detail page is the existing `/events/[id]` |
| PhotoAlbum | `gallery-albums` + `event-medias` | — |
| Video | none confirmed | not built |
| Download | `profile-media-assets` | — |
| Enquiry | `contact-form-email` | no subject/phone fields |

## Caveats

- The `school-*` backend endpoints are assumed by this frontend; their tables are not defined in this repository, and the configured tenant returned no rows for any of them during testing.
- The active Tailwind config is `tailwind.config.js` (Tailwind resolves `.js` before `.ts`); `tailwind.config.ts` is not loaded.

## Files changed outside `src/app/school` and `src/components/school`

| File | Change |
| --- | --- |
| `src/components/ConditionalLayout.tsx` | `/school` now skips the main site header/footer, the same way `/mosc` does, because the school layout supplies its own |
| `tailwind.config.js` | added the `sch` colour namespace and two `sch-*` font families (additive) |
| `src/lib/school/schoolIdentity.ts` | new |
| `.claude/launch.json` | new; points the preview at the dev server on port 3004 |
