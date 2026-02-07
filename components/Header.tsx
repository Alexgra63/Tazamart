
import React from 'react';
import { View } from '../types.ts';
import { ShoppingCartIcon } from './Icons.tsx';

interface HeaderProps {
    cartItemCount: number;
    setView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount, setView }) => {
    return (
        <header className="bg-white sticky top-0 z-50 px-4 py-3 border-b border-gray-100">
            <div className="container mx-auto flex items-center justify-between">
                <div 
                    className="flex items-center space-x-2 cursor-pointer transition-transform active:scale-95" 
                    onClick={() => setView(View.Home)}
                >
                    <div className="bg-gradient-to-br from-primary to-primary-dark p-1 rounded-lg shadow-sm">
                        <span className="text-white text-lg">🥬</span>
                    </div>
                    <span className="text-xl font-black text-dark tracking-tighter">Vegelo</span>
                </div>

                <div className="flex items-center">
                    <button 
                        onClick={() => setView(View.Cart)} 
                        className="bg-gray-50 p-2.5 rounded-xl relative hover:bg-gray-100 transition-colors shadow-soft"
                    >
                        <ShoppingCartIcon className="h-5 w-5 text-dark" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-gradient-to-br from-primary to-primary-dark text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-white shadow-sm">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};
