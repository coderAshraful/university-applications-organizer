'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { University, Requirement, Deadline } from '@/types';
import UniversityHeader from '@/components/detail/UniversityHeader';
import RequirementsChecklist from '@/components/detail/RequirementsChecklist';
import DeadlinesManager from '@/components/detail/DeadlinesManager';
import NotesSection from '@/components/detail/NotesSection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Loader2, DollarSign, GraduationCap, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch university data
  useEffect(() => {
    async function fetchUniversity() {
      try {
        const res = await fetch(`/api/universities/${id}`);
        const data = await res.json();

        if (data.data) {
          setUniversity(data.data);
        } else {
          setError(data.error || 'University not found');
        }
      } catch (err) {
        setError('Failed to load university');
      } finally {
        setLoading(false);
      }
    }

    fetchUniversity();
  }, [id]);

  // Update university field
  const handleUpdateField = async (field: string, value: any) => {
    if (!university) return;

    try {
      const res = await fetch(`/api/universities/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });

      const data = await res.json();

      if (data.data) {
        setUniversity(data.data);
      }
    } catch (error) {
      console.error('Error updating university:', error);
    }
  };

  // Delete university
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this university?')) {
      return;
    }

    try {
      await fetch(`/api/universities/${id}`, {
        method: 'DELETE',
      });

      router.push('/universities');
    } catch (error) {
      console.error('Error deleting university:', error);
    }
  };

  // Requirements handlers
  const handleToggleRequirement = async (reqId: string) => {
    if (!university) return;

    const requirement = university.requirements?.find((r) => r.id === reqId);
    if (!requirement) return;

    try {
      const res = await fetch(`/api/requirements/${reqId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !requirement.completed }),
      });

      const data = await res.json();

      if (data.data) {
        setUniversity({
          ...university,
          requirements: university.requirements?.map((r) =>
            r.id === reqId ? data.data : r
          ),
        });
      }
    } catch (error) {
      console.error('Error toggling requirement:', error);
    }
  };

  const handleAddRequirement = async (title: string, notes?: string) => {
    if (!university) return;

    try {
      const res = await fetch('/api/requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          universityId: id,
          title,
          notes,
          type: 'other',
        }),
      });

      const data = await res.json();

      if (data.data) {
        setUniversity({
          ...university,
          requirements: [...(university.requirements || []), data.data],
        });
      }
    } catch (error) {
      console.error('Error adding requirement:', error);
    }
  };

  const handleEditRequirement = async (reqId: string, title: string, notes?: string) => {
    if (!university) return;

    try {
      const res = await fetch(`/api/requirements/${reqId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, notes }),
      });

      const data = await res.json();

      if (data.data) {
        setUniversity({
          ...university,
          requirements: university.requirements?.map((r) =>
            r.id === reqId ? data.data : r
          ),
        });
      }
    } catch (error) {
      console.error('Error editing requirement:', error);
    }
  };

  const handleDeleteRequirement = async (reqId: string) => {
    if (!university) return;

    try {
      await fetch(`/api/requirements/${reqId}`, {
        method: 'DELETE',
      });

      setUniversity({
        ...university,
        requirements: university.requirements?.filter((r) => r.id !== reqId),
      });
    } catch (error) {
      console.error('Error deleting requirement:', error);
    }
  };

  // Deadlines handlers
  const handleAddDeadline = async (deadline: Partial<Deadline>) => {
    if (!university) return;

    try {
      const res = await fetch('/api/deadlines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...deadline,
          universityId: id,
        }),
      });

      const data = await res.json();

      if (data.data) {
        setUniversity({
          ...university,
          deadlines: [...(university.deadlines || []), data.data],
        });
      }
    } catch (error) {
      console.error('Error adding deadline:', error);
    }
  };

  const handleEditDeadline = async (deadlineId: string, deadline: Partial<Deadline>) => {
    if (!university) return;

    try {
      const res = await fetch(`/api/deadlines/${deadlineId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deadline),
      });

      const data = await res.json();

      if (data.data) {
        setUniversity({
          ...university,
          deadlines: university.deadlines?.map((d) =>
            d.id === deadlineId ? data.data : d
          ),
        });
      }
    } catch (error) {
      console.error('Error editing deadline:', error);
    }
  };

  const handleDeleteDeadline = async (deadlineId: string) => {
    if (!university) return;

    try {
      await fetch(`/api/deadlines/${deadlineId}`, {
        method: 'DELETE',
      });

      setUniversity({
        ...university,
        deadlines: university.deadlines?.filter((d) => d.id !== deadlineId),
      });
    } catch (error) {
      console.error('Error deleting deadline:', error);
    }
  };

  const handleToggleDeadline = async (deadlineId: string) => {
    if (!university) return;

    const deadline = university.deadlines?.find((d) => d.id === deadlineId);
    if (!deadline) return;

    try {
      const res = await fetch(`/api/deadlines/${deadlineId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !deadline.completed }),
      });

      const data = await res.json();

      if (data.data) {
        setUniversity({
          ...university,
          deadlines: university.deadlines?.map((d) =>
            d.id === deadlineId ? data.data : d
          ),
        });
      }
    } catch (error) {
      console.error('Error toggling deadline:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  // Error state
  if (error || !university) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-12 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              University Not Found
            </h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <Link href="/universities">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Universities
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/universities">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Universities
            </Button>
          </Link>
        </div>

        {/* University Header */}
        <UniversityHeader
          university={university}
          onUpdate={handleUpdateField}
          onDelete={handleDelete}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-orange-500" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Location:</span>
                  <p className="font-medium text-slate-900">{university.location}</p>
                </div>
                <div>
                  <span className="text-slate-600">Program:</span>
                  <p className="font-medium text-slate-900">{university.program}</p>
                </div>
                {university.ranking && (
                  <div>
                    <span className="text-slate-600">Ranking:</span>
                    <p className="font-medium text-slate-900">#{university.ranking}</p>
                  </div>
                )}
                {university.acceptanceRate && (
                  <div>
                    <span className="text-slate-600">Acceptance Rate:</span>
                    <p className="font-medium text-slate-900">
                      {(university.acceptanceRate * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Requirements */}
            <Card className="p-6">
              <RequirementsChecklist
                requirements={university.requirements || []}
                onToggle={handleToggleRequirement}
                onAdd={handleAddRequirement}
                onEdit={handleEditRequirement}
                onDelete={handleDeleteRequirement}
              />
            </Card>

            {/* Notes */}
            <Card className="p-6">
              <NotesSection
                notes={university.notes || ''}
                onSave={(notes) => handleUpdateField('notes', notes)}
              />
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Deadlines */}
            <DeadlinesManager
              deadlines={university.deadlines || []}
              onAdd={handleAddDeadline}
              onEdit={handleEditDeadline}
              onDelete={handleDeleteDeadline}
              onToggle={handleToggleDeadline}
            />

            {/* Financial Info */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                Financial Information
              </h2>
              <div className="space-y-3 text-sm">
                {university.tuition && (
                  <div>
                    <span className="text-slate-600">Tuition:</span>
                    <p className="font-medium text-slate-900">
                      ${university.tuition.toLocaleString()}/year
                    </p>
                  </div>
                )}
                {university.applicationFee && (
                  <div>
                    <span className="text-slate-600">Application Fee:</span>
                    <p className="font-medium text-slate-900">
                      ${university.applicationFee}
                    </p>
                  </div>
                )}
                {university.estimatedCostOfLiving && (
                  <div>
                    <span className="text-slate-600">Est. Cost of Living:</span>
                    <p className="font-medium text-slate-900">
                      ${university.estimatedCostOfLiving.toLocaleString()}/year
                    </p>
                  </div>
                )}
                {university.scholarshipNotes && (
                  <div>
                    <span className="text-slate-600">Scholarship Notes:</span>
                    <p className="text-slate-900">{university.scholarshipNotes}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
