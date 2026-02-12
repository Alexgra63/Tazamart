
import React from 'react';
import { View } from '../types';
import { HomeIcon, TagIcon, ProfileIcon } from './Icons';

interface BottomNavProps {
    currentView: View;
    setView: (view: View) => void;
    isAdminUnlocked: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
    currentView, 
    setView, 
    isAdminUnlocked
}) => {
    // Standardizing icons to all be functional components accepting className
    const navItems = [
        { id: View.Home, label: 'Home', icon: HomeIcon },
        { id: View.OrderHistory, label: 'Orders', icon: TagIcon },
        { id: View.Favorites, label: 'Liked', icon: ({ className }: { className?: string }) => <span className={`material-symbols-rounded ${className}`}>favorite</span> },
        { id: View.Profile, label: 'Account', icon: ProfileIcon },
    ];

    if (isAdminUnlocked) {
        navItems.push({ id: View.Admin, label: 'Admin', icon: ({ className }: { className?: string }) => <span className={`material-symbols-rounded ${className}`}>settings</span> } as any);
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 px-6 py-2.5 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] transition-colors">
            {navItems.map((item: any) => {
                const isActive = currentView === item.id;
                const Icon = item.icon;
                
                return (
                    <button
                        key={item.label}
                        onClick={() => setView(item.id as View)}
                        className="flex flex-col items-center space-y-1 transition-all active:scale-90"
                    >
                        <div className={`${isActive ? 'text-primary' : 'text-gray-400'} transition-colors`}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                            {item.label}
                        </span>
                        {isActive && <div className="w-1 h-1 bg-primary rounded-full"></div>}
                    </button>
                );
            })}
        </nav>
    );
};
