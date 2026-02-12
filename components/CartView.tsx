
import React from 'react';
import { CartItem, View, Language } from '../types';
import { TrashIcon, PlusIcon, MinusIcon } from './Icons';

interface CartViewProps {
    cart: CartItem[];
    updateQuantity: (productId: number, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    setView: (view: View) => void;
    // Added lang prop to fix TypeScript error in App.tsx
    lang: Language;
}

const translations = {
    [Language.EN]: {
        title: "My Basket",
        empty: "Your basket is empty",
        start: "Start Shopping",
        summary: "Order Summary",
        subtotal: "Subtotal",
        delivery: "Delivery",
        free: "FREE",
        total: "Total",
        checkout: "Checkout Now"
    },
    [Language.UR]: {
        title: "میری ٹوکری",
        empty: "آپ کی ٹوکری خالی ہے",
        start: "خریداری شروع کریں",
        summary: "آرڈر کا خلاصہ",
        subtotal: "کل رقم",
        delivery: "ڈیلیوری",
        free: "مفت",
        total: "کل",
        checkout: "چیک آؤٹ"
    }
};

export const CartView: React.FC<CartViewProps> = ({ cart, updateQuantity, removeFromCart, setView, lang }) => {
    const t = translations[lang];
    const isUrdu = lang === Language.UR;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleQuantityChange = (item: CartItem, change: number) => {
        const step = item.unit === 'kg' ? 0.25 : 1;
        const newQuantity = parseFloat((item.quantity + (change * step)).toFixed(2));
        if (newQuantity > 0) {
            updateQuantity(item.id, newQuantity);
        }
    };

    return (
        <div className={`container mx-auto px-4 py-8 animate-in fade-in duration-500 ${isUrdu ? 'rtl text-right' : 'ltr'}`}>
            <h2 className="text-3xl font-black text-dark dark:text-white mb-8 tracking-tight">{t.title}</h2>
            {cart.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-gray-100 dark:border-slate-800">
                    <div className="text-6xl mb-6">🧺</div>
                    <p className="text-xl font-bold text-gray-400">{t.empty}</p>
                    <button onClick={() => setView(View.Home)} className="mt-8 bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-premium transform active:scale-95 transition">
                        {t.start}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-grow space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] shadow-soft border border-gray-100 dark:border-slate-800 flex items-center gap-4 transition-all">
                                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover shrink-0 shadow-sm"/>
                                <div className="flex-grow">
                                    <h3 className="font-black text-dark dark:text-white text-sm">{item.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tighter">Rs. {item.price} / {item.unit}</p>
                                    
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center bg-gray-50 dark:bg-slate-800 rounded-xl p-1 border border-gray-100 dark:border-slate-700">
                                            <button 
                                                onClick={() => handleQuantityChange(item, -1)} 
                                                className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-white disabled:opacity-30" 
                                                disabled={item.quantity <= (item.unit === 'kg' ? 0.25 : 1)}
                                            >
                                                <MinusIcon className="h-4 w-4"/>
                                            </button>
                                            <span className="px-3 font-black text-[11px] min-w-[70px] text-center dark:text-white">
                                                {item.quantity} {item.unit}
                                            </span>
                                            <button 
                                                onClick={() => handleQuantityChange(item, 1)} 
                                                className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-white"
                                            >
                                                <PlusIcon className="h-4 w-4"/>
                                            </button>
                                        </div>
                                        <span className="font-black text-primary text-sm">Rs. {(item.price * item.quantity).toFixed(0)}</span>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 dark:text-slate-700 hover:text-red-500 transition-colors p-2">
                                    <TrashIcon className="h-5 w-5"/>
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="lg:w-96">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-800 sticky top-24">
                            <h3 className="text-lg font-black text-dark dark:text-white mb-6 tracking-tight">{t.summary}</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span>{t.subtotal}</span>
                                    <span className="text-dark dark:text-white">Rs. {total.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span>{t.delivery}</span>
                                    <span className="text-primary font-black">{t.free}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
                                    <span className="font-black text-dark dark:text-white text-base">{t.total}</span>
                                    <span className="font-black text-primary text-2xl tracking-tighter">Rs. {total.toFixed(0)}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setView(View.Checkout)}
                                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-premium hover:shadow-lg transform active:scale-[0.98] transition"
                            >
                                {t.checkout}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
