
import React from 'react';
import { View } from '../types';
import { ShoppingCartIcon, SearchIcon } from './Icons';

interface HeaderProps {
    cartItemCount: number;
    isAdminView: boolean;
    isAuthenticated: boolean;
    setView: (view: View) => void;
    setIsAdminView: (isAdmin: boolean) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount, isAdminView, isAuthenticated, setView, setIsAdminView, searchQuery, setSearchQuery }) => {
    const handleNavigation = (view: View) => {
        setIsAdminView(false);
        setView(view);
    }
    
    const toggleAdminView = () => {
        if (!isAdminView) {
            setIsAdminView(true);
            if (isAuthenticated) {
                setView(View.Admin);
            } else {
                setView(View.AdminLogin);
            }
        } else {
            setIsAdminView(false);
            setView(View.Home);
        }
    };
    
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-4">
                    <div className="flex items-center shrink-0 space-x-2 sm:space-x-4">
                        <h1 onClick={() => handleNavigation(View.Home)} className="text-2xl sm:text-3xl font-bold text-primary cursor-pointer">
                            TazaMart
                        </h1>
                        <span className="text-2xl hidden sm:inline">🥦</span>
                    </div>

                    <div className="flex-1 max-w-lg mx-2 sm:mx-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <nav className="hidden md:flex items-center space-x-6 shrink-0">
                        <a onClick={() => handleNavigation(View.Home)} className="text-gray-600 hover:text-primary transition cursor-pointer">Home</a>
                        <a onClick={() => handleNavigation(View.OrderHistory)} className="text-gray-600 hover:text-primary transition cursor-pointer">My Orders</a>
                        <a onClick={toggleAdminView} className="text-gray-600 hover:text-primary transition cursor-pointer font-semibold">{isAdminView ? 'Exit Admin' : 'Admin Panel'}</a>
                    </nav>

                    <div className="flex items-center shrink-0">
                        <button onClick={() => setView(View.Cart)} className="relative text-gray-600 hover:text-primary transition-colors focus:outline-none">
                            <ShoppingCartIcon className="h-7 w-7" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
