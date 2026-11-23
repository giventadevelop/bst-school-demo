# GitHub source

repo: giventadevelop/bst-school-demo
branch: main
path: src/app/(school), src/components/school, src/lib/school

## Last sync

date: 2026-11-23T19:24:14Z

### Updated in this project
- Read the school shell, nav, footer, home, ui kit and all (school) route pages
- Built the design system and home page in two directions (A, B)
- Replaced the Modernist system with the brief's own tokens (Roboto, #B1040E, 4px/8px radius) and a seven-colour Kerala palette; the shared school-ds.css holds the tokens
- Inner pages not yet designed; waiting on direction choice

## Screen map

| Project screen | Repo files |
| --- | --- |
| Home.dc.html (direction prop a or b; HomeA and HomeB open it alone) | src/app/(school)/page.tsx, src/components/school/SchoolHome.tsx, SchoolShell.tsx, SchoolNav.tsx, SchoolFooter.tsx, ui.tsx, src/lib/school/schoolPublic.ts, schoolIdentity.ts |
| Design System.dc.html, school-ds.css | src/components/school/ui.tsx, school-theme.css, schoolFonts.ts, SchoolContactForm.tsx |
| School Redesign.dc.html | board showing Home in directions A and B at 1440, 834 and 390 |
