
import React from 'react';
import { Order, OrderStatus, Language } from '../types';

interface OrderHistoryViewProps {
    orders: Order[];
    lang: Language;
}

const statusColorMap: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-500',
    [OrderStatus.Packed]: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-500',
    [OrderStatus.Delivered]: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-500',
};

const translations = {
    title: "My Orders",
    empty: "You have no past orders.",
    orderId: "Order ID",
    date: "Date",
    total: "Total",
    items: "Items",
    pending: "Pending",
    packed: "Packed",
    delivered: "Delivered"
};

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ orders, lang }) => {
    const t = translations;

    return (
        <div className="container mx-auto px-4 py-8 pb-32 animate-in fade-in duration-500 ltr text-left">
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink dark:text-white mb-8">{t.title}</h1>
            {orders.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-line">
                    <span className="material-symbols-rounded text-6xl text-gray-200 dark:text-slate-700 mb-4">receipt_long</span>
                    <p className="text-xl font-bold text-gray-400">{t.empty}</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.slice().reverse().map(order => (
                        <div key={order.id} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-premium border border-line transition-all hover:shadow-lg">
                            <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
                                <div className="text-left">
                                    <p className="text-xs font-semibold text-gray-400 mb-1">{t.orderId}</p>
                                    <p className="font-semibold text-dark dark:text-white text-lg">#{order.id.split('-').pop()}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-1">{t.date}: {new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-sm font-semibold text-primary">Rs.</span>
                                        <span className="text-2xl font-semibold text-primary">{order.total.toLocaleString()}</span>
                                    </div>
                                    <span className={`inline-block mt-2 px-4 py-1.5 text-xs font-semibold rounded-lg ${statusColorMap[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-line">
                                <h4 className="text-xs font-semibold text-gray-400 mb-4">{t.items}:</h4>
                                <ul className="space-y-2">
                                    {order.items.map(item => (
                                        <li key={item.id} className="flex justify-between items-center text-sm dark:text-gray-300">
                                            <span className="font-bold">
                                                {item.name}
                                            </span>
                                            <span className="font-semibold text-gray-400 text-xs">× {item.quantity}</span>
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
