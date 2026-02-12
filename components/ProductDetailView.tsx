
import React, { useState } from 'react';
import { Product, Language } from '../types';
import { PlusIcon, MinusIcon } from './Icons';

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
        added: "Added to Basket"
    },
    [Language.UR]: {
        back: "واپس",
        per: "فی",
        quantity: "مقدار",
        addToCart: "ٹوکری میں ڈالیں",
        desc: "تفصیلات",
        noDesc: "تازہ اور بہترین معیار کی چیز جو خاص طور پر تازہ مارٹ کے صارفین کے لیے منتخب کی گئی ہے۔",
        added: "ٹوکری میں شامل کر دیا گیا"
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
        <div className={`min-h-screen bg-white dark:bg-slate-950 animate-in slide-in-from-right duration-300 ${isUrdu ? 'rtl' : 'ltr'}`}>
            {/* Header / Nav */}
            <div className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between p-4 pointer-events-none">
                <button 
                    onClick={onBack}
                    className="pointer-events-auto w-10 h-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-dark dark:text-white transition-transform active:scale-90"
                >
                    <span className="material-symbols-rounded">{isUrdu ? 'arrow_forward' : 'arrow_back'}</span>
                </button>
                <button 
                    onClick={() => toggleFavorite(product.id)}
                    className={`pointer-events-auto w-10 h-10 rounded-full shadow-lg flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 dark:bg-slate-800/80 text-gray-400'}`}
                >
                    <span className="material-symbols-rounded" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                </button>
            </div>

            {/* Product Image Section */}
            <div className="relative w-full aspect-square overflow-hidden">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-transparent h-full"></div>
            </div>

            {/* Content Section */}
            <div className="relative -mt-16 bg-white dark:bg-slate-950 rounded-t-[3rem] px-6 pt-10 pb-40 shadow-premium">
                <div className="flex flex-col mb-6">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-3 py-1 rounded-full tracking-widest">
                            {product.category}
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-dark dark:text-white tracking-tighter leading-none mb-4">
                        {product.name}
                    </h1>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-4xl font-black text-primary">Rs. {product.price}</span>
                        <span className="text-gray-400 font-bold text-sm tracking-widest uppercase">/ {product.unit}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">{t.desc}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-medium">
                            {product.description || t.noDesc}
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-900 rounded-[2rem] p-6 flex items-center justify-between">
                        <span className="font-black text-dark dark:text-white uppercase tracking-widest text-xs">{t.quantity}</span>
                        <div className="flex items-center space-x-6">
                            <button 
                                onClick={() => setQuantity(prev => Math.max(minQuantity, parseFloat((prev - step).toFixed(2))))}
                                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-gray-400 dark:text-gray-500 shadow-sm flex items-center justify-center active:scale-90 transition-transform"
                                disabled={quantity <= minQuantity}
                            >
                                <MinusIcon className="h-4 w-4"/>
                            </button>
                            <span className="text-xl font-black text-dark dark:text-white min-w-[60px] text-center">
                                {quantity}<span className="text-[10px] ml-1 text-gray-400">{product.unit}</span>
                            </span>
                            <button 
                                onClick={() => setQuantity(prev => parseFloat((prev + step).toFixed(2)))}
                                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-gray-400 dark:text-gray-500 shadow-sm flex items-center justify-center active:scale-90 transition-transform"
                            >
                                <PlusIcon className="h-4 w-4"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-50 border-t border-gray-50 dark:border-slate-800">
                <div className="container mx-auto max-w-lg flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Total</p>
                        <p className="text-2xl font-black text-dark dark:text-white">Rs. {(product.price * quantity).toFixed(0)}</p>
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        className="flex-[2] bg-gradient-to-r from-primary to-primary-dark text-white py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-premium hover:shadow-lg transition-all active:scale-95"
                    >
                        {t.addToCart}
                    </button>
                </div>
            </div>

            {/* Toast */}
            {addedToast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-dark text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-premium z-[100] animate-in slide-in-from-top-4">
                    {t.added}
                </div>
            )}
        </div>
    );
};
