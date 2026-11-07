import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, formatCurrency } from '@/lib/utils';
import type { Scholarship, MatchLevel } from '@/types';

interface RecommendedCardProps {
  scholarship: Scholarship;
  matchScore: number;
  matchLevel: MatchLevel;
}

const matchLevelConfig: Record<MatchLevel, { bg: string; text: string }> = {
  'Strong Match': { bg: 'bg-emerald-100', text: 'text-[#237A55]' },
  'Good Match': { bg: 'bg-[#D7F8A7]', text: 'text-[#172033]' },
  'Partial Match': { bg: 'bg-amber-100', text: 'text-[#B7791F]' },
  'Low Match': { bg: 'bg-gray-100', text: 'text-[#687386]' },
  'Incomplete Profile': { bg: 'bg-gray-100', text: 'text-[#687386]' },
};

export default function RecommendedCard({ scholarship, matchScore, matchLevel }: RecommendedCardProps) {
  const levelStyle = matchLevelConfig[matchLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group rounded-xl border border-[#E5E9E5] bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#172033] truncate">{scholarship.title}</p>
          <p className="mt-0.5 text-xs text-[#687386] truncate">{scholarship.provider}</p>
        </div>
        <span
          className={cn(
            'shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
            levelStyle.bg,
            levelStyle.text
          )}
        >
          {matchLevel}
        </span>
      </div>

      {/* Funding & score */}
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-xs text-[#687386]">Funding</p>
          <p className="text-base font-bold text-[#172033]">
            {formatCurrency(scholarship.fundingAmount, scholarship.currency)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#687386]">Match</p>
          <p className="text-base font-bold text-[#172033]">{matchScore}%</p>
        </div>
      </div>

      {/* Action */}
      <Link
        to={`/scholarships/${scholarship.id}`}
        className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-[#E5E9E5] px-3 py-2 text-xs font-medium text-[#172033] transition-colors hover:bg-[#F7F8F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172033]"
      >
        View Details
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </motion.div>
  );
}
