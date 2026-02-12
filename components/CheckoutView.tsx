
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                alert("File is too large. Please upload an image under 5MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPaymentProof(base64String);
                setPaymentProofPreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customer.name || !customer.address || !customer.phone || !paymentProof) {
            alert('Please fill all fields and upload payment proof.');
            return;
        }

        setIsSubmitting(true);
        try {
            const newOrder: Order = {
                id: `ORD-${Date.now()}`,
                customer,
                items: cart,
                total,
                status: OrderStatus.Pending,
                paymentMethod,
                paymentProof, // This is already base64
                orderDate: new Date(),
            };
            placeOrder(newOrder);
            setView(View.Confirmation);
        } catch (error) {
            console.error("Order submission failed:", error);
            alert("Error placing order.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
         setView(View.Home);
         return null;
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-32 max-w-6xl">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-dark tracking-tight">Checkout</h2>
                <p className="text-gray-400 mt-1 font-black uppercase tracking-widest text-[9px]">Confirm Details</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                <div className="flex-grow space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] shadow-premium border border-gray-100">
                        <h3 className="text-lg font-black text-dark mb-6 flex items-center">
                            <span className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center mr-3 text-xs font-black">01</span>
                            Delivery Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">Full Name</label>
                                <input type="text" name="name" value={customer.name} onChange={handleInputChange} className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm" required placeholder="Full Name" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">Phone Number</label>
                                <input type="tel" name="phone" value={customer.phone} onChange={handleInputChange} className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm" required placeholder="03xx-xxxxxxx" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">Address</label>
                                <input type="text" name="address" value={customer.address} onChange={handleInputChange} className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm" required placeholder="House #, Street, City" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] shadow-premium border border-gray-100">
                        <h3 className="text-lg font-black text-dark mb-6 flex items-center">
                            <span className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center mr-3 text-xs font-black">02</span>
                            Payment Proof
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button type="button" onClick={() => setPaymentMethod('Easypaisa')} className={`py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all transform active:scale-95 border-2 ${paymentMethod === 'Easypaisa' ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white text-gray-400 border-gray-50'}`}>Easypaisa</button>
                            <button type="button" onClick={() => setPaymentMethod('JazzCash')} className={`py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all transform active:scale-95 border-2 ${paymentMethod === 'JazzCash' ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-gray-400 border-gray-50'}`}>JazzCash</button>
                        </div>
                        
                        <div className="p-6 rounded-2xl bg-gray-50 text-center mb-6 border border-gray-100">
                            <p className="text-3xl font-black text-dark mb-4 tracking-tighter">Rs. {total.toLocaleString()}</p>
                            <p className="text-xl font-black text-primary">0300-1234567</p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Account Title: TazaMart Fresh</p>
                        </div>

                        <div className="relative">
                            <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" id="file-upload" required />
                            <label htmlFor="file-upload" className="flex items-center justify-center w-full py-12 border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5 cursor-pointer hover:bg-primary/10 transition-all group overflow-hidden">
                                {paymentProofPreview ? (
                                    <img src={paymentProofPreview} className="h-40 rounded-xl shadow-premium object-cover animate-in zoom-in duration-300" />
                                ) : (
                                    <div className="text-center group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-rounded text-4xl text-primary/40 mb-2">add_a_photo</span>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Upload Payment Screenshot</p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="lg:w-[380px] shrink-0">
                    <div className="bg-white p-8 rounded-[2rem] shadow-premium border border-gray-100 sticky top-24">
                        <h3 className="text-lg font-black text-dark border-b border-gray-50 pb-4 mb-6">Summary</h3>
                        <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 no-scrollbar">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-[11px]">
                                    <span className="font-bold text-dark">{item.name} <span className="text-gray-400">× {item.quantity}{item.unit}</span></span>
                                    <span className="font-black text-dark">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-50 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-gray-400 uppercase">Total Amount</span>
                                <span className="text-2xl font-black text-primary tracking-tighter">Rs. {total.toLocaleString()}</span>
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full mt-8 bg-primary text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-premium hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
