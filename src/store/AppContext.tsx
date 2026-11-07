import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type {
  StudentProfile,
  Scholarship,
  Application,
  ApplicationStatus,
  ChecklistItem,
  MatchResult,
  MatchCriterion,
  MatchLevel,
  AnalyticsSummary,
} from '@/types';
import { demoScholarships } from '@/data/scholarships';

// ─── State ───────────────────────────────────────────────────────
interface AppState {
  profile: StudentProfile;
  scholarships: Scholarship[];
  savedScholarshipIds: string[];
  applications: Application[];
}

const defaultProfile: StudentProfile = {
  id: 'user-1',
  displayName: '',
  educationLevel: '',
  degree: '',
  fieldOfStudy: '',
  institution: '',
  academicScore: null,
  location: '',
  graduationYear: null,
  interests: [],
  financialNeed: '',
  profileComplete: 0,
};

function calculateProfileCompletion(p: StudentProfile): number {
  const fields = [
    p.displayName,
    p.educationLevel,
    p.degree,
    p.fieldOfStudy,
    p.institution,
    p.academicScore !== null ? 'yes' : '',
    p.location,
    p.graduationYear !== null ? 'yes' : '',
    p.financialNeed,
  ];
  const filled = fields.filter((f) => f !== '' && f !== null && f !== undefined).length;
  return Math.round((filled / fields.length) * 100);
}

// ─── Actions ─────────────────────────────────────────────────────
type Action =
  | { type: 'SET_PROFILE'; payload: Partial<StudentProfile> }
  | { type: 'TOGGLE_SAVE_SCHOLARSHIP'; payload: string }
  | { type: 'ADD_APPLICATION'; payload: Application }
  | { type: 'UPDATE_APPLICATION_STATUS'; payload: { id: string; status: ApplicationStatus } }
  | { type: 'UPDATE_APPLICATION_NOTES'; payload: { id: string; notes: string } }
  | { type: 'TOGGLE_CHECKLIST_ITEM'; payload: { applicationId: string; itemId: string } }
  | { type: 'REMOVE_APPLICATION'; payload: string }
  | { type: 'SET_APPLICATION_SUBMISSION_DATE'; payload: { id: string; date: string } }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PROFILE': {
      const updated = { ...state.profile, ...action.payload };
      updated.profileComplete = calculateProfileCompletion(updated);
      return { ...state, profile: updated };
    }
    case 'TOGGLE_SAVE_SCHOLARSHIP': {
      const id = action.payload;
      const saved = state.savedScholarshipIds.includes(id)
        ? state.savedScholarshipIds.filter((s) => s !== id)
        : [...state.savedScholarshipIds, id];
      return { ...state, savedScholarshipIds: saved };
    }
    case 'ADD_APPLICATION': {
      if (state.applications.find((a) => a.scholarshipId === action.payload.scholarshipId)) {
        return state;
      }
      return { ...state, applications: [...state.applications, action.payload] };
    }
    case 'UPDATE_APPLICATION_STATUS': {
      return {
        ...state,
        applications: state.applications.map((a) =>
          a.id === action.payload.id
            ? { ...a, status: action.payload.status, lastUpdated: new Date().toISOString() }
            : a
        ),
      };
    }
    case 'UPDATE_APPLICATION_NOTES': {
      return {
        ...state,
        applications: state.applications.map((a) =>
          a.id === action.payload.id
            ? { ...a, notes: action.payload.notes, lastUpdated: new Date().toISOString() }
            : a
        ),
      };
    }
    case 'TOGGLE_CHECKLIST_ITEM': {
      return {
        ...state,
        applications: state.applications.map((a) =>
          a.id === action.payload.applicationId
            ? {
                ...a,
                checklist: a.checklist.map((item) =>
                  item.id === action.payload.itemId ? { ...item, completed: !item.completed } : item
                ),
                lastUpdated: new Date().toISOString(),
              }
            : a
        ),
      };
    }
    case 'REMOVE_APPLICATION': {
      return {
        ...state,
        applications: state.applications.filter((a) => a.id !== action.payload),
      };
    }
    case 'SET_APPLICATION_SUBMISSION_DATE': {
      return {
        ...state,
        applications: state.applications.map((a) =>
          a.id === action.payload.id
            ? { ...a, submissionDate: action.payload.date, lastUpdated: new Date().toISOString() }
            : a
        ),
      };
    }
    case 'LOAD_STATE': {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}

// ─── Persistence ─────────────────────────────────────────────────
const STORAGE_KEY = 'grantly_state';

function loadPersistedState(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      profile: parsed.profile ? { ...defaultProfile, ...parsed.profile } : undefined,
      savedScholarshipIds: Array.isArray(parsed.savedScholarshipIds) ? parsed.savedScholarshipIds : undefined,
      applications: Array.isArray(parsed.applications) ? parsed.applications : undefined,
    };
  } catch {
    return {};
  }
}

function persistState(state: AppState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        profile: state.profile,
        savedScholarshipIds: state.savedScholarshipIds,
        applications: state.applications,
      })
    );
  } catch {
    // Storage full or unavailable
  }
}

// ─── Matching Engine ─────────────────────────────────────────────
export function computeMatch(scholarship: Scholarship, profile: StudentProfile): MatchResult {
  const matched: MatchCriterion[] = [];
  const unmatched: MatchCriterion[] = [];
  const missingInfo: string[] = [];
  let totalCriteria = 0;
  let matchedCount = 0;

  // Education Level
  totalCriteria++;
  if (!profile.educationLevel) {
    missingInfo.push('Education Level');
    unmatched.push({ label: 'Education Level', status: 'missing_info', detail: 'Not provided in profile' });
  } else if (scholarship.educationLevels.includes(profile.educationLevel)) {
    matchedCount++;
    matched.push({ label: 'Education Level', status: 'matched', detail: `${profile.educationLevel} is eligible` });
  } else {
    unmatched.push({
      label: 'Education Level',
      status: 'not_matched',
      detail: `Requires ${scholarship.educationLevels.join(' or ')}`,
    });
  }

  // Field of Study
  totalCriteria++;
  if (!profile.fieldOfStudy) {
    missingInfo.push('Field of Study');
    unmatched.push({ label: 'Field of Study', status: 'missing_info', detail: 'Not provided in profile' });
  } else if (scholarship.fieldsOfStudy.includes(profile.fieldOfStudy)) {
    matchedCount++;
    matched.push({ label: 'Field of Study', status: 'matched', detail: `${profile.fieldOfStudy} is eligible` });
  } else {
    unmatched.push({
      label: 'Field of Study',
      status: 'not_matched',
      detail: `Requires ${scholarship.fieldsOfStudy.join(', ')}`,
    });
  }

  // Academic Score
  if (scholarship.minAcademicScore) {
    totalCriteria++;
    if (profile.academicScore === null) {
      missingInfo.push('Academic Score');
      unmatched.push({ label: 'Academic Score', status: 'missing_info', detail: 'Not provided in profile' });
    } else if (profile.academicScore >= scholarship.minAcademicScore) {
      matchedCount++;
      matched.push({
        label: 'Academic Score',
        status: 'matched',
        detail: `${profile.academicScore}% meets minimum ${scholarship.minAcademicScore}%`,
      });
    } else {
      unmatched.push({
        label: 'Academic Score',
        status: 'not_matched',
        detail: `Requires minimum ${scholarship.minAcademicScore}%, you have ${profile.academicScore}%`,
      });
    }
  }

  // Financial Need
  if (scholarship.requiresFinancialNeed) {
    totalCriteria++;
    if (!profile.financialNeed || profile.financialNeed === 'Prefer not to say') {
      missingInfo.push('Financial Need Information');
      unmatched.push({
        label: 'Financial Need',
        status: 'needs_verification',
        detail: 'Financial need information required',
      });
    } else if (profile.financialNeed === 'High' || profile.financialNeed === 'Medium') {
      matchedCount++;
      matched.push({ label: 'Financial Need', status: 'matched', detail: 'Financial need criteria appears to match' });
    } else {
      unmatched.push({
        label: 'Financial Need',
        status: 'needs_verification',
        detail: 'This scholarship is for students with demonstrated financial need',
      });
    }
  }

  // Other criteria (needs manual verification)
  scholarship.eligibilityCriteria
    .filter((c) => c.type === 'other')
    .forEach((c) => {
      totalCriteria++;
      unmatched.push({ label: c.label, status: 'needs_verification', detail: c.description });
    });

  const score = totalCriteria > 0 ? Math.round((matchedCount / totalCriteria) * 100) : 0;

  let level: MatchLevel;
  if (missingInfo.length > 2) {
    level = 'Incomplete Profile';
  } else if (score >= 75) {
    level = 'Strong Match';
  } else if (score >= 50) {
    level = 'Good Match';
  } else if (score >= 25) {
    level = 'Partial Match';
  } else {
    level = 'Low Match';
  }

  return { scholarshipId: scholarship.id, score, matchedCriteria: matched, unmatchedCriteria: unmatched, missingInfo, level };
}

// ─── Analytics ───────────────────────────────────────────────────
export function computeAnalytics(state: AppState): AnalyticsSummary {
  const now = new Date();
  const byStatus: Record<string, number> = {};
  let potentialFunding = 0;
  let awardedFunding = 0;
  let completedApplications = 0;
  let upcomingDeadlines = 0;

  for (const app of state.applications) {
    byStatus[app.status] = (byStatus[app.status] || 0) + 1;
    const sch = state.scholarships.find((s) => s.id === app.scholarshipId);
    if (sch) {
      if (app.status === 'Awarded') {
        awardedFunding += sch.fundingAmount;
        completedApplications++;
      } else if (app.status === 'Submitted') {
        potentialFunding += sch.fundingAmount;
        completedApplications++;
      } else if (app.status !== 'Rejected' && app.status !== 'Withdrawn') {
        potentialFunding += sch.fundingAmount;
      }
      if (new Date(sch.deadline) > now && app.status !== 'Submitted' && app.status !== 'Awarded' && app.status !== 'Rejected' && app.status !== 'Withdrawn') {
        upcomingDeadlines++;
      }
    }
  }

  return {
    totalSaved: state.savedScholarshipIds.length,
    totalApplications: state.applications.length,
    byStatus: byStatus as AnalyticsSummary['byStatus'],
    upcomingDeadlines,
    potentialFunding,
    awardedFunding,
    completedApplications,
  };
}

// ─── Context ─────────────────────────────────────────────────────
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  getScholarship: (id: string) => Scholarship | undefined;
  getMatch: (scholarship: Scholarship) => MatchResult;
  getApplication: (scholarshipId: string) => Application | undefined;
  isSaved: (scholarshipId: string) => boolean;
  analytics: AnalyticsSummary;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const persisted = loadPersistedState();
  const initialProfile = persisted.profile || { ...defaultProfile };
  initialProfile.profileComplete = calculateProfileCompletion(initialProfile);

  const [state, dispatch] = useReducer(reducer, {
    profile: initialProfile,
    scholarships: demoScholarships,
    savedScholarshipIds: persisted.savedScholarshipIds || [],
    applications: persisted.applications || [],
  });

  useEffect(() => {
    persistState(state);
  }, [state]);

  const getScholarship = (id: string) => state.scholarships.find((s) => s.id === id);
  const getMatch = (scholarship: Scholarship) => computeMatch(scholarship, state.profile);
  const getApplication = (scholarshipId: string) => state.applications.find((a) => a.scholarshipId === scholarshipId);
  const isSaved = (scholarshipId: string) => state.savedScholarshipIds.includes(scholarshipId);
  const analytics = computeAnalytics(state);

  return (
    <AppContext.Provider value={{ state, dispatch, getScholarship, getMatch, getApplication, isSaved, analytics }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
