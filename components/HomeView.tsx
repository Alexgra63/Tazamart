
import React from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';

interface HomeViewProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
    searchQuery: string;
    onProductClick: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ products, onAddToCart, searchQuery, onProductClick }) => {
    const categories = Object.values(ProductCategory);

    // Filter products based on search query
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-dark tracking-tight">Fresh From The Farm</h2>
                <p className="mt-4 text-lg text-gray-500">The best quality fruits and vegetables, delivered to your doorstep.</p>
            </div>
            
            {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-500">No products found matching "{searchQuery}"</p>
                    <p className="mt-2 text-gray-400">Try checking your spelling or use different keywords.</p>
                </div>
            ) : (
                categories.map(category => {
                    const categoryProducts = filteredProducts.filter(p => p.category === category);
                    if (categoryProducts.length === 0) return null;

                    return (
                        <div key={category} className="mb-12">
                            <h3 className="text-2xl font-bold text-dark border-b-2 border-primary pb-2 mb-6">{category}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                                {categoryProducts.map(product => (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product} 
                                        onAddToCart={onAddToCart} 
                                        onClick={onProductClick}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};
