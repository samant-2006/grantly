import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  ClipboardList,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { formatCurrency } from '@/lib/utils';
import type { ApplicationStatus } from '@/types';
import { APPLICATION_STATUSES } from '@/types';

// Palette matching our design system
const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Saved: '#687386',
  Preparing: '#3B82F6',
  'Ready to Apply': '#6BBF47',
  Submitted: '#6366F1',
  Awarded: '#237A55',
  Rejected: '#E11D48',
  Withdrawn: '#94A3B8',
};

export default function Analytics() {
  const { state, analytics, getScholarship } = useApp();
  const { applications, scholarships } = state;

  // Status Distribution Data for Pie Chart
  const statusChartData = useMemo(() => {
    return APPLICATION_STATUSES.map((status) => {
      const count = applications.filter((a) => a.status === status).length;
      return {
        name: status,
        value: count,
        color: STATUS_COLORS[status],
      };
    }).filter((item) => item.value > 0);
  }, [applications]);

  // Funding Comparison Data for Bar Chart
  const fundingChartData = useMemo(() => {
    return [
      {
        category: 'Pipeline Potential',
        amount: analytics.potentialFunding,
        fill: '#101827',
      },
      {
        category: 'Awarded to Date',
        amount: analytics.awardedFunding,
        fill: '#6BBF47',
      },
    ];
  }, [analytics]);

  // Checklist completion per application
  const checklistData = useMemo(() => {
    return applications.slice(0, 6).map((app) => {
      const sch = getScholarship(app.scholarshipId);
      const total = app.checklist.length;
      const completed = app.checklist.filter((c) => c.completed).length;
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        name: sch ? sch.title.substring(0, 16) + '...' : 'App',
        completed,
        pending: total - completed,
        percentage: pct,
      };
    });
  }, [applications, getScholarship]);

  const hasData = applications.length > 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Application Analytics
          </h1>
          <p className="text-sm text-secondary mt-1">
            Real-time pipeline metrics and funding distribution for your scholarship portfolio.
          </p>
        </div>

        <div className="text-xs text-secondary bg-navy-50 px-3 py-1.5 rounded-lg border border-border w-fit">
          <span>Client-side persistent metrics</span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <span className="text-xs font-medium text-secondary">Total Tracked Applications</span>
          <div className="text-2xl font-bold text-navy mt-1">{analytics.totalApplications}</div>
          <span className="text-[11px] text-secondary mt-1 block">
            Across {analytics.totalSaved} shortlisted opportunities
          </span>
        </div>

        <div className="card p-5">
          <span className="text-xs font-medium text-secondary">Potential Target Funding</span>
          <div className="text-2xl font-bold text-navy mt-1">
            {formatCurrency(analytics.potentialFunding)}
          </div>
          <span className="text-[11px] text-amber-700 font-medium mt-1 block">
            Pending selection & review
          </span>
        </div>

        <div className="card p-5 bg-gradient-to-br from-card to-lime-50/50 border-lime-dark/30">
          <span className="text-xs font-medium text-secondary">Confirmed Awarded Funding</span>
          <div className="text-2xl font-bold text-emerald-800 mt-1">
            {formatCurrency(analytics.awardedFunding)}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            Officially granted
          </span>
        </div>

        <div className="card p-5">
          <span className="text-xs font-medium text-secondary">Upcoming Target Deadlines</span>
          <div className="text-2xl font-bold text-navy mt-1">{analytics.upcomingDeadlines}</div>
          <span className="text-[11px] text-secondary mt-1 block">Active applications</span>
        </div>
      </div>

      {hasData ? (
        <div className="space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Breakdown */}
            <div className="card p-6">
              <h2 className="text-base font-semibold text-primary mb-1">
                Applications by Status
              </h2>
              <p className="text-xs text-secondary mb-4">
                Distribution of where your scholarships currently stand in the preparation pipeline.
              </p>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={3}
                      label={({ name, value }) => `${name} (${value})`}
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`${value} application(s)`, 'Count']}
                      contentStyle={{
                        backgroundColor: '#172033',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Potential vs Awarded Bar Chart */}
            <div className="card p-6">
              <h2 className="text-base font-semibold text-primary mb-1">
                Funding Pipeline Comparison
              </h2>
              <p className="text-xs text-secondary mb-4">
                Explicit separation between theoretical target opportunities and realized funding.
              </p>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fundingChartData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E9E5" />
                    <XAxis dataKey="category" tick={{ fill: '#687386', fontSize: 12 }} />
                    <YAxis
                      tick={{ fill: '#687386', fontSize: 12 }}
                      tickFormatter={(val) => `$${val / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value: any) => [formatCurrency(Number(value)), 'Funding']}
                      contentStyle={{
                        backgroundColor: '#172033',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                      {fundingChartData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Document Readiness Bar Chart */}
          {checklistData.length > 0 && (
            <div className="card p-6">
              <h2 className="text-base font-semibold text-primary mb-1">
                Document Checklist Completion
              </h2>
              <p className="text-xs text-secondary mb-4">
                Preparation readiness across your tracked scholarships.
              </p>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={checklistData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E9E5" />
                    <XAxis type="number" tick={{ fill: '#687386', fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#172033', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#172033',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="completed" name="Prepared Docs" stackId="a" fill="#237A55" />
                    <Bar dataKey="pending" name="Pending Docs" stackId="a" fill="#E5E9E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card p-12 text-center max-w-md mx-auto my-12 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-navy-50 text-navy flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-primary mb-1">No tracking data available</h3>
          <p className="text-xs text-secondary mb-6 leading-relaxed">
            As you shortlist scholarships and advance their status from 'Saved' to 'Preparing' and 'Submitted', pipeline charts and funding analytics will render here.
          </p>
          <Link to="/discover" className="btn-primary text-xs">
            Discover Opportunities
          </Link>
        </div>
      )}
    </div>
  );
}
