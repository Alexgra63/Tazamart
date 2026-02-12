
import React, { useState } from 'react';
import { Product, ProductCategory, Language } from '../types.ts';
import { ProductCard } from './ProductCard.tsx';
import { SearchIcon, StarIcon, LeafIcon, AppleIcon, BoxIconFilled, SparkleIconFilled } from './Icons.tsx';

interface HomeViewProps {
    products: Product[];
    onAddToCart: (product: Product, quantity: number) => void;
    onProductClick: (product: Product) => void;
    lang: Language;
}

const translations = {
    [Language.EN]: {
        heroTitle: "Freshness delivered",
        heroSub: "at market price",
        searchPlaceholder: "Search items...",
        qualityTag: "Fresh Quality",
        categoriesLabel: "Categories",
        selectionLabel: "Fresh Selection",
        itemsFound: "items found",
        all: "All",
        veggies: "Vegetables",
        fruits: "Fruits",
        bundles: "Bundles",
        seasonal: "Seasonal",
        noItems: "No items found",
        reset: "Reset View"
    },
    [Language.UR]: {
        heroTitle: "تازہ ترین اشیاء",
        heroSub: "مارکیٹ ریٹ پر",
        searchPlaceholder: "تلاش کریں...",
        qualityTag: "بہترین معیار",
        categoriesLabel: "اقسام",
        selectionLabel: "تازہ اشیاء",
        itemsFound: "اشیاء ملی ہیں",
        all: "سب",
        veggies: "سبزیاں",
        fruits: "پھل",
        bundles: "بنڈلز",
        seasonal: "موسمی",
        noItems: "کچھ نہیں ملا",
        reset: "دوبارہ دیکھیں"
    }
};

export const HomeView: React.FC<HomeViewProps> = ({ products, onAddToCart, onProductClick, lang }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [localSearch, setLocalSearch] = useState('');
    const t = translations[lang];

    const categories = [
        { name: 'All', label: t.all, icon: StarIcon, color: 'text-gray-300 bg-gray-50 dark:bg-slate-800', activeColor: 'text-white bg-primary' },
        { name: ProductCategory.Vegetables, label: t.veggies, icon: LeafIcon, color: 'text-green-300 bg-green-50 dark:bg-slate-800', activeColor: 'text-white bg-green-500' },
        { name: ProductCategory.Fruits, label: t.fruits, icon: AppleIcon, color: 'text-red-300 bg-red-50 dark:bg-slate-800', activeColor: 'text-white bg-red-500' },
        { name: ProductCategory.Bundles, label: t.bundles, icon: BoxIconFilled, color: 'text-blue-300 bg-blue-50 dark:bg-slate-800', activeColor: 'text-white bg-blue-500' },
        { name: ProductCategory.Seasonal, label: t.seasonal, icon: SparkleIconFilled, color: 'text-purple-300 bg-purple-50 dark:bg-slate-800', activeColor: 'text-white bg-purple-500' },
    ];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(localSearch.toLowerCase());
        const matchesCategory = !selectedCategory || selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const isUrdu = lang === Language.UR;

    return (
        <div className={`pb-20 animate-in fade-in duration-500 ${isUrdu ? 'rtl text-right' : 'ltr'}`} dir={isUrdu ? 'rtl' : 'ltr'}>
            <div className="px-4 mt-3 mb-4">
                <div className="hero-gradient p-5 rounded-[1.5rem] shadow-premium text-white relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 mb-3">
                        <span className="bg-white/20 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full backdrop-blur-md mb-1.5 inline-block">
                            {t.qualityTag}
                        </span>
                        <h2 className={`text-xl font-black leading-tight tracking-tight ${isUrdu ? 'text-2xl' : ''}`}>
                            {t.heroTitle} <br/> 
                            <span className="text-green-200">{t.heroSub}</span>
                        </h2>
                    </div>
                    <div className="relative z-10">
                        <div className={`absolute inset-y-0 ${isUrdu ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                            <SearchIcon className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                        <input 
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className={`block w-full ${isUrdu ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-white rounded-xl text-dark font-bold placeholder-gray-400 border-none outline-none shadow-premium focus:ring-4 focus:ring-white/10 transition-all text-[11px]`}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <h3 className="px-5 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5">{t.categoriesLabel}</h3>
                <div className="flex overflow-x-auto space-x-3 px-5 no-scrollbar pb-1">
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat.name || (cat.name === 'All' && !selectedCategory);
                        const Icon = cat.icon;
                        return (
                            <button 
                                key={cat.name} 
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`flex flex-col items-center space-y-1.5 min-w-[64px] group transition-transform active:scale-90`}
                            >
                                <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive ? `${cat.activeColor} shadow-md scale-105` : `${cat.color} opacity-90 group-hover:opacity-100`}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className={`text-[10px] font-black tracking-tight transition-colors ${isActive ? 'text-dark dark:text-white' : 'text-gray-400'}`}>
                                    {cat.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="px-5">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-black text-dark dark:text-white">
                            {selectedCategory && selectedCategory !== 'All' ? selectedCategory : t.selectionLabel}
                        </h3>
                        <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest leading-none mt-0.5">
                            {filteredProducts.length} {t.itemsFound}
                        </p>
                    </div>
                </div>
                
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
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
                    <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                        <span className="material-symbols-rounded text-4xl text-gray-200 dark:text-slate-700 mb-2">search_off</span>
                        <h4 className="font-black text-gray-400 uppercase tracking-widest text-[9px]">{t.noItems}</h4>
                        <button onClick={() => {setLocalSearch(''); setSelectedCategory('All');}} className="mt-2 text-primary font-black uppercase text-[8px] tracking-widest">{t.reset}</button>
                    </div>
                )}
            </div>
        </div>
    );
};
