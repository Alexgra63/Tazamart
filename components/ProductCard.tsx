
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full">
            <div 
                className="cursor-pointer relative overflow-hidden group"
                onClick={() => onClick && onClick(product)}
            >
                <img className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" src={product.image} alt={product.name} />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 
                    className="text-lg font-semibold text-dark cursor-pointer hover:text-primary transition-colors"
                    onClick={() => onClick && onClick(product)}
                >
                    {product.name}
                </h3>
                <p className="text-gray-500 mt-1">Rs. {product.price} / {product.unit}</p>
                <div className="mt-auto pt-4">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};
