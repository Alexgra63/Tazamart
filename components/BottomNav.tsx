
import React from 'react';
import { View, Language } from '../types';

interface BottomNavProps {
    currentView: View;
    setView: (view: View) => void;
    cartCount: number;
    lang: Language;
}

const translations = {
    home: "Home",
    cart: "Basket",
    favorites: "Favs",
    history: "Orders",
    profile: "Profile"
};

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView, cartCount, lang }) => {
    const t = translations;

    const navItems = [
        { view: View.Home, icon: 'home', label: t.home },
        { view: View.Cart, icon: 'shopping_basket', label: t.cart, count: cartCount },
        { view: View.Favorites, icon: 'favorite', label: t.favorites },
        { view: View.OrderHistory, icon: 'receipt_long', label: t.history },
        { view: View.Profile, icon: 'person', label: t.profile },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 pointer-events-none">
            <div className="max-w-xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[2.5rem] shadow-premium border border-white/20 dark:border-slate-800/50 flex items-center justify-between p-2 pointer-events-auto">
                {navItems.map((item) => {
                    const isActive = currentView === item.view;
                    return (
                        <button 
                            key={item.view}
                            onClick={() => setView(item.view)}
                            className={`relative flex flex-col items-center justify-center flex-1 py-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-dark dark:hover:text-white'}`}
                        >
                            <span className="material-symbols-rounded text-[24px] mb-0.5" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                                {item.icon}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-tight">{item.label}</span>
                            {item.count !== undefined && item.count > 0 && (
                                <span className="absolute top-1 right-2 w-4 h-4 bg-primary text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-lg border-2 border-white dark:border-slate-900 animate-in zoom-in">
                                    {item.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
