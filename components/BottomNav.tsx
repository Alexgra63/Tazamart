
import React from 'react';
import { View } from '../types';
import { HomeIcon, TagIcon, ShoppingCartIcon, ProfileIcon } from './Icons';

interface BottomNavProps {
    currentView: View;
    setView: (view: View) => void;
    isAdminView: boolean;
    setIsAdminView: (isAdmin: boolean) => void;
    isAuthenticated: boolean;
    isAdminUnlocked: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
    currentView, 
    setView, 
    isAdminView, 
    setIsAdminView, 
    isAuthenticated,
    isAdminUnlocked
}) => {
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
        { id: View.Cart, label: 'Cart', icon: ShoppingCartIcon },
    ];

    // Only add admin tab if it's unlocked via the secret logo tap
    if (isAdminUnlocked) {
        navItems.push({ id: 'admin', label: 'Admin', icon: ProfileIcon, action: handleAdminClick } as any);
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-50">
            {navItems.map((item: any) => {
                const isActive = currentView === item.id || (item.id === 'admin' && isAdminView);
                const Icon = item.icon;
                
                return (
                    <button
                        key={item.label}
                        onClick={() => item.action ? item.action() : setView(item.id as View)}
                        className="flex flex-col items-center space-y-1 transition-colors"
                    >
                        <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                        <span className={`text-[9px] font-black uppercase tracking-tight ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};
