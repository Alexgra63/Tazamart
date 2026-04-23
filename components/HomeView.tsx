
import React, { useState } from 'react';
import { Product, ProductCategory, Language } from '../types.ts';
import { ProductCard } from './ProductCard.tsx';

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
        { name: 'All', label: t.all, icon: 'stars', color: 'text-gray-300 bg-gray-50 dark:bg-slate-800', activeColor: 'text-white bg-primary' },
        { name: ProductCategory.Vegetables, label: t.veggies, icon: 'eco', color: 'text-green-300 bg-green-50 dark:bg-slate-800', activeColor: 'text-white bg-green-500' },
        { name: ProductCategory.Fruits, label: t.fruits, icon: 'nutrition', color: 'text-red-300 bg-red-50 dark:bg-slate-800', activeColor: 'text-white bg-red-500' },
        { name: ProductCategory.Bundles, label: t.bundles, icon: 'inventory_2', color: 'text-blue-300 bg-blue-50 dark:bg-slate-800', activeColor: 'text-white bg-blue-500' },
        { name: ProductCategory.Seasonal, label: t.seasonal, icon: 'auto_awesome', color: 'text-purple-300 bg-purple-50 dark:bg-slate-800', activeColor: 'text-white bg-purple-500' },
    ];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(localSearch.toLowerCase());
        const matchesCategory = !selectedCategory || selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const isUrdu = lang === Language.UR;

    return (
        <div className={`pb-20 animate-in fade-in duration-500 ${isUrdu ? 'rtl text-right' : 'ltr'}`} dir={isUrdu ? 'rtl' : 'ltr'}>
            <div className="px-4 mt-3 mb-8">
                <div className="hero-gradient p-6 md:p-12 md:flex md:items-center md:justify-between rounded-[1.5rem] md:rounded-[2.5rem] shadow-premium text-white relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 md:w-80 md:h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 mb-5 md:mb-0 md:max-w-xl">
                        <span className="bg-white/20 text-[8px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md mb-3 inline-block">
                            {t.qualityTag}
                        </span>
                        <h2 className={`text-2xl md:text-5xl font-black leading-tight tracking-tight ${isUrdu ? 'text-3xl md:text-6xl' : ''}`}>
                            {t.heroTitle} <br/> 
                            <span className="text-green-200">{t.heroSub}</span>
                        </h2>
                    </div>
                    <div className="relative z-10 w-full md:max-w-md">
                        <div className={`absolute inset-y-0 ${isUrdu ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                            <span className="material-symbols-rounded text-gray-400 text-[20px] md:text-[24px]">search</span>
                        </div>
                        <input 
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className={`block w-full ${isUrdu ? 'pr-12 pl-6' : 'pl-12 pr-6'} py-3 md:py-5 bg-white rounded-2xl text-dark font-bold placeholder-gray-400 border-none outline-none shadow-premium focus:ring-8 focus:ring-white/10 transition-all text-xs md:text-sm`}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-8 md:mb-12">
                <h3 className="px-5 text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">{t.categoriesLabel}</h3>
                <div className="flex md:flex-wrap overflow-x-auto md:overflow-visible space-x-3 md:space-x-0 md:gap-4 px-5 no-scrollbar pb-1">
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat.name || (cat.name === 'All' && !selectedCategory);
                        return (
                            <button 
                                key={cat.name} 
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`flex items-center space-x-3 px-5 py-3 rounded-2xl transition-all duration-300 md:min-w-0 min-w-[64px] flex-shrink-0 group active:scale-90 ${isActive ? `${cat.activeColor} shadow-lg scale-105` : `${cat.color} opacity-90 hover:opacity-100 hover:scale-105`}`}
                            >
                                <span className="material-symbols-rounded text-[20px] md:text-[24px] leading-none">{cat.icon}</span>
                                <span className={`text-[10px] md:text-[12px] font-black tracking-tight ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onAddToCart={(p) => onAddToCart(p, 1)} 
                                onClick={onProductClick}
                                lang={lang}
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
