
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
    [Language.EN]: {
        back: "Back",
        per: "per",
        quantity: "Quantity",
        addToCart: "Add to Basket",
        desc: "Product Description",
        noDesc: "Fresh premium quality item selected specially for TazaMart customers.",
        added: "Added to Basket",
        total: "Subtotal"
    },
    [Language.UR]: {
        back: "واپس",
        per: "فی",
        quantity: "مقدار",
        addToCart: "ٹوکری میں ڈالیں",
        desc: "تفصیلات",
        noDesc: "تازہ اور بہترین معیار کی چیز جو خاص طور پر تازہ مارٹ کے صارفین کے لیے منتخب کی گئی ہے۔",
        added: "ٹوکری میں شامل کر دیا گیا",
        total: "کل رقم"
    }
};

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ 
    product, onAddToCart, onBack, lang, isFavorite, toggleFavorite 
}) => {
    const [quantity, setQuantity] = useState(1);
    const [addedToast, setAddedToast] = useState(false);
    const t = translations[lang];
    const isUrdu = lang === Language.UR;

    const isWeightBased = product.unit === 'kg';
    const step = isWeightBased ? 0.25 : 1;
    const minQuantity = isWeightBased ? 0.25 : 1;

    const handleAddToCart = () => {
        onAddToCart(product, quantity);
        setAddedToast(true);
        setTimeout(() => setAddedToast(false), 2000);
    };

    return (
        <div className={`min-h-screen bg-white dark:bg-slate-950 animate-in slide-in-from-right duration-300 pb-20 ${isUrdu ? 'rtl text-right' : 'ltr text-left'}`} dir={isUrdu ? 'rtl' : 'ltr'}>
            
            {/* Floating Navigation Buttons - Offset from global Header */}
            <div className="fixed top-[72px] left-0 right-0 z-[60] flex items-center justify-between p-4 pointer-events-none">
                <button 
                    onClick={onBack}
                    className="pointer-events-auto w-11 h-11 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-premium flex items-center justify-center text-dark dark:text-white transition-all active:scale-90 border border-white/20 dark:border-slate-700/50"
                >
                    <span className="material-symbols-rounded text-2xl">{isUrdu ? 'arrow_forward' : 'arrow_back'}</span>
                </button>
                <button 
                    onClick={() => toggleFavorite(product.id)}
                    className={`pointer-events-auto w-11 h-11 rounded-2xl shadow-premium flex items-center justify-center backdrop-blur-xl transition-all active:scale-90 border ${isFavorite ? 'bg-red-500 text-white border-red-400' : 'bg-white/90 dark:bg-slate-800/90 text-gray-400 border-white/20 dark:border-slate-700/50'}`}
                >
                    <span className="material-symbols-rounded text-2xl" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                </button>
            </div>

            {/* Main Scrollable Content */}
            <div className="pb-56 pt-2">
                {/* Hero Image Section */}
                <div className="relative w-full h-[45vh] sm:h-[55vh] overflow-hidden rounded-b-[2rem] sm:rounded-b-[3.5rem] shadow-soft">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>

                {/* Content Details */}
                <div className="relative bg-white dark:bg-slate-950 px-6 pt-10">
                    <div className="max-w-3xl mx-auto">
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
                        <h1 className="text-3xl sm:text-5xl font-black text-dark dark:text-white tracking-tighter leading-none mb-6">
                            {product.name}
                        </h1>
                        
                        <div className="flex items-center gap-3 mb-10">
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs font-black text-primary uppercase">Rs.</span>
                                <span className="text-4xl font-black text-primary tracking-tighter">{product.price}</span>
                            </div>
                            <span className="text-gray-400 font-bold text-[11px] tracking-widest uppercase border-l border-gray-100 dark:border-slate-800 pl-3">
                                {t.per} {product.unit}
                            </span>
                        </div>

                        {/* Quantity Selector */}
                        <div className="bg-gray-50 dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 border border-gray-100 dark:border-slate-800">
                            <div className="flex flex-col items-center sm:items-start">
                                <span className="font-black text-dark dark:text-white uppercase tracking-widest text-[9px] mb-1 opacity-40">{t.quantity}</span>
                                <p className="text-[11px] font-bold text-gray-400">{isWeightBased ? 'Adjust weight' : 'Select pieces'}</p>
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
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-50 dark:border-slate-800 pb-2">{t.desc}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl leading-relaxed font-medium">
                                {product.description || t.noDesc}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Action Footer - Floating above global BottomNav */}
            <div className="fixed bottom-[88px] left-0 right-0 px-4 z-50">
                <div className="max-w-3xl mx-auto flex items-center gap-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-3 rounded-[2rem] shadow-premium border border-gray-100/50 dark:border-slate-800/50">
                    <div className={`${isUrdu ? 'pr-4' : 'pl-4'} flex-1`}>
                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-0.5">{t.total}</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[10px] font-black text-dark dark:text-white">Rs.</span>
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
