
import React, { useState, ChangeEvent } from 'react';
import { CartItem, Customer, Order, View, OrderStatus } from '../types';

interface CheckoutViewProps {
    cart: CartItem[];
    placeOrder: (order: Order) => void;
    setView: (view: View) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ cart, placeOrder, setView }) => {
    const [customer, setCustomer] = useState<Customer>({ name: '', address: '', phone: '' });
    const [paymentMethod, setPaymentMethod] = useState<'Easypaisa' | 'JazzCash'>('Easypaisa');
    const [paymentProof, setPaymentProof] = useState<string | null>(null);
    const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPaymentProof(base64String);
                setPaymentProofPreview(URL.createObjectURL(file));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customer.name || !customer.address || !customer.phone || !paymentProof) {
            alert('Please fill all fields and upload payment proof.');
            return;
        }
        const newOrder: Order = {
            id: `TM-${Date.now()}`,
            customer,
            items: cart,
            total,
            status: OrderStatus.Pending,
            paymentMethod,
            paymentProof,
            orderDate: new Date(),
        };
        placeOrder(newOrder);
        setView(View.Confirmation);
    };

    if (cart.length === 0) {
         setView(View.Home);
         return null;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-dark mb-8">Checkout</h2>
            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                <div className="flex-grow bg-white p-8 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-6">1. Shipping Information</h3>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="name" id="name" value={customer.name} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Full Address</label>
                            <input type="text" name="address" id="address" value={customer.address} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input type="tel" name="phone" id="phone" value={customer.phone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required />
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mt-10 mb-6">2. Payment</h3>
                    <div className="flex space-x-4 mb-6">
                        <button type="button" onClick={() => setPaymentMethod('Easypaisa')} className={`px-6 py-2 rounded-lg font-semibold ${paymentMethod === 'Easypaisa' ? 'bg-primary text-white' : 'bg-gray-200'}`}>Easypaisa</button>
                        <button type="button" onClick={() => setPaymentMethod('JazzCash')} className={`px-6 py-2 rounded-lg font-semibold ${paymentMethod === 'JazzCash' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>JazzCash</button>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <p className="font-semibold">Scan to pay with {paymentMethod}:</p>
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${paymentMethod}-Pay`} alt={`${paymentMethod} QR Code`} className="mx-auto my-4"/>
                        <p className="text-center text-sm text-gray-600">Account: TazaMart | 0300-1234567</p>
                    </div>
                     <div className="mt-6">
                        <label htmlFor="paymentProof" className="block text-sm font-medium text-gray-700">Upload Payment Proof (Screenshot)</label>
                        <input type="file" name="paymentProof" id="paymentProof" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" required/>
                    </div>
                    {paymentProofPreview && (
                        <div className="mt-4">
                            <p className="font-semibold text-sm mb-2">Image Preview:</p>
                            <img src={paymentProofPreview} alt="Payment proof preview" className="max-w-xs rounded-lg border"/>
                        </div>
                    )}
                </div>

                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-lg shadow-lg sticky top-28">
                        <h3 className="text-xl font-bold border-b pb-4">Your Order</h3>
                        <div className="my-4 space-y-2 max-h-60 overflow-y-auto">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between">
                                    <span className="text-gray-600">{item.name} x {item.quantity}</span>
                                    <span className="font-medium">Rs. {item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                         <div className="flex justify-between items-center mt-6 pt-4 border-t text-xl font-bold">
                                <span>Total</span>
                                <span>Rs. {total.toFixed(2)}</span>
                            </div>
                        <button type="submit" className="w-full mt-6 bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-secondary-dark transition-colors">
                            Place Order
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
