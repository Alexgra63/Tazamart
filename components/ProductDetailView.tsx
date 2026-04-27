
import React, { useState } from 'react';
import { Product, Language } from '../types';

interface ProductDetailViewProps {
    product: Product;
    onAddToCart: (product: Product, quantity: number) => void;
    onBack: () => void;
    lang: Language;
    isFavorite: boolean;
    toggleFavorite: (id: number) => void;
}

const translations = {
    back: "Back",
    per: "per",
    rs: "Rs.",
    quantity: "Quantity",
    addToCart: "Add to Basket",
    desc: "Product Description",
    noDesc: "Fresh premium quality item selected specially for Vegelo customers.",
    added: "Added to Basket",
    total: "Subtotal",
    adjustWeight: "Adjust weight",
    selectPieces: "Select pieces"
};

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ 
    product, onAddToCart, onBack, lang, isFavorite, toggleFavorite 
}) => {
    const [quantity, setQuantity] = useState(1);
    const [addedToast, setAddedToast] = useState(false);
    const t = translations;

    const isWeightBased = product.unit === 'kg';
    const step = isWeightBased ? 0.25 : 1;
    const minQuantity = isWeightBased ? 0.25 : 1;

    const handleAddToCart = () => {
        onAddToCart(product, quantity);
        setAddedToast(true);
        setTimeout(() => setAddedToast(false), 2000);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 animate-in slide-in-from-right duration-300 pb-20 ltr text-left" dir="ltr">
            
            {/* Navigation Buttons - Adjusted for sticky header */}
            <div className="sticky top-0 z-[60] flex items-center justify-between p-4 pointer-events-none max-w-7xl mx-auto">
                <button 
                    onClick={onBack}
                    className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-premium flex items-center justify-center text-dark dark:text-white transition-all active:scale-90 border border-white/20 dark:border-slate-700/50"
                >
                    <span className="material-symbols-rounded text-xl md:text-2xl">arrow_back</span>
                </button>
                <button 
                    onClick={() => toggleFavorite(product.id)}
                    className={`pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-2xl shadow-premium flex items-center justify-center backdrop-blur-xl transition-all active:scale-90 border ${isFavorite ? 'bg-red-500 text-white border-red-400' : 'bg-white/90 dark:bg-slate-800/90 text-gray-400 border-white/20 dark:border-slate-700/50'}`}
                >
                    <span className="material-symbols-rounded text-xl md:text-2xl" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="md:flex md:items-start md:gap-16 max-w-7xl mx-auto px-4 md:px-8 pb-12">
                {/* Hero Image Section */}
                <div className="relative w-full md:w-[40%] h-[40vh] sm:h-[50vh] md:h-[400px] overflow-hidden rounded-[2rem] md:rounded-[2.5rem] shadow-soft shrink-0">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>

                {/* Content Details */}
                <div className="relative px-2 md:px-0 pt-8 md:pt-4 md:flex-1">
                    <div className="max-w-3xl">
                        {/* Category & Badge */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-[9px] font-black uppercase text-primary bg-primary/10 px-3 py-1 rounded-lg tracking-widest border border-primary/5">
                                {product.category}
                            </span>
                            <span className="text-[9px] font-black uppercase text-gray-400 bg-gray-50 dark:bg-slate-800 px-3 py-1 rounded-lg tracking-widest">
                                {product.unit} base
                            </span>
                        </div>

                        {/* Title & Price */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-dark dark:text-white tracking-tighter leading-none mb-4 md:mb-6">
                            {product.name}
                        </h1>
                        
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs font-black text-primary uppercase">{t.rs}</span>
                                <span className="text-4xl font-black text-primary tracking-tighter">{product.price}</span>
                            </div>
                            <span className="text-gray-400 font-bold text-[11px] tracking-widest uppercase border-gray-100 dark:border-slate-800 border-l pl-3">
                                {t.per} {product.unit}
                            </span>
                        </div>

                        {/* Quantity Selector */}
                        <div className="bg-gray-50 dark:bg-slate-900 rounded-[2rem] p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border border-gray-100 dark:border-slate-800">
                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                <span className="font-black text-dark dark:text-white uppercase tracking-widest text-[9px] mb-1 opacity-40">{t.quantity}</span>
                                <p className="text-[11px] font-bold text-gray-400">{isWeightBased ? t.adjustWeight : t.selectPieces}</p>
                            </div>
                            
                            <div className="flex items-center bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-soft border border-gray-100 dark:border-slate-700/50">
                                <button 
                                    onClick={() => setQuantity(prev => Math.max(minQuantity, parseFloat((prev - step).toFixed(2))))}
                                    className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-400 hover:text-primary dark:text-gray-400 shadow-sm flex items-center justify-center active:scale-90 transition-all disabled:opacity-30"
                                    disabled={quantity <= minQuantity}
                                >
                                    <span className="material-symbols-rounded">remove</span>
                                </button>
                                <span className="text-xl font-black text-dark dark:text-white min-w-[80px] text-center px-2">
                                    {quantity} <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter ml-0.5">{product.unit}</span>
                                </span>
                                <button 
                                    onClick={() => setQuantity(prev => parseFloat((prev + step).toFixed(2)))}
                                    className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-400 hover:text-primary dark:text-gray-400 shadow-sm flex items-center justify-center active:scale-90 transition-all"
                                >
                                    <span className="material-symbols-rounded">add</span>
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-3 mb-20 md:mb-0">
                            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-50 dark:border-slate-800 pb-2">{t.desc}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed font-medium">
                                {product.description || t.noDesc}
                            </p>
                        </div>

                        {/* Desktop Add to Cart - Visible only on MD+ */}
                        <div className="hidden md:flex items-center gap-6 mt-8 bg-gray-50 dark:bg-slate-900 shadow-premium p-5 rounded-[2rem] border border-gray-100 dark:border-slate-800">
                            <div className="flex-grow text-left">
                                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">{t.total}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[10px] font-black text-dark dark:text-white">{t.rs}</span>
                                    <span className="text-3xl font-black text-dark dark:text-white tracking-tighter">{(product.price * quantity).toLocaleString()}</span>
                                </div>
                            </div>
                            <button 
                                onClick={handleAddToCart}
                                className="px-12 py-5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-premium hover:shadow-lg transition-all active:scale-[0.97] flex items-center gap-3"
                            >
                                <span className="material-symbols-rounded text-xl">shopping_basket</span>
                                {t.addToCart}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Action Footer - Floating for Mobile Only */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 px-4 pb-6 pt-2 z-50 pointer-events-none">
                <div className="max-w-3xl mx-auto flex items-center gap-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-3 rounded-[2.5rem] shadow-premium border border-white/20 dark:border-slate-800/50 pointer-events-auto">
                    <div className="pl-4 text-left flex-1">
                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-0.5">{t.total}</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[10px] font-black text-dark dark:text-white">{t.rs}</span>
                            <span className="text-2xl font-black text-dark dark:text-white tracking-tighter">{(product.price * quantity).toLocaleString()}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        className="flex-[1.5] bg-gradient-to-r from-primary to-primary-dark text-white py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-premium hover:shadow-lg transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-rounded text-lg">shopping_basket</span>
                        {t.addToCart}
                    </button>
                </div>
            </div>

            {/* Notification Toast */}
            {addedToast && (
                <div className="fixed top-[72px] left-1/2 -translate-x-1/2 bg-dark dark:bg-white text-white dark:text-dark px-6 py-3 rounded-2xl font-black uppercase text-[9px] tracking-widest shadow-premium z-[100] animate-in slide-in-from-top-4 flex items-center gap-2">
                    <span className="material-symbols-rounded text-primary text-lg">check_circle</span>
                    {t.added}
                </div>
            )}
        </div>
    );
};
