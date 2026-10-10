
import React, { useState } from 'react';
import { Product, ProductCategory, Language } from '../types.ts';
import { ProductCard } from './ProductCard.tsx';
import { Button, EmptyState, SectionHeading } from './ui';
import { getEnglishKeywords } from '@/lib/searchDictionary.ts';

interface HomeViewProps {
    products: Product[];
    onAddToCart: (product: Product, quantity: number) => void;
    onProductClick: (product: Product) => void;
    lang: Language;
}

const translations = {
    heroTitle: "Freshness delivered",
    heroSub: "at market price",
    searchPlaceholder: "Search tomatoes, aloo, سیب…",
    qualityTag: "Fresh Quality",
    categoriesLabel: "Categories",
    selectionLabel: "Fresh today",
    itemsFound: "items found",
    all: "All",
    veggies: "Vegetables",
    fruits: "Fruits",
    bundles: "Bundles",
    seasonal: "Seasonal",
    noItems: "No items found",
    reset: "Show everything"
};

export const HomeView: React.FC<HomeViewProps> = ({ products, onAddToCart, onProductClick, lang }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [localSearch, setLocalSearch] = useState('');
    const t = translations;

    const categories = [
        { name: 'All', label: t.all, icon: 'apps', color: 'text-gray-300 bg-gray-50 dark:bg-slate-800', activeColor: 'text-white bg-primary' },
        { name: ProductCategory.Vegetables, label: t.veggies, icon: 'eco', color: 'text-green-300 bg-green-50 dark:bg-slate-800', activeColor: 'text-white bg-green-500' },
        { name: ProductCategory.Fruits, label: t.fruits, icon: 'nutrition', color: 'text-red-300 bg-red-50 dark:bg-slate-800', activeColor: 'text-white bg-red-500' },
        { name: ProductCategory.Bundles, label: t.bundles, icon: 'inventory_2', color: 'text-blue-300 bg-blue-50 dark:bg-slate-800', activeColor: 'text-white bg-blue-500' },
        { name: ProductCategory.Seasonal, label: t.seasonal, icon: 'auto_awesome', color: 'text-purple-300 bg-purple-50 dark:bg-slate-800', activeColor: 'text-white bg-purple-500' },
    ];

    const filteredProducts = products.filter(product => {
        const matchesCategory = !selectedCategory || selectedCategory === 'All' || product.category === selectedCategory;
        
        const searchTerm = localSearch.toLowerCase();
        if (!searchTerm) return matchesCategory;

        // Check for English matches first
        const matchesEnglish = product.name.toLowerCase().includes(searchTerm) || 
                             (product.description && product.description.toLowerCase().includes(searchTerm));
        
        if (matchesEnglish) return matchesCategory;

        // Verify if the query contains Urdu characters - Keep Urdu search capability
        const isUrduQuery = /[\u0600-\u06FF]/.test(searchTerm);
        if (isUrduQuery) {
            const englishKeywords = getEnglishKeywords(searchTerm);
            const matchesUrduDictionary = englishKeywords.some(keyword => 
                product.name.toLowerCase().includes(keyword.toLowerCase()) || 
                product.category.toLowerCase().includes(keyword.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(keyword.toLowerCase()))
            );
            return matchesCategory && matchesUrduDictionary;
        }

        return matchesCategory && matchesEnglish;
    });

    const isFiltered = !!localSearch || (selectedCategory && selectedCategory !== 'All');

    return (
        <div className="pb-8 animate-in fade-in duration-300" dir="ltr">
            {/* Hero */}
            <section className="px-4 md:px-0 pt-4 md:pt-8">
                <div className="hero-gradient relative overflow-hidden rounded-2xl md:rounded-3xl px-6 py-8 md:px-12 md:py-14 text-white">
                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                            <span className="material-symbols-rounded text-[16px] text-amber-300">eco</span>
                            {t.qualityTag} · picked fresh every morning
                        </span>
                        <h1 className="font-display mt-4 text-3xl md:text-5xl font-semibold leading-[1.1]">
                            {t.heroTitle}, <span className="text-amber-300">{t.heroSub}</span>
                        </h1>
                        <p className="mt-3 text-sm md:text-base text-green-50/90 max-w-lg">Taza sabzi and fruit straight from the Islamabad mandi to your door.</p>
                        <label className="relative mt-6 block max-w-xl">
                            <span className="sr-only">Search products</span>
                            <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[22px] pointer-events-none">search</span>
                            <input
                                type="search"
                                placeholder={t.searchPlaceholder}
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                className="block w-full h-13 pl-12 pr-4 rounded-xl bg-white text-ink placeholder:text-gray-400 text-sm md:text-base outline-none focus:ring-4 focus:ring-amber-300/50"
                            />
                        </label>
                    </div>
                    <span aria-hidden className="material-symbols-rounded hidden md:block absolute -right-6 -bottom-10 text-[260px] text-white/10 rotate-12">nutrition</span>
                </div>
                <ul className="mt-4 grid grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm text-muted dark:text-stone-400">
                    {[['local_shipping','Same-day delivery'],['verified','Hand-picked quality'],['payments','Easypaisa & JazzCash']].map(([icon,label]) => (
                        <li key={label} className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2 rounded-xl border border-line bg-white dark:bg-slate-900 px-2 py-2.5 md:px-4 text-center md:text-left">
                            <span className="material-symbols-rounded text-[18px] text-primary">{icon}</span>
                            <span className="font-medium leading-tight text-[11px] md:text-sm">{label}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Categories */}
            <section className="mt-8 md:mt-10" aria-label={t.categoriesLabel}>
                <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar px-4 md:px-0 pb-1">
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat.name || (cat.name === 'All' && !selectedCategory);
                        return (
                            <button
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                aria-pressed={isActive}
                                className={`shrink-0 h-11 px-4 rounded-full border flex items-center gap-2 text-sm font-semibold transition-colors ${isActive ? 'bg-ink text-white border-ink dark:bg-white dark:text-stone-950 dark:border-white' : 'bg-white dark:bg-slate-900 border-line text-ink dark:text-stone-200 hover:border-primary'}`}
                            >
                                <span className={`material-symbols-rounded text-[20px] ${isActive ? '' : 'text-primary'}`}>{cat.icon}</span>
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Products */}
            <section className="mt-6 md:mt-8 px-4 md:px-0">
                <SectionHeading
                    title={selectedCategory && selectedCategory !== 'All' ? selectedCategory : (localSearch ? `Results for "${localSearch}"` : t.selectionLabel)}
                    subtitle={`${filteredProducts.length} ${t.itemsFound}`}
                    action={isFiltered ? <Button variant="ghost" size="sm" icon="close" onClick={() => { setLocalSearch(''); setSelectedCategory('All'); }}>Clear</Button> : undefined}
                />
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
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
                    <EmptyState icon="search_off" title={t.noItems} description="Try another word, or search in Urdu."
                        action={<Button variant="outline" onClick={() => { setLocalSearch(''); setSelectedCategory('All'); }}>{t.reset}</Button>} />
                )}
            </section>
        </div>
    );
};
