import React from 'react';
import { cn } from './cn';

interface Props {
    value: number;
    onChange: (v: number) => void;
    step?: number;
    min?: number;
    size?: 'sm' | 'md';
    className?: string;
}

export const QuantityStepper: React.FC<Props> = ({ value, onChange, step = 1, min = 0, size = 'md', className }) => {
    const h = size === 'sm' ? 'h-9' : 'h-11';
    const round = (n: number) => parseFloat(n.toFixed(2));
    return (
        <div className={cn('inline-flex items-center rounded-[10px] border border-line bg-white dark:bg-slate-900 overflow-hidden', h, className)}>
            <button type="button" aria-label="Decrease" onClick={(e) => { e.stopPropagation(); onChange(Math.max(min, round(value - step))); }}
                className="w-9 h-full flex items-center justify-center text-ink dark:text-stone-100 hover:bg-gray-100 dark:hover:bg-slate-800">
                <span className="material-symbols-rounded text-[18px]">remove</span>
            </button>
            <span className="min-w-10 px-1 text-center text-sm font-bold tabular text-ink dark:text-white">{value}</span>
            <button type="button" aria-label="Increase" onClick={(e) => { e.stopPropagation(); onChange(round(value + step)); }}
                className="w-9 h-full flex items-center justify-center text-primary hover:bg-primary-soft">
                <span className="material-symbols-rounded text-[18px]">add</span>
            </button>
        </div>
    );
};
