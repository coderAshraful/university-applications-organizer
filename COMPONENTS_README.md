# University Applications Organizer - UI Components Documentation

This document provides detailed information about all the reusable UI components created for the University Applications Organizer.

## Table of Contents

1. [Layout Components](#layout-components)
2. [University Components](#university-components)
3. [Detail View Components](#detail-view-components)
4. [Dashboard Components](#dashboard-components)
5. [Design System](#design-system)
6. [Usage Examples](#usage-examples)

---

## Layout Components

### Navigation.tsx
**Location:** `/components/layout/Navigation.tsx`

Main navigation bar with links to Dashboard, Universities, and Timeline pages.

**Features:**
- Responsive navigation with logo
- Active link highlighting with orange accent
- Deep blue background (slate-900)
- Smooth transitions on hover
- Icons from lucide-react

**Props:** None (uses Next.js router for active state)

**Usage:**
```tsx
import Navigation from '@/components/layout/Navigation';

<Navigation />
```

---

### PageHeader.tsx
**Location:** `/components/layout/PageHeader.tsx`

Reusable page header component with title, optional description, and action buttons.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| title | string | Yes | Main page title |
| description | string | No | Optional subtitle/description |
| actions | ReactNode | No | Action buttons (e.g., Add button) |

**Usage:**
```tsx
import PageHeader from '@/components/layout/PageHeader';

<PageHeader
  title="Universities"
  description="Manage your university applications"
  actions={
    <button onClick={handleAdd}>Add University</button>
  }
/>
```

---

## University Components

### UniversityCard.tsx
**Location:** `/components/universities/UniversityCard.tsx`

Interactive card displaying university information with visual indicators.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| university | University | Yes | University object with all data |

**Features:**
- Color-coded top stripe by category (reach/target/safety)
- Status badge with color coding
- Category badge
- Next upcoming deadline display
- Progress bar showing requirement completion
- Hover effects with shadow and border color change
- Responsive layout

**Visual Elements:**
- Red gradient: Reach schools
- Blue gradient: Target schools
- Green gradient: Safety schools
- Orange highlighted deadline box
- Dynamic progress bar (orange → blue → green)

**Usage:**
```tsx
import UniversityCard from '@/components/universities/UniversityCard';

<UniversityCard university={universityData} />
```

---

### UniversityFilters.tsx
**Location:** `/components/universities/UniversityFilters.tsx`

Filter controls for university list (search, status, category).

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| searchQuery | string | Yes | Current search text |
| onSearchChange | (query: string) => void | Yes | Search handler |
| selectedStatus | ApplicationStatus \| 'all' | Yes | Selected status filter |
| onStatusChange | (status: ApplicationStatus \| 'all') => void | Yes | Status filter handler |
| selectedCategory | UniversityCategory \| 'all' | Yes | Selected category filter |
| onCategoryChange | (category: UniversityCategory \| 'all') => void | Yes | Category filter handler |

**Features:**
- Search input with magnifying glass icon
- Status dropdown (All, Not Started, In Progress, etc.)
- Category dropdown (All, Reach, Target, Safety)
- Responsive grid layout
- Consistent styling with orange focus rings

**Usage:**
```tsx
import UniversityFilters from '@/components/universities/UniversityFilters';

<UniversityFilters
  searchQuery={search}
  onSearchChange={setSearch}
  selectedStatus={status}
  onStatusChange={setStatus}
  selectedCategory={category}
  onCategoryChange={setCategory}
/>
```

---

### UniversityForm.tsx
**Location:** `/components/universities/UniversityForm.tsx`

Modal form for adding or editing universities.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| university | University | No | If provided, form is in edit mode |
| onSave | (data: Partial<University>) => void | Yes | Save handler |
| onCancel | () => void | Yes | Cancel handler |

**Features:**
- Full-screen modal with backdrop
- Form fields: name, location, status, category, website, portal, notes
- Validation (required fields marked with *)
- Cancel and Submit buttons
- Sticky header
- Scrollable content area

**Fields:**
- University Name (required)
- Location (required)
- Application Status (dropdown)
- Category (dropdown)
- Website (URL)
- Application Portal (URL)
- Notes (textarea)

**Usage:**
```tsx
import UniversityForm from '@/components/universities/UniversityForm';

{showForm && (
  <UniversityForm
    university={editingUniversity}
    onSave={handleSave}
    onCancel={() => setShowForm(false)}
  />
)}
```

---

## Detail View Components

### UniversityHeader.tsx
**Location:** `/components/detail/UniversityHeader.tsx`

Header section for university detail page with name, location, and status selectors.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| name | string | Yes | University name |
| location | string | Yes | University location |
| status | ApplicationStatus | Yes | Current status |
| category | UniversityCategory | Yes | Current category |
| website | string | No | Website URL |
| applicationPortal | string | No | Application portal URL |
| onStatusChange | (status: ApplicationStatus) => void | Yes | Status change handler |
| onCategoryChange | (category: UniversityCategory) => void | Yes | Category change handler |

**Features:**
- Large university name display
- Location with map pin icon
- Back to Universities link
- Website and portal external links
- Color-coded status selector
- Color-coded category selector
- Responsive layout (stacked on mobile, side-by-side on desktop)

**Usage:**
```tsx
import UniversityHeader from '@/components/detail/UniversityHeader';

<UniversityHeader
  name={university.name}
  location={university.location}
  status={university.status}
  category={university.category}
  website={university.website}
  applicationPortal={university.applicationPortal}
  onStatusChange={handleStatusChange}
  onCategoryChange={handleCategoryChange}
/>
```

---

### RequirementsChecklist.tsx
**Location:** `/components/detail/RequirementsChecklist.tsx`

Interactive checklist for tracking application requirements.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| requirements | Requirement[] | Yes | Array of requirements |
| onToggle | (id: string) => void | Yes | Toggle completion handler |
| onAdd | (title: string, notes?: string) => void | Yes | Add requirement handler |
| onEdit | (id: string, title: string, notes?: string) => void | Yes | Edit requirement handler |
| onDelete | (id: string) => void | Yes | Delete requirement handler |

**Features:**
- Progress bar with percentage
- Add new requirement inline form
- Edit existing requirements inline
- Delete requirements
- Check/uncheck completion
- Visual feedback (green for completed)
- Hover actions (edit/delete buttons appear on hover)
- Empty state message

**Usage:**
```tsx
import RequirementsChecklist from '@/components/detail/RequirementsChecklist';

<RequirementsChecklist
  requirements={university.requirements}
  onToggle={handleToggle}
  onAdd={handleAdd}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

### DeadlinesManager.tsx
**Location:** `/components/detail/DeadlinesManager.tsx`

Comprehensive deadline management with add/edit/delete functionality.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| deadlines | Deadline[] | Yes | Array of deadlines |
| onAdd | (deadline: Omit<Deadline, 'id'>) => void | Yes | Add deadline handler |
| onEdit | (id: string, deadline: Partial<Deadline>) => void | Yes | Edit deadline handler |
| onDelete | (id: string) => void | Yes | Delete deadline handler |
| onToggle | (id: string) => void | Yes | Toggle completion handler |

**Features:**
- Add/edit inline form with date picker
- Deadline type selector (Application, Financial Aid, etc.)
- Days until calculation
- Color coding:
  - Red: Overdue or ≤3 days
  - Orange: 4-7 days
  - Blue: >7 days
  - Green: Completed
- Urgency indicators
- Sorted list (incomplete first, then by date)
- Hover actions (edit/delete)

**Deadline Types:**
- Application
- Financial Aid
- Document
- Interview
- Decision
- Other

**Usage:**
```tsx
import DeadlinesManager from '@/components/detail/DeadlinesManager';

<DeadlinesManager
  deadlines={university.deadlines}
  onAdd={handleAddDeadline}
  onEdit={handleEditDeadline}
  onDelete={handleDeleteDeadline}
  onToggle={handleToggleDeadline}
/>
```

---

### NotesSection.tsx
**Location:** `/components/detail/NotesSection.tsx`

Rich text notes area for university-specific information.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| notes | string | Yes | Current notes content |
| onSave | (notes: string) => void | Yes | Save notes handler |

**Features:**
- View/Edit mode toggle
- Large textarea in edit mode
- Character count
- Save/Cancel buttons
- Empty state with helpful placeholder
- Preserves whitespace and line breaks
- Unsaved changes detection

**Usage:**
```tsx
import NotesSection from '@/components/detail/NotesSection';

<NotesSection
  notes={university.notes}
  onSave={handleSaveNotes}
/>
```

---

## Dashboard Components

### StatsOverview.tsx
**Location:** `/components/dashboard/StatsOverview.tsx`

Summary metrics cards showing application statistics.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| stats | DashboardStats | Yes | Statistics object |

**Features:**
- Grid of metric cards
- Color-coded icons
- Total count display
- Percentage of total calculation
- Responsive grid (1/2/4 columns)
- Hover shadow effect

**Metrics Displayed:**
- Total Universities
- Considering
- Applied
- Accepted
- Waitlisted
- Rejected
- Enrolled

**Usage:**
```tsx
import StatsOverview from '@/components/dashboard/StatsOverview';

<StatsOverview stats={dashboardStats} />
```

---

### UpcomingDeadlines.tsx
**Location:** `/components/dashboard/UpcomingDeadlines.tsx`

Deadline widget with time range filtering (7/14/30 days).

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| deadlines | UpcomingDeadline[] | Yes | Array of upcoming deadlines |

**Features:**
- Time range selector (7/14/30 days)
- Color-coded urgency (red/orange/blue)
- Days until display
- Link to university detail page
- Deadline type badge
- Empty state message
- "View full timeline" link
- Sorted by urgency

**Urgency Levels:**
- Overdue: Red with alert icon
- Today: Red with pulsing alert
- Tomorrow: Red
- ≤7 days: Orange
- >7 days: Blue

**Usage:**
```tsx
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';

<UpcomingDeadlines deadlines={upcomingDeadlines} />
```

---

### QuickActions.tsx
**Location:** `/components/dashboard/QuickActions.tsx`

Action buttons for common tasks.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onAddUniversity | () => void | No | Handler for Add University button |

**Features:**
- Three action cards:
  1. Add University (triggers callback)
  2. View All Universities (links to /universities)
  3. Timeline (links to /timeline)
- Color-coded buttons
- Hover effects
- Pro tips section below
- Responsive grid

**Usage:**
```tsx
import QuickActions from '@/components/dashboard/QuickActions';

<QuickActions onAddUniversity={() => setShowForm(true)} />
```

---

## Design System

### Color Palette

**Primary (Deep Blue):**
- slate-900: Navigation background
- blue-500: In-progress status
- blue-600: Target category

**Accent (Warm Orange):**
- orange-500: Primary buttons, focus rings
- orange-600: Button hover states
- orange-50/100: Urgent deadline backgrounds

**Status Colors:**
- Not Started: slate
- In Progress: blue
- Submitted: purple
- Accepted: green
- Rejected: red
- Waitlisted: yellow

**Category Colors:**
- Reach: red
- Target: blue
- Safety: green

### Typography

**Font Family:** System font stack (San Francisco, Segoe UI, Roboto, etc.)

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

**Text Sizes:**
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)

### Spacing

Following Tailwind's default spacing scale (0.25rem increments).

### Shadows

- sm: Small shadow for cards
- md: Medium shadow for elevated cards
- lg: Large shadow for hover states
- xl: Extra large shadow for modals

### Border Radius

- Default: 0.5rem (8px) for most elements
- lg: 0.75rem (12px) for cards
- full: 9999px for badges and pills

---

## Usage Examples

### Complete Dashboard Page

```tsx
'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { StatsOverview, UpcomingDeadlines, QuickActions } from '@/components/dashboard';
import { UniversityForm } from '@/components/universities';

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);

  const stats = {
    total: 12,
    considering: 3,
    applied: 5,
    accepted: 2,
    rejected: 1,
    waitlisted: 1,
    enrolled: 0,
  };

  const upcomingDeadlines = [
    // ... deadline data
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Dashboard"
        description="Track your university application progress"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <StatsOverview stats={stats} />
        <UpcomingDeadlines deadlines={upcomingDeadlines} />
        <QuickActions onAddUniversity={() => setShowForm(true)} />
      </div>

      {showForm && (
        <UniversityForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
```

### Complete Universities List Page

```tsx
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { UniversityCard, UniversityFilters, UniversityForm } from '@/components/universities';

export default function Universities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);

  // Filter universities based on search and filters
  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || uni.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || uni.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Universities"
        description={`${universities.length} universities tracked`}
        actions={
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add University
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <UniversityFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.map(university => (
            <UniversityCard key={university.id} university={university} />
          ))}
        </div>
      </div>

      {showForm && (
        <UniversityForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
```

### Complete University Detail Page

```tsx
'use client';

import { useState } from 'react';
import { UniversityHeader } from '@/components/detail';
import { RequirementsChecklist, DeadlinesManager, NotesSection } from '@/components/detail';

export default function UniversityDetail({ params }: { params: { id: string } }) {
  const [university, setUniversity] = useState(/* ... */);

  return (
    <div className="min-h-screen bg-slate-50">
      <UniversityHeader
        name={university.name}
        location={university.location}
        status={university.status}
        category={university.category}
        website={university.website}
        applicationPortal={university.applicationPortal}
        onStatusChange={handleStatusChange}
        onCategoryChange={handleCategoryChange}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RequirementsChecklist
            requirements={university.requirements}
            onToggle={handleToggleRequirement}
            onAdd={handleAddRequirement}
            onEdit={handleEditRequirement}
            onDelete={handleDeleteRequirement}
          />

          <DeadlinesManager
            deadlines={university.deadlines}
            onAdd={handleAddDeadline}
            onEdit={handleEditDeadline}
            onDelete={handleDeleteDeadline}
            onToggle={handleToggleDeadline}
          />
        </div>

        <NotesSection
          notes={university.notes}
          onSave={handleSaveNotes}
        />
      </div>
    </div>
  );
}
```

---

## Component Index Files

For easier imports, index files are provided for each component group:

```tsx
// components/layout/index.ts
export { default as Navigation } from './Navigation';
export { default as PageHeader } from './PageHeader';

// components/universities/index.ts
export { default as UniversityCard } from './UniversityCard';
export { default as UniversityFilters } from './UniversityFilters';
export { default as UniversityForm } from './UniversityForm';

// components/detail/index.ts
export { default as UniversityHeader } from './UniversityHeader';
export { default as RequirementsChecklist } from './RequirementsChecklist';
export { default as DeadlinesManager } from './DeadlinesManager';
export { default as NotesSection } from './NotesSection';

// components/dashboard/index.ts
export { default as StatsOverview } from './StatsOverview';
export { default as UpcomingDeadlines } from './UpcomingDeadlines';
export { default as QuickActions } from './QuickActions';
```

**Usage:**
```tsx
// Import multiple components from the same group
import { UniversityCard, UniversityFilters, UniversityForm } from '@/components/universities';
```

---

## Dependencies

The components use the following external libraries:

- **next**: Framework (routing, Link component)
- **react**: Core React library
- **lucide-react**: Icon library
- **clsx**: Conditional className utility
- **tailwind-merge**: Tailwind class merging utility

---

## TypeScript Types

All components are fully typed with TypeScript. Key type definitions are located in `/types/index.ts`:

- `ApplicationStatus`
- `UniversityCategory`
- `University`
- `Requirement`
- `Deadline`
- `DashboardStats`
- `UpcomingDeadline`

---

## Responsive Design

All components are fully responsive with breakpoints:

- **sm**: 640px (mobile)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)

Components adapt their layout, spacing, and functionality across different screen sizes.

---

## Accessibility

Components follow accessibility best practices:

- Semantic HTML elements
- ARIA labels where appropriate
- Keyboard navigation support
- Focus states on interactive elements
- Color contrast ratios meet WCAG standards
- Screen reader friendly text

---

## Performance Optimizations

- Client components use `'use client'` directive
- Minimal re-renders with proper state management
- Lazy loading for large lists (can be implemented)
- Optimized images with Next.js Image component (can be added)

---

## License

These components are part of the University Applications Organizer project.
