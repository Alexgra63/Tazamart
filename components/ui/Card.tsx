import React from 'react';
import { cn } from './cn';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { padded?: boolean }> = ({ padded = true, className, ...rest }) => (
    <div {...rest} className={cn('bg-white dark:bg-slate-900 border border-line rounded-[var(--radius-card)]', padded && 'p-4 md:p-6', className)} />
);

export const Badge: React.FC<{ tone?: 'neutral' | 'green' | 'amber' | 'red' | 'blue'; className?: string; children: React.ReactNode }> = ({ tone = 'neutral', className, children }) => {
    const tones = {
        neutral: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-stone-300',
        green: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
        amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        red: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
        blue: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    };
    return <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone], className)}>{children}</span>;
};

export const SectionHeading: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode; className?: string }> = ({ title, subtitle, action, className }) => (
    <div className={cn('flex items-end justify-between gap-4 mb-4', className)}>
        <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink dark:text-white">{title}</h2>
            {subtitle && <p className="text-sm text-muted dark:text-stone-400 mt-1">{subtitle}</p>}
        </div>
        {action}
    </div>
);

export const EmptyState: React.FC<{ icon: string; title: string; description?: string; action?: React.ReactNode }> = ({ icon, title, description, action }) => (
    <div className="flex flex-col items-center text-center py-16 px-6 rounded-[var(--radius-card)] border border-dashed border-line bg-white/60 dark:bg-slate-900/60">
        <span className="material-symbols-rounded text-5xl text-primary/70 mb-3">{icon}</span>
        <h3 className="font-display text-xl font-semibold text-ink dark:text-white">{title}</h3>
        {description && <p className="text-sm text-muted dark:text-stone-400 mt-1 max-w-sm">{description}</p>}
        {action && <div className="mt-5">{action}</div>}
    </div>
);

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn('animate-pulse rounded-[var(--radius-card)] bg-gray-100 dark:bg-slate-800', className)} />
);

export const Price: React.FC<{ amount: number; unit?: string; className?: string }> = ({ amount, unit, className }) => (
    <span className={cn('tabular font-bold text-ink dark:text-white', className)}>
        Rs.&nbsp;{Number(amount).toLocaleString('en-PK', { maximumFractionDigits: 2 })}
        {unit && <span className="ml-1 text-xs font-medium text-muted dark:text-stone-400">/ {unit}</span>}
    </span>
);
