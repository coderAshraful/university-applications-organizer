'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { University } from '@/types';
import UniversityCard from '@/components/universities/UniversityCard';
import UniversityFilters from '@/components/universities/UniversityFilters';
import UniversityForm from '@/components/universities/UniversityForm';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';

function UniversitiesContent() {
  const searchParams = useSearchParams();
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
  });

  // Check if should auto-open modal or apply status filter
  useEffect(() => {
    const shouldAdd = searchParams.get('add');
    const statusFilter = searchParams.get('status');

    if (shouldAdd === 'true') {
      setIsFormOpen(true);
    }

    if (statusFilter) {
      setFilters((prev) => ({ ...prev, status: statusFilter }));
    }
  }, [searchParams]);

  // Fetch universities
  useEffect(() => {
    async function fetchUniversities() {
      try {
        const res = await fetch('/api/universities');
        const data = await res.json();

        if (data.data) {
          setUniversities(data.data);
          setFilteredUniversities(data.data);
        }
      } catch (error) {
        console.error('Error fetching universities:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUniversities();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...universities];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (uni) =>
          uni.name.toLowerCase().includes(searchLower) ||
          uni.location.toLowerCase().includes(searchLower) ||
          uni.program.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((uni) => uni.status === filters.status);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter((uni) => uni.category === filters.category);
    }

    setFilteredUniversities(filtered);
  }, [filters, universities]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleAddUniversity = async (universityData: Partial<University>) => {
    try {
      const res = await fetch('/api/universities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(universityData),
      });

      const data = await res.json();

      if (data.data) {
        setUniversities([...universities, data.data]);
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error('Error adding university:', error);
    }
  };

  const handleDeleteUniversity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this university?')) {
      return;
    }

    try {
      await fetch(`/api/universities/${id}`, {
        method: 'DELETE',
      });

      setUniversities(universities.filter((uni) => uni.id !== id));
    } catch (error) {
      console.error('Error deleting university:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Universities</h1>
            <p className="text-lg text-slate-600">
              Browse and manage your university applications
            </p>
          </div>

          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add University
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <UniversityFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            totalCount={universities.length}
            filteredCount={filteredUniversities.length}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        )}

        {/* Empty State */}
        {!loading && universities.length === 0 && (
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🏫</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                No Universities Yet
              </h2>
              <p className="text-slate-600 mb-6">
                Start building your university list by adding your first application.
              </p>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First University
              </Button>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && universities.length > 0 && filteredUniversities.length === 0 && (
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                No Results Found
              </h2>
              <p className="text-slate-600 mb-6">
                Try adjusting your filters or search terms.
              </p>
              <Button
                onClick={() =>
                  setFilters({ search: '', status: 'all', category: 'all' })
                }
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Universities Grid */}
        {!loading && filteredUniversities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((university) => (
              <UniversityCard
                key={university.id}
                university={university}
                onDelete={handleDeleteUniversity}
              />
            ))}
          </div>
        )}

        {/* Add University Form */}
        <UniversityForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleAddUniversity}
        />
      </div>
    </main>
  );
}

export default function UniversitiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>}>
      <UniversitiesContent />
    </Suspense>
  );
}
