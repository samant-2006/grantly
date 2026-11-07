import { cn } from '@/lib/utils';
import type { MatchLevel } from '@/types';

interface MatchBadgeProps {
  level: MatchLevel;
  score: number;
  compact?: boolean;
}

const levelConfig: Record<MatchLevel, { bg: string; text: string; border: string }> = {
  'Strong Match': {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  'Good Match': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  'Partial Match': {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  'Low Match': {
    bg: 'bg-gray-50',
    text: 'text-gray-500',
    border: 'border-gray-200',
  },
  'Incomplete Profile': {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
  },
};

export default function MatchBadge({ level, score, compact = false }: MatchBadgeProps) {
  const config = levelConfig[level];

  if (compact) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
          config.bg,
          config.text,
          config.border
        )}
        title={`${level} — ${score}%`}
      >
        <span className="truncate">{level}</span>
        <span className="font-semibold">{score}%</span>
      </span>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium',
        config.bg,
        config.text,
        config.border
      )}
    >
      {/* colored dot indicator */}
      <span
        className={cn(
          'inline-block h-2 w-2 rounded-full',
          level === 'Strong Match' && 'bg-green-500',
          level === 'Good Match' && 'bg-blue-500',
          level === 'Partial Match' && 'bg-yellow-500',
          level === 'Low Match' && 'bg-gray-400',
          level === 'Incomplete Profile' && 'bg-orange-400'
        )}
        aria-hidden
      />
      <span>{level}</span>
      <span className="ml-auto font-semibold">{score}%</span>
    </div>
  );
}
