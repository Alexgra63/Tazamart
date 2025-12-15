
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:bg-white print:static print:block">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto print:shadow-none print:p-0">
                <div id="invoice-content">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-primary">TazaMart Invoice</h1>
                            <p className="text-gray-500">Freshness Delivered</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-semibold">Order #{order.id}</h2>
                            <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 border-y py-4">
                        <div>
                            <h3 className="font-semibold mb-2">Billed To:</h3>
                            <p>{order.customer.name}</p>
                            <p>{order.customer.address}</p>
                            <p>{order.customer.phone}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="font-semibold mb-2">Payment Method:</h3>
                            <p>{order.paymentMethod}</p>
                            <p>Status: <span className="font-bold">{order.status}</span></p>
                        </div>
                    </div>
                    <div className="mt-8">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 font-semibold">Item</th>
                                    <th className="p-3 font-semibold">Quantity</th>
                                    <th className="p-3 font-semibold">Unit Price</th>
                                    <th className="p-3 font-semibold text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map(item => (
                                    <tr key={item.id} className="border-b">
                                        <td className="p-3">{item.name}</td>
                                        <td className="p-3">{item.quantity} {item.unit}</td>
                                        <td className="p-3">Rs. {item.price.toFixed(2)}</td>
                                        <td className="p-3 text-right">Rs. {(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end mt-8">
                        <div className="w-full max-w-xs">
                             <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>Rs. {order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-12 text-sm text-gray-500">
                        <p>Thank you for your business!</p>
                        <p>TazaMart | www.tazamart.example.com</p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4 print:hidden">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Close</button>
                    <button onClick={handlePrint} className="px-4 py-2 bg-primary text-white rounded-lg">Print Invoice</button>
                </div>
            </div>
        </div>
    );
};
