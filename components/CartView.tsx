
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
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-black text-dark mb-8">My Basket</h2>
            {cart.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl shadow-soft border border-gray-100">
                    <div className="text-6xl mb-6">🧺</div>
                    <p className="text-xl font-bold text-gray-400">Your basket is empty</p>
                    <button onClick={() => setView(View.Home)} className="mt-8 bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-3 rounded-2xl font-bold shadow-premium transform active:scale-95 transition">
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-grow space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover shrink-0"/>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-dark">{item.name}</h3>
                                    <p className="text-sm text-gray-500">Rs. {item.price} / {item.unit}</p>
                                    
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center bg-gray-100 rounded-xl p-1">
                                            <button 
                                                onClick={() => handleQuantityChange(item, -1)} 
                                                className="p-1.5 text-gray-500 hover:text-dark disabled:opacity-30" 
                                                disabled={item.quantity <= (item.unit === 'kg' ? 0.25 : 1)}
                                            >
                                                <MinusIcon className="h-4 w-4"/>
                                            </button>
                                            <span className="px-3 font-bold text-sm min-w-[80px] text-center">
                                                {item.quantity} {item.unit}
                                            </span>
                                            <button 
                                                onClick={() => handleQuantityChange(item, 1)} 
                                                className="p-1.5 text-gray-500 hover:text-dark"
                                            >
                                                <PlusIcon className="h-4 w-4"/>
                                            </button>
                                        </div>
                                        <span className="font-black text-primary">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                                    <TrashIcon className="h-6 w-6"/>
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="lg:w-96">
                        <div className="bg-white p-8 rounded-3xl shadow-premium border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-black text-dark mb-6">Order Summary</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span>Rs. {total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Delivery</span>
                                    <span className="text-primary font-bold">FREE</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="font-black text-dark text-lg">Total</span>
                                    <span className="font-black text-primary text-2xl">Rs. {total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setView(View.Checkout)}
                                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-2xl font-bold shadow-premium hover:shadow-lg transform active:scale-[0.98] transition"
                            >
                                Checkout Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
