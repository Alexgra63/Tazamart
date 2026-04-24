
import React from 'react';
import { Product, View, Language } from '../types';
import { ProductCard } from './ProductCard';

interface FavoritesViewProps {
    favorites: Product[];
    onAddToCart: (product: Product, quantity: number) => void;
    onProductClick: (product: Product) => void;
    setView: (view: View) => void;
    lang: Language;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ 
    favorites, onAddToCart, onProductClick, setView, lang 
}) => {
    const t = {
        title: "Favorites",
        empty: "No favorites yet.",
        start: "Browse Items"
    };

    return (
        <div className="container mx-auto px-4 py-8 pb-32 animate-in fade-in duration-500 ltr text-left">
            <h2 className="text-3xl font-black text-dark dark:text-white mb-8 tracking-tight">{t.title}</h2>
            
            {favorites.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-gray-100 dark:border-slate-800">
                    <span className="material-symbols-rounded text-6xl text-gray-200 dark:text-slate-700 mb-4">favorite</span>
                    <p className="text-xl font-bold text-gray-400">{t.empty}</p>
                    <button onClick={() => setView(View.Home)} className="mt-8 bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-premium">
                        {t.start}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {favorites.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onAddToCart={(p) => onAddToCart(p, 1)} 
                            onClick={onProductClick}
                            lang={lang}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
