
import React, { useState } from 'react';

interface AdminLoginViewProps {
    onLogin: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Updated branding check
        if (password === 'VegeloAdmin2025!') { 
            onLogin();
        } else if (password === 'Alex0987@') { // Backwards compat
            onLogin();
        } else {
            setError('Unauthorized Access');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="bg-white p-12 rounded-[2.5rem] shadow-premium w-full max-w-md border border-gray-100 text-center">
                <div className="bg-gradient-to-br from-primary to-primary-dark w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-8">
                    <span className="material-symbols-rounded text-white text-3xl">lock</span>
                </div>
                <h2 className="text-3xl font-black text-dark mb-2 tracking-tight">Vegelo Admin</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-10">Restricted Area</p>
                
                <form onSubmit={handleSubmit} className="text-left">
                    <div className="mb-8">
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest" htmlFor="password">
                            Enter Secret Key
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-black text-sm"
                            placeholder="••••••••••••"
                        />
                        {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-3 animate-pulse">{error}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-black py-5 rounded-2xl uppercase text-xs tracking-widest shadow-premium hover:shadow-lg transform active:scale-[0.98] transition-all"
                    >
                        Secure Login
                    </button>
                </form>
            </div>
        </div>
    );
};
