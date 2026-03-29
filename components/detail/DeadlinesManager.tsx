'use client';

import { useState } from 'react';
import { Deadline } from '@/types';
import { Calendar, Plus, Pencil, Trash2, X, Check, Clock, AlertCircle } from 'lucide-react';
import { cn, formatDate, getDaysUntil } from '@/lib/utils';

interface DeadlineFormData {
  title: string;
  date: Date;
  type: string;
  description?: string;
  completed?: boolean;
}

interface DeadlinesManagerProps {
  deadlines: Deadline[];
  onAdd: (deadline: DeadlineFormData) => void;
  onEdit: (id: string, deadline: Partial<DeadlineFormData>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const deadlineTypes = [
  { value: 'application', label: 'Application' },
  { value: 'financial-aid', label: 'Financial Aid' },
  { value: 'document', label: 'Document' },
  { value: 'interview', label: 'Interview' },
  { value: 'decision', label: 'Decision' },
  { value: 'other', label: 'Other' },
] as const;

export default function DeadlinesManager({
  deadlines,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
}: DeadlinesManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    type: 'application' as Deadline['type'],
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date) return;

    const deadlineData = {
      title: formData.title,
      date: new Date(formData.date),
      type: formData.type,
      notes: formData.notes || undefined,
      completed: false,
    };

    if (editingId) {
      onEdit(editingId, deadlineData);
      setEditingId(null);
    } else {
      onAdd(deadlineData);
      setIsAdding(false);
    }
    setFormData({ title: '', date: '', type: 'application', notes: '' });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: '', date: '', type: 'application', notes: '' });
  };

  const startEdit = (deadline: Deadline) => {
    setEditingId(deadline.id);
    const dateObj = typeof deadline.date === 'string' ? new Date(deadline.date) : deadline.date;
    setFormData({
      title: deadline.title,
      date: dateObj.toISOString().split('T')[0],
      type: deadline.type,
      notes: deadline.notes || '',
    });
    setIsAdding(false);
  };

  // Sort deadlines: incomplete first, then by date
  const sortedDeadlines = [...deadlines].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
    const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
    return dateA.getTime() - dateB.getTime();
  });

  const now = new Date();
  const upcomingDeadlines = deadlines.filter(d => {
    const deadlineDate = typeof d.date === 'string' ? new Date(d.date) : d.date;
    return !d.completed && deadlineDate >= now;
  });
  const pastDeadlines = deadlines.filter(d => {
    const deadlineDate = typeof d.date === 'string' ? new Date(d.date) : d.date;
    return !d.completed && deadlineDate < now;
  });

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Deadlines</h2>
          <p className="text-sm text-slate-600 mt-1">
            {upcomingDeadlines.length} upcoming
            {pastDeadlines.length > 0 && `, ${pastDeadlines.length} overdue`}
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Deadline
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-300 rounded-lg p-4 mb-4">
          <div className="space-y-3">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Deadline title"
              autoFocus
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Deadline['type'] }))}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                {deadlineTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes (optional)"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Check className="h-5 w-5" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Deadlines List */}
      <div className="space-y-2">
        {deadlines.length === 0 ? (
          <p className="text-center text-slate-500 py-8">
            No deadlines yet. Click &quot;Add Deadline&quot; to get started.
          </p>
        ) : (
          sortedDeadlines.map((deadline) => {
            const daysUntil = getDaysUntil(deadline.date);
            const isOverdue = daysUntil < 0 && !deadline.completed;
            const isUrgent = daysUntil >= 0 && daysUntil <= 7 && !deadline.completed;

            return (
              <div
                key={deadline.id}
                className={cn(
                  "group flex items-start space-x-3 p-4 rounded-lg border transition-all",
                  deadline.completed
                    ? "bg-green-50 border-green-200"
                    : isOverdue
                    ? "bg-red-50 border-red-200"
                    : isUrgent
                    ? "bg-orange-50 border-orange-200"
                    : "bg-white border-slate-200 hover:border-slate-300"
                )}
              >
                {/* Checkbox */}
                <button
                  onClick={() => onToggle(deadline.id)}
                  className="flex-shrink-0 mt-0.5 focus:outline-none"
                >
                  <div
                    className={cn(
                      "h-6 w-6 rounded border-2 flex items-center justify-center transition-all",
                      deadline.completed
                        ? "bg-green-600 border-green-600"
                        : "border-slate-300 hover:border-slate-400"
                    )}
                  >
                    {deadline.completed && <Check className="h-4 w-4 text-white" />}
                  </div>
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p
                      className={cn(
                        "font-medium",
                        deadline.completed
                          ? "text-green-700 line-through"
                          : "text-slate-900"
                      )}
                    >
                      {deadline.title}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                      {deadlineTypes.find(t => t.value === deadline.type)?.label}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-slate-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(deadline.date)}</span>
                    </div>
                    {!deadline.completed && (
                      <div
                        className={cn(
                          "flex items-center",
                          isOverdue ? "text-red-600 font-semibold" :
                          isUrgent ? "text-orange-600 font-semibold" :
                          "text-slate-600"
                        )}
                      >
                        {isOverdue ? (
                          <>
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>{Math.abs(daysUntil)} days overdue</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {daysUntil === 0 ? 'Today' :
                               daysUntil === 1 ? 'Tomorrow' :
                               `${daysUntil} days`}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {deadline.notes && (
                    <p className="text-sm text-slate-600 mt-2">{deadline.notes}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(deadline)}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(deadline.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
