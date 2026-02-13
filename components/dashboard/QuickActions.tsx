'use client';

import { Plus, School, Calendar, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
  const actions = [
    {
      label: 'Add University',
      description: 'Add a new university to track',
      icon: Plus,
      color: 'bg-orange-500 hover:bg-orange-600',
      href: '/universities?add=true',
    },
    {
      label: 'View All Universities',
      description: 'Browse and manage universities',
      icon: School,
      color: 'bg-blue-500 hover:bg-blue-600',
      href: '/universities',
    },
    {
      label: 'Timeline',
      description: 'View deadlines and schedule',
      icon: Calendar,
      color: 'bg-purple-500 hover:bg-purple-600',
      href: '/timeline',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          const content = (
            <div
              className={`${action.color} text-white rounded-lg p-6 transition-all hover:shadow-lg cursor-pointer group`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-all">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">{action.label}</h3>
              </div>
              <p className="text-white text-opacity-90 text-sm">
                {action.description}
              </p>
            </div>
          );

          return (
            <Link key={action.label} href={action.href}>
              {content}
            </Link>
          );
        })}
      </div>

      {/* Additional Info Section */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-slate-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Pro Tip</h4>
              <p className="text-xs text-slate-600">
                Organize universities into Reach, Target, and Safety categories to build a balanced application list.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
            <FileText className="h-5 w-5 text-slate-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Stay Organized</h4>
              <p className="text-xs text-slate-600">
                Track deadlines, requirements, and notes for each university to stay on top of your applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
