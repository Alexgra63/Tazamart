
import React from 'react';
import { View } from '../types';
import { HomeIcon, TagIcon, SearchIcon, ProfileIcon } from './Icons';

interface BottomNavProps {
    currentView: View;
    setView: (view: View) => void;
    isAdminView: boolean;
    setIsAdminView: (isAdmin: boolean) => void;
    isAuthenticated: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView, isAdminView, setIsAdminView, isAuthenticated }) => {
    const handleAdminClick = () => {
        setIsAdminView(true);
        if (isAuthenticated) {
            setView(View.Admin);
        } else {
            setView(View.AdminLogin);
        }
    }

    const navItems = [
        { id: View.Home, label: 'Discovery', icon: HomeIcon },
        { id: View.OrderHistory, label: 'Orders', icon: TagIcon },
        { id: View.Cart, label: 'Cart', icon: SearchIcon }, // Using search as a placeholder or could add search view
        { id: 'admin', label: 'Admin', icon: ProfileIcon, action: handleAdminClick },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-50">
            {navItems.map((item) => {
                const isActive = currentView === item.id || (item.id === 'admin' && isAdminView);
                const Icon = item.icon;
                
                return (
                    <button
                        key={item.label}
                        onClick={() => item.action ? item.action() : setView(item.id as View)}
                        className="flex flex-col items-center space-y-1 transition-colors"
                    >
                        <Icon className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                        <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};
