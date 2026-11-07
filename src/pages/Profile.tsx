import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  GraduationCap,
  DollarSign,
  Sparkles,
  Save,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '@/store/AppContext';
import type { EducationLevel, FieldOfStudy, FinancialNeed, StudentProfile } from '@/types';

const EDUCATION_LEVELS: EducationLevel[] = ['Undergraduate', 'Postgraduate', 'Doctoral', 'Diploma'];

const FIELDS_OF_STUDY: FieldOfStudy[] = [
  'Engineering',
  'Medicine',
  'Business',
  'Arts & Humanities',
  'Science',
  'Law',
  'Education',
  'Social Sciences',
  'Computer Science',
  'Other',
];

const FINANCIAL_NEEDS: FinancialNeed[] = ['Low', 'Medium', 'High', 'Prefer not to say'];

const INTEREST_TAGS = [
  'STEM',
  'Research & Innovation',
  'Community Leadership',
  'Women in Technology',
  'First-Generation College',
  'International Studies',
  'Social Entrepreneurship',
  'Creative Arts & Design',
];

export default function Profile() {
  const { state, dispatch } = useApp();
  const { profile } = state;

  const [form, setForm] = useState<StudentProfile>({ ...profile });
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  const handleInterestToggle = (tag: string) => {
    setForm((prev) => {
      const exists = prev.interests.includes(tag);
      const updated = exists ? prev.interests.filter((t) => t !== tag) : [...prev.interests, tag];
      return { ...prev, interests: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_PROFILE', payload: form });
    setIsSavedRecently(true);
    toast.success('Student profile updated successfully!');
    setTimeout(() => setIsSavedRecently(false), 2500);
  };

  const handleLoadSample = () => {
    const sample: StudentProfile = {
      id: profile.id || 'user-1',
      displayName: 'Alex Chen',
      educationLevel: 'Undergraduate',
      degree: 'B.S. in Computer Science',
      fieldOfStudy: 'Computer Science',
      institution: 'State University of Technology',
      academicScore: 88,
      location: 'California, USA',
      graduationYear: 2027,
      interests: ['STEM', 'Research & Innovation', 'Women in Technology'],
      financialNeed: 'Medium',
      profileComplete: 100,
    };
    setForm(sample);
    dispatch({ type: 'SET_PROFILE', payload: sample });
    toast.success('Sample student profile loaded!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Student Profile
          </h1>
          <p className="text-sm text-secondary mt-1">
            Maintain your academic profile for transparent, real-time scholarship matching.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="btn-secondary text-xs self-start sm:self-auto"
        >
          <Sparkles className="h-3.5 w-3.5 text-lime-dark" />
          <span>Load Sample Profile</span>
        </button>
      </div>

      {/* Completion Meter Card */}
      <div className="card p-6 bg-gradient-to-r from-card to-lime-50/40 border-lime-dark/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-primary">Profile Completeness</span>
            <span className="badge bg-lime text-navy font-bold text-xs">
              {profile.profileComplete}%
            </span>
          </div>
          <span className="text-xs text-secondary">
            {profile.profileComplete >= 80
              ? 'Excellent accuracy for matching'
              : 'Add more details to sharpen your matches'}
          </span>
        </div>

        <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-navy h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${profile.profileComplete}%` }}
          />
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details Card */}
        <div className="card p-6 space-y-4">
          <h2 className="text-base font-semibold text-primary flex items-center gap-2 pb-2 border-b border-border">
            <User className="h-4 w-4 text-navy" />
            <span>Personal Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="displayName" className="label">
                Full Name / Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                placeholder="e.g. Maya Patel"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="location" className="label">
                Location / Country
              </label>
              <input
                id="location"
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Austin, TX, United States"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="graduationYear" className="label">
                Expected Graduation Year
              </label>
              <input
                id="graduationYear"
                type="number"
                min={2020}
                max={2035}
                value={form.graduationYear || ''}
                onChange={(e) =>
                  setForm({ ...form, graduationYear: e.target.value ? Number(e.target.value) : null })
                }
                placeholder="e.g. 2027"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Academic Details Card */}
        <div className="card p-6 space-y-4">
          <h2 className="text-base font-semibold text-primary flex items-center gap-2 pb-2 border-b border-border">
            <GraduationCap className="h-4 w-4 text-navy" />
            <span>Academic Background</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="educationLevel" className="label">
                Current Education Level
              </label>
              <select
                id="educationLevel"
                value={form.educationLevel}
                onChange={(e) => setForm({ ...form, educationLevel: e.target.value as EducationLevel })}
                className="input"
              >
                <option value="">Select Level</option>
                {EDUCATION_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fieldOfStudy" className="label">
                Primary Field of Study
              </label>
              <select
                id="fieldOfStudy"
                value={form.fieldOfStudy}
                onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value as FieldOfStudy })}
                className="input"
              >
                <option value="">Select Field</option>
                {FIELDS_OF_STUDY.map((fld) => (
                  <option key={fld} value={fld}>
                    {fld}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="degree" className="label">
                Degree / Program
              </label>
              <input
                id="degree"
                type="text"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                placeholder="e.g. B.Tech in Electronics"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="institution" className="label">
                Institution / University
              </label>
              <input
                id="institution"
                type="text"
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                placeholder="e.g. National Institute of Technology"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="academicScore" className="label">
                Academic Score / GPA Percentage
              </label>
              <input
                id="academicScore"
                type="number"
                min={0}
                max={100}
                value={form.academicScore !== null ? form.academicScore : ''}
                onChange={(e) =>
                  setForm({ ...form, academicScore: e.target.value !== '' ? Number(e.target.value) : null })
                }
                placeholder="e.g. 88 (out of 100%)"
                className="input"
              />
              <span className="text-[11px] text-secondary mt-1 block">
                Normalized percentage used for minimum threshold criteria.
              </span>
            </div>
          </div>
        </div>

        {/* Financial & Assistance Profile */}
        <div className="card p-6 space-y-4">
          <h2 className="text-base font-semibold text-primary flex items-center gap-2 pb-2 border-b border-border">
            <DollarSign className="h-4 w-4 text-navy" />
            <span>Financial Assistance Details</span>
          </h2>

          <div className="max-w-md">
            <label htmlFor="financialNeed" className="label">
              Self-Reported Need Level
            </label>
            <select
              id="financialNeed"
              value={form.financialNeed}
              onChange={(e) => setForm({ ...form, financialNeed: e.target.value as FinancialNeed })}
              className="input"
            >
              <option value="">Select Need Level (Optional)</option>
              {FINANCIAL_NEEDS.map((need) => (
                <option key={need} value={need}>
                  {need}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-lg bg-navy-50 text-xs text-secondary flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Your financial need declaration is stored solely in local client storage and evaluated only against scholarships designated as Need-Based.
            </span>
          </div>
        </div>

        {/* Interests & Special Programs */}
        <div className="card p-6 space-y-4">
          <h2 className="text-base font-semibold text-primary pb-2 border-b border-border">
            Interests & Special Eligibility Categories
          </h2>

          <p className="text-xs text-secondary">
            Select the focus areas that align with your aspirations.
          </p>

          <div className="flex flex-wrap gap-2">
            {INTEREST_TAGS.map((tag) => {
              const active = form.interests.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleInterestToggle(tag)}
                  className={`badge px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer border ${
                    active
                      ? 'bg-navy text-white border-navy'
                      : 'bg-card text-secondary border-border hover:bg-navy-50 hover:text-primary'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="btn-primary px-6 py-2.5 text-sm"
          >
            {isSavedRecently ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-lime" />
                <span>Profile Saved</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
