import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  ClipboardList,
  Calendar,
  DollarSign,
  Search,
  UserCircle,
  Info,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { cn, formatCurrency, daysUntil } from '@/lib/utils';
import StatCard from '@/components/dashboard/StatCard';
import DeadlineCard from '@/components/dashboard/DeadlineCard';
import RecommendedCard from '@/components/dashboard/RecommendedCard';

// ─── Animation Variants ──────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Dashboard() {
  const { state, analytics, getMatch } = useApp();
  const navigate = useNavigate();

  const { profile, scholarships, applications } = state;

  // ── Determine if profile is mostly empty (show demo banner) ───
  const isProfileEmpty = profile.profileComplete < 20;

  // ── Has any urgent deadline ───────────────────────────────────
  const hasUrgentDeadline = useMemo(() => {
    return applications.some((app) => {
      const sch = scholarships.find((s) => s.id === app.scholarshipId);
      if (!sch) return false;
      if (['Submitted', 'Awarded', 'Rejected', 'Withdrawn'].includes(app.status)) return false;
      const days = daysUntil(sch.deadline);
      return days >= 0 && days <= 7;
    });
  }, [applications, scholarships]);

  // ── Upcoming deadlines (next 3, sorted soonest first) ─────────
  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    return applications
      .map((app) => {
        const sch = scholarships.find((s) => s.id === app.scholarshipId);
        return sch ? { app, sch } : null;
      })
      .filter((entry): entry is NonNullable<typeof entry> => {
        if (!entry) return false;
        const { app, sch } = entry;
        if (['Submitted', 'Awarded', 'Rejected', 'Withdrawn'].includes(app.status)) return false;
        return new Date(sch.deadline) >= now;
      })
      .sort((a, b) => new Date(a.sch.deadline).getTime() - new Date(b.sch.deadline).getTime())
      .slice(0, 3);
  }, [applications, scholarships]);

  // ── Recommended scholarships (top 3 by match score) ───────────
  const recommended = useMemo(() => {
    return scholarships
      .map((sch) => {
        const match = getMatch(sch);
        return { scholarship: sch, matchScore: match.score, matchLevel: match.level };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }, [scholarships, getMatch]);

  // ── Active application count ──────────────────────────────────
  const activeApplications = applications.filter(
    (a) => !['Submitted', 'Awarded', 'Rejected', 'Withdrawn'].includes(a.status)
  ).length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* ── Welcome Header ─────────────────────────────────────── */}
      <motion.header variants={itemVariants} className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
          {profile.displayName
            ? `Welcome back, ${profile.displayName}`
            : 'Welcome to Grantly'}
        </h1>
        <p className="mt-1 text-sm text-[#687386]">Your scholarship journey at a glance</p>
      </motion.header>

      {/* ── Demo Data Banner ───────────────────────────────────── */}
      {isProfileEmpty && (
        <motion.div
          variants={itemVariants}
          className="mb-6 flex items-start gap-3 rounded-xl border border-[#D7F8A7] bg-[#D7F8A7]/20 px-4 py-3"
          role="status"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#237A55]" aria-hidden="true" />
          <p className="text-sm text-[#172033]">
            Explore with demonstration data.{' '}
            <Link
              to="/profile"
              className="font-medium underline underline-offset-2 hover:text-[#237A55] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172033]"
            >
              Update your profile
            </Link>{' '}
            for personalized matches.
          </p>
        </motion.div>
      )}

      {/* ── Stats Grid ─────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <StatCard
          title="Saved Scholarships"
          value={analytics.totalSaved}
          icon={Heart}
          accent="bg-[#D7F8A7]"
        />
        <StatCard
          title="Active Applications"
          value={activeApplications}
          icon={ClipboardList}
        />
        <StatCard
          title="Upcoming Deadlines"
          value={analytics.upcomingDeadlines}
          icon={Calendar}
          accent={hasUrgentDeadline ? 'bg-amber-100' : undefined}
          subtitle={hasUrgentDeadline ? 'Some deadlines are urgent' : undefined}
        />
        <StatCard
          title="Potential Funding"
          value={formatCurrency(analytics.potentialFunding)}
          icon={DollarSign}
          subtitle="Potential, not awarded"
        />
      </motion.div>

      {/* ── Profile Completion Card ────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="mb-8 rounded-xl border border-[#E5E9E5] bg-white p-5 shadow-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-[#172033]">Profile Completion</h2>
            <p className="mt-1 text-xs text-[#687386]">
              A complete profile improves scholarship matching accuracy
            </p>

            {/* Progress bar */}
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#F7F8F5]">
              <motion.div
                className={cn(
                  'h-full rounded-full',
                  profile.profileComplete >= 80
                    ? 'bg-[#237A55]'
                    : profile.profileComplete >= 50
                      ? 'bg-[#D7F8A7]'
                      : 'bg-amber-400'
                )}
                initial={{ width: 0 }}
                animate={{ width: `${profile.profileComplete}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                role="progressbar"
                aria-valuenow={profile.profileComplete}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Profile completion progress"
              />
            </div>
            <p className="mt-1.5 text-xs font-medium text-[#687386]">
              {profile.profileComplete}% complete
            </p>
          </div>

          <Link
            to="/profile"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#172033] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#101827] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172033]"
          >
            Complete Profile
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </motion.div>

      {/* ── Two-Column Layout: Deadlines + Recommended ─────────── */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upcoming Deadlines */}
        <motion.section variants={itemVariants} aria-labelledby="upcoming-deadlines-heading">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="upcoming-deadlines-heading" className="text-base font-semibold text-[#172033]">
              Upcoming Deadlines
            </h2>
            {applications.length > 3 && (
              <Link
                to="/applications"
                className="text-xs font-medium text-[#687386] hover:text-[#172033] transition-colors"
              >
                View all
              </Link>
            )}
          </div>

          {upcomingDeadlines.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E9E5] bg-white py-10 text-center">
              <Calendar className="mb-2 h-8 w-8 text-[#E5E9E5]" aria-hidden="true" />
              <p className="text-sm text-[#687386]">No upcoming deadlines</p>
              <p className="mt-0.5 text-xs text-[#687386]">
                Start tracking scholarships to see deadlines here
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {upcomingDeadlines.map(({ app, sch }) => (
                <DeadlineCard
                  key={app.id}
                  scholarshipTitle={sch.title}
                  provider={sch.provider}
                  deadline={sch.deadline}
                  status={app.status}
                  scholarshipId={sch.id}
                />
              ))}
            </div>
          )}
        </motion.section>

        {/* Recommended Scholarships */}
        <motion.section variants={itemVariants} aria-labelledby="recommended-heading">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="recommended-heading" className="text-base font-semibold text-[#172033]">
              Recommended Scholarships
            </h2>
            <Link
              to="/scholarships"
              className="text-xs font-medium text-[#687386] hover:text-[#172033] transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
            {recommended.map(({ scholarship, matchScore, matchLevel }) => (
              <RecommendedCard
                key={scholarship.id}
                scholarship={scholarship}
                matchScore={matchScore}
                matchLevel={matchLevel}
              />
            ))}
          </div>
        </motion.section>
      </div>

      {/* ── Quick Actions ──────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
      >
        <button
          type="button"
          onClick={() => navigate('/scholarships')}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D7F8A7] px-5 py-3 text-sm font-semibold text-[#172033] transition-colors hover:bg-[#c5f08e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172033]"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Discover Scholarships
        </button>
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E5E9E5] bg-white px-5 py-3 text-sm font-semibold text-[#172033] transition-colors hover:bg-[#F7F8F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172033]"
        >
          <UserCircle className="h-4 w-4" aria-hidden="true" />
          Update Profile
        </button>
      </motion.div>
    </motion.div>
  );
}
