'use client';

import { useState, useEffect } from 'react';
import { University, ApplicationStatus, UniversityCategory } from '@/types';
import { X, Search, Loader2, School } from 'lucide-react';

interface UniversityFormProps {
  isOpen: boolean;
  university?: University;
  onSave: (data: Partial<University>) => void;
  onClose: () => void;
}

interface CollegeSearchResult {
  id: string;
  name: string;
  city: string;
  state: string;
  website: string;
  country?: string;
}

export default function UniversityForm({ isOpen, university, onSave, onClose }: UniversityFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    program: '',
    status: 'considering' as ApplicationStatus,
    category: 'target' as UniversityCategory,
    websiteUrl: '',
    notes: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CollegeSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (university) {
        setFormData({
          name: university.name || '',
          location: university.location || '',
          program: university.program || '',
          status: university.status || 'considering',
          category: university.category || 'target',
          websiteUrl: university.websiteUrl || '',
          notes: university.notes || '',
        });
      } else {
        setFormData({
          name: '',
          location: '',
          program: '',
          status: 'considering',
          category: 'target',
          websiteUrl: '',
          notes: '',
        });
      }
      setSearchQuery('');
      setSearchResults([]);
      setShowResults(false);
    }
  }, [isOpen, university]);

  // Search for universities
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);
    setShowResults(true);

    try {
      const res = await fetch(`/api/search-universities?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.data) {
        setSearchResults(data.data);
      }
    } catch (error) {
      console.error('Error searching universities:', error);
    } finally {
      setSearching(false);
    }
  };

  // Select a university from search results
  const handleSelectUniversity = (result: CollegeSearchResult) => {
    setFormData({
      ...formData,
      name: result.name,
      location: `${result.city}, ${result.state}`,
      websiteUrl: result.website,
    });
    setSearchQuery(result.name);
    setShowResults(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-slate-900">
            {university ? 'Edit University' : 'Add New University'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            type="button"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* University Search */}
          {!university && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <School className="inline h-4 w-4 mr-1" />
                Search Universities
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for a university..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                  {searching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500 animate-spin" />
                  )}
                </div>

                {/* Search Results */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute z-20 mt-2 w-full bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => handleSelectUniversity(result)}
                        className="w-full text-left px-4 py-3 hover:bg-orange-50 border-b border-slate-100 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900">{result.name}</div>
                            <div className="text-sm text-slate-600">
                              {result.city}{result.city && result.state ? ', ' : ''}{result.state}
                            </div>
                          </div>
                          {result.country && (
                            <div className="ml-2">
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {result.country === 'United States' ? '🇺🇸 US' : `🌍 ${result.country}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {showResults && searchResults.length === 0 && !searching && searchQuery.length >= 2 && (
                  <div className="absolute z-20 mt-2 w-full bg-white border border-slate-300 rounded-lg shadow-lg p-4 text-center text-slate-500">
                    No universities found. Enter manually below.
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Or enter the information manually below
              </p>
            </div>
          )}

          {/* University Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
              University Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Stanford University"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Stanford, CA"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Program */}
          <div>
            <label htmlFor="program" className="block text-sm font-semibold text-slate-700 mb-2">
              Program <span className="text-red-500">*</span>
            </label>
            <input
              id="program"
              name="program"
              type="text"
              required
              value={formData.program}
              onChange={handleChange}
              placeholder="e.g., Computer Science"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Status and Category - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-2">
                Application Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
              >
                <option value="considering">Considering</option>
                <option value="applied">Applied</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="waitlisted">Waitlisted</option>
                <option value="enrolled">Enrolled</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
              >
                <option value="safety">Safety</option>
                <option value="target">Target</option>
                <option value="reach">Reach</option>
              </select>
            </div>
          </div>

          {/* Website */}
          <div>
            <label htmlFor="websiteUrl" className="block text-sm font-semibold text-slate-700 mb-2">
              Website
            </label>
            <input
              id="websiteUrl"
              name="websiteUrl"
              type="url"
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder="https://www.university.edu"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-slate-700 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Why are you interested in this university?"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              {university ? 'Update' : 'Add'} University
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
