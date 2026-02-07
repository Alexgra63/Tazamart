
import React, { useState } from 'react';
import { Product, ProductCategory } from '../types.ts';
import { ProductCard } from './ProductCard.tsx';
import { SearchIcon, LeafIcon, CarrotIcon, FruitIcon, BoxIcon, SparkleIcon } from './Icons.tsx';

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
        { name: 'All', icon: LeafIcon, color: 'text-gray-400 bg-gray-50', activeColor: 'text-primary bg-primary/10' },
        { name: ProductCategory.Vegetables, icon: CarrotIcon, color: 'text-green-500 bg-green-50', activeColor: 'text-green-600 bg-green-100' },
        { name: ProductCategory.Fruits, icon: FruitIcon, color: 'text-red-500 bg-red-50', activeColor: 'text-red-600 bg-red-100' },
        { name: ProductCategory.Bundles, icon: BoxIcon, color: 'text-blue-500 bg-blue-50', activeColor: 'text-blue-600 bg-blue-100' },
        { name: ProductCategory.Seasonal, icon: SparkleIcon, color: 'text-purple-500 bg-purple-50', activeColor: 'text-purple-600 bg-purple-100' },
    ];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(localSearch.toLowerCase());
        const matchesCategory = !selectedCategory || selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-white pb-20 animate-in fade-in duration-500">
            {/* Tighter Hero Banner */}
            <div className="px-4 mt-4 mb-6">
                <div className="hero-gradient p-6 rounded-[2rem] shadow-premium text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 mb-4">
                        <span className="bg-white/20 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md mb-2 inline-block">
                            Fresh Quality
                        </span>
                        <h2 className="text-2xl font-black leading-tight tracking-tight">
                            Delivered to your doorstep <br/> 
                            <span className="text-green-200">at market price</span>
                        </h2>
                    </div>

                    <div className="relative z-10 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input 
                            type="text"
                            placeholder="Search fresh items..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3 bg-white rounded-2xl text-dark font-black placeholder-gray-400 border-none outline-none shadow-premium focus:ring-4 focus:ring-white/10 transition-all text-xs"
                        />
                    </div>
                </div>
            </div>

            {/* Smaller Categories */}
            <div className="mb-6">
                <h3 className="px-5 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Browse</h3>
                <div className="flex overflow-x-auto space-x-4 px-5 no-scrollbar pb-1">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = selectedCategory === cat.name || (cat.name === 'All' && !selectedCategory);
                        return (
                            <button 
                                key={cat.name} 
                                onClick={() => setSelectedCategory(cat.name)}
                                className="flex flex-col items-center space-y-2 min-w-[64px] group transition-transform active:scale-90"
                            >
                                <div className={`
                                    h-14 w-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300
                                    ${isActive 
                                        ? `border-primary shadow-soft ${cat.activeColor}` 
                                        : `border-transparent opacity-90 ${cat.color}`}
                                `}>
                                    <Icon className={`h-6 w-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                                </div>
                                <span className={`text-[10px] font-black tracking-tight transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                                    {cat.name.split(' ')[0]}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Product Section */}
            <div className="px-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-black text-dark">
                            {selectedCategory && selectedCategory !== 'All' ? selectedCategory : 'Fresh Produce'}
                        </h3>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                            {filteredProducts.length} items
                        </p>
                    </div>
                </div>
                
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
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
                    <div className="text-center py-16 bg-gray-50 rounded-[2rem] border border-gray-100">
                        <div className="text-4xl mb-4 text-gray-200">🥗</div>
                        <h4 className="font-black text-gray-400 uppercase tracking-widest text-[10px]">No items found</h4>
                        <button onClick={() => {setLocalSearch(''); setSelectedCategory('All');}} className="mt-2 text-primary font-black uppercase text-[9px] tracking-widest">Clear</button>
                    </div>
                )}
            </div>
        </div>
    );
};
