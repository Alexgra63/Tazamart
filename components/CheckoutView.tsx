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
                setPaymentProofPreview(URL.createObjectURL(file));
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
                id: `VG-${Date.now()}`,
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
            console.error("Order submission failed:", error);
            alert("Storage error: The payment proof image might be too large for local storage.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
         setView(View.Home);
         return null;
    }

    return (
        <div className="container mx-auto px-4 py-12 pb-32 max-w-6xl">
            <div className="mb-12">
                <h2 className="text-4xl font-black text-dark tracking-tight">Checkout</h2>
                <p className="text-gray-400 mt-2 font-black uppercase tracking-widest text-[10px]">Verify details and pay</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12">
                <div className="flex-grow space-y-8 animate-in slide-in-from-left-4 duration-500">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-gray-100">
                        <h3 className="text-xl font-black text-dark mb-8 flex items-center">
                            <span className="w-10 h-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mr-4 text-sm font-black">01</span>
                            Delivery Details
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Full Name</label>
                                <input type="text" name="name" value={customer.name} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-black text-sm" required placeholder="Who is receiving this order?" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Phone Number</label>
                                <input type="tel" name="phone" value={customer.phone} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-black text-sm" required placeholder="03xx-xxxxxxx" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Shipping Address</label>
                                <input type="text" name="address" value={customer.address} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-black text-sm" required placeholder="House #, Street, DHA Phase 6" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-gray-100">
                        <h3 className="text-xl font-black text-dark mb-8 flex items-center">
                            <span className="w-10 h-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mr-4 text-sm font-black">02</span>
                            Payment Info
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <button type="button" onClick={() => setPaymentMethod('Easypaisa')} className={`py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all transform active:scale-95 border-2 ${paymentMethod === 'Easypaisa' ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white text-gray-400 border-gray-100'}`}>Easypaisa</button>
                            <button type="button" onClick={() => setPaymentMethod('JazzCash')} className={`py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all transform active:scale-95 border-2 ${paymentMethod === 'JazzCash' ? 'bg-[#da291c] text-white border-[#da291c] shadow-lg' : 'bg-white text-gray-400 border-gray-100'}`}>JazzCash</button>
                        </div>
                        
                        <div className="p-10 rounded-[2rem] bg-gray-50 text-center mb-10 border border-gray-100">
                            <p className="font-black text-gray-400 text-[10px] mb-4 uppercase tracking-widest">Transfer Amount</p>
                            <p className="text-5xl font-black text-dark mb-10 tracking-tighter">Rs. {total.toLocaleString()}</p>
                            
                            <div className="bg-white p-8 rounded-[2rem] shadow-premium inline-block mb-8 border border-gray-50">
                                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${paymentMethod}-Vegelo-03001234567`} alt="QR" className="w-32 h-32"/>
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-2xl font-black text-primary">0300-1234567</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title: Vegelo Official</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest text-center">Upload Payment Proof</label>
                            <div className="relative">
                                <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" id="file-upload" required />
                                <label htmlFor="file-upload" className="flex items-center justify-center w-full px-8 py-20 border-2 border-dashed border-primary/20 rounded-[2.5rem] bg-primary/5 cursor-pointer hover:bg-primary/10 transition-all group overflow-hidden">
                                    {paymentProofPreview ? (
                                        <div className="relative animate-in zoom-in duration-300">
                                            <img src={paymentProofPreview} className="h-56 rounded-3xl shadow-premium object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
                                                <span className="text-white font-black text-xs uppercase tracking-widest">Update Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center transition-transform group-hover:scale-110">
                                            <div className="text-6xl mb-6">📸</div>
                                            <p className="text-xs font-black text-primary uppercase tracking-widest">Tap to upload screenshot</p>
                                            <p className="text-[9px] text-gray-400 mt-2 font-black uppercase tracking-tight">Max 5MB • JPG/PNG</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:w-[420px] shrink-0 animate-in slide-in-from-right-4 duration-500">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-gray-100 sticky top-28">
                        <h3 className="text-xl font-black text-dark border-b border-gray-50 pb-6 mb-8">Summary</h3>
                        <div className="space-y-5 max-h-[300px] overflow-y-auto pr-4 no-scrollbar">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-soft bg-gray-50">
                                            <img src={item.image} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-dark leading-none mb-1">{item.name}</p>
                                            <p className="text-[10px] text-gray-400 font-black uppercase">{item.quantity} {item.unit}</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-dark text-xs">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 pt-10 border-t border-gray-50 space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Total</span>
                                <span className="font-black text-dark text-sm">Rs. {total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery</span>
                                <span className="font-black text-primary text-[10px] uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-xl">Free Delivery</span>
                            </div>
                            <div className="flex justify-between items-end pt-4">
                                <span className="font-black text-dark text-lg uppercase tracking-tight">Total</span>
                                <span className="text-4xl font-black text-primary leading-none tracking-tighter">Rs. {total.toLocaleString()}</span>
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full mt-10 bg-gradient-to-r from-primary to-primary-dark text-white py-6 rounded-2xl font-black uppercase text-sm tracking-widest shadow-premium hover:shadow-lg transform active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Processing...' : 'Place Order Now'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};