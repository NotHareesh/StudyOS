'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-indigo-400',
  trend,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-5 rounded-2xl glass-card transition-all hover:translate-y-[-2px] flex flex-col justify-between',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
          <div className="mt-1 text-2xl font-bold text-white font-mono tracking-tight">{value}</div>
        </div>

        <div className={cn('p-2.5 rounded-xl bg-slate-900/80 border border-slate-800', iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 flex items-center justify-between text-xs border-t border-white/5 pt-3">
          {subtitle && <span className="text-slate-400">{subtitle}</span>}

          {trend && (
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                trend.isPositive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
