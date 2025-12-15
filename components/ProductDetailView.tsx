
import React, { useState } from 'react';
import { Product, View } from '../types';
import { PlusIcon, MinusIcon } from './Icons';

interface ProductDetailViewProps {
    product: Product;
    onAddToCart: (product: Product, quantity: number) => void;
    onBack: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onAddToCart, onBack }) => {
    // Default quantity is 1
    const [quantity, setQuantity] = useState(1);
    
    // Logic for step based on unit type
    const isWeightBased = product.unit === 'kg';
    const step = isWeightBased ? 0.25 : 1;
    const minQuantity = isWeightBased ? 0.25 : 1;

    const handleIncrement = () => {
        setQuantity(prev => parseFloat((prev + step).toFixed(2)));
    };

    const handleDecrement = () => {
        setQuantity(prev => Math.max(minQuantity, parseFloat((prev - step).toFixed(2))));
    };

    const handleAddToCart = () => {
        onAddToCart(product, quantity);
        onBack();
    };

    const totalPrice = (product.price * quantity).toFixed(2);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button 
                onClick={onBack}
                className="mb-6 flex items-center text-gray-600 hover:text-primary transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Products
            </button>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2">
                        <img className="w-full h-96 object-cover" src={product.image} alt={product.name} />
                    </div>
                    <div className="p-8 md:w-1/2 flex flex-col justify-between">
                        <div>
                            <div className="uppercase tracking-wide text-sm text-primary font-bold">{product.category}</div>
                            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
                            <p className="mt-4 text-gray-600 text-lg">{product.description || 'No description available for this product.'}</p>
                            
                            <div className="mt-8 flex items-center">
                                <span className="text-3xl font-bold text-gray-900">Rs. {product.price}</span>
                                <span className="ml-2 text-xl text-gray-500">/ {product.unit}</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-center mb-6">
                                <span className="mr-4 text-gray-700 font-medium">Quantity ({product.unit}):</span>
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button 
                                        onClick={handleDecrement}
                                        className="p-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
                                        disabled={quantity <= minQuantity}
                                    >
                                        <MinusIcon className="h-4 w-4"/>
                                    </button>
                                    <span className="px-4 font-semibold text-lg w-24 text-center">{quantity}</span>
                                    <button 
                                        onClick={handleIncrement}
                                        className="p-3 text-gray-600 hover:bg-gray-100 transition"
                                    >
                                        <PlusIcon className="h-4 w-4"/>
                                    </button>
                                </div>
                            </div>
                            
                            {isWeightBased && (
                                <div className="flex gap-2 mb-6 flex-wrap">
                                    {[0.25, 0.5, 1, 2].map(val => (
                                        <button 
                                            key={val}
                                            onClick={() => setQuantity(val)}
                                            className={`px-3 py-1 rounded border ${quantity === val ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            {val} kg
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button 
                                onClick={handleAddToCart}
                                className="w-full bg-primary text-white text-lg font-bold py-4 rounded-lg shadow-lg hover:bg-primary-dark transform transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50"
                            >
                                Add to Cart - Rs. {totalPrice}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
