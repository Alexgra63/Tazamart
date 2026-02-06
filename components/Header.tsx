import React from 'react';
import { View } from '../types';
import { ShoppingCartIcon, LocationIcon } from './Icons';

interface HeaderProps {
    cartItemCount: number;
    setView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount, setView }) => {
    return (
        <header className="bg-white sticky top-0 z-50 px-4 py-4 border-b border-gray-100">
            <div className="container mx-auto flex items-center justify-between">
                <div 
                    className="flex flex-col cursor-pointer transition-transform active:scale-95" 
                    onClick={() => setView(View.Home)}
                >
                    <div className="flex items-center space-x-2">
                        <div className="bg-gradient-to-br from-primary to-primary-dark p-1.5 rounded-xl shadow-sm">
                            <span className="text-white text-xl">🥬</span>
                        </div>
                        <span className="text-2xl font-black text-dark tracking-tighter">Vegelo</span>
                    </div>
                    <div className="flex items-center mt-1 text-primary">
                        <LocationIcon className="h-3 w-3 mr-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest">DHA Phase 6 &gt;</span>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button 
                        onClick={() => setView(View.Cart)} 
                        className="bg-gray-50 p-3 rounded-2xl relative hover:bg-gray-100 transition-colors shadow-soft"
                    >
                        <ShoppingCartIcon className="h-6 w-6 text-dark" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-gradient-to-br from-primary to-primary-dark text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};