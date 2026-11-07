import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Calendar,
  DollarSign,
  GraduationCap,
  BookOpen,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ClipboardList,
  ShieldAlert,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '@/store/AppContext';
import { cn, formatCurrency, formatDate, daysUntil, deadlineUrgency, generateId } from '@/lib/utils';
import MatchBadge from '@/components/scholarship/MatchBadge';
import type { Application, ChecklistItem } from '@/types';

export default function ScholarshipDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getScholarship, getMatch, isSaved, getApplication, dispatch } = useApp();

  const scholarship = id ? getScholarship(id) : undefined;

  if (!scholarship) {
    return (
      <div className="card p-12 text-center max-w-lg mx-auto my-12">
        <h2 className="text-xl font-bold text-primary mb-2">Scholarship Not Found</h2>
        <p className="text-sm text-secondary mb-6">
          The scholarship opportunity you are looking for does not exist or may have been removed.
        </p>
        <Link to="/discover" className="btn-primary text-xs">
          Back to Discover
        </Link>
      </div>
    );
  }

  const match = getMatch(scholarship);
  const saved = isSaved(scholarship.id);
  const application = getApplication(scholarship.id);
  const days = daysUntil(scholarship.deadline);
  const urgency = deadlineUrgency(scholarship.deadline);

  const handleToggleSave = () => {
    dispatch({ type: 'TOGGLE_SAVE_SCHOLARSHIP', payload: scholarship.id });
    if (!saved) {
      toast.success('Saved to your favorites');
    } else {
      toast('Removed from saved list', { icon: 'ℹ️' });
    }
  };

  const handleStartTracking = () => {
    if (application) {
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
      status: 'Saved',
      dateAdded: new Date().toISOString(),
      submissionDate: null,
      notes: '',
      checklist,
      lastUpdated: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_APPLICATION', payload: newApp });
    toast.success('Added to your Application Tracker');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top back navigation */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-navy transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Header Card */}
      <div className="card p-6 sm:p-8 relative overflow-hidden">
        {scholarship.isDemo && (
          <div className="mb-4 inline-flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Demonstration Record — For exploratory and prototype purposes</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="badge bg-navy-50 text-navy font-medium border border-navy-100">
                {scholarship.category}
              </span>
              <MatchBadge level={match.level} score={match.score} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1">
              {scholarship.title}
            </h1>
            <p className="text-sm text-secondary font-medium">{scholarship.provider}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:self-start">
            <button
              onClick={handleToggleSave}
              className={cn(
                'btn-secondary px-3 py-2 text-xs',
                saved && 'text-rose-600 border-rose-200 bg-rose-50/50'
              )}
              title={saved ? 'Remove from saved' : 'Save for later'}
            >
              <Heart className={cn('h-4 w-4', saved && 'fill-rose-500 text-rose-500')} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>

            {application ? (
              <button
                onClick={() => navigate('/applications')}
                className="btn-lime px-4 py-2 text-xs font-semibold"
              >
                <ClipboardList className="h-4 w-4" />
                <span>Tracking ({application.status})</span>
              </button>
            ) : (
              <button
                onClick={handleStartTracking}
                className="btn-primary px-4 py-2 text-xs"
              >
                <ClipboardList className="h-4 w-4" />
                <span>Track Application</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div>
            <span className="text-xs text-secondary block mb-1">Potential Funding</span>
            <span className="text-lg font-bold text-navy">
              {formatCurrency(scholarship.fundingAmount, scholarship.currency)}
            </span>
          </div>

          <div>
            <span className="text-xs text-secondary block mb-1">Deadline</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-secondary" />
              <span className="text-sm font-semibold text-primary">
                {formatDate(scholarship.deadline)}
              </span>
            </div>
            <span className="text-[11px] text-secondary">
              {days < 0 ? 'Closed' : `${days} days remaining`}
            </span>
          </div>

          <div>
            <span className="text-xs text-secondary block mb-1">Education Level</span>
            <span className="text-sm font-semibold text-primary">
              {scholarship.educationLevels.join(', ')}
            </span>
          </div>

          <div>
            <span className="text-xs text-secondary block mb-1">Fields of Study</span>
            <span className="text-sm font-semibold text-primary line-clamp-1" title={scholarship.fieldsOfStudy.join(', ')}>
              {scholarship.fieldsOfStudy.join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-primary mb-3">About This Scholarship</h2>
        <p className="text-sm text-secondary leading-relaxed whitespace-pre-line">
          {scholarship.description}
        </p>
      </div>

      {/* Match Engine Analysis Card */}
      <div className="card p-6 border-lime-dark/30 bg-lime-50/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-primary">Profile Match Breakdown</h2>
            <MatchBadge level={match.level} score={match.score} compact />
          </div>
          <Link to="/profile" className="text-xs text-navy font-medium hover:underline">
            Update Profile
          </Link>
        </div>

        <p className="text-xs text-secondary mb-4">
          This automated matching score compares the declared criteria against your student profile. It is a preliminary evaluation designed for discovery guidance and does not represent an official eligibility determination.
        </p>

        <div className="space-y-2.5">
          {match.matchedCriteria.map((c, i) => (
            <div
              key={`match-${i}`}
              className="flex items-start gap-3 p-3 rounded-lg bg-card border border-emerald-100 text-xs"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-emerald-900 block font-medium">{c.label} — Matched</strong>
                <span className="text-emerald-700">{c.detail}</span>
              </div>
            </div>
          ))}

          {match.unmatchedCriteria.map((c, i) => (
            <div
              key={`unmatch-${i}`}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg bg-card border text-xs',
                c.status === 'missing_info'
                  ? 'border-amber-200 bg-amber-50/30'
                  : c.status === 'needs_verification'
                  ? 'border-blue-200 bg-blue-50/30'
                  : 'border-rose-200 bg-rose-50/30'
              )}
            >
              {c.status === 'missing_info' ? (
                <HelpCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              ) : c.status === 'needs_verification' ? (
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
              )}
              <div>
                <strong className="block font-medium text-primary">
                  {c.label} —{' '}
                  {c.status === 'missing_info'
                    ? 'Missing Profile Information'
                    : c.status === 'needs_verification'
                    ? 'Requires Manual Review'
                    : 'Unmatched'}
                </strong>
                <span className="text-secondary">{c.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Required Documents Checklist Preview */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-primary mb-2 flex items-center gap-2">
          <FileText className="h-4 w-4 text-navy" />
          <span>Required Documentation</span>
        </h2>
        <p className="text-xs text-secondary mb-4">
          When you add this scholarship to your application tracker, these documents are automatically populated into your preparation checklist.
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {scholarship.requiredDocuments.map((doc, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-navy-50/40 text-xs font-medium text-primary"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-navy shrink-0" />
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Official Link Disclaimer Banner */}
      <div className="card p-5 bg-navy-50/60 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-semibold text-primary mb-0.5">Application Submission Transparency</h4>
          <p className="text-xs text-secondary">
            {scholarship.isDemo
              ? 'This is a hackathon prototype demonstration record. In a production environment, this link directs students to the officially verified portal.'
              : 'Always review official provider guidelines prior to final packet submission.'}
          </p>
        </div>

        <button
          onClick={() => {
            if (scholarship.isDemo) {
              toast('Demo record: external submission simulated locally', { icon: 'ℹ️' });
            } else {
              window.open(scholarship.applicationUrl, '_blank');
            }
          }}
          className="btn-secondary text-xs whitespace-nowrap shrink-0"
        >
          <span>Official Portal Link</span>
          <ExternalLink className="h-3.5 w-3.5 ml-1" />
        </button>
      </div>
    </div>
  );
}
