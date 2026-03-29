'use client';

import { useState, useEffect } from 'react';
import { FileText, Save, X } from 'lucide-react';

interface NotesSectionProps {
  notes: string;
  onSave: (notes: string) => void;
}

export default function NotesSection({ notes, onSave }: NotesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedNotes(notes);
  }, [notes]);

  useEffect(() => {
    setHasChanges(editedNotes !== notes);
  }, [editedNotes, notes]);

  const handleSave = () => {
    onSave(editedNotes);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setEditedNotes(notes);
    setIsEditing(false);
    setHasChanges(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-slate-600" />
          <h2 className="text-2xl font-bold text-slate-900">Notes</h2>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                <X className="h-4 w-4 inline mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 inline mr-2" />
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Notes Content */}
      {isEditing ? (
        <div>
          <textarea
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-y font-mono text-sm"
            placeholder="Add notes about this university...&#10;&#10;You can include:&#10;- Research notes&#10;- Essay ideas&#10;- Visit impressions&#10;- Financial considerations&#10;- Contact information&#10;- Anything else you want to remember"
          />
          <p className="text-sm text-slate-500 mt-2">
            {editedNotes.length} characters
          </p>
        </div>
      ) : (
        <div className="min-h-[200px]">
          {notes ? (
            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-wrap text-slate-700">{notes}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-slate-400">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No notes yet. Click &quot;Edit&quot; to add notes.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
