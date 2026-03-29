'use client';

import { Search, Filter } from 'lucide-react';

interface Filters {
  search: string;
  status: string;
  category: string;
}

interface UniversityFiltersProps {
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
  totalCount: number;
  filteredCount: number;
}

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'considering', label: 'Considering' },
  { value: 'applied', label: 'Applied' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'waitlisted', label: 'Waitlisted' },
  { value: 'enrolled', label: 'Enrolled' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'reach', label: 'Reach' },
  { value: 'target', label: 'Target' },
  { value: 'safety', label: 'Safety' },
];

export default function UniversityFilters({
  filters,
  onFilterChange,
  totalCount,
  filteredCount,
}: UniversityFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200 space-y-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 text-slate-700">
          <Filter className="h-5 w-5" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <span className="text-sm text-slate-500">
          {filteredCount} of {totalCount} universities
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="search"
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Search universities..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
