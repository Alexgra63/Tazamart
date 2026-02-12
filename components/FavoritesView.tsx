
import React from 'react';
import { Product, Language } from '../types';
import { ProductCard } from './ProductCard.tsx';

interface FavoritesViewProps {
    products: Product[];
    onAddToCart: (product: Product, qty: number) => void;
    onProductClick: (product: Product) => void;
    lang: Language;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ products, onAddToCart, onProductClick, lang }) => {
    const isUrdu = lang === Language.UR;
    const title = isUrdu ? "پسندیدہ اشیاء" : "Your Favorites";
    const sub = isUrdu ? "محفوظ کی گئی چیزیں" : "Items you've saved";
    const empty = isUrdu ? "کوئی پسندیدہ چیز نہیں ہے" : "No favorites yet";

    return (
        <div className={`container mx-auto px-6 py-8 pb-32 animate-in fade-in duration-300 ${isUrdu ? 'text-right' : 'text-left'}`}>
            <div className="mb-10">
                <h2 className="text-3xl font-black text-dark dark:text-white tracking-tight">{title}</h2>
                <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest mt-1">{sub}</p>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                    {products.map(p => (
                        <ProductCard 
                            key={p.id} 
                            product={p} 
                            onAddToCart={(prod) => onAddToCart(prod, 1)} 
                            onClick={onProductClick}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-slate-900 rounded-[2.5rem] border border-gray-50 dark:border-slate-800">
                    <span className="material-symbols-rounded text-6xl text-gray-200 dark:text-slate-700 mb-4">heart_broken</span>
                    <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">{empty}</p>
                </div>
            )}
        </div>
    );
};
