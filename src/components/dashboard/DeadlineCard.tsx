import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, formatDate, daysUntil, deadlineUrgency } from '@/lib/utils';
import type { ApplicationStatus } from '@/types';

interface DeadlineCardProps {
  scholarshipTitle: string;
  provider: string;
  deadline: string;
  status: ApplicationStatus;
  scholarshipId: string;
}

const urgencyConfig = {
  overdue: { badge: 'Overdue', color: 'bg-red-100 text-[#B42318]' },
  urgent: { badge: '', color: 'bg-red-100 text-[#B42318]' },
  soon: { badge: '', color: 'bg-amber-100 text-[#B7791F]' },
  normal: { badge: '', color: 'bg-emerald-100 text-[#237A55]' },
};

export default function DeadlineCard({
  scholarshipTitle,
  provider,
  deadline,
  status,
  scholarshipId,
}: DeadlineCardProps) {
  const days = daysUntil(deadline);
  const urgency = deadlineUrgency(deadline);
  const config = urgencyConfig[urgency];

  const badgeLabel =
    urgency === 'overdue'
      ? 'Overdue'
      : days === 0
        ? 'Today'
        : days === 1
          ? '1 day left'
          : `${days} days left`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group flex items-center gap-4 rounded-xl border border-[#E5E9E5] bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Calendar icon */}
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
          urgency === 'urgent' || urgency === 'overdue'
            ? 'bg-red-50'
            : urgency === 'soon'
              ? 'bg-amber-50'
              : 'bg-emerald-50'
        )}
      >
        <Calendar
          className={cn(
            'h-5 w-5',
            urgency === 'urgent' || urgency === 'overdue'
              ? 'text-[#B42318]'
              : urgency === 'soon'
                ? 'text-[#B7791F]'
                : 'text-[#237A55]'
          )}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#172033] truncate">{scholarshipTitle}</p>
        <p className="mt-0.5 text-xs text-[#687386] truncate">{provider}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#687386]">{formatDate(deadline)}</span>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
              config.color
            )}
          >
            {badgeLabel}
          </span>
          <span className="inline-flex items-center rounded-full bg-[#F7F8F5] px-2 py-0.5 text-xs font-medium text-[#687386]">
            {status}
          </span>
        </div>
      </div>

      {/* Link arrow */}
      <Link
        to={`/scholarships/${scholarshipId}`}
        className="shrink-0 rounded-lg p-2 text-[#687386] transition-colors hover:bg-[#F7F8F5] hover:text-[#172033] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172033]"
        aria-label={`View ${scholarshipTitle}`}
      >
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
}
