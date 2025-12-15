
import React from 'react';
import { Order, OrderStatus } from '../types';

interface OrderHistoryViewProps {
    orders: Order[];
}

const statusColorMap: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.Packed]: 'bg-blue-100 text-blue-800',
    [OrderStatus.Delivered]: 'bg-green-100 text-green-800',
};

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ orders }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-dark mb-8">My Orders</h2>
            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                    <p className="text-xl text-gray-500">You have no past orders.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.slice().reverse().map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex flex-wrap justify-between items-center mb-4">
                                <div>
                                    <p className="font-bold text-lg">Order ID: {order.id}</p>
                                    <p className="text-sm text-gray-500">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-lg font-semibold">Total: Rs. {order.total.toFixed(2)}</p>
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColorMap[order.status]}`}>{order.status}</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Items:</h4>
                                <ul className="list-disc list-inside text-gray-600">
                                    {order.items.map(item => (
                                        <li key={item.id}>{item.name} (x{item.quantity})</li>
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
