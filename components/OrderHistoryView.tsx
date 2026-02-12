
import React from 'react';
import { Order, OrderStatus, Language } from '../types';

interface OrderHistoryViewProps {
    orders: Order[];
    // Added lang prop to fix TypeScript error in App.tsx
    lang: Language;
}

const statusColorMap: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-500',
    [OrderStatus.Packed]: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-500',
    [OrderStatus.Delivered]: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-500',
};

const translations = {
    [Language.EN]: {
        title: "My Orders",
        empty: "You have no past orders.",
        orderId: "Order ID",
        date: "Date",
        total: "Total",
        items: "Items"
    },
    [Language.UR]: {
        title: "میرے آرڈرز",
        empty: "آپ کا کوئی پرانا آرڈر نہیں ہے۔",
        orderId: "آرڈر آئی ڈی",
        date: "تاریخ",
        total: "کل",
        items: "اشیاء"
    }
};

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ orders, lang }) => {
    const t = translations[lang];
    const isUrdu = lang === Language.UR;

    return (
        <div className={`container mx-auto px-4 py-8 pb-32 animate-in fade-in duration-500 ${isUrdu ? 'rtl text-right' : 'ltr'}`}>
            <h2 className="text-3xl font-black text-dark dark:text-white mb-8 tracking-tight">{t.title}</h2>
            {orders.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-gray-100 dark:border-slate-800">
                    <span className="material-symbols-rounded text-6xl text-gray-200 dark:text-slate-700 mb-4">receipt_long</span>
                    <p className="text-xl font-bold text-gray-400">{t.empty}</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.slice().reverse().map(order => (
                        <div key={order.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-premium border border-gray-50 dark:border-slate-800 transition-all hover:shadow-lg">
                            <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{t.orderId}</p>
                                    <p className="font-black text-dark dark:text-white text-lg">#{order.id.split('-').pop()}</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1 uppercase tracking-tighter">{t.date}: {new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                                <div className={`${isUrdu ? 'text-left' : 'text-right'}`}>
                                    <p className="text-2xl font-black text-primary tracking-tighter">Rs. {order.total.toLocaleString()}</p>
                                    <span className={`inline-block mt-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg ${statusColorMap[order.status]}`}>{order.status}</span>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-50 dark:border-slate-800">
                                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">{t.items}:</h4>
                                <ul className="space-y-2">
                                    {order.items.map(item => (
                                        <li key={item.id} className="flex justify-between items-center text-sm dark:text-gray-300">
                                            <span className="font-bold">{item.name}</span>
                                            <span className="font-black text-gray-400 text-xs">× {item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
