# Plans

This folder stores feature plan documents for the University Applications Organizer. Each plan is numbered in the order it was implemented and describes the context, implementation steps, files changed, and verification checklist for that feature.

## Index

| File | Feature | Status |
|------|---------|--------|
| [01-clerk-authentication.md](./01-clerk-authentication.md) | Clerk authentication with per-user data isolation | ✅ Complete |
| [02-mobile-responsiveness.md](./02-mobile-responsiveness.md) | Full mobile responsiveness (hamburger nav, layout fixes, touch-friendly UI) | ✅ Complete |

## How to Add a New Plan

1. Create a new file named `NN-feature-name.md` where `NN` is the next number in sequence
2. Include these sections:
   - **Context** — why this feature is needed
   - **Implementation Steps** — numbered, with code snippets
   - **Files Modified / New Files** — table of all changes
   - **Verification** — checklist to confirm it works
3. Add a row to the index table above
