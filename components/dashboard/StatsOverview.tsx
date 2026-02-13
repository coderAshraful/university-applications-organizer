'use client';

import { DashboardStats } from '@/types';
import { School, FileText, CheckCircle, XCircle, Clock, GraduationCap } from 'lucide-react';

interface StatsOverviewProps {
  stats: DashboardStats;
}

const statCards = [
  {
    key: 'total' as keyof DashboardStats,
    label: 'Total Universities',
    icon: School,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  {
    key: 'considering' as keyof DashboardStats,
    label: 'Considering',
    icon: FileText,
    color: 'bg-slate-500',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
  },
  {
    key: 'applied' as keyof DashboardStats,
    label: 'Applied',
    icon: Clock,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  {
    key: 'accepted' as keyof DashboardStats,
    label: 'Accepted',
    icon: CheckCircle,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
  {
    key: 'waitlisted' as keyof DashboardStats,
    label: 'Waitlisted',
    icon: Clock,
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
  },
  {
    key: 'rejected' as keyof DashboardStats,
    label: 'Rejected',
    icon: XCircle,
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
  },
  {
    key: 'enrolled' as keyof DashboardStats,
    label: 'Enrolled',
    icon: GraduationCap,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
  },
];

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = stats[card.key];

          return (
            <div
              key={card.key}
              className="bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
                <span className="text-3xl font-bold text-slate-900">{value}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">{card.label}</h3>
              {card.key !== 'total' && stats.total > 0 && (
                <p className="text-xs text-slate-500 mt-1">
                  {Math.round((value / stats.total) * 100)}% of total
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
