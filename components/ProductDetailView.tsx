
import React, { useState } from 'react';
import { Product, Language } from '../types';
import { Badge, Button, Card, IconButton, Price, QuantityStepper } from './ui';

interface ProductDetailViewProps {
    product: Product;
    onAddToCart: (product: Product, quantity: number) => void;
    onBack: () => void;
    lang: Language;
    isFavorite: boolean;
    toggleFavorite: (id: number) => void;
}

const translations = {
    back: "Back",
    per: "per",
    rs: "Rs.",
    quantity: "Quantity",
    addToCart: "Add to Basket",
    desc: "Product Description",
    noDesc: "Fresh premium quality item selected specially for Vegelo customers.",
    added: "Added to Basket",
    total: "Subtotal",
    adjustWeight: "Adjust weight",
    selectPieces: "Select pieces"
};

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ 
    product, onAddToCart, onBack, lang, isFavorite, toggleFavorite 
}) => {
    const [quantity, setQuantity] = useState(1);
    const [addedToast, setAddedToast] = useState(false);
    const t = translations;

    const isWeightBased = product.unit === 'kg';
    const step = isWeightBased ? 0.25 : 1;
    const minQuantity = isWeightBased ? 0.25 : 1;

    const handleAddToCart = () => {
        onAddToCart(product, quantity);
        setAddedToast(true);
        setTimeout(() => setAddedToast(false), 2000);
    };

    const presets = isWeightBased ? [0.25, 0.5, 1, 2] : [1, 2, 3, 5];

    return (
        <div className="pb-28 md:pb-12 animate-in fade-in duration-300 text-left" dir="ltr">
            <div className="flex items-center justify-between px-4 md:px-0 py-4">
                <Button variant="ghost" size="sm" icon="arrow_back" onClick={onBack}>{t.back}</Button>
                <IconButton
                    icon="favorite"
                    label={isFavorite ? 'Remove from saved' : 'Save'}
                    onClick={() => toggleFavorite(product.id)}
                    className={isFavorite ? 'text-red-600 dark:text-red-400' : ''}
                />
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-12 px-4 md:px-0">
                <div className="relative aspect-[4/3] md:aspect-square overflow-hidden rounded-2xl md:rounded-3xl bg-gray-50 dark:bg-slate-800 border border-line">
                    <img src={product.image} alt={product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x600?text=Vegelo'; }} />
                </div>

                <div className="pt-6 md:pt-2">
                    <div className="flex items-center gap-2 mb-3">
                        <Badge tone="green">{product.category}</Badge>
                        <Badge>Sold per {product.unit}</Badge>
                    </div>
                    <h1 className="font-display text-3xl md:text-5xl font-semibold text-ink dark:text-white leading-tight">{product.name}</h1>
                    <div className="mt-3"><Price amount={product.price} unit={product.unit} className="text-2xl md:text-3xl text-primary-dark dark:text-primary" /></div>

                    <Card className="mt-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-ink dark:text-white">{t.quantity}</p>
                                <p className="text-xs text-muted dark:text-stone-400">{isWeightBased ? t.adjustWeight : t.selectPieces}</p>
                            </div>
                            <QuantityStepper value={quantity} step={step} min={minQuantity} onChange={setQuantity} />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {presets.map(q => (
                                <button key={q} onClick={() => setQuantity(q)}
                                    className={`h-9 px-3 rounded-full text-sm font-semibold border transition-colors ${quantity === q ? 'bg-primary-soft border-primary text-primary-dark dark:text-primary' : 'border-line text-muted dark:text-stone-300 hover:border-primary'}`}>
                                    {isWeightBased && q < 1 ? `${q * 1000} g` : `${q} ${product.unit}`}
                                </button>
                            ))}
                        </div>
                    </Card>

                    <div className="hidden md:flex items-center justify-between gap-6 mt-6">
                        <div>
                            <p className="text-xs text-muted dark:text-stone-400">{t.total}</p>
                            <Price amount={product.price * quantity} className="text-2xl" />
                        </div>
                        <Button size="lg" icon="shopping_basket" onClick={handleAddToCart} className="px-8">{t.addToCart}</Button>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-sm font-semibold text-ink dark:text-white mb-2">{t.desc}</h2>
                        <p className="text-muted dark:text-stone-300 leading-relaxed">{product.description || t.noDesc}</p>
                    </div>
                </div>
            </div>

            {/* Mobile sticky add bar */}
            <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-4 no-print">
                <div className="shrink-0">
                    <p className="text-xs text-muted dark:text-stone-400">{t.total}</p>
                    <Price amount={product.price * quantity} className="text-lg" />
                </div>
                <Button size="lg" fullWidth icon="shopping_basket" onClick={handleAddToCart}>{t.addToCart}</Button>
            </div>

            {addedToast && (
                <div role="status" className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 rounded-full bg-ink dark:bg-white text-white dark:text-stone-950 px-5 py-2.5 text-sm font-semibold shadow-premium animate-in fade-in slide-in-from-top-2">
                    <span className="material-symbols-rounded text-primary text-[20px]">check_circle</span>
                    {t.added}
                </div>
            )}
        </div>
    );
};
