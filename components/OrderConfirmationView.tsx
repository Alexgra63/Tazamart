
import React from 'react';
import { View, Order, Language } from '../types';

interface OrderConfirmationViewProps {
    lastOrder: Order | null;
    setView: (view: View) => void;
    // Added lang prop to fix TypeScript error in App.tsx
    lang: Language;
}

const translations = {
    [Language.EN]: {
        title: "Thank You For Your Order!",
        message: "Your order has been placed successfully. We'll notify you once it's packed.",
        summary: "Order Summary",
        orderId: "Order ID",
        name: "Name",
        total: "Total Amount",
        shipping: "Shipping to",
        continue: "Continue Shopping",
        viewOrders: "View My Orders",
        notFound: "No order found."
    },
    [Language.UR]: {
        title: "آپ کے آرڈر کا شکریہ!",
        message: "آپ کا آرڈر کامیابی کے ساتھ موصول ہو گیا ہے۔ جب یہ پیک ہو جائے گا تو ہم آپ کو مطلع کریں گے۔",
        summary: "آرڈر کا خلاصہ",
        orderId: "آرڈر آئی ڈی",
        name: "نام",
        total: "کل رقم",
        shipping: "ڈیلیوری کا پتہ",
        continue: "مزید خریداری کریں",
        viewOrders: "میرے آرڈرز دیکھیں",
        notFound: "کوئی آرڈر نہیں ملا۔"
    }
};

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({ lastOrder, setView, lang }) => {
    const t = translations[lang];
    const isUrdu = lang === Language.UR;

    if (!lastOrder) {
        return (
            <div className="container mx-auto text-center py-20 dark:text-white">
                <h2 className="text-2xl font-black">{t.notFound}</h2>
            </div>
        );
    }

    return (
        <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500 ${isUrdu ? 'rtl text-right' : 'ltr'}`}>
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-premium max-w-2xl mx-auto text-center border border-gray-100 dark:border-slate-800">
                <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-3xl font-black text-dark dark:text-white mt-8 tracking-tight">{t.title}</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-3 text-sm">{t.message}</p>
                
                <div className={`text-left ${isUrdu ? 'text-right' : 'text-left'} bg-gray-50 dark:bg-slate-800 p-8 rounded-3xl mt-10 border border-gray-100 dark:border-slate-700`}>
                    <h3 className="font-black text-dark dark:text-white text-lg mb-6 border-b border-gray-200 dark:border-slate-600 pb-3">{t.summary}</h3>
                    <div className="space-y-3">
                        <p className="text-sm dark:text-gray-300"><strong className="text-[10px] font-black uppercase text-gray-400 tracking-widest mr-2">{t.orderId}:</strong> {lastOrder.id}</p>
                        <p className="text-sm dark:text-gray-300"><strong className="text-[10px] font-black uppercase text-gray-400 tracking-widest mr-2">{t.name}:</strong> {lastOrder.customer.name}</p>
                        <p className="text-sm dark:text-gray-300"><strong className="text-[10px] font-black uppercase text-gray-400 tracking-widest mr-2">{t.total}:</strong> Rs. {lastOrder.total.toLocaleString()}</p>
                        <p className="text-sm dark:text-gray-300"><strong className="text-[10px] font-black uppercase text-gray-400 tracking-widest mr-2">{t.shipping}:</strong> {lastOrder.customer.address}</p>
                    </div>
                </div>
                
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                     <button onClick={() => setView(View.Home)} className="bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-300 px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all hover:bg-gray-200 active:scale-95">
                        {t.continue}
                    </button>
                    <button onClick={() => setView(View.OrderHistory)} className="bg-primary text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-premium hover:shadow-lg transition-all active:scale-95">
                        {t.viewOrders}
                    </button>
                </div>
            </div>
        </div>
    );
};
