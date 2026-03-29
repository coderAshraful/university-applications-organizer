# Plan: Add Clerk Authentication

## ⚠️ Before You Begin: Get Your Clerk API Keys

1. Go to [clerk.com](https://clerk.com) and sign in (or create a free account)
2. Create a new application — name it "University Applications Organizer"
3. On the setup screen, select **Email**, **Google**, **Apple**, and **Microsoft** as sign-in methods
4. Once created, go to **Dashboard → API Keys**
5. Copy the two keys you need:
   - **Publishable key** — starts with `pk_test_...` (safe to expose publicly)
   - **Secret key** — starts with `sk_test_...` (keep private, never commit)
6. Add both keys to your **Vercel project settings** under Environment Variables before redeploying
7. To enable **Apple**: go to **Dashboard → User & Authentication → Social Connections → Apple** and follow Clerk's Apple Sign-In guide (requires an Apple Developer account)
8. To enable **Microsoft** (Outlook/Azure AD): go to **Dashboard → User & Authentication → Social Connections → Microsoft** and follow Clerk's Azure AD setup guide

---

## Context
The app currently has zero authentication — all universities, deadlines, and requirements are stored globally with no user ownership. Any visitor can read or modify any data. Adding Clerk will:
- Gate the entire app behind login
- Isolate each user's data (universities, deadlines, requirements) via a `userId` field
- Support Email/Password, Google, Apple, and Microsoft (Outlook) OAuth
- Show a custom user menu in the nav bar (orange-themed, matches existing UI)
- Embed sign-in/sign-up pages within the app at `/sign-in` and `/sign-up`

---

## Implementation Steps

### 1. Install Clerk
```
npm install @clerk/nextjs
```

### 2. Update `.env` and `.env.example`
Add to both files:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```
`.env` gets placeholder values; `.env.example` gets the same (user fills in real keys).

### 3. Wrap app with ClerkProvider
**File:** `app/layout.tsx`
- Import `ClerkProvider` from `@clerk/nextjs`
- Wrap the root layout body content with `<ClerkProvider>`

### 4. Create middleware
**New file:** `middleware.ts` (project root)
```ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect();
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};
```

### 5. Create embedded sign-in/sign-up pages
**New file:** `app/sign-in/[[...sign-in]]/page.tsx`
- Centered layout, app branding (graduation cap + "University Applications" heading)
- Render Clerk's `<SignIn>` component

**New file:** `app/sign-up/[[...sign-up]]/page.tsx`
- Same layout, render Clerk's `<SignUp>` component

### 6. Add `userId` to Prisma schema
**File:** `prisma/schema.prisma`
```prisma
model University {
  id      String @id @default(cuid())
  userId  String           // ← NEW
  ...
  @@index([userId])        // ← NEW
}
```
`Requirement` and `Deadline` link to `University` via `universityId`, so they inherit user scoping through that relation — no changes needed on those models.

Then run: `npx prisma db push`

### 6a. Handle existing database rows (migration safety)
The Neon database currently has rows in the `University` table with no `userId`. Adding a non-nullable `userId` column will **fail** unless handled first.

**Strategy — delete orphaned rows before pushing the schema:**
```sql
-- Run in Neon SQL editor (console.neon.tech) BEFORE prisma db push
DELETE FROM "Deadline" WHERE "universityId" IN (SELECT id FROM "University");
DELETE FROM "Requirement" WHERE "universityId" IN (SELECT id FROM "University");
DELETE FROM "University";
```
This clears the seeded demo data. After `prisma db push` succeeds, each real user will populate their own data when they sign up.

> **Alternative:** If you want to keep existing rows, add `userId String @default("")` temporarily, run `prisma db push`, manually assign real Clerk user IDs via Neon's SQL editor, then remove the `@default("")` and push again. The delete approach is simpler since the current data is just seed data.

### 7. Update API routes to scope by userId

Use `auth()` from `@clerk/nextjs/server` in every route handler.

**`app/api/universities/route.ts`**
- GET: add `where: { userId }` filter
- POST: include `userId` in the created record

**`app/api/universities/[id]/route.ts`**
- GET/PATCH/DELETE: add `userId` to the `where` clause so users can't access other users' records

**`app/api/stats/route.ts`**
- GET: add `where: { userId }` filter

**`app/api/deadlines/route.ts`**
- GET: filter deadlines whose university belongs to the current user (join via `university: { userId }`)

**`app/api/deadlines/[id]/route.ts`**
- PATCH/DELETE: verify the deadline's university belongs to the current user

**`app/api/requirements/route.ts`**
- POST: verify the target university belongs to the current user before creating

**`app/api/requirements/[id]/route.ts`**
- PATCH/DELETE: verify through the university relation

All routes return 401 if `userId` is null (unauthenticated).

### 8. Update dashboard server component
**File:** `app/page.tsx`
- Import `auth` from `@clerk/nextjs/server`
- Get `userId` from `auth()` and pass it to the Prisma queries already in `getDashboardData()`

### 9. Loading state handling during auth checks
Client components that fetch data (`app/universities/page.tsx`, `app/universities/[id]/page.tsx`, `app/timeline/page.tsx`) already show a spinner while `loading === true`. However, there is a brief window between page mount and Clerk's auth state being ready where the user object is `undefined`. Handle this in `Navigation.tsx`:

- Use Clerk's `useAuth()` hook — it exposes `isLoaded` boolean
- While `!isLoaded`, render a placeholder/skeleton in the nav user menu area (e.g., a grey circle the same size as the avatar) instead of flickering between signed-in and signed-out states
- The Clerk `<SignedIn>` / `<SignedOut>` guards handle this automatically for page-level rendering, so no extra work needed in page components — only the nav needs the `isLoaded` guard

### 10. Custom nav user menu
**File:** `components/layout/Navigation.tsx`
- Import `useUser`, `useClerk`, `useAuth`, `SignedIn`, `SignedOut` from `@clerk/nextjs`
- While `!isLoaded`: render a grey circle placeholder (same size as avatar)
- When loaded and signed in (`<SignedIn>`):
  - Orange circle with user initials, clicking opens a dropdown
  - Dropdown shows full name, email, and "Sign out" button
  - `clerk.signOut()` on sign-out click
- When loaded and signed out (`<SignedOut>`): render nothing (middleware redirects them anyway)

---

## Files Modified
| File | Change |
|------|--------|
| `app/layout.tsx` | Wrap with `ClerkProvider` |
| `app/page.tsx` | Scope Prisma queries by `userId` from `auth()` |
| `app/api/universities/route.ts` | Filter/set `userId` |
| `app/api/universities/[id]/route.ts` | Scope by `userId` |
| `app/api/stats/route.ts` | Filter by `userId` |
| `app/api/deadlines/route.ts` | Scope by `userId` via university join |
| `app/api/deadlines/[id]/route.ts` | Verify ownership |
| `app/api/requirements/route.ts` | Verify university ownership |
| `app/api/requirements/[id]/route.ts` | Verify ownership |
| `prisma/schema.prisma` | Add `userId` to `University` |
| `components/layout/Navigation.tsx` | Add custom user menu + loading state |
| `.env` | Add Clerk env vars (placeholders) |
| `.env.example` | Add Clerk env vars |

## New Files
| File | Purpose |
|------|---------|
| `middleware.ts` | Clerk route protection |
| `app/sign-in/[[...sign-in]]/page.tsx` | Embedded sign-in page |
| `app/sign-up/[[...sign-up]]/page.tsx` | Embedded sign-up page |

---

## Verification
1. Clear existing DB rows using the SQL above, then run `npx prisma db push`
2. `npm run build` — must pass with zero errors
3. Run dev server, visit `/` → should redirect to `/sign-in`
4. Sign up with email — should land on dashboard with empty data (0 universities)
5. Add a university — verify it appears only for that account
6. Open incognito, sign up with a second account — should see zero universities
7. Sign in with Google/Apple/Microsoft (after enabling in Clerk Dashboard)
8. Verify nav shows user avatar with correct initials; sign-out works and redirects to `/sign-in`
9. Verify no flicker in the nav user menu area during page load
10. Add all 6 Clerk env vars to Vercel before redeploying
