import React from 'react';
import { View } from '../types';
import { config } from '../lib/config';

interface FooterProps {
    setView: (view: View) => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
    const year = new Date().getFullYear();
    const link = 'text-sm text-muted dark:text-stone-400 hover:text-primary transition-colors';
    return (
        <footer className="hidden md:block mt-16 border-t border-line bg-white/50 dark:bg-slate-900/40 no-print" dir="ltr">
            <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-4 gap-10">
                <div className="col-span-2">
                    <div className="flex items-center gap-2.5 mb-3">
                        <img src="/logo.png" alt="" className="h-8 w-8 object-contain" />
                        <span className="font-display text-xl font-semibold text-ink dark:text-white">Vegelo</span>
                    </div>
                    <p className="text-sm text-muted dark:text-stone-400 max-w-sm">Taza sabzi and fruit from the Islamabad mandi at market prices, delivered to your door.</p>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-ink dark:text-white mb-3">Help</h4>
                    <ul className="space-y-2">
                        <li><button onClick={() => setView(View.AboutUs)} className={link}>About us</button></li>
                        <li><button onClick={() => setView(View.ReturnPolicy)} className={link}>Return policy</button></li>
                        <li><button onClick={() => setView(View.Terms)} className={link}>Terms &amp; conditions</button></li>
                        <li><button onClick={() => setView(View.ContactUs)} className={link}>Contact us</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-ink dark:text-white mb-3">Contact</h4>
                    <p className="text-sm text-muted dark:text-stone-400 flex items-center gap-2">
                        <span className="material-symbols-rounded text-[18px] text-primary">call</span>{config.paymentNumber}
                    </p>
                </div>
            </div>
            <div className="border-t border-line">
                <p className="max-w-7xl mx-auto px-8 py-4 text-xs text-muted dark:text-stone-500">© {year} Vegelo. All rights reserved.</p>
            </div>
        </footer>
    );
};
