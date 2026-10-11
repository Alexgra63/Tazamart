import React from 'react';
import { View, Language } from '../types';

interface BottomNavProps {
    currentView: View;
    setView: (view: View) => void;
    cartCount: number;
    lang: Language;
    isAdminUnlocked?: boolean;
}

type NavItem = { view: View; icon: string; label: string; count?: number };

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView, cartCount, isAdminUnlocked }) => {
    const navItems: NavItem[] = [
        { view: View.Home, icon: 'storefront', label: 'Shop' },
        { view: View.Favorites, icon: 'favorite', label: 'Saved' },
        { view: View.Cart, icon: 'shopping_basket', label: 'Basket', count: Math.floor(cartCount) },
        { view: View.OrderHistory, icon: 'receipt_long', label: 'Orders' },
        { view: View.Profile, icon: 'person', label: 'Account' },
    ];
    if (isAdminUnlocked) navItems.push({ view: View.Admin, icon: 'admin_panel_settings', label: 'Admin' });

    return (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-line pb-[env(safe-area-inset-bottom)] no-print" aria-label="Main">
            <div className="flex items-stretch justify-around h-16" dir="ltr">
                {navItems.map((item) => {
                    const isActive = currentView === item.view;
                    return (
                        <button
                            key={item.view}
                            onClick={() => setView(item.view)}
                            aria-current={isActive ? 'page' : undefined}
                            className={`relative flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors ${isActive ? 'text-primary' : 'text-muted dark:text-stone-400'}`}
                        >
                            {isActive && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />}
                            <span className="material-symbols-rounded text-[24px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                            <span className="text-[11px] font-semibold">{item.label}</span>
                            {!!item.count && item.count > 0 && (
                                <span className="absolute top-2 left-1/2 ml-2 min-w-[18px] h-[18px] px-1 bg-secondary text-stone-950 text-[10px] font-bold flex items-center justify-center rounded-full tabular">
                                    {item.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
