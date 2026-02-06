import React from 'react';
import { Order } from '../types';

interface InvoiceProps {
    order: Order;
    onClose: () => void;
}

export const Invoice: React.FC<InvoiceProps> = ({ order, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:bg-white print:static print:block overflow-y-auto">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-premium w-full max-w-4xl print:shadow-none print:p-0 my-8">
                <div id="invoice-content">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-12 gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-primary tracking-tighter leading-none">Vegelo</h1>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">Premium Fresh Delivery</p>
                        </div>
                        <div className="sm:text-right">
                            <h2 className="text-lg font-black text-dark tracking-tight uppercase">Invoice #{order.id.split('-').pop()}</h2>
                            <p className="text-gray-400 text-xs font-bold mt-1">Issued: {new Date(order.orderDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-y border-gray-100 py-10">
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Delivery For:</h3>
                            <div className="space-y-1">
                                <p className="font-black text-dark text-lg">{order.customer.name}</p>
                                <p className="text-gray-500 text-sm font-bold leading-relaxed">{order.customer.address}</p>
                                <p className="text-primary text-sm font-black">{order.customer.phone}</p>
                            </div>
                        </div>
                        <div className="md:text-right">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Payment Method:</h3>
                            <div className="space-y-1">
                                <p className="font-black text-dark text-lg">{order.paymentMethod}</p>
                                <div className="flex md:justify-end items-center mt-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order {order.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="p-4 font-black text-gray-400 text-[10px] uppercase tracking-widest rounded-l-2xl">Item</th>
                                    <th className="p-4 font-black text-gray-400 text-[10px] uppercase tracking-widest">Qty</th>
                                    <th className="p-4 font-black text-gray-400 text-[10px] uppercase tracking-widest">Price</th>
                                    <th className="p-4 font-black text-gray-400 text-[10px] uppercase tracking-widest text-right rounded-r-2xl">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {order.items.map(item => (
                                    <tr key={item.id}>
                                        <td className="p-5 font-black text-dark text-sm">{item.name}</td>
                                        <td className="p-5 text-gray-500 text-sm font-bold">{item.quantity} {item.unit}</td>
                                        <td className="p-5 text-gray-500 text-sm font-bold">Rs. {item.price.toLocaleString()}</td>
                                        <td className="p-5 text-right font-black text-dark text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end mt-12">
                        <div className="w-full max-w-xs space-y-4">
                            <div className="flex justify-between items-center px-4">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtotal</span>
                                <span className="font-bold text-dark text-sm">Rs. {order.total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center px-4">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery</span>
                                <span className="font-black text-primary text-[10px] uppercase tracking-widest">Free</span>
                            </div>
                            <div className="flex justify-between items-center bg-primary/5 p-6 rounded-3xl">
                                <span className="text-xs font-black text-primary uppercase tracking-widest">Total Amount</span>
                                <span className="text-3xl font-black text-primary tracking-tighter">Rs. {order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-20 pb-4 border-t border-gray-100 pt-10">
                        <p className="text-sm font-black text-dark">Eat Fresh. Live Better.</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">Vegelo Fresh Delivery • DHA Phase 6, Lahore</p>
                    </div>
                </div>

                <div className="mt-12 flex justify-end space-x-4 print:hidden">
                    <button onClick={onClose} className="px-8 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all hover:bg-gray-200">Discard</button>
                    <button onClick={handlePrint} className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-premium hover:shadow-lg transition-all">Print Receipt</button>
                </div>
            </div>
        </div>
    );
};