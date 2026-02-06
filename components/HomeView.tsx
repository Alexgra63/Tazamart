import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { SearchIcon } from './Icons';

interface HomeViewProps {
    products: Product[];
    onAddToCart: (product: Product, quantity: number) => void;
    searchQuery: string;
    onProductClick: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ products, onAddToCart, onProductClick }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [localSearch, setLocalSearch] = useState('');

    const categories = [
        { name: 'All', icon: '🌟', color: 'bg-gray-50' },
        { name: ProductCategory.Vegetables, icon: '🥦', color: 'bg-green-50' },
        { name: ProductCategory.Fruits, icon: '🍎', color: 'bg-red-50' },
        { name: ProductCategory.Bundles, icon: '📦', color: 'bg-blue-50' },
        { name: ProductCategory.Seasonal, icon: '✨', color: 'bg-purple-50' },
    ];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(localSearch.toLowerCase());
        const matchesCategory = !selectedCategory || selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-white pb-32 animate-in fade-in duration-500">
            {/* Redesigned Hero Banner */}
            <div className="px-4 mt-6 mb-10">
                <div className="hero-gradient p-10 rounded-[2.5rem] shadow-premium text-white relative overflow-hidden flex flex-col min-h-[260px] justify-between">
                    {/* Decorative blurred circles */}
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-dark/20 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10">
                        <span className="bg-white/20 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-md mb-4 inline-block">
                            Premium Quality
                        </span>
                        <h2 className="text-4xl font-black leading-tight tracking-tight mb-2">
                            Delivered to your doorstep <br/> 
                            <span className="text-green-200">at market price</span>
                        </h2>
                    </div>

                    {/* Search Bar at the bottom of hero */}
                    <div className="relative z-10 group mt-8">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input 
                            type="text"
                            placeholder="Search fresh items..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="block w-full pl-14 pr-5 py-5 bg-white rounded-3xl text-dark font-black placeholder-gray-400 border-none outline-none shadow-premium focus:ring-8 focus:ring-white/10 transition-all text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Category Scroll */}
            <div className="mb-10">
                <h3 className="px-6 text-xs font-black text-gray-400 uppercase tracking-widest mb-5">Browse Categories</h3>
                <div className="flex overflow-x-auto space-x-6 px-6 no-scrollbar pb-4">
                    {categories.map((cat) => (
                        <button 
                            key={cat.name} 
                            onClick={() => setSelectedCategory(cat.name)}
                            className="flex flex-col items-center space-y-3 min-w-[84px] group transition-transform active:scale-90"
                        >
                            <div className={`
                                ${cat.color} h-20 w-20 rounded-[2rem] flex items-center justify-center text-4xl shadow-soft border-2 transition-all duration-300
                                ${selectedCategory === cat.name || (cat.name === 'All' && !selectedCategory) 
                                    ? 'border-primary scale-110 shadow-premium bg-white' 
                                    : 'border-transparent opacity-90 group-hover:opacity-100 group-hover:scale-105'}
                            `}>
                                {cat.icon}
                            </div>
                            <span className={`text-[11px] font-black tracking-tight transition-colors ${selectedCategory === cat.name || (cat.name === 'All' && !selectedCategory) ? 'text-primary' : 'text-gray-500'}`}>
                                {cat.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Section */}
            <div className="px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-dark">
                            {selectedCategory && selectedCategory !== 'All' ? selectedCategory : 'Everything Fresh'}
                        </h3>
                        <div className="flex items-center mt-1">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                {filteredProducts.length} items available
                            </p>
                        </div>
                    </div>
                </div>
                
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-5">
                        {filteredProducts.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onAddToCart={(p) => onAddToCart(p, 1)} 
                                onClick={onProductClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                        <div className="text-6xl mb-6">🥬</div>
                        <h4 className="font-black text-gray-400 uppercase tracking-widest text-xs">No items found</h4>
                        <button onClick={() => {setLocalSearch(''); setSelectedCategory('All');}} className="mt-4 text-primary font-black uppercase text-[10px] tracking-widest">Clear filters</button>
                    </div>
                )}
            </div>
        </div>
    );
};