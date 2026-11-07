import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, SearchX, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import ScholarshipCard from '@/components/scholarship/ScholarshipCard';
import FilterBar, { type FundingRange, type DeadlineRange, type SortOption } from '@/components/scholarship/FilterBar';
import { daysUntil } from '@/lib/utils';
import type { EducationLevel, FieldOfStudy, ScholarshipCategory } from '@/types';

export default function Discover() {
  const { state, getMatch } = useApp();
  const { scholarships, profile } = state;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Filter States
  const [search, setSearch] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const query = searchParams.get('q');
    if (query !== null) {
      setSearch(query);
    }
  }, [searchParams]);
  const [educationLevel, setEducationLevel] = useState('All');
  const [fieldOfStudy, setFieldOfStudy] = useState('All');
  const [category, setCategory] = useState('All');
  const [fundingRange, setFundingRange] = useState<FundingRange>('All');
  const [deadlineRange, setDeadlineRange] = useState<DeadlineRange>('All');
  const [sort, setSort] = useState<SortOption>('relevance');

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search.trim()) count++;
    if (educationLevel !== 'All') count++;
    if (fieldOfStudy !== 'All') count++;
    if (category !== 'All') count++;
    if (fundingRange !== 'All') count++;
    if (deadlineRange !== 'All') count++;
    return count;
  }, [search, educationLevel, fieldOfStudy, category, fundingRange, deadlineRange]);

  const handleClearFilters = () => {
    setSearch('');
    setEducationLevel('All');
    setFieldOfStudy('All');
    setCategory('All');
    setFundingRange('All');
    setDeadlineRange('All');
    setSort('relevance');
  };

  // Filter & Sort Logic
  const filteredScholarships = useMemo(() => {
    return scholarships
      .filter((s) => {
        // Search term
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = s.title.toLowerCase().includes(q);
          const matchProvider = s.provider.toLowerCase().includes(q);
          const matchDesc = s.description.toLowerCase().includes(q);
          const matchCategory = s.category.toLowerCase().includes(q);
          if (!matchTitle && !matchProvider && !matchDesc && !matchCategory) return false;
        }

        // Education Level
        if (educationLevel !== 'All') {
          if (!s.educationLevels.includes(educationLevel as EducationLevel)) return false;
        }

        // Field of Study
        if (fieldOfStudy !== 'All') {
          if (!s.fieldsOfStudy.includes(fieldOfStudy as FieldOfStudy)) return false;
        }

        // Category
        if (category !== 'All') {
          if (s.category !== category) return false;
        }

        // Funding Range
        if (fundingRange === 'Under $10,000' && s.fundingAmount >= 10000) return false;
        if (fundingRange === '$10,000-$20,000' && (s.fundingAmount < 10000 || s.fundingAmount > 20000)) return false;
        if (fundingRange === 'Over $20,000' && s.fundingAmount <= 20000) return false;

        // Deadline Range
        const days = daysUntil(s.deadline);
        if (deadlineRange === 'Within 30 days' && (days < 0 || days > 30)) return false;
        if (deadlineRange === 'Within 90 days' && (days < 0 || days > 90)) return false;
        if (deadlineRange === 'Within 6 months' && (days < 0 || days > 180)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sort === 'relevance') {
          const matchA = getMatch(a).score;
          const matchB = getMatch(b).score;
          return matchB - matchA;
        }
        if (sort === 'deadline') {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        if (sort === 'funding') {
          return b.fundingAmount - a.fundingAmount;
        }
        return 0;
      });
  }, [scholarships, search, educationLevel, fieldOfStudy, category, fundingRange, deadlineRange, sort, getMatch]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Discover Scholarships
          </h1>
          <p className="text-sm text-secondary mt-1">
            Browse verified opportunities, match against your student profile, and find relevant funding.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-secondary bg-navy-50 px-3 py-1.5 rounded-lg border border-border w-fit">
          <Sparkles className="h-4 w-4 text-lime-dark" />
          <span>Transparent matching algorithm active</span>
        </div>
      </div>

      {/* Filter and Search Bar Component */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        educationLevel={educationLevel}
        onEducationLevelChange={setEducationLevel}
        fieldOfStudy={fieldOfStudy}
        onFieldOfStudyChange={setFieldOfStudy}
        category={category}
        onCategoryChange={setCategory}
        fundingRange={fundingRange}
        onFundingRangeChange={setFundingRange}
        deadlineRange={deadlineRange}
        onDeadlineRangeChange={setDeadlineRange}
        sort={sort}
        onSortChange={setSort}
        onClear={handleClearFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Results Count & Current Active Filters Summary */}
      <div className="flex items-center justify-between text-xs text-secondary px-1">
        <span>
          Showing <strong className="text-primary">{filteredScholarships.length}</strong> of{' '}
          {scholarships.length} opportunities
        </span>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearFilters}
            className="text-navy hover:underline font-medium cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Scholarship Grid or Empty State */}
      {filteredScholarships.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {filteredScholarships.map((scholarship) => {
              const matchResult = getMatch(scholarship);
              return (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  matchResult={matchResult}
                  onViewDetails={(id) => navigate(`/scholarship/${id}`)}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="card p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-navy-50 flex items-center justify-center mb-4 text-secondary">
            <SearchX className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-primary mb-1">No scholarships matched</h3>
          <p className="text-xs text-secondary mb-5">
            We couldn't find any opportunities matching your specific filters. Try loosening your criteria or search query.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="btn-primary text-xs"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
