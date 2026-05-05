
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { View } from '../types';

interface PageViewProps {
    title: string;
    content: string;
    onBack: () => void;
}

export const PageView: React.FC<PageViewProps> = ({ title, content, onBack }) => {
    return (
        <div className="container mx-auto px-4 py-8 mb-32 max-w-4xl text-left ltr animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
                onClick={onBack}
                className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors mb-8 group"
            >
                <span className="material-symbols-rounded mr-2 transition-transform group-hover:-translate-x-1">arrow_back</span>
                Back to Shop
            </button>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-800 p-8 md:p-12">
                <h1 className="text-4xl font-black text-dark dark:text-white mb-8 tracking-tight">{title}</h1>
                
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none 
                    prose-headings:font-black prose-headings:tracking-tight prose-headings:text-dark dark:prose-headings:text-white
                    prose-p:text-gray-500 dark:prose-p:text-gray-400 prose-p:font-medium
                    prose-strong:text-dark dark:prose-strong:text-white prose-strong:font-black
                    prose-li:text-gray-500 dark:prose-li:text-gray-400 prose-li:font-medium
                    prose-ul:list-disc prose-ol:list-decimal">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
