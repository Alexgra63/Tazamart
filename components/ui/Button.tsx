import React from 'react';
import { cn } from './cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    icon?: string;
    fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
    primary: 'bg-primary text-white dark:text-stone-950 hover:bg-primary-dark shadow-soft',
    secondary: 'bg-secondary text-stone-950 hover:bg-secondary-dark',
    ghost: 'bg-transparent text-ink dark:text-stone-100 hover:bg-gray-100 dark:hover:bg-slate-800',
    outline: 'bg-white dark:bg-slate-900 text-ink dark:text-stone-100 border border-line hover:border-primary hover:text-primary',
    danger: 'bg-red-600 text-white hover:bg-red-700',
};
const sizes: Record<Size, string> = {
    sm: 'h-9 px-3 text-sm gap-1.5',
    md: 'h-11 px-4 text-sm gap-2',
    lg: 'h-13 px-6 text-base gap-2',
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', icon, fullWidth, className, children, ...rest }) => (
    <button
        {...rest}
        className={cn(
            'inline-flex items-center justify-center rounded-[10px] font-semibold transition-colors duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
            variants[variant], sizes[size], fullWidth && 'w-full', className
        )}
    >
        {icon && <span className="material-symbols-rounded text-[20px] leading-none">{icon}</span>}
        {children}
    </button>
);

export const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: string; label: string; badge?: number }> = ({ icon, label, badge, className, ...rest }) => (
    <button
        {...rest}
        aria-label={label}
        title={label}
        className={cn('relative inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-ink dark:text-stone-100 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors', className)}
    >
        <span className="material-symbols-rounded text-[22px] leading-none">{icon}</span>
        {!!badge && badge > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-secondary text-stone-950 text-[11px] font-bold flex items-center justify-center tabular ring-2 ring-white dark:ring-slate-900">
                {Math.floor(badge)}
            </span>
        )}
    </button>
);
