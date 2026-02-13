'use client';

import { University, ApplicationStatus, UniversityCategory } from '@/types';
import { MapPin, ExternalLink, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface UniversityHeaderProps {
  university: University;
  onUpdate: (field: string, value: any) => void;
  onDelete: () => void;
}

const statusOptions: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: 'not-started', label: 'Not Started', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'submitted', label: 'Submitted', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { value: 'accepted', label: 'Accepted', color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 'waitlisted', label: 'Waitlisted', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
];

const categoryOptions: { value: UniversityCategory; label: string; color: string }[] = [
  { value: 'safety', label: 'Safety', color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'target', label: 'Target', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'reach', label: 'Reach', color: 'bg-red-100 text-red-700 border-red-300' },
];

export default function UniversityHeader({
  university,
  onUpdate,
  onDelete,
}: UniversityHeaderProps) {
  const { name, location, status, category, websiteUrl, notes } = university;

  const currentStatus = statusOptions.find(opt => opt.value === status);
  const currentCategory = categoryOptions.find(opt => opt.value === category);

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    onUpdate('status', newStatus);
  };

  const handleCategoryChange = (newCategory: UniversityCategory) => {
    onUpdate('category', newCategory);
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <Link
          href="/universities"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Universities
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left Side: Name and Location */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{name}</h1>
            <div className="flex items-center text-slate-600 mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="text-lg">{location}</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </a>
              )}
              <button
                onClick={onDelete}
                className="inline-flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm font-medium"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete University
              </button>
            </div>
          </div>

          {/* Right Side: Status and Category Selectors */}
          <div className="flex flex-col gap-4 lg:min-w-[300px]">
            {/* Status Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Application Status
              </label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
                className={cn(
                  "w-full px-4 py-2.5 rounded-lg border-2 font-semibold transition-all cursor-pointer text-sm",
                  currentStatus?.color
                )}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category
              </label>
              <select
                value={category || 'target'}
                onChange={(e) => handleCategoryChange(e.target.value as UniversityCategory)}
                className={cn(
                  "w-full px-4 py-2.5 rounded-lg border-2 font-semibold transition-all cursor-pointer text-sm",
                  currentCategory?.color
                )}
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
      </div>
    </div>
  );
}
