
import React, { useState, ChangeEvent, useEffect } from 'react';
import { CartItem, Customer, Order, View, OrderStatus, UserProfile, Language } from '../types';

interface CheckoutViewProps {
    cart: CartItem[];
    placeOrder: (order: Order) => void;
    setView: (view: View) => void;
    profile: UserProfile;
    lang: Language;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ cart, placeOrder, setView, profile, lang }) => {
    const [customer, setCustomer] = useState<Customer>(profile);
    const [paymentMethod, setPaymentMethod] = useState<'Easypaisa' | 'JazzCash'>('Easypaisa');
    const [paymentProof, setPaymentProof] = useState<string | null>(null);
    const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const isUrdu = lang === Language.UR;
    const t = {
        title: isUrdu ? "چیک آؤٹ" : "Checkout",
        delivery: isUrdu ? "ڈیلیوری کی تفصیلات" : "Delivery Details",
        proof: isUrdu ? "ادائیگی کا ثبوت" : "Payment Proof",
        submit: isUrdu ? "آرڈر مکمل کریں" : "Confirm Order",
        name: isUrdu ? "نام" : "Name",
        phone: isUrdu ? "فون" : "Phone",
        address: isUrdu ? "پتہ" : "Address"
    };

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
                setPaymentProofPreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customer.name || !customer.address || !customer.phone || !paymentProof) {
            alert(isUrdu ? 'براہ کرم تمام معلومات پر کریں اور ادائیگی کا ثبوت اپلوڈ کریں۔' : 'Please fill all fields and upload payment proof.');
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
                paymentProof, 
                orderDate: new Date(),
            };
            placeOrder(newOrder);
            setView(View.Confirmation);
        } catch (error) {
            alert("Error placing order.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`container mx-auto px-4 py-8 pb-32 max-w-6xl ${isUrdu ? 'text-right rtl' : 'text-left'}`}>
            <div className="mb-8">
                <h2 className="text-3xl font-black text-dark dark:text-white tracking-tight">{t.title}</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                <div className="flex-grow space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-premium border border-gray-100 dark:border-slate-800">
                        <h3 className="text-lg font-black text-dark dark:text-white mb-6 flex items-center">
                            <span className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center mr-3 text-xs font-black">01</span>
                            {t.delivery}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">{t.name}</label>
                                <input type="text" name="name" value={customer.name} onChange={handleInputChange} className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 dark:text-white border-none outline-none focus:ring-4 focus:ring-primary/5 font-bold text-sm" required />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">{t.phone}</label>
                                <input type="tel" name="phone" value={customer.phone} onChange={handleInputChange} className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 dark:text-white border-none outline-none focus:ring-4 focus:ring-primary/5 font-bold text-sm" required />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">{t.address}</label>
                                <input type="text" name="address" value={customer.address} onChange={handleInputChange} className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 dark:text-white border-none outline-none focus:ring-4 focus:ring-primary/5 font-bold text-sm" required />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-premium border border-gray-100 dark:border-slate-800">
                        <h3 className="text-lg font-black text-dark dark:text-white mb-6 flex items-center">
                            <span className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center mr-3 text-xs font-black">02</span>
                            {t.proof}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button type="button" onClick={() => setPaymentMethod('Easypaisa')} className={`py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${paymentMethod === 'Easypaisa' ? 'bg-primary text-white shadow-lg' : 'bg-gray-50 dark:bg-slate-800 text-gray-400'}`}>Easypaisa</button>
                            <button type="button" onClick={() => setPaymentMethod('JazzCash')} className={`py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${paymentMethod === 'JazzCash' ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-lg' : 'bg-gray-50 dark:bg-slate-800 text-gray-400'}`}>JazzCash</button>
                        </div>
                        
                        <div className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-800 text-center mb-6 border border-gray-100 dark:border-slate-800">
                            <p className="text-3xl font-black text-dark dark:text-white mb-4 tracking-tighter">Rs. {total.toLocaleString()}</p>
                            <p className="text-xl font-black text-primary">0300-1234567</p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Title: TazaMart Fresh</p>
                        </div>

                        <div className="relative">
                            <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" id="file-upload" required />
                            <label htmlFor="file-upload" className="flex items-center justify-center w-full py-12 border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5 cursor-pointer transition-all">
                                {paymentProofPreview ? (
                                    <img src={paymentProofPreview} className="h-40 rounded-xl shadow-premium object-cover" />
                                ) : (
                                    <div className="text-center">
                                        <span className="material-symbols-rounded text-4xl text-primary/40 mb-2">add_a_photo</span>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Upload Payment Screenshot</p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="lg:w-[380px] shrink-0">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-premium border border-gray-100 dark:border-slate-800 sticky top-24">
                        <h3 className="text-lg font-black text-dark dark:text-white pb-4 mb-6">{isUrdu ? 'خلاصہ' : 'Summary'}</h3>
                        <div className="space-y-4 max-h-[250px] overflow-y-auto no-scrollbar">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-[11px] dark:text-gray-300">
                                    <span className="font-bold">{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
                                    <span className="font-black">Rs. {(item.price * item.quantity).toFixed(0)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-50 dark:border-slate-800">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-gray-400 uppercase">Total</span>
                                <span className="text-2xl font-black text-primary tracking-tighter">Rs. {total.toLocaleString()}</span>
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full mt-8 bg-primary text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-premium disabled:opacity-50"
                        >
                            {isSubmitting ? '...' : t.submit}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
