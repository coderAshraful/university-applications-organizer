# Component Structure & File Organization

## Directory Structure

```
university-app/
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx          # Main navigation bar
│   │   ├── PageHeader.tsx          # Page header with title and actions
│   │   └── index.ts                # Barrel export
│   │
│   ├── universities/
│   │   ├── UniversityCard.tsx      # University card with progress
│   │   ├── UniversityFilters.tsx   # Search and filter controls
│   │   ├── UniversityForm.tsx      # Add/edit modal form
│   │   └── index.ts                # Barrel export
│   │
│   ├── detail/
│   │   ├── UniversityHeader.tsx    # Detail page header
│   │   ├── RequirementsChecklist.tsx # Requirements management
│   │   ├── DeadlinesManager.tsx    # Deadlines management
│   │   ├── NotesSection.tsx        # Notes editor
│   │   └── index.ts                # Barrel export
│   │
│   └── dashboard/
│       ├── StatsOverview.tsx       # Statistics cards
│       ├── UpcomingDeadlines.tsx   # Upcoming deadlines widget
│       ├── QuickActions.tsx        # Quick action buttons
│       └── index.ts                # Barrel export
│
├── types/
│   └── index.ts                    # TypeScript type definitions
│
├── lib/
│   └── utils.ts                    # Utility functions (cn, formatDate, etc.)
│
└── app/
    ├── layout.tsx                  # Root layout with Navigation
    ├── page.tsx                    # Dashboard page
    ├── universities/
    │   ├── page.tsx                # Universities list page
    │   └── [id]/
    │       └── page.tsx            # University detail page
    └── timeline/
        └── page.tsx                # Timeline page
```

## Component Hierarchy

### Dashboard Page
```
RootLayout
└── Navigation
└── PageHeader
└── StatsOverview
└── UpcomingDeadlines
└── QuickActions
└── UniversityForm (conditional)
```

### Universities List Page
```
RootLayout
└── Navigation
└── PageHeader
└── UniversityFilters
└── [UniversityCard, UniversityCard, ...] (grid)
└── UniversityForm (conditional)
```

### University Detail Page
```
RootLayout
└── Navigation
└── UniversityHeader
└── RequirementsChecklist
└── DeadlinesManager
└── NotesSection
```

## Component Dependencies

### External Dependencies
- `next` - Next.js framework (Link, usePathname, useRouter)
- `react` - React library (useState, useEffect, ReactNode)
- `lucide-react` - Icon components
- `clsx` - Conditional className utility
- `tailwind-merge` - Merge Tailwind classes

### Internal Dependencies
- `@/types` - Type definitions
- `@/lib/utils` - Utility functions

## Type Definitions

### Core Types (from `/types/index.ts`)

```typescript
// Application Status
type ApplicationStatus =
  | 'considering'
  | 'applied'
  | 'accepted'
  | 'rejected'
  | 'waitlisted'
  | 'enrolled';

// University Category
type UniversityCategory = 'reach' | 'target' | 'safety';

// Deadline Type
type DeadlineType =
  | 'application'
  | 'financial_aid'
  | 'scholarship'
  | 'decision'
  | 'deposit'
  | 'housing'
  | 'other';

// Requirement Type
type RequirementType =
  | 'essay'
  | 'test_score'
  | 'recommendation'
  | 'transcript'
  | 'portfolio'
  | 'other';
```

## Utility Functions (from `/lib/utils.ts`)

```typescript
// Merge className strings with Tailwind support
function cn(...inputs: ClassValue[]): string

// Format date to readable string
function formatDate(date: Date): string

// Get days until a future date
function getDaysUntil(date: Date): number

// Calculate percentage
function getProgressPercentage(completed: number, total: number): number
```

## Component Props Summary

### Layout Components
```typescript
// Navigation.tsx
No props (uses Next.js router)

// PageHeader.tsx
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}
```

### University Components
```typescript
// UniversityCard.tsx
interface UniversityCardProps {
  university: University;
}

// UniversityFilters.tsx
interface UniversityFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: ApplicationStatus | 'all';
  onStatusChange: (status: ApplicationStatus | 'all') => void;
  selectedCategory: UniversityCategory | 'all';
  onCategoryChange: (category: UniversityCategory | 'all') => void;
}

// UniversityForm.tsx
interface UniversityFormProps {
  university?: University;
  onSave: (data: Partial<University>) => void;
  onCancel: () => void;
}
```

### Detail Components
```typescript
// UniversityHeader.tsx
interface UniversityHeaderProps {
  name: string;
  location: string;
  status: ApplicationStatus;
  category: UniversityCategory;
  website?: string;
  applicationPortal?: string;
  onStatusChange: (status: ApplicationStatus) => void;
  onCategoryChange: (category: UniversityCategory) => void;
}

// RequirementsChecklist.tsx
interface RequirementsChecklistProps {
  requirements: Requirement[];
  onToggle: (id: string) => void;
  onAdd: (title: string, notes?: string) => void;
  onEdit: (id: string, title: string, notes?: string) => void;
  onDelete: (id: string) => void;
}

// DeadlinesManager.tsx
interface DeadlinesManagerProps {
  deadlines: Deadline[];
  onAdd: (deadline: Omit<Deadline, 'id'>) => void;
  onEdit: (id: string, deadline: Partial<Deadline>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

// NotesSection.tsx
interface NotesSectionProps {
  notes: string;
  onSave: (notes: string) => void;
}
```

### Dashboard Components
```typescript
// StatsOverview.tsx
interface StatsOverviewProps {
  stats: DashboardStats;
}

// UpcomingDeadlines.tsx
interface UpcomingDeadlinesProps {
  deadlines: UpcomingDeadline[];
}

// QuickActions.tsx
interface QuickActionsProps {
  onAddUniversity?: () => void;
}
```

## Import Patterns

### Using Barrel Exports
```typescript
// Import multiple components from the same group
import { UniversityCard, UniversityFilters, UniversityForm } from '@/components/universities';
import { StatsOverview, UpcomingDeadlines, QuickActions } from '@/components/dashboard';
import { RequirementsChecklist, DeadlinesManager, NotesSection } from '@/components/detail';
```

### Direct Imports
```typescript
import Navigation from '@/components/layout/Navigation';
import PageHeader from '@/components/layout/PageHeader';
```

## State Management Patterns

### Local State (useState)
Most components use local state for UI interactions:
- Form inputs
- Edit mode toggles
- Dropdown selections
- Filter states

### Prop Callbacks
Parent components manage data and pass callback handlers:
```typescript
const [universities, setUniversities] = useState<University[]>([]);

const handleAddUniversity = (data: Partial<University>) => {
  // API call to add university
  // Update local state
};

<UniversityForm onSave={handleAddUniversity} />
```

## Styling Conventions

### Tailwind Class Patterns

**Spacing:**
- `p-4` / `p-6` - Padding
- `space-y-4` / `space-x-3` - Stack spacing
- `gap-4` / `gap-6` - Grid/flex gap

**Colors:**
- `bg-white` - Component backgrounds
- `bg-slate-50` - Page backgrounds
- `bg-orange-500` - Primary actions
- `text-slate-900` - Primary text
- `text-slate-600` - Secondary text

**Borders:**
- `border border-slate-200` - Default borders
- `rounded-lg` - Default border radius
- `shadow-md` - Default shadow

**Interactive States:**
- `hover:bg-slate-50` - Subtle hover
- `hover:shadow-lg` - Elevation on hover
- `transition-all` / `transition-colors` - Smooth animations
- `focus:ring-2 focus:ring-orange-500` - Focus states

### Responsive Design
```typescript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//         mobile: 1 col    tablet: 2 cols   desktop: 3 cols
```

## Color System Reference

### Status Colors
```typescript
const statusColors = {
  'considering': 'bg-slate-100 text-slate-700',
  'applied': 'bg-purple-100 text-purple-700',
  'accepted': 'bg-green-100 text-green-700',
  'rejected': 'bg-red-100 text-red-700',
  'waitlisted': 'bg-yellow-100 text-yellow-700',
  'enrolled': 'bg-orange-100 text-orange-700',
};
```

### Category Colors
```typescript
const categoryColors = {
  'reach': 'bg-red-50 text-red-700 border-red-200',
  'target': 'bg-blue-50 text-blue-700 border-blue-200',
  'safety': 'bg-green-50 text-green-700 border-green-200',
};
```

### Urgency Colors (Deadlines)
```typescript
const urgencyColors = {
  overdue: 'bg-red-50 border-red-200 text-red-700',
  urgent: 'bg-orange-50 border-orange-200 text-orange-700',
  normal: 'bg-blue-50 border-blue-200 text-blue-700',
  completed: 'bg-green-50 border-green-200 text-green-700',
};
```

## Component Features Matrix

| Component | Interactive | Forms | API Calls | Routing | State Management |
|-----------|------------|-------|-----------|---------|------------------|
| Navigation | ✓ | - | - | ✓ | Router state |
| PageHeader | - | - | - | - | Props only |
| UniversityCard | ✓ | - | - | ✓ | Props only |
| UniversityFilters | ✓ | ✓ | - | - | Controlled |
| UniversityForm | ✓ | ✓ | ✓ | - | Local state |
| UniversityHeader | ✓ | ✓ | ✓ | ✓ | Controlled |
| RequirementsChecklist | ✓ | ✓ | ✓ | - | Local + Controlled |
| DeadlinesManager | ✓ | ✓ | ✓ | - | Local + Controlled |
| NotesSection | ✓ | ✓ | ✓ | - | Local + Controlled |
| StatsOverview | - | - | - | - | Props only |
| UpcomingDeadlines | ✓ | - | - | ✓ | Local state |
| QuickActions | ✓ | - | - | ✓ | Props only |

## Testing Considerations

### Unit Tests
- Test component rendering with different props
- Test user interactions (clicks, form submissions)
- Test conditional rendering (empty states, edit mode)

### Integration Tests
- Test form validation
- Test API integration
- Test routing behavior

### Visual Tests
- Test responsive layouts at different breakpoints
- Test color schemes and theming
- Test accessibility (keyboard navigation, screen readers)

## Performance Tips

1. **Memoization:** Use `React.memo()` for components that receive the same props frequently
2. **Lazy Loading:** Use `next/dynamic` for heavy components
3. **Virtualization:** Consider virtual scrolling for long lists
4. **Debouncing:** Debounce search inputs to reduce re-renders
5. **Image Optimization:** Use `next/image` for university logos

## Next Steps

1. Connect components to API routes
2. Add error handling and loading states
3. Implement data fetching with React Query or SWR
4. Add form validation with Zod or Yup
5. Add animations with Framer Motion
6. Implement drag-and-drop for requirement ordering
7. Add export/import functionality (CSV, JSON)
8. Add dark mode support
9. Add keyboard shortcuts
10. Add print stylesheet
