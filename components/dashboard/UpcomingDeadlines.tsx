'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UpcomingDeadline } from '@/types';
import { Calendar, AlertCircle, Clock, ChevronRight } from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';

interface UpcomingDeadlinesProps {
  deadlines: UpcomingDeadline[];
}

type TimeRange = 7 | 14 | 30;

export default function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>(7);

  // Filter deadlines based on selected time range
  const filteredDeadlines = deadlines
    .filter(d => d.daysUntil <= timeRange)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const getDeadlineColor = (daysUntil: number) => {
    if (daysUntil < 0) return 'red'; // Overdue
    if (daysUntil <= 3) return 'red'; // Very urgent
    if (daysUntil <= 7) return 'orange'; // Urgent
    return 'blue'; // Normal
  };

  const colorClasses = {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-800',
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      badge: 'bg-orange-100 text-orange-800',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800',
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-slate-600" />
          <h2 className="text-2xl font-bold text-slate-900">Upcoming Deadlines</h2>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
          {([7, 14, 30] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                timeRange === range
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              {range} days
            </button>
          ))}
        </div>
      </div>

      {/* Deadlines List */}
      <div className="space-y-3">
        {filteredDeadlines.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No upcoming deadlines in the next {timeRange} days.</p>
            <p className="text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          filteredDeadlines.map((deadline) => {
            const color = getDeadlineColor(deadline.daysUntil);
            const classes = colorClasses[color];

            return (
              <Link
                key={deadline.id}
                href={`/universities/${deadline.universityId}`}
                className={cn(
                  "block p-4 rounded-lg border-2 transition-all hover:shadow-md group",
                  classes.bg,
                  classes.border
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* University Name */}
                    <h3 className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors mb-1">
                      {deadline.universityName}
                    </h3>

                    {/* Deadline Title */}
                    <p className="text-sm text-slate-700 mb-2">
                      {deadline.title}
                    </p>

                    {/* Date and Days Until */}
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="flex items-center text-slate-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(deadline.date)}</span>
                      </div>

                      <div className={cn("flex items-center font-semibold", classes.text)}>
                        {deadline.daysUntil < 0 ? (
                          <>
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>{Math.abs(deadline.daysUntil)} days overdue</span>
                          </>
                        ) : deadline.daysUntil === 0 ? (
                          <>
                            <AlertCircle className="h-4 w-4 mr-1 animate-pulse" />
                            <span>Today</span>
                          </>
                        ) : deadline.daysUntil === 1 ? (
                          <>
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>Tomorrow</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{deadline.daysUntil} days</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>

                {/* Type Badge */}
                <div className="mt-3">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                    classes.badge
                  )}>
                    {deadline.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* View All Link */}
      {filteredDeadlines.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <Link
            href="/timeline"
            className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center group"
          >
            View full timeline
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}
