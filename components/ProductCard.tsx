import React from 'react';
import { Product } from '../types';
import { PlusIcon } from './Icons';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
    return (
        <div 
            className="bg-white rounded-[2rem] overflow-hidden shadow-soft border border-gray-50 flex flex-col h-full transition-all hover:shadow-premium hover:-translate-y-1 active:scale-[0.98] group"
            onClick={() => onClick && onClick(product)}
        >
            <div className="relative overflow-hidden aspect-square">
                <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    src={product.image} 
                    alt={product.name} 
                />
                <div className="absolute top-3 left-3">
                    <span className="bg-white/80 backdrop-blur-md text-dark text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tight shadow-sm">
                        {product.unit}
                    </span>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                    }}
                    className="absolute bottom-4 right-4 bg-gradient-to-br from-primary to-primary-dark text-white p-3 rounded-2xl shadow-premium hover:shadow-lg transition-all active:scale-90"
                >
                    <PlusIcon className="h-5 w-5" />
                </button>
            </div>
            <div className="p-5">
                <h3 className="text-sm font-black text-dark line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                <div className="flex items-center mt-2">
                    <span className="text-lg font-black text-dark">Rs. {product.price}</span>
                    <span className="text-[10px] text-gray-400 font-bold ml-1 uppercase tracking-tighter">per {product.unit}</span>
                </div>
            </div>
        </div>
    );
};