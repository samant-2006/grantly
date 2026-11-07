// ─── Student Profile ─────────────────────────────────────────────
export interface StudentProfile {
  id: string;
  displayName: string;
  educationLevel: EducationLevel | '';
  degree: string;
  fieldOfStudy: FieldOfStudy | '';
  institution: string;
  academicScore: number | null;
  location: string;
  graduationYear: number | null;
  interests: string[];
  financialNeed: FinancialNeed | '';
  profileComplete: number; // 0-100
}

export type EducationLevel = 'Undergraduate' | 'Postgraduate' | 'Doctoral' | 'Diploma';

export type FieldOfStudy =
  | 'Engineering'
  | 'Medicine'
  | 'Business'
  | 'Arts & Humanities'
  | 'Science'
  | 'Law'
  | 'Education'
  | 'Social Sciences'
  | 'Computer Science'
  | 'Other';

export type FinancialNeed = 'Low' | 'Medium' | 'High' | 'Prefer not to say';

// ─── Scholarship ─────────────────────────────────────────────────
export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  description: string;
  fundingAmount: number;
  currency: string;
  educationLevels: EducationLevel[];
  fieldsOfStudy: FieldOfStudy[];
  eligibilityCriteria: EligibilityCriterion[];
  requiredDocuments: string[];
  deadline: string; // ISO date string
  applicationUrl: string;
  category: ScholarshipCategory;
  dataSource: string;
  isDemo: boolean;
  minAcademicScore?: number;
  requiresFinancialNeed?: boolean;
  locationRestriction?: string;
}

export interface EligibilityCriterion {
  label: string;
  description: string;
  type: 'education_level' | 'field_of_study' | 'academic_score' | 'financial_need' | 'location' | 'other';
}

export type ScholarshipCategory =
  | 'Merit-Based'
  | 'Need-Based'
  | 'Research'
  | 'STEM'
  | 'Arts & Culture'
  | 'Community Service'
  | 'Women in Tech'
  | 'International'
  | 'Government'
  | 'Institutional';

// ─── Match ───────────────────────────────────────────────────────
export interface MatchResult {
  scholarshipId: string;
  score: number; // 0-100
  matchedCriteria: MatchCriterion[];
  unmatchedCriteria: MatchCriterion[];
  missingInfo: string[];
  level: MatchLevel;
}

export interface MatchCriterion {
  label: string;
  status: 'matched' | 'not_matched' | 'needs_verification' | 'missing_info';
  detail: string;
}

export type MatchLevel = 'Strong Match' | 'Good Match' | 'Partial Match' | 'Low Match' | 'Incomplete Profile';

// ─── Application ─────────────────────────────────────────────────
export interface Application {
  id: string;
  scholarshipId: string;
  status: ApplicationStatus;
  dateAdded: string; // ISO date string
  submissionDate: string | null;
  notes: string;
  checklist: ChecklistItem[];
  lastUpdated: string; // ISO date string
}

export type ApplicationStatus =
  | 'Saved'
  | 'Preparing'
  | 'Ready to Apply'
  | 'Submitted'
  | 'Awarded'
  | 'Rejected'
  | 'Withdrawn';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Saved',
  'Preparing',
  'Ready to Apply',
  'Submitted',
  'Awarded',
  'Rejected',
  'Withdrawn',
];

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

// ─── Notification ────────────────────────────────────────────────
export interface AppNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

// ─── Analytics ───────────────────────────────────────────────────
export interface AnalyticsSummary {
  totalSaved: number;
  totalApplications: number;
  byStatus: Record<ApplicationStatus, number>;
  upcomingDeadlines: number;
  potentialFunding: number;
  awardedFunding: number;
  completedApplications: number;
}
