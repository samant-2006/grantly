import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, ArrowRight, Sparkles, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '@/store/AppContext';
import ScholarshipCard from '@/components/scholarship/ScholarshipCard';
import { generateId } from '@/lib/utils';
import type { Application, ChecklistItem, Scholarship } from '@/types';

export default function Saved() {
  const { state, dispatch, getMatch, getApplication } = useApp();
  const { savedScholarshipIds, scholarships } = state;
  const navigate = useNavigate();

  // Get saved scholarship objects
  const savedScholarships = useMemo(() => {
    return scholarships
      .filter((s) => savedScholarshipIds.includes(s.id))
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }, [scholarships, savedScholarshipIds]);

  const handleStartApplication = (scholarship: Scholarship) => {
    const existing = getApplication(scholarship.id);
    if (existing) {
      navigate('/applications');
      return;
    }

    const checklist: ChecklistItem[] = scholarship.requiredDocuments.map((doc, idx) => ({
      id: `chk-${generateId()}-${idx}`,
      label: doc,
      completed: false,
    }));

    const newApp: Application = {
      id: `app-${generateId()}`,
      scholarshipId: scholarship.id,
      status: 'Preparing',
      dateAdded: new Date().toISOString(),
      submissionDate: null,
      notes: '',
      checklist,
      lastUpdated: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_APPLICATION', payload: newApp });
    toast.success(`Started application for ${scholarship.title}`);
    navigate('/applications');
  };

  const handleClearAllSaved = () => {
    if (window.confirm('Are you sure you want to clear all saved scholarships?')) {
      savedScholarshipIds.forEach((id) => {
        dispatch({ type: 'TOGGLE_SAVE_SCHOLARSHIP', payload: id });
      });
      toast.success('Saved list cleared');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Saved Scholarships
          </h1>
          <p className="text-sm text-secondary mt-1">
            Shortlist and bookmark opportunities to research further or move into your preparation pipeline.
          </p>
        </div>

        {savedScholarships.length > 0 && (
          <button
            onClick={handleClearAllSaved}
            className="btn-secondary text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 self-start sm:self-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Shortlist</span>
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {savedScholarships.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {savedScholarships.map((scholarship) => {
              const matchResult = getMatch(scholarship);
              return (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  matchResult={matchResult}
                  onViewDetails={(id) => navigate(`/scholarship/${id}`)}
                  onStartApplication={handleStartApplication}
                  showStartApp
                />
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="card p-12 text-center max-w-md mx-auto my-12 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 fill-rose-100" />
          </div>
          <h3 className="text-base font-semibold text-primary mb-1">Your shortlist is empty</h3>
          <p className="text-xs text-secondary mb-6 leading-relaxed">
            As you explore scholarships, click the heart icon on any card to save opportunities here for quick review.
          </p>
          <Link to="/discover" className="btn-primary text-xs">
            <Search className="h-3.5 w-3.5 mr-1" />
            <span>Explore Opportunities</span>
          </Link>
        </div>
      )}
    </div>
  );
}
