import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  Trash2,
  ExternalLink,
  Edit3,
  Search,
  CheckSquare,
  Square,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '@/store/AppContext';
import {
  cn,
  formatCurrency,
  formatDate,
  daysUntil,
  deadlineUrgency,
  pluralize,
} from '@/lib/utils';
import type { Application, ApplicationStatus } from '@/types';
import { APPLICATION_STATUSES } from '@/types';

export default function Applications() {
  const { state, dispatch, getScholarship } = useApp();
  const { applications } = state;

  const [activeTab, setActiveTab] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [expandedChecklists, setExpandedChecklists] = useState<Record<string, boolean>>({});
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState<string>('');

  // Toggle expanded checklist
  const toggleChecklist = (appId: string) => {
    setExpandedChecklists((prev) => ({ ...prev, [appId]: !prev[appId] }));
  };

  // Status badge styles
  const getStatusBadge = (status: ApplicationStatus) => {
    const config: Record<ApplicationStatus, { bg: string; text: string; border: string }> = {
      Saved: { bg: 'bg-navy-50', text: 'text-secondary', border: 'border-border' },
      Preparing: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      'Ready to Apply': { bg: 'bg-lime-50', text: 'text-emerald-800', border: 'border-lime-dark' },
      Submitted: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
      Awarded: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' },
      Rejected: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
      Withdrawn: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' },
    };
    return config[status] || config.Saved;
  };

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    dispatch({ type: 'UPDATE_APPLICATION_STATUS', payload: { id: appId, status: newStatus } });
    if (newStatus === 'Submitted') {
      dispatch({
        type: 'SET_APPLICATION_SUBMISSION_DATE',
        payload: { id: appId, date: new Date().toISOString() },
      });
      toast.success('Marked as Submitted in your personal tracker');
    } else {
      toast.success(`Application status updated to ${newStatus}`);
    }
  };

  const handleToggleChecklistItem = (appId: string, itemId: string) => {
    dispatch({ type: 'TOGGLE_CHECKLIST_ITEM', payload: { applicationId: appId, itemId } });
  };

  const handleSaveNotes = (appId: string) => {
    dispatch({ type: 'UPDATE_APPLICATION_NOTES', payload: { id: appId, notes: notesValue } });
    setEditingNotesId(null);
    toast.success('Notes saved');
  };

  const handleRemove = (appId: string, title: string) => {
    if (window.confirm(`Remove application tracking for "${title}"?`)) {
      dispatch({ type: 'REMOVE_APPLICATION', payload: appId });
      toast.success('Removed from tracker');
    }
  };

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const sch = getScholarship(app.scholarshipId);
      if (!sch) return false;

      // Status filter
      if (activeTab !== 'All' && app.status !== activeTab) return false;

      // Search term
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = sch.title.toLowerCase().includes(q);
        const matchProvider = sch.provider.toLowerCase().includes(q);
        const matchNotes = app.notes.toLowerCase().includes(q);
        if (!matchTitle && !matchProvider && !matchNotes) return false;
      }

      return true;
    });
  }, [applications, activeTab, search, getScholarship]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Application Tracker
          </h1>
          <p className="text-sm text-secondary mt-1">
            Manage preparation progress, document checklists, and submission milestones in one place.
          </p>
        </div>

        <Link to="/discover" className="btn-primary text-xs self-start sm:self-auto">
          <span>+ Add From Discovery</span>
        </Link>
      </div>

      {/* Tabs and Search row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('All')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
              activeTab === 'All'
                ? 'bg-navy text-white'
                : 'bg-card text-secondary border border-border hover:bg-navy-50'
            )}
          >
            All ({applications.length})
          </button>
          {APPLICATION_STATUSES.map((status) => {
            const count = applications.filter((a) => a.status === status).length;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setActiveTab(status)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
                  activeTab === status
                    ? 'bg-navy text-white'
                    : 'bg-card text-secondary border border-border hover:bg-navy-50'
                )}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracked applications..."
            className="input pl-8 py-1.5 text-xs h-9"
          />
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredApps.map((app) => {
              const sch = getScholarship(app.scholarshipId);
              if (!sch) return null;

              const badge = getStatusBadge(app.status);
              const isExpanded = !!expandedChecklists[app.id];
              const completedCount = app.checklist.filter((c) => c.completed).length;
              const totalChecklist = app.checklist.length;
              const progressPct =
                totalChecklist > 0 ? Math.round((completedCount / totalChecklist) * 100) : 0;
              const days = daysUntil(sch.deadline);

              return (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="card p-5 sm:p-6 transition-shadow hover:shadow-sm"
                >
                  {/* Top Bar: Title, Provider, Status Dropdown, Delete */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={cn(
                            'badge border text-xs font-semibold px-2.5 py-0.5',
                            badge.bg,
                            badge.text,
                            badge.border
                          )}
                        >
                          {app.status}
                        </span>

                        <span className="text-xs text-secondary">
                          Deadline: {formatDate(sch.deadline)} ({days < 0 ? 'Passed' : `${days}d left`})
                        </span>
                      </div>

                      <Link
                        to={`/scholarship/${sch.id}`}
                        className="text-base sm:text-lg font-bold text-primary hover:text-navy hover:underline block"
                      >
                        {sch.title}
                      </Link>
                      <p className="text-xs text-secondary">{sch.provider}</p>
                    </div>

                    {/* Status Changer & Remove */}
                    <div className="flex items-center gap-2 self-start">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        className="input py-1 px-2.5 text-xs h-8 font-medium bg-card"
                        aria-label="Change application status"
                      >
                        {APPLICATION_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            Status: {st}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemove(app.id, sch.title)}
                        className="p-1.5 text-secondary hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete application record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Checklist Summary Progress Bar */}
                  <div className="mb-4 bg-navy-50/50 p-3.5 rounded-lg border border-border">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-primary flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-navy" />
                        Required Document Checklist
                      </span>
                      <span className="text-secondary font-medium">
                        {completedCount} of {totalChecklist} documents prepared ({progressPct}%)
                      </span>
                    </div>

                    <div className="w-full bg-border rounded-full h-2 overflow-hidden mb-2">
                      <div
                        className="bg-navy h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleChecklist(app.id)}
                      className="text-xs text-navy font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Checklist Items' : 'View & Toggle Document Tasks'}</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>

                    {/* Expanded Checklist Items */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-border space-y-2">
                        {app.checklist.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center gap-2.5 text-xs text-primary hover:bg-card p-1.5 rounded-md cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => handleToggleChecklistItem(app.id, item.id)}
                              className="rounded border-border text-navy focus:ring-lime-dark h-3.5 w-3.5 cursor-pointer"
                            />
                            <span className={cn(item.completed && 'line-through text-secondary')}>
                              {item.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Personal Notes Section */}
                  <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex-1">
                      {editingNotesId === app.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={notesValue}
                            onChange={(e) => setNotesValue(e.target.value)}
                            placeholder="Add reference notes, essay draft link, or portal login..."
                            className="input text-xs py-1 h-8"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveNotes(app.id)}
                            className="btn-primary text-xs py-1 px-3 h-8"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingNotesId(null)}
                            className="btn-secondary text-xs py-1 px-2.5 h-8"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-secondary">
                          <span className="font-medium text-primary">Notes:</span>
                          <span className="italic">{app.notes || 'No private notes attached.'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNotesId(app.id);
                              setNotesValue(app.notes);
                            }}
                            className="text-navy hover:underline inline-flex items-center gap-1 font-medium ml-1"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] text-secondary self-end sm:self-center">
                      Added {formatDate(app.dateAdded)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="card p-12 text-center max-w-md mx-auto my-12 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-navy-50 text-navy flex items-center justify-center mb-4">
            <ClipboardList className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-primary mb-1">No tracked applications</h3>
          <p className="text-xs text-secondary mb-6 leading-relaxed">
            {activeTab !== 'All'
              ? `You do not have any applications marked as "${activeTab}".`
              : 'Add scholarships from the discovery catalog to track requirements, deadlines, and submission phases.'}
          </p>
          <Link to="/discover" className="btn-primary text-xs">
            Discover Opportunities
          </Link>
        </div>
      )}
    </div>
  );
}
