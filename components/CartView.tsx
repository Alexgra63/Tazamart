
import React from 'react';
import { CartItem, View, Language } from '../types';

interface CartViewProps {
    cart: CartItem[];
    updateQuantity: (productId: number, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    setView: (view: View) => void;
    lang: Language;
}

const translations = {
    title: "My Basket",
    empty: "Your basket is empty",
    start: "Start Shopping",
    summary: "Order Summary",
    subtotal: "Subtotal",
    delivery: "Delivery",
    free: "FREE",
    total: "Total",
    checkout: "Checkout Now"
};

export const CartView: React.FC<CartViewProps> = ({ cart, updateQuantity, removeFromCart, setView, lang }) => {
    const t = translations;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleQuantityChange = (item: CartItem, change: number) => {
        const step = item.unit === 'kg' ? 0.25 : 1;
        const newQuantity = parseFloat((item.quantity + (change * step)).toFixed(2));
        if (newQuantity > 0) {
            updateQuantity(item.id, newQuantity);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 ltr">
            <h2 className="text-3xl md:text-5xl font-black text-dark dark:text-white mb-10 tracking-tight">{t.title}</h2>
            {cart.length === 0 ? (
                <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] shadow-soft border border-gray-100 dark:border-slate-800">
                    <div className="text-6xl mb-8">🧺</div>
                    <p className="text-2xl font-bold text-gray-400 mb-8">{t.empty}</p>
                    <button onClick={() => setView(View.Home)} className="bg-gradient-to-r from-primary to-primary-dark text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-premium transform active:scale-95 transition">
                        {t.start}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    <div className="w-full lg:flex-grow space-y-6">
                        {cart.map(item => (
                            <div key={item.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] shadow-soft border border-gray-100 dark:border-slate-800 flex items-center gap-6 transition-all hover:shadow-lg">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden shrink-0 shadow-sm">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-black text-dark dark:text-white text-base md:text-lg truncate pr-4">
                                            {item.name}
                                        </h3>
                                        <button onClick={() => removeFromCart(item.id)} className="text-gray-300 dark:text-slate-700 hover:text-red-500 transition-colors shrink-0">
                                            <span className="material-symbols-rounded text-[24px]">delete</span>
                                        </button>
                                    </div>
                                    <p className="text-[10px] md:text-[11px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest mb-4">
                                        <span>Rs. {item.price}</span>
                                        <span className="mx-2 opacity-30">/</span>
                                        <span>{item.unit}</span>
                                    </p>
                                    
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center bg-gray-50 dark:bg-slate-800 rounded-2xl p-1.5 border border-gray-100 dark:border-slate-700 shadow-sm shrink-0">
                                            <button 
                                                onClick={() => handleQuantityChange(item, -1)} 
                                                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 text-gray-400 shadow-sm flex items-center justify-center hover:text-primary transition-all disabled:opacity-30" 
                                                disabled={item.quantity <= (item.unit === 'kg' ? 0.25 : 1)}
                                            >
                                                <span className="material-symbols-rounded text-[20px]">remove</span>
                                            </button>
                                            <span className="px-4 font-black text-xs min-w-[70px] text-center dark:text-white">
                                                {item.quantity} <span className="text-[9px] text-gray-400 ml-1">{item.unit}</span>
                                            </span>
                                            <button 
                                                onClick={() => handleQuantityChange(item, 1)} 
                                                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 text-gray-400 shadow-sm flex items-center justify-center hover:text-primary transition-all"
                                            >
                                                <span className="material-symbols-rounded text-[20px]">add</span>
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Subtotal</span>
                                            <span className="font-black text-primary text-base md:text-xl tracking-tighter">
                                                Rs. {(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 0})}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="w-full lg:w-[400px] shrink-0">
                        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] shadow-premium border border-gray-100 dark:border-slate-800 sticky top-24">
                            <h3 className="text-xl md:text-2xl font-black text-dark dark:text-white mb-8 tracking-tight">{t.summary}</h3>
                            <div className="space-y-5 mb-10">
                                <div className="flex justify-between text-[11px] md:text-xs font-black text-gray-400 uppercase tracking-[0.15em]">
                                    <span>{t.subtotal}</span>
                                    <span className="text-dark dark:text-white">Rs. {total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[11px] md:text-xs font-black text-gray-400 uppercase tracking-[0.15em]">
                                    <span>{t.delivery}</span>
                                    <span className="text-primary font-black">{t.free}</span>
                                </div>
                                <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
                                    <span className="font-black text-dark dark:text-white text-lg">{t.total}</span>
                                    <span className="font-black text-primary text-3xl md:text-4xl tracking-tighter">Rs. {total.toLocaleString()}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setView(View.Checkout)}
                                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-premium hover:shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                <span className="material-symbols-rounded">lock</span>
                                {t.checkout}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
