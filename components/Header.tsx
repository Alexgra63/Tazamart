
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

    return (
        <header className="bg-white dark:bg-slate-900 sticky top-0 z-50 px-4 py-2 border-b border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
            <div className="container mx-auto flex items-center justify-between">
                <div 
                    className="flex items-center space-x-2 cursor-pointer transition-transform active:scale-95 select-none" 
                    onClick={handleLogoClick}
                >
                    <div className="bg-gradient-to-br from-primary to-primary-dark p-1.5 rounded-xl shadow-sm">
                        <span className="material-symbols-rounded text-white text-base leading-none">shopping_basket</span>
                    </div>
                    <span className="text-xl font-black text-dark dark:text-white tracking-tighter">TazaMart</span>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Language Toggle */}
                    <button 
                        onClick={() => setLanguage(lang === Language.EN ? Language.UR : Language.EN)}
                        className="text-[10px] font-black uppercase bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        {lang === Language.EN ? 'Urdu' : 'English'}
                    </button>

                    {/* Theme Toggle */}
                    <button 
                        onClick={() => setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light)}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-rounded">
                            {theme === Theme.Light ? 'dark_mode' : 'light_mode'}
                        </span>
                    </button>

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
                </div>
            </div>
        </header>
    );
};
