# Quick Start Guide - UI Components

## Getting Started

All UI components for the University Applications Organizer are ready to use!

## Installation

Dependencies are already installed:
```bash
npm install lucide-react clsx tailwind-merge
```

## Import Components

### Option 1: Barrel Imports (Recommended)
```typescript
import { UniversityCard, UniversityFilters, UniversityForm } from '@/components/universities';
import { StatsOverview, UpcomingDeadlines, QuickActions } from '@/components/dashboard';
import { UniversityHeader, RequirementsChecklist, DeadlinesManager, NotesSection } from '@/components/detail';
```

### Option 2: Direct Imports
```typescript
import Navigation from '@/components/layout/Navigation';
import PageHeader from '@/components/layout/PageHeader';
import UniversityCard from '@/components/universities/UniversityCard';
```

## Quick Examples

### 1. Dashboard Page (5 minutes)

```tsx
'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { StatsOverview, UpcomingDeadlines, QuickActions } from '@/components/dashboard';

export default function Dashboard() {
  const stats = {
    total: 12,
    considering: 3,
    applied: 5,
    accepted: 2,
    rejected: 1,
    waitlisted: 1,
    enrolled: 0,
  };

  const upcomingDeadlines = []; // Fetch from API

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Dashboard" description="Track your progress" />

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        <StatsOverview stats={stats} />
        <UpcomingDeadlines deadlines={upcomingDeadlines} />
        <QuickActions />
      </div>
    </div>
  );
}
```

### 2. Universities List (10 minutes)

```tsx
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { UniversityCard, UniversityFilters, UniversityForm } from '@/components/universities';

export default function Universities() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');

  const universities = []; // Fetch from API

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Universities"
        actions={
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            <Plus className="inline h-4 w-4 mr-2" />
            Add University
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        <UniversityFilters
          searchQuery={search}
          onSearchChange={setSearch}
          selectedStatus={status}
          onStatusChange={setStatus}
          selectedCategory={category}
          onCategoryChange={setCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map(uni => (
            <UniversityCard key={uni.id} university={uni} />
          ))}
        </div>
      </div>

      {showForm && (
        <UniversityForm
          onSave={(data) => {
            // API call to save
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
```

### 3. University Detail Page (15 minutes)

```tsx
'use client';

import { useState, useEffect } from 'react';
import {
  UniversityHeader,
  RequirementsChecklist,
  DeadlinesManager,
  NotesSection
} from '@/components/detail';

export default function UniversityDetail({ params }: { params: { id: string } }) {
  const [university, setUniversity] = useState(null);

  useEffect(() => {
    // Fetch university data
    // setUniversity(data);
  }, [params.id]);

  if (!university) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <UniversityHeader
        name={university.name}
        location={university.location}
        status={university.status}
        category={university.category}
        website={university.websiteUrl}
        applicationPortal={university.applicationPortal}
        onStatusChange={(newStatus) => {
          // API call to update status
        }}
        onCategoryChange={(newCategory) => {
          // API call to update category
        }}
      />

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RequirementsChecklist
            requirements={university.requirements}
            onToggle={(id) => {/* API call */}}
            onAdd={(title, notes) => {/* API call */}}
            onEdit={(id, title, notes) => {/* API call */}}
            onDelete={(id) => {/* API call */}}
          />

          <DeadlinesManager
            deadlines={university.deadlines}
            onAdd={(deadline) => {/* API call */}}
            onEdit={(id, data) => {/* API call */}}
            onDelete={(id) => {/* API call */}}
            onToggle={(id) => {/* API call */}}
          />
        </div>

        <NotesSection
          notes={university.notes}
          onSave={(notes) => {/* API call */}}
        />
      </div>
    </div>
  );
}
```

## API Integration Pattern

### Fetch Data
```typescript
const [universities, setUniversities] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch('/api/universities')
    .then(res => res.json())
    .then(data => {
      setUniversities(data);
      setLoading(false);
    });
}, []);
```

### Create/Update
```typescript
const handleSave = async (data) => {
  const response = await fetch('/api/universities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const newUniversity = await response.json();
    setUniversities([...universities, newUniversity]);
  }
};
```

### Delete
```typescript
const handleDelete = async (id) => {
  const response = await fetch(`/api/universities/${id}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    setUniversities(universities.filter(u => u.id !== id));
  }
};
```

## Color Reference

### Quick Class Names

**Buttons:**
- Primary: `bg-orange-500 hover:bg-orange-600 text-white`
- Secondary: `border border-slate-300 text-slate-700 hover:bg-slate-50`

**Cards:**
- `bg-white rounded-lg shadow-md border border-slate-200`

**Inputs:**
- `border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500`

**Status Colors:**
```typescript
const statusColors = {
  considering: 'bg-slate-100 text-slate-700',
  applied: 'bg-purple-100 text-purple-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  waitlisted: 'bg-yellow-100 text-yellow-700',
  enrolled: 'bg-orange-100 text-orange-700',
};
```

## Common Patterns

### Loading State
```tsx
{loading ? (
  <div className="flex items-center justify-center h-64">
    <div className="text-slate-500">Loading...</div>
  </div>
) : (
  <YourComponent />
)}
```

### Empty State
```tsx
{items.length === 0 ? (
  <div className="text-center py-8 text-slate-500">
    <p>No items yet.</p>
  </div>
) : (
  items.map(item => <ItemCard key={item.id} {...item} />)
)}
```

### Error Handling
```tsx
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
    {error.message}
  </div>
)}
```

## Responsive Layout

All components are responsive by default. Key breakpoints:

```tsx
// Mobile-first approach
className="
  grid
  grid-cols-1           // 1 column on mobile
  md:grid-cols-2        // 2 columns on tablet
  lg:grid-cols-3        // 3 columns on desktop
  gap-6
"
```

## TypeScript Tips

### Import Types
```typescript
import type { University, Requirement, Deadline } from '@/types';
```

### Type-Safe State
```typescript
const [university, setUniversity] = useState<University | null>(null);
const [deadlines, setDeadlines] = useState<Deadline[]>([]);
```

## Testing Components

### Example Test (Jest + React Testing Library)
```typescript
import { render, screen } from '@testing-library/react';
import UniversityCard from '@/components/universities/UniversityCard';

test('renders university card', () => {
  const university = {
    id: '1',
    name: 'Stanford University',
    location: 'Stanford, CA',
    status: 'applied',
    category: 'reach',
    requirements: [],
    deadlines: [],
  };

  render(<UniversityCard university={university} />);

  expect(screen.getByText('Stanford University')).toBeInTheDocument();
  expect(screen.getByText('Stanford, CA')).toBeInTheDocument();
});
```

## Next Steps

1. **Connect to API** - Wire up all the `onSave`, `onDelete`, etc. handlers
2. **Add Loading States** - Show spinners while data is fetching
3. **Add Error Handling** - Display errors gracefully
4. **Add Validation** - Use Zod or Yup for form validation
5. **Add Tests** - Write unit and integration tests
6. **Add Animations** - Use Framer Motion for smooth transitions

## Documentation

- **COMPONENTS_README.md** - Full component documentation
- **COMPONENT_STRUCTURE.md** - Architecture and patterns
- **COMPONENTS_SUMMARY.md** - Quick overview
- **COMPONENT_OVERVIEW.txt** - Visual diagram

## Support

All components follow Next.js 15 and React 19 best practices. They are:
- ✅ Fully typed with TypeScript
- ✅ Responsive and accessible
- ✅ Using Tailwind CSS
- ✅ Client components with `'use client'`

Ready to build!
