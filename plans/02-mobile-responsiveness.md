# Plan: Full Mobile Responsiveness

## Context
The app looks good on desktop but has several overflow and layout issues on mobile (phones/tablets). Screenshots show: the navigation bar overflows horizontally with truncated nav items, and the PageHeader title/action button overflow off-screen. Additional issues exist throughout detail, timeline, and auth pages. Goal: every page looks polished at all screen sizes (375px phones through tablets and desktop).

User decisions:
- **Navigation mobile pattern**: Hamburger menu (opens full-width overlay with all nav links + user info)
- **Edit/delete action buttons**: Always visible (not hover-only) on all devices
- **Timeline**: Fix both title scaling and internal card header wrapping
- **UniversityForm**: Stack Cancel/Save buttons vertically on mobile
- **UniversityCard grid**: Keep single column until md (no change needed)
- **Also fix**: University detail stats, Dashboard stats grid, Sign-in/Sign-up pages

---

## Files Modified

| File | Change |
|------|--------|
| `components/layout/Navigation.tsx` | Hamburger menu for mobile |
| `components/layout/PageHeader.tsx` | Header wrapping + title scaling |
| `components/dashboard/UpcomingDeadlines.tsx` | Header wrapping |
| `components/dashboard/StatsOverview.tsx` | Add `sm:grid-cols-2` breakpoint |
| `components/detail/RequirementsChecklist.tsx` | Header wrapping + always-visible actions |
| `components/detail/DeadlinesManager.tsx` | Header wrapping + form grid + always-visible actions |
| `components/detail/NotesSection.tsx` | Header wrapping |
| `components/detail/UniversityHeader.tsx` | Title text scaling |
| `components/universities/UniversityFilters.tsx` | Header wrapping |
| `components/universities/UniversityForm.tsx` | Stack buttons on mobile |
| `app/universities/[id]/page.tsx` | Basic info `grid-cols-2` → `grid-cols-1 sm:grid-cols-2` |
| `app/timeline/page.tsx` | Title scaling + Calendar View header wrapping |
| `app/sign-in/[[...sign-in]]/page.tsx` | Title scaling + spacing |
| `app/sign-up/[[...sign-up]]/page.tsx` | Title scaling + spacing |

---

## Implementation Steps

### 1. `components/layout/Navigation.tsx`
- Add `mobileMenuOpen` state (`useState(false)`)
- Close on pathname change via `useEffect`
- Add hamburger toggle button (`Menu`/`X` lucide icons) with `md:hidden`
- Wrap existing desktop nav links in `hidden md:flex`
- Wrap desktop `UserMenu` in `hidden md:block`
- Add mobile menu panel (`md:hidden`) below navbar: all 3 nav links (icon + text, active state) + divider + user name/email + Sign Out

```
Mobile closed:  [🎓 University Applications]        [☰]
Mobile open:    [🎓 University Applications]        [✕]
                ─────────────────────────────────────
                  📊 Dashboard
                  🏫 Universities
                  📅 Timeline
                ─────────────────────────────────────
                  👤 John Doe  john@email.com
                  Sign Out

Desktop (md+): unchanged
```

### 2. `components/layout/PageHeader.tsx`
- Inner div: `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`
- Title: `text-2xl sm:text-3xl font-bold`

### 3. `components/dashboard/UpcomingDeadlines.tsx`
- Header div: `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`

### 4. `components/dashboard/StatsOverview.tsx`
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`

### 5. `components/detail/RequirementsChecklist.tsx`
- Header: `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`
- Actions: remove `opacity-0 group-hover:opacity-100` (always visible)

### 6. `components/detail/DeadlinesManager.tsx`
- Header: `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`
- Form date/type grid: `grid grid-cols-1 sm:grid-cols-2 gap-3`
- Actions: remove `opacity-0 group-hover:opacity-100` (always visible)

### 7. `components/detail/NotesSection.tsx`
- Header: `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`

### 8. `components/detail/UniversityHeader.tsx`
- Title: `text-2xl sm:text-3xl lg:text-4xl font-bold`

### 9. `components/universities/UniversityFilters.tsx`
- Header: `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`

### 10. `components/universities/UniversityForm.tsx`
- Action buttons: `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end`
  (reverse so primary action appears on top on mobile)

### 11. `app/universities/[id]/page.tsx`
- Basic Info grid: `grid grid-cols-1 sm:grid-cols-2 gap-4`

### 12. `app/timeline/page.tsx`
- Page title: `text-2xl sm:text-4xl font-bold`
- Calendar View card header: `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`

### 13. `app/sign-in/[[...sign-in]]/page.tsx`
- Title: `text-2xl sm:text-3xl font-bold`
- Logo spacing: `mb-4 sm:mb-8`

### 14. `app/sign-up/[[...sign-up]]/page.tsx`
- Same as sign-in (verify structure matches)

---

## Verification

### DevTools (before deploying)
- [ ] Browser DevTools at 375px (iPhone SE) — check all pages
- [ ] Browser DevTools at 768px (iPad) — check all pages
- [ ] Nav hamburger opens/closes; links navigate and menu closes on navigation
- [ ] PageHeader title + action button stack vertically at 375px
- [ ] Edit/delete buttons visible without hover on requirements and deadlines
- [ ] Deadlines add form not cramped (date + type stack on mobile)
- [ ] UniversityForm Cancel/Save stack on mobile
- [ ] Timeline title and Calendar View filter don't overflow
- [ ] Sign-in/Sign-up pages look clean on mobile

### Real device testing (after deploying to Vercel)
- [ ] **iOS Safari** — test all pages; Safari has known quirks with `position: fixed`, `vh` units, and bottom safe areas that DevTools won't catch
- [ ] **Android Chrome** — test all pages; students may use either platform
- [ ] **Sign-in page on a real phone** — this is the first page new users see; verify Clerk's embedded UI renders correctly, inputs are tappable, and the keyboard doesn't break the layout
- [ ] **Sign-up page on a real phone** — same reason as above
