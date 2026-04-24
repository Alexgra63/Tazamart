
import React, { useState } from 'react';
import { View, Language, Theme } from '../types.ts';
import { ShoppingCartIcon } from './Icons.tsx';

interface HeaderProps {
    cartItemCount: number;
    setView: (view: View) => void;
    onUnlockAdmin: () => void;
    lang: Language;
    theme: Theme;
    setLanguage: (lang: Language) => void;
    setTheme: (theme: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    cartItemCount, setView, onUnlockAdmin, lang, theme, setLanguage, setTheme 
}) => {
    const [clickCount, setClickCount] = useState(0);

    const handleLogoClick = () => {
        const newCount = clickCount + 1;
        setClickCount(newCount);
        if (newCount >= 5) {
            onUnlockAdmin();
            setClickCount(0);
        }
        setView(View.Home);
    };

    const t = { home: 'Home', orders: 'Orders', liked: 'Liked', account: 'Account' };

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 px-4 py-3 md:py-4 border-b border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
            <div className="max-w-7xl mx-auto flex items-center justify-between ltr">
                <div 
                    className="flex items-center space-x-3 cursor-pointer transition-transform active:scale-95 select-none" 
                    onClick={handleLogoClick}
                >
                    <div className="bg-gradient-to-br from-primary to-primary-dark p-2 rounded-2xl shadow-premium">
                        <span className="material-symbols-rounded text-white text-lg leading-none">shopping_basket</span>
                    </div>
                    <span className="text-xl md:text-2xl font-black text-dark dark:text-white tracking-tighter">TazaMart</span>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1 mr-4 ml-0">
                        {[
                            { id: View.Home, label: t.home, icon: 'home' },
                            { id: View.OrderHistory, label: t.orders, icon: 'receipt_long' },
                            { id: View.Favorites, label: t.liked, icon: 'favorite' },
                            { id: View.Profile, label: t.account, icon: 'person' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setView(item.id)}
                                className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary hover:bg-primary/5 transition-all flex items-center space-x-2"
                            >
                                <span className="material-symbols-rounded text-[20px]">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Cart Button */}
                    <button 
                        onClick={() => setView(View.Cart)} 
                        className="bg-gray-50 dark:bg-slate-800 p-2 rounded-xl relative hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shadow-soft"
                    >
                        <ShoppingCartIcon className="h-5 w-5 text-dark dark:text-white" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-gradient-to-br from-primary to-primary-dark text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                                {Math.floor(cartItemCount)}
                            </span>
                        )}
                    </button>
                    
                    {/* Theme Toggle Button */}
                    <button 
                        onClick={() => setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light)}
                        className="bg-gray-50 dark:bg-slate-800 p-2 rounded-xl text-gray-400 hover:text-primary transition-colors shadow-soft ml-2"
                    >
                        <span className="material-symbols-rounded text-[20px]">
                            {theme === Theme.Light ? 'dark_mode' : 'light_mode'}
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
};
