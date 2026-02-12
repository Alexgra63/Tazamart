
import React from 'react';
import { View } from '../types';

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
    const navItems = [
        { id: View.Home, label: 'Home', icon: 'home' },
        { id: View.OrderHistory, label: 'Orders', icon: 'receipt_long' },
        { id: View.Favorites, label: 'Liked', icon: 'favorite' },
        { id: View.Profile, label: 'Account', icon: 'person' },
    ];

    if (isAdminUnlocked) {
        navItems.push({ id: View.Admin, label: 'Admin', icon: 'settings' });
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 px-2 py-3 flex justify-around items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] transition-colors">
            {navItems.map((item) => {
                const isActive = currentView === item.id;
                
                return (
                    <button
                        key={item.label}
                        onClick={() => setView(item.id)}
                        className={`flex flex-col items-center justify-center min-w-[64px] transition-all duration-300 ${
                            isActive 
                                ? 'text-primary' 
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                        }`}
                    >
                        <span className={`material-symbols-rounded text-[26px] mb-0.5 transition-all ${isActive ? 'scale-110' : 'scale-100'}`}>
                            {item.icon}
                        </span>
                        {isActive ? (
                            <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 duration-300">
                                {item.label}
                            </span>
                        ) : (
                            <div className="h-[13px]"></div> // Placeholder to prevent jump
                        )}
                    </button>
                );
            })}
        </nav>
    );
};
