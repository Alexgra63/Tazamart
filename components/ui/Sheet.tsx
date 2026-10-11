import React from 'react';
import { IconButton } from './Button';

/* ------------------------------------------------------------ Sheet (bottom sheet on mobile, dialog on desktop) */
export const Sheet: React.FC<{ title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode }> = ({ title, onClose, children, footer }) => (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
        <div className="w-full md:max-w-xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-t-2xl md:rounded-2xl animate-in slide-in-from-bottom-8 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3 px-4 md:px-6 h-14 border-b border-line shrink-0">
                <h2 className="text-lg font-semibold text-ink dark:text-white truncate">{title}</h2>
                <IconButton icon="close" label="Close" onClick={onClose} />
            </div>
            <div className="overflow-y-auto px-4 md:px-6 py-4 flex-1">{children}</div>
            {footer && <div className="shrink-0 border-t border-line px-4 md:px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex gap-3">{footer}</div>}
        </div>
    </div>
);

