import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accent?: string;
  subtitle?: string;
}

export default function StatCard({ title, value, icon: Icon, accent, subtitle }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-xl border border-[#E5E9E5] bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#687386] truncate">{title}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-[#172033]">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-[#687386]">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            accent || 'bg-[#F7F8F5]'
          )}
        >
          <Icon className="h-5 w-5 text-[#172033]" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
}
