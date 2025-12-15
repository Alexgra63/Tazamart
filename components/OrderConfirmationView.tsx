
import React from 'react';
import { View, Order } from '../types';

interface OrderConfirmationViewProps {
    lastOrder: Order | null;
    setView: (view: View) => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({ lastOrder, setView }) => {
    if (!lastOrder) {
        return (
            <div className="container mx-auto text-center py-20">
                <h2 className="text-2xl font-bold">No order found.</h2>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto text-center">
                <div className="w-16 h-16 bg-primary rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-3xl font-bold text-dark mt-6">Thank You For Your Order!</h2>
                <p className="text-gray-600 mt-2">Your order has been placed successfully. We'll notify you once it's packed.</p>
                <div className="text-left bg-light p-6 rounded-lg mt-8 border">
                    <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                    <p><strong>Order ID:</strong> {lastOrder.id}</p>
                    <p><strong>Name:</strong> {lastOrder.customer.name}</p>
                    <p><strong>Total Amount:</strong> Rs. {lastOrder.total.toFixed(2)}</p>
                    <p><strong>Shipping to:</strong> {lastOrder.customer.address}</p>
                </div>
                <div className="mt-8 space-x-4">
                     <button onClick={() => setView(View.Home)} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        Continue Shopping
                    </button>
                    <button onClick={() => setView(View.OrderHistory)} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                        View My Orders
                    </button>
                </div>
            </div>
        </div>
    );
};
