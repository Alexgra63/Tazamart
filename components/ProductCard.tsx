
import React from 'react';
import { Product } from '../types.ts';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
    return (
        <div 
            className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-soft border border-gray-50 dark:border-slate-800 flex flex-col h-full transition-all hover:shadow-premium hover:-translate-y-0.5 active:scale-[0.98] group"
            onClick={() => onClick && onClick(product)}
        >
            <div className="relative overflow-hidden aspect-square">
                <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    src={product.image} 
                    alt={product.name} 
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400?text=No+Image'; }}
                />
                <div className="absolute top-2 left-2">
                    <span className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-dark dark:text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tight shadow-sm">
                        {product.unit}
                    </span>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                    }}
                    className="absolute bottom-3 right-3 bg-gradient-to-br from-primary to-primary-dark text-white p-2 rounded-xl shadow-premium hover:shadow-lg transition-all active:scale-90"
                >
                    <span className="material-symbols-rounded text-[18px]">add</span>
                </button>
            </div>
            <div className="p-3">
                <h3 className="text-xs font-black text-dark dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                <div className="flex items-center mt-1">
                    <span className="text-sm font-black text-dark dark:text-white">Rs. {product.price}</span>
                    <span className="text-[9px] text-gray-400 font-bold ml-1 uppercase tracking-tighter">/ {product.unit}</span>
                </div>
            </div>
        </div>
    );
};
