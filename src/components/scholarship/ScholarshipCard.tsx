import { motion } from 'framer-motion';
import { Heart, Calendar, GraduationCap, DollarSign, ArrowUpRight, Sparkles } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { cn, formatCurrency, formatDate, daysUntil, deadlineUrgency } from '@/lib/utils';
import MatchBadge from '@/components/scholarship/MatchBadge';
import type { Scholarship, MatchResult } from '@/types';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  matchResult?: MatchResult;
  onViewDetails: (id: string) => void;
  onStartApplication?: (scholarship: Scholarship) => void;
  showStartApp?: boolean;
}

export default function ScholarshipCard({
  scholarship,
  matchResult,
  onViewDetails,
  onStartApplication,
  showStartApp = false,
}: ScholarshipCardProps) {
  const { isSaved, dispatch, getApplication } = useApp();
  const saved = isSaved(scholarship.id);
  const existingApp = getApplication(scholarship.id);

  const days = daysUntil(scholarship.deadline);
  const urgency = deadlineUrgency(scholarship.deadline);

  const urgencyStyles = {
    overdue: 'text-red-600 bg-red-50 border-red-200',
    urgent: 'text-amber-700 bg-amber-50 border-amber-200',
    soon: 'text-blue-700 bg-blue-50 border-blue-200',
    normal: 'text-secondary bg-navy-50/60 border-border',
  }[urgency];

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card group relative flex flex-col justify-between overflow-hidden p-5 transition-shadow duration-200 hover:shadow-md"
    >
      {/* Top Header: Category & Save */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="badge bg-navy-50 text-navy font-medium border border-navy-100/60">
              {scholarship.category}
            </span>
            {scholarship.isDemo && (
              <span className="badge bg-amber-50 text-amber-800 border border-amber-200 text-[10px]">
                Demo Data
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: 'TOGGLE_SAVE_SCHOLARSHIP', payload: scholarship.id });
            }}
            aria-label={saved ? 'Remove from saved' : 'Save scholarship'}
            className={cn(
              'rounded-lg p-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-lime-dark',
              saved
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                : 'text-secondary hover:bg-navy-50 hover:text-navy'
            )}
          >
            <Heart className={cn('h-4 w-4', saved && 'fill-rose-500')} />
          </button>
        </div>

        {/* Title & Provider */}
        <h3
          onClick={() => onViewDetails(scholarship.id)}
          className="text-base font-semibold text-primary line-clamp-2 hover:text-navy cursor-pointer transition-colors mb-1"
        >
          {scholarship.title}
        </h3>
        <p className="text-xs text-secondary mb-3 flex items-center gap-1">
          <span>{scholarship.provider}</span>
        </p>

        {/* Funding Amount Highlight */}
        <div className="mb-4 flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-navy">
            {formatCurrency(scholarship.fundingAmount, scholarship.currency)}
          </span>
          <span className="text-xs text-secondary font-normal">potential funding</span>
        </div>

        {/* Match Indicator */}
        {matchResult && (
          <div className="mb-4">
            <MatchBadge level={matchResult.level} score={matchResult.score} compact />
          </div>
        )}

        {/* Education Levels & Fields tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <div className="inline-flex items-center gap-1 text-[11px] text-secondary bg-navy-50/70 px-2 py-0.5 rounded-md">
            <GraduationCap className="h-3 w-3 text-secondary" />
            <span>{scholarship.educationLevels.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Card Footer: Deadline & Action Buttons */}
      <div className="pt-3 border-t border-border mt-auto">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-secondary flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Deadline: {formatDate(scholarship.deadline)}
          </span>
          <span className={cn('badge text-[11px] border', urgencyStyles)}>
            {days < 0 ? 'Closed' : days === 0 ? 'Today' : `${days}d left`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(scholarship.id)}
            className="btn-secondary flex-1 text-xs py-2 h-9"
          >
            View Details
            <ArrowUpRight className="h-3.5 w-3.5 ml-0.5" />
          </button>

          {showStartApp && onStartApplication && (
            <button
              type="button"
              onClick={() => onStartApplication(scholarship)}
              className={cn(
                'btn-lime text-xs py-2 h-9 font-medium whitespace-nowrap',
                existingApp && 'opacity-60 cursor-default'
              )}
            >
              {existingApp ? 'In Tracker' : 'Start Application'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
