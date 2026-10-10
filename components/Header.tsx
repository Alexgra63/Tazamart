import React from 'react';
import { View, Language, Theme } from '../types.ts';
import { IconButton } from './ui';

interface HeaderProps {
    cartItemCount: number;
    currentView?: View;
    setView: (view: View) => void;
    lang: Language;
    theme: Theme;
    setLanguage: (lang: Language) => void;
    setTheme: (theme: Theme) => void;
}

const navItems = [
    { id: View.Home, label: 'Shop', icon: 'storefront' },
    { id: View.OrderHistory, label: 'Orders', icon: 'receipt_long' },
    { id: View.Favorites, label: 'Saved', icon: 'favorite' },
    { id: View.Profile, label: 'Account', icon: 'person' },
];

export const Header: React.FC<HeaderProps> = ({ cartItemCount, currentView, setView, theme, setTheme }) => {
    return (
        <header className="sticky top-0 z-50 bg-light/85 dark:bg-dark/85 backdrop-blur-lg border-b border-line no-print">
            <div className="max-w-7xl mx-auto h-16 px-4 md:px-8 flex items-center justify-between gap-4" dir="ltr">
                <button onClick={() => setView(View.Home)} className="flex items-center gap-2.5 select-none" aria-label="Tazamart home">
                    <img src="/logo.png" alt="" className="h-9 w-9 object-contain" />
                    <span className="leading-tight text-left">
                        <span className="block font-display text-xl md:text-2xl font-semibold text-ink dark:text-white">Tazamart</span>
                        <span className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-muted dark:text-stone-400">
                            <span className="material-symbols-rounded text-[14px] text-primary">location_on</span>
                            Islamabad · same-day delivery
                        </span>
                    </span>
                </button>

                <nav className="hidden md:flex items-center gap-1" aria-label="Main">
                    {navItems.map((item) => {
                        const active = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setView(item.id)}
                                aria-current={active ? 'page' : undefined}
                                className={`h-10 px-3.5 rounded-[10px] text-sm font-semibold flex items-center gap-2 transition-colors ${active ? 'bg-primary-soft text-primary-dark dark:text-primary' : 'text-muted dark:text-stone-300 hover:text-ink dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                            >
                                <span className="material-symbols-rounded text-[20px]" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-1">
                    <IconButton
                        icon={theme === Theme.Light ? 'dark_mode' : 'light_mode'}
                        label={theme === Theme.Light ? 'Switch to dark mode' : 'Switch to light mode'}
                        onClick={() => setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light)}
                    />
                    <button
                        onClick={() => setView(View.Cart)}
                        className="relative ml-1 h-10 pl-3 pr-4 rounded-[10px] bg-primary text-white dark:text-stone-950 hover:bg-primary-dark flex items-center gap-2 text-sm font-semibold transition-colors"
                        aria-label={`Basket, ${Math.floor(cartItemCount)} items`}
                    >
                        <span className="material-symbols-rounded text-[20px]">shopping_basket</span>
                        <span className="hidden sm:inline">Basket</span>
                        {cartItemCount > 0 && (
                            <span className="min-w-5 h-5 px-1 rounded-full bg-secondary text-stone-950 text-[11px] font-bold flex items-center justify-center tabular">
                                {Math.floor(cartItemCount)}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};
