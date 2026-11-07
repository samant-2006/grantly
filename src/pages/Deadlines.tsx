import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, Clock, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { cn, formatDate, daysUntil, deadlineUrgency } from '@/lib/utils';
import type { Application, Scholarship } from '@/types';

interface DeadlineItem {
  application: Application;
  scholarship: Scholarship;
  days: number;
  urgency: 'overdue' | 'urgent' | 'soon' | 'normal';
}

export default function Deadlines() {
  const { state, getScholarship } = useApp();
  const { applications } = state;

  // Build list of all tracked deadlines
  const deadlineItems: DeadlineItem[] = useMemo(() => {
    return applications
      .map((app) => {
        const sch = getScholarship(app.scholarshipId);
        if (!sch) return null;
        const days = daysUntil(sch.deadline);
        const urgency = deadlineUrgency(sch.deadline);
        return { application: app, scholarship: sch, days, urgency };
      })
      .filter((item): item is DeadlineItem => item !== null)
      .sort((a, b) => a.days - b.days);
  }, [applications, getScholarship]);

  // Group into Overdue, This Week, This Month, Later
  const groups = useMemo(() => {
    const overdue: DeadlineItem[] = [];
    const thisWeek: DeadlineItem[] = [];
    const thisMonth: DeadlineItem[] = [];
    const later: DeadlineItem[] = [];

    deadlineItems.forEach((item) => {
      // Exclude terminal completed statuses if user wants clean view
      if (['Awarded', 'Withdrawn'].includes(item.application.status)) return;

      if (item.days < 0) overdue.push(item);
      else if (item.days <= 7) thisWeek.push(item);
      else if (item.days <= 30) thisMonth.push(item);
      else later.push(item);
    });

    return { overdue, thisWeek, thisMonth, later };
  }, [deadlineItems]);

  const activeCount =
    groups.overdue.length + groups.thisWeek.length + groups.thisMonth.length + groups.later.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Deadlines Timeline
          </h1>
          <p className="text-sm text-secondary mt-1">
            Stay ahead of submission dates and ensure no required scholarship packet lapses.
          </p>
        </div>

        <div className="text-xs text-secondary bg-navy-50 px-3 py-1.5 rounded-lg border border-border w-fit">
          <span>{activeCount} active target deadlines</span>
        </div>
      </div>

      {activeCount > 0 ? (
        <div className="space-y-6">
          {/* Section: Overdue */}
          {groups.overdue.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Passed Deadlines ({groups.overdue.length})</span>
              </div>
              <div className="space-y-2">
                {groups.overdue.map((item) => (
                  <DeadlineRow key={item.application.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Section: This Week (<=7 days) */}
          {groups.thisWeek.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm">
                <Clock className="h-4 w-4" />
                <span>Urgent — Due Within 7 Days ({groups.thisWeek.length})</span>
              </div>
              <div className="space-y-2">
                {groups.thisWeek.map((item) => (
                  <DeadlineRow key={item.application.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Section: This Month (<=30 days) */}
          {groups.thisMonth.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                <Calendar className="h-4 w-4" />
                <span>Due Within 30 Days ({groups.thisMonth.length})</span>
              </div>
              <div className="space-y-2">
                {groups.thisMonth.map((item) => (
                  <DeadlineRow key={item.application.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Section: Later */}
          {groups.later.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Calendar className="h-4 w-4 text-secondary" />
                <span>Upcoming Opportunities ({groups.later.length})</span>
              </div>
              <div className="space-y-2">
                {groups.later.map((item) => (
                  <DeadlineRow key={item.application.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card p-12 text-center max-w-md mx-auto my-12 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-navy-50 text-navy flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-primary mb-1">No deadlines tracked</h3>
          <p className="text-xs text-secondary mb-6 leading-relaxed">
            You don't have any active scholarship applications with pending deadlines. Browse opportunities and add them to your tracker.
          </p>
          <Link to="/discover" className="btn-primary text-xs">
            Discover Scholarships
          </Link>
        </div>
      )}
    </div>
  );
}

function DeadlineRow({ item }: { item: DeadlineItem }) {
  const { scholarship, application, days, urgency } = item;
  const completedDocs = application.checklist.filter((c) => c.completed).length;
  const totalDocs = application.checklist.length;

  const badgeColor = {
    overdue: 'bg-rose-50 text-rose-700 border-rose-200',
    urgent: 'bg-amber-50 text-amber-700 border-amber-200',
    soon: 'bg-blue-50 text-blue-700 border-blue-200',
    normal: 'bg-navy-50 text-secondary border-border',
  }[urgency];

  return (
    <div className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start sm:items-center gap-3">
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex flex-col items-center justify-center shrink-0 border text-center font-bold',
            badgeColor
          )}
        >
          <span className="text-xs leading-none">
            {days < 0 ? 'PAST' : days === 0 ? 'TODAY' : `${days}d`}
          </span>
          <span className="text-[9px] font-normal uppercase mt-0.5">
            {days < 0 ? 'Over' : 'Left'}
          </span>
        </div>

        <div>
          <Link
            to={`/scholarship/${scholarship.id}`}
            className="text-sm font-semibold text-primary hover:text-navy hover:underline line-clamp-1"
          >
            {scholarship.title}
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-xs text-secondary mt-0.5">
            <span>{scholarship.provider}</span>
            <span>•</span>
            <span>Due {formatDate(scholarship.deadline)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:self-center justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
        <div className="text-xs text-right">
          <span className="text-secondary block">Checklist Progress</span>
          <span className="font-semibold text-primary">
            {completedDocs}/{totalDocs} documents ready
          </span>
        </div>

        <Link
          to="/applications"
          className="btn-secondary text-xs py-1.5 px-3 h-8 whitespace-nowrap"
        >
          <span>Manage Tracker</span>
          <ArrowRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
    </div>
  );
}
