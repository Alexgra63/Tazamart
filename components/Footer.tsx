
import React from 'react';
import { View } from '../types';

interface FooterProps {
    setView: (view: View) => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="mt-20 border-t border-gray-50 dark:border-slate-800/50 pt-12 pb-24 md:pb-12 px-6 ltr">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <img src="/logo.png" alt="Vegelo" className="h-8 w-8 object-contain" />
                            <span className="text-xl font-black text-dark dark:text-white tracking-tighter">Vegelo</span>
                        </div>
                        <p className="text-sm font-medium text-gray-400 dark:text-slate-500 max-w-sm mb-6">
                            Premium delivery of fresh fruits and vegetables at market price. From our farms to your family.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase text-gray-300 dark:text-slate-600 tracking-widest mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><button onClick={() => setView(View.AboutUs)} className="text-xs font-black text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">About Us</button></li>
                            <li><button onClick={() => setView(View.ReturnPolicy)} className="text-xs font-black text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Return Policy</button></li>
                            <li><button onClick={() => setView(View.Terms)} className="text-xs font-black text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Terms & Conditions</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase text-gray-300 dark:text-slate-600 tracking-widest mb-6">Contact</h4>
                        <ul className="space-y-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                            <li className="flex items-center"><span className="material-symbols-rounded text-sm mr-2 opacity-40">call</span> 0300-1234567</li>
                            <li className="flex items-center"><span className="material-symbols-rounded text-sm mr-2 opacity-40">mail</span> hello@vegelo.com</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-50 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center text-[9px] font-black uppercase text-gray-300 dark:text-slate-600 tracking-widest gap-4">
                    <p>© {currentYear} Vegelo Fresh. All Rights Reserved.</p>
                    <div className="flex items-center space-x-6">
                        <span className="flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span> Fresh Delivery</span>
                        <span className="flex items-center"><span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span> Sustainable Sourcing</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
