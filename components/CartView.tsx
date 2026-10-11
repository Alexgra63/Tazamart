
import React from 'react';
import { CartItem, View, Language } from '../types';
import { Badge, Button, Card, EmptyState, IconButton, Price, QuantityStepper } from './ui';

interface CartViewProps {
    cart: CartItem[];
    updateQuantity: (productId: number, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    setView: (view: View) => void;
    lang: Language;
}

const translations = {
    title: "My Basket",
    empty: "Your basket is empty",
    start: "Start Shopping",
    summary: "Order Summary",
    subtotal: "Subtotal",
    delivery: "Delivery",
    free: "Free",
    total: "Total",
    checkout: "Checkout"
};

export const CartView: React.FC<CartViewProps> = ({ cart, updateQuantity, removeFromCart, setView, lang }) => {
    const t = translations;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleQuantityChange = (item: CartItem, change: number) => {
        const step = item.unit === 'kg' ? 0.25 : 1;
        const newQuantity = parseFloat((item.quantity + (change * step)).toFixed(2));
        if (newQuantity > 0) {
            updateQuantity(item.id, newQuantity);
        }
    };

    return (
        <div className="px-4 md:px-0 py-6 md:py-10 animate-in fade-in duration-300" dir="ltr">
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink dark:text-white mb-6">{t.title}</h1>
            {cart.length === 0 ? (
                <EmptyState icon="shopping_basket" title={t.empty} description="Fresh sabzi is a tap away."
                    action={<Button icon="storefront" onClick={() => setView(View.Home)}>{t.start}</Button>} />
            ) : (
                <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-10 items-start">
                    <ul className="divide-y divide-line border border-line rounded-[var(--radius-card)] bg-white dark:bg-slate-900">
                        {cart.map(item => {
                            const step = item.unit === 'kg' ? 0.25 : 1;
                            return (
                                <li key={item.id} className="flex gap-3 md:gap-4 p-3 md:p-4">
                                    <img src={item.image} alt={item.name} referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.src = 'https://placehold.co/200x200?text=Vegelo'; }} className="w-20 h-20 md:w-24 md:h-24 rounded-[10px] object-cover bg-gray-50 dark:bg-slate-800 shrink-0" />
                                    <div className="flex-1 min-w-0 flex flex-col">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-ink dark:text-white truncate">{item.name}</h3>
                                                <Price amount={item.price} unit={item.unit} className="text-sm font-medium !text-muted dark:!text-stone-400" />
                                            </div>
                                            <IconButton icon="delete" label={`Remove ${item.name}`} onClick={() => removeFromCart(item.id)} className="!h-9 !w-9 text-muted hover:!text-red-600" />
                                        </div>
                                        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                                            <QuantityStepper size="sm" value={item.quantity} step={step} min={step}
                                                onChange={(q) => q > 0 && updateQuantity(item.id, q)} />
                                            <Price amount={item.price * item.quantity} className="text-base" />
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <Card className="lg:sticky lg:top-24">
                        <h2 className="text-lg font-semibold text-ink dark:text-white mb-4">{t.summary}</h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between"><dt className="text-muted dark:text-stone-400">{t.subtotal}</dt><dd className="font-semibold tabular">Rs. {total.toLocaleString()}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted dark:text-stone-400">{t.delivery}</dt><dd><Badge tone="green">{t.free}</Badge></dd></div>
                            <div className="flex justify-between items-baseline pt-3 border-t border-line">
                                <dt className="font-semibold text-ink dark:text-white">{t.total}</dt>
                                <dd className="text-2xl font-bold tabular text-ink dark:text-white">Rs. {total.toLocaleString()}</dd>
                            </div>
                        </dl>
                        <Button size="lg" fullWidth icon="lock" className="mt-6" onClick={() => setView(View.Checkout)}>{t.checkout}</Button>
                        <button onClick={() => setView(View.Home)} className="w-full mt-3 text-sm font-semibold text-primary hover:underline">Continue shopping</button>
                    </Card>
                </div>
            )}
        </div>
    );
};
