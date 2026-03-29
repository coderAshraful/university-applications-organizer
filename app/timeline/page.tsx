'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UpcomingDeadline } from '@/types';
import { formatDate, cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Filter, Loader2, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TimelinePage() {
  const [deadlines, setDeadlines] = useState<UpcomingDeadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterType, setFilterType] = useState<string>('all');

  // Fetch deadlines
  useEffect(() => {
    async function fetchDeadlines() {
      try {
        const res = await fetch('/api/deadlines');
        const data = await res.json();

        if (data.data) {
          setDeadlines(data.data);
        }
      } catch (error) {
        console.error('Error fetching deadlines:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDeadlines();
  }, []);

  // Filter deadlines by type
  const filteredDeadlines = filterType === 'all'
    ? deadlines
    : deadlines.filter(d => d.type === filterType);

  // Get unique deadline types
  const deadlineTypes = Array.from(new Set(deadlines.map(d => d.type)));

  // Get deadlines for selected month
  const selectedMonth = selectedDate?.getMonth() ?? new Date().getMonth();
  const selectedYear = selectedDate?.getFullYear() ?? new Date().getFullYear();

  const monthDeadlines = filteredDeadlines.filter(d => {
    const deadlineDate = new Date(d.date);
    return deadlineDate.getMonth() === selectedMonth &&
           deadlineDate.getFullYear() === selectedYear;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get dates with deadlines for calendar highlighting
  const datesWithDeadlines = filteredDeadlines.map(d => {
    const date = new Date(d.date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  });

  const getDeadlineColor = (daysUntil: number) => {
    if (daysUntil < 0) return 'red';
    if (daysUntil <= 3) return 'red';
    if (daysUntil <= 7) return 'orange';
    return 'blue';
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

  const typeColors: Record<string, string> = {
    application: 'bg-red-500',
    financial_aid: 'bg-green-500',
    test: 'bg-blue-500',
    decision_notification: 'bg-purple-500',
    enrollment_deposit: 'bg-orange-500',
    other: 'bg-slate-500',
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">Timeline</h1>
          <p className="text-lg text-slate-600">
            View all your deadlines in one place
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View - Left Column */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                    <CalendarIcon className="h-6 w-6 mr-2 text-orange-500" />
                    Calendar View
                  </h2>

                  {/* Type Filter */}
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-slate-600" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      {deadlineTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Calendar */}
                <div className="flex justify-center mb-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      hasDeadline: datesWithDeadlines,
                    }}
                    modifiersStyles={{
                      hasDeadline: {
                        fontWeight: 'bold',
                        backgroundColor: '#fed7aa',
                        borderRadius: '50%',
                      },
                    }}
                  />
                </div>

                {/* Legend */}
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Legend</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(typeColors).map(([type, color]) => (
                      <div key={type} className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${color}`}></div>
                        <span className="text-xs text-slate-600">
                          {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Deadlines List - Right Column */}
            <div>
              <Card className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  {selectedDate
                    ? `Deadlines in ${selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                    : 'All Deadlines'}
                </h2>

                {/* Empty State */}
                {monthDeadlines.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No deadlines this month</p>
                  </div>
                )}

                {/* Deadlines List */}
                <div className="space-y-3">
                  {monthDeadlines.map((deadline) => {
                    const color = getDeadlineColor(deadline.daysUntil);
                    const classes = colorClasses[color];

                    return (
                      <Link
                        key={deadline.id}
                        href={`/universities/${deadline.universityId}`}
                        className={cn(
                          'block p-4 rounded-lg border-2 transition-all hover:shadow-md group',
                          classes.bg,
                          classes.border
                        )}
                      >
                        {/* Date Badge */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-slate-600">
                            {formatDate(deadline.date)}
                          </div>
                          {deadline.daysUntil <= 7 && deadline.daysUntil >= 0 && (
                            <div className={cn('flex items-center text-xs font-semibold', classes.text)}>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {deadline.daysUntil === 0 ? 'Today' : `${deadline.daysUntil}d`}
                            </div>
                          )}
                        </div>

                        {/* University Name */}
                        <h3 className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors mb-1">
                          {deadline.universityName}
                        </h3>

                        {/* Deadline Title */}
                        <p className="text-sm text-slate-700 mb-2">
                          {deadline.title}
                        </p>

                        {/* Type Badge */}
                        <div className="flex items-center justify-between">
                          <Badge
                            className={cn('text-xs', classes.badge)}
                          >
                            {deadline.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* View All Button */}
                {monthDeadlines.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedDate(new Date())}
                    >
                      View Current Month
                    </Button>
                  </div>
                )}
              </Card>

              {/* Stats Card */}
              <Card className="p-6 mt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Deadlines:</span>
                    <span className="font-semibold text-slate-900">{deadlines.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">This Month:</span>
                    <span className="font-semibold text-slate-900">{monthDeadlines.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Urgent (≤7 days):</span>
                    <span className="font-semibold text-red-700">
                      {deadlines.filter(d => d.daysUntil >= 0 && d.daysUntil <= 7).length}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State - No Deadlines at All */}
        {!loading && deadlines.length === 0 && (
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                No Deadlines Yet
              </h2>
              <p className="text-slate-600 mb-6">
                Add universities and deadlines to see them on your timeline.
              </p>
              <Link href="/universities">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Go to Universities
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
