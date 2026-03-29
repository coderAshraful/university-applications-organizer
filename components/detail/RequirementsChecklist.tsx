'use client';

import { useState } from 'react';
import { Requirement } from '@/types';
import { CheckCircle2, Circle, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RequirementsChecklistProps {
  requirements: Requirement[];
  onToggle: (id: string) => void;
  onAdd: (title: string, notes?: string) => void;
  onEdit: (id: string, title: string, notes?: string) => void;
  onDelete: (id: string) => void;
}

export default function RequirementsChecklist({
  requirements,
  onToggle,
  onAdd,
  onEdit,
  onDelete,
}: RequirementsChecklistProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', notes: '' });

  const completedCount = requirements.filter(r => r.completed).length;
  const totalCount = requirements.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingId) {
      onEdit(editingId, formData.title, formData.notes || undefined);
      setEditingId(null);
    } else {
      onAdd(formData.title, formData.notes || undefined);
      setIsAdding(false);
    }
    setFormData({ title: '', notes: '' });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: '', notes: '' });
  };

  const startEdit = (requirement: Requirement) => {
    setEditingId(requirement.id);
    setFormData({ title: requirement.title, notes: requirement.notes || '' });
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Requirements</h2>
          <p className="text-sm text-slate-600 mt-1">
            {completedCount} of {totalCount} completed ({progressPercentage}%)
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Requirement
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className={cn(
            "h-3 rounded-full transition-all duration-500",
            progressPercentage === 100 ? "bg-green-500" :
            progressPercentage >= 50 ? "bg-blue-500" :
            "bg-orange-500"
          )}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-300 rounded-lg p-4 mb-4">
          <div className="space-y-3">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Requirement title"
              autoFocus
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
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

      {/* Requirements List */}
      <div className="space-y-2">
        {requirements.length === 0 ? (
          <p className="text-center text-slate-500 py-8">
            No requirements yet. Click &quot;Add Requirement&quot; to get started.
          </p>
        ) : (
          requirements.map((requirement) => (
            <div
              key={requirement.id}
              className={cn(
                "group flex items-start space-x-3 p-4 rounded-lg border transition-all",
                requirement.completed
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-slate-200 hover:border-slate-300"
              )}
            >
              {/* Checkbox */}
              <button
                onClick={() => onToggle(requirement.id)}
                className="flex-shrink-0 mt-0.5 focus:outline-none"
              >
                {requirement.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <Circle className="h-6 w-6 text-slate-400 group-hover:text-slate-600 transition-colors" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-medium",
                    requirement.completed
                      ? "text-green-700 line-through"
                      : "text-slate-900"
                  )}
                >
                  {requirement.title}
                </p>
                {requirement.notes && (
                  <p className="text-sm text-slate-600 mt-1">{requirement.notes}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex items-center space-x-1">
                <button
                  onClick={() => startEdit(requirement)}
                  className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(requirement.id)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
