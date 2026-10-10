import React from 'react';
import { Product, Language } from '../types.ts';
import { Price } from './ui';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onClick?: (product: Product) => void;
    lang: Language;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
    return (
        <article
            className="group flex flex-col h-full bg-white dark:bg-slate-900 border border-line rounded-[var(--radius-card)] overflow-hidden text-left transition-shadow hover:shadow-premium cursor-pointer"
            onClick={() => onClick && onClick(product)}
        >
            <div className="relative aspect-[4/3] bg-gray-50 dark:bg-slate-800 overflow-hidden">
                <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300?text=Tazamart'; }}
                />
                <span className="absolute bottom-2 left-2 rounded-md bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 text-[11px] font-semibold text-ink dark:text-stone-100">
                    {product.unit}
                </span>
            </div>
            <div className="flex flex-col flex-1 p-3 md:p-4 gap-2">
                <h3 className="text-sm md:text-base font-semibold text-ink dark:text-white line-clamp-2 leading-snug">{product.name}</h3>
                <div className="mt-auto flex items-center justify-between gap-2">
                    <Price amount={product.price} unit={product.unit} className="text-base md:text-lg" />
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                        aria-label={`Add ${product.name} to basket`}
                        className="shrink-0 h-9 px-3 rounded-[10px] bg-primary-soft text-primary-dark dark:text-primary hover:bg-primary hover:text-white dark:hover:text-stone-950 text-sm font-semibold flex items-center gap-1 transition-colors"
                    >
                        <span className="material-symbols-rounded text-[18px]">add</span>
                        <span className="hidden sm:inline">Add</span>
                    </button>
                </div>
            </div>
        </article>
    );
};
