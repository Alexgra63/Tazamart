
import React from 'react';
import { CartItem, View } from '../types';
import { TrashIcon, PlusIcon, MinusIcon } from './Icons';

interface CartViewProps {
    cart: CartItem[];
    updateQuantity: (productId: number, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    setView: (view: View) => void;
}

export const CartView: React.FC<CartViewProps> = ({ cart, updateQuantity, removeFromCart, setView }) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleQuantityChange = (item: CartItem, change: number) => {
        const step = item.unit === 'kg' ? 0.25 : 1;
        const newQuantity = parseFloat((item.quantity + (change * step)).toFixed(2));
        if (newQuantity > 0) {
            updateQuantity(item.id, newQuantity);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-dark mb-8">Your Shopping Cart</h2>
            {cart.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                    <p className="text-xl text-gray-500">Your cart is empty.</p>
                    <button onClick={() => setView(View.Home)} className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-grow bg-white p-6 rounded-lg shadow-lg">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between border-b py-4 last:border-b-0">
                                <div className="flex items-center gap-4">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover"/>
                                    <div>
                                        <p className="font-semibold text-lg text-dark">{item.name}</p>
                                        <p className="text-gray-500">Rs. {item.price} / {item.unit}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border rounded-md">
                                        <button 
                                            onClick={() => handleQuantityChange(item, -1)} 
                                            className="p-2 disabled:opacity-50" 
                                            disabled={item.quantity <= (item.unit === 'kg' ? 0.25 : 1)}
                                        >
                                            <MinusIcon className="h-5 w-5"/>
                                        </button>
                                        <span className="px-4 font-semibold w-20 text-center">{item.quantity} {item.unit}</span>
                                        <button 
                                            onClick={() => handleQuantityChange(item, 1)} 
                                            className="p-2"
                                        >
                                            <PlusIcon className="h-5 w-5"/>
                                        </button>
                                    </div>
                                    <p className="w-24 text-right font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 p-2"><TrashIcon className="h-6 w-6"/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="lg: