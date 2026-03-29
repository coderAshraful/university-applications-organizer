# Session Log — University Applications Organizer

Chronological record of everything built, in the order it was built.

---

## Session 1 — February 13, 2026: Initial App + UI Components

**Commits:** `b7bb75c`, `2a92e10`, `7e2e292`, `59599c0`

### What Was Built

**Initial app scaffold** (`b7bb75c` — 2026-02-13):
- Next.js 15 project with TypeScript 5.7, App Router, Tailwind CSS
- Prisma ORM configured with **SQLite** (`prisma/dev.db`) for zero-config local dev
- Full database schema: `University`, `Requirement`, `Deadline` models with cascade deletes
- Initial migration (`20260213193505_init`) applied
- Prisma client singleton at `lib/db.ts` (dev logging + global instance for hot reload)
- Seed script (`prisma/seed.ts`) populating 5 sample universities:
  - MIT (Reach, Applied)
  - Stanford (Reach, Applied)
  - University of Washington (Target, Accepted)
  - Georgia Tech (Target, Considering)
  - Purdue (Safety, Accepted)

**API routes:**
- `GET/POST /api/universities` — list with filters, create
- `GET/PATCH/DELETE /api/universities/[id]` — single university CRUD
- `POST /api/requirements`, `PATCH/DELETE /api/requirements/[id]`
- `POST /api/deadlines`, `PATCH/DELETE /api/deadlines/[id]`
- `GET /api/stats` — dashboard counts by status
- `GET /api/search-universities` — proxies College Scorecard API (US) + Hipolabs API (worldwide)

**UI components (12 components across 4 groups):**
- `components/layout/` — Navigation (deep blue, orange accents), PageHeader
- `components/universities/` — UniversityCard (color-coded stripe, progress bar), UniversityFilters, UniversityForm (full-screen modal)
- `components/detail/` — UniversityHeader, RequirementsChecklist, DeadlinesManager, NotesSection
- `components/dashboard/` — StatsOverview, UpcomingDeadlines (7/14/30-day filter), QuickActions

**Pages:**
- `/` — Dashboard (server component, stats + upcoming deadlines + quick actions)
- `/universities` — List page with search/filter grid
- `/universities/[id]` — Detail page
- `/timeline` — Monthly calendar view

**TypeScript types** (`types/index.ts`): `University`, `Requirement`, `Deadline`, `ApplicationStatus`, `UniversityCategory`, `RequirementType`, `DeadlineType`, `DashboardStats`, `UpcomingDeadline`

**Bug fixes in same session:**
- `2a92e10` — Dashboard overview stat cards made clickable (link to `/universities?status=X`)
- `7e2e292` — Fix TypeError in DeadlinesManager: API returns ISO date strings, not `Date` objects — added explicit `new Date()` conversion
- `59599c0` — Fix `UniversityHeader` prop interface mismatch

---

## Session 2 — March 28, 2026: Vercel Deployment + Neon PostgreSQL + Clerk Auth

**Commits:** `dabdb75`, `dd9e606`, `293082d`, `a2ada68`, `01b44f3`, `0ae9b99`

### Phase 1 — Deploy to Vercel (`dabdb75`, `dd9e606`, `293082d`, `a2ada68`)

**Goal:** Get the app running on Vercel.

`dabdb75` — Install missing UI dependencies and fix dashboard data fetching:
- Added Radix UI packages: `@radix-ui/react-checkbox`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-label`, `@radix-ui/react-select`, `@radix-ui/react-slot`
- Added `react-day-picker` (date picker for deadline forms)
- Added `class-variance-authority`
- Fixed dashboard `getDashboardData()` server function (data fetching broken)

`dd9e606` — Fix Vercel build: removed `prisma.config.ts` that was causing `prisma generate` to fail on Vercel's CI

`293082d` — Fix all remaining Vercel build errors:
- ESLint errors (unused imports, `any` types, missing deps)
- TypeScript type errors across API routes and components
- Added `<Suspense>` boundaries required by Next.js 15 for `useSearchParams()`

`a2ada68` — Fix missing `handleToggleDeadline` function and `onToggle` prop in `DeadlinesManager` (was referenced but not implemented)

### Phase 2 — Migrate to Neon PostgreSQL (`01b44f3`)

**Goal:** Replace SQLite (not supported in serverless) with a persistent PostgreSQL database.

- Created Neon project and obtained connection string
- Changed `prisma/schema.prisma` datasource from `sqlite` to `postgresql`
- Updated `DATABASE_URL` in Vercel environment variables to Neon connection string
- Ran `npx prisma db push` to apply schema to Neon (no migration files needed)
- Removed `prisma/dev.db` SQLite file from repo

### Phase 3 — Clerk Authentication (`0ae9b99`)

**Goal:** Gate the entire app behind login; isolate each user's data.

**Setup:**
- Installed `@clerk/nextjs` v7
- Created Clerk application "University Applications Organizer" with Email, Google, Apple, Microsoft sign-in
- Added 6 Clerk env vars to `.env` and Vercel

**Schema change:**
- Added `userId String` + `@@index([userId])` to `University` model in Prisma schema
- Wiped existing Neon database rows (seed data only, no real user data) before pushing non-nullable column
- Ran `npx prisma db push`

**New files:**
- `middleware.ts` — `clerkMiddleware` protects all routes; allows `/sign-in` and `/sign-up` through
- `app/sign-in/[[...sign-in]]/page.tsx` — Embedded Clerk `<SignIn>` component, centered with app branding
- `app/sign-up/[[...sign-up]]/page.tsx` — Embedded Clerk `<SignUp>` component

**Modified files:**
- `app/layout.tsx` — wrapped body in `<ClerkProvider>`
- `app/page.tsx` — `auth()` call, `userId` passed to `getDashboardData()`
- `app/api/universities/route.ts` — GET filters by `userId`, POST sets `userId`
- `app/api/universities/[id]/route.ts` — GET/PATCH/DELETE include `userId` in `where` clause
- `app/api/stats/route.ts` — `where: { userId }` on all counts
- `app/api/deadlines/route.ts` — filter via `university: { userId }`
- `app/api/deadlines/[id]/route.ts` — verify university ownership before PATCH/DELETE
- `app/api/requirements/route.ts` — verify university ownership before POST
- `app/api/requirements/[id]/route.ts` — verify ownership before PATCH/DELETE
- `components/layout/Navigation.tsx` — custom user menu: `useAuth()` (isLoaded guard → grey circle placeholder), `useUser()`, `useClerk()`, `SignedIn`/`SignedOut`, orange initial avatar, dropdown with name/email/sign-out

All routes return `401` if `userId` is null (unauthenticated request).

---

## Session 3 — March 29, 2026: Full Mobile Responsiveness

**Commits:** `7998c5f`

### What Was Built

**Goal:** Fix all overflow and layout issues on mobile (375px phones through tablets). Every page now looks polished at all screen sizes.

**Navigation — hamburger menu (`components/layout/Navigation.tsx`):**
- Desktop nav links and user menu wrapped in `hidden md:flex` / `hidden md:block` — unchanged on desktop
- Added `mobileMenuOpen` state; closes automatically on pathname change via `useEffect`
- Hamburger (`Menu`) / close (`X`) toggle button, `md:hidden`
- Mobile overlay panel below navbar: all 3 nav links with active state, divider, user avatar + name/email, Sign Out button

**Responsive layouts (14 files total):**
- `components/layout/PageHeader.tsx` — inner div stacks vertically on mobile (`flex-col gap-3 sm:flex-row`); title `text-2xl sm:text-3xl`
- `components/dashboard/UpcomingDeadlines.tsx` — header stacks on mobile
- `components/dashboard/StatsOverview.tsx` — grid gains `sm:grid-cols-2` breakpoint (was jumping 1→4 columns)
- `components/detail/RequirementsChecklist.tsx` — header stacks; edit/delete buttons always visible (removed `opacity-0 group-hover:opacity-100`)
- `components/detail/DeadlinesManager.tsx` — header stacks; date/type form grid `grid-cols-1 sm:grid-cols-2`; edit/delete always visible
- `components/detail/NotesSection.tsx` — header stacks on mobile
- `components/detail/UniversityHeader.tsx` — title `text-2xl sm:text-3xl lg:text-4xl`
- `components/universities/UniversityFilters.tsx` — header stacks on mobile
- `components/universities/UniversityForm.tsx` — Cancel/Save buttons `flex-col-reverse gap-2 sm:flex-row` (Save on top on mobile)
- `app/universities/[id]/page.tsx` — Basic Info grid `grid-cols-1 sm:grid-cols-2`
- `app/timeline/page.tsx` — page title `text-2xl sm:text-4xl`; Calendar View card header stacks on mobile
- `app/sign-in/[[...sign-in]]/page.tsx` — title `text-2xl sm:text-3xl`; logo spacing `mb-4 sm:mb-8`
- `app/sign-up/[[...sign-up]]/page.tsx` — same as sign-in
