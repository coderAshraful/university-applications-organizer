'use client';

import Link from 'next/link';
import { University } from '@/types';
import { cn, formatDate, getProgressPercentage } from '@/lib/utils';
import { MapPin, Calendar, CheckCircle2, Clock } from 'lucide-react';

interface UniversityCardProps {
  university: University;
  onDelete?: (id: string) => void;
}

const statusColors: Record<string, string> = {
  'not-started': 'bg-slate-100 text-slate-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'submitted': 'bg-purple-100 text-purple-700',
  'accepted': 'bg-green-100 text-green-700',
  'rejected': 'bg-red-100 text-red-700',
  'waitlisted': 'bg-yellow-100 text-yellow-700',
  'considering': 'bg-slate-100 text-slate-700',
  'applied': 'bg-purple-100 text-purple-700',
  'enrolled': 'bg-green-100 text-green-700',
};

const statusLabels: Record<string, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'submitted': 'Submitted',
  'accepted': 'Accepted',
  'rejected': 'Rejected',
  'waitlisted': 'Waitlisted',
  'considering': 'Considering',
  'applied': 'Applied',
  'enrolled': 'Enrolled',
};

const categoryColors: Record<string, string> = {
  'reach': 'bg-red-50 text-red-700 border-red-200',
  'target': 'bg-blue-50 text-blue-700 border-blue-200',
  'safety': 'bg-green-50 text-green-700 border-green-200',
};

const categoryLabels: Record<string, string> = {
  'reach': 'Reach',
  'target': 'Target',
  'safety': 'Safety',
};

export default function UniversityCard({ university, onDelete }: UniversityCardProps) {
  const completedRequirements = university.requirements?.filter(r => r.completed).length || 0;
  const totalRequirements = university.requirements?.length || 0;
  const progressPercentage = getProgressPercentage(completedRequirements, totalRequirements);

  // Find next upcoming deadline
  const now = new Date();
  const upcomingDeadlines = (university.deadlines || [])
    .filter(d => !d.completed && d.date >= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  const nextDeadline = upcomingDeadlines[0];

  return (
    <Link
      href={`/universities/${university.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border border-slate-200 hover:border-orange-300 overflow-hidden group"
    >
      {/* Header with colored stripe */}
      <div className={cn(
        "h-2",
        university.category === 'reach' ? 'bg-gradient-to-r from-red-400 to-red-600' :
        university.category === 'target' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
        'bg-gradient-to-r from-green-400 to-green-600'
      )} />

      <div className="p-6">
        {/* University Name and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
            {university.name}
          </h3>
          <div className="flex items-center mt-1 text-sm text-slate-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{university.location}</span>
          </div>
        </div>

        {/* Status and Category Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
            statusColors[university.status]
          )}>
            {statusLabels[university.status]}
          </span>
          {university.category && (
            <span className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
              categoryColors[university.category]
            )}>
              {categoryLabels[university.category]}
            </span>
          )}
        </div>

        {/* Next Deadline */}
        {nextDeadline && (
          <div className="flex items-start space-x-2 mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <Calendar className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-orange-900">Next Deadline</p>
              <p className="text-sm text-orange-800 truncate">{nextDeadline.title}</p>
              <p className="text-xs text-orange-600 mt-0.5">{formatDate(nextDeadline.date)}</p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-slate-700">
              <CheckCircle2 className="h-4 w-4 mr-1 text-slate-500" />
              <span className="font-medium">Requirements</span>
            </div>
            <span className="text-slate-600">
              {completedRequirements}/{totalRequirements}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={cn(
                "h-2.5 rounded-full transition-all duration-500",
                progressPercentage === 100 ? "bg-green-500" :
                progressPercentage >= 50 ? "bg-blue-500" :
                "bg-orange-500"
              )}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 text-right">
            {progressPercentage}% complete
          </p>
        </div>
      </div>
    </Link>
  );
}
