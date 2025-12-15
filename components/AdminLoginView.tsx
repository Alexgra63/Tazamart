
import React, { useState } from 'react';

interface AdminLoginViewProps {
    onLogin: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'Alex0987@') {
            onLogin();
        } else {
            setError('Incorrect password');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-dark mb-6">Admin Access</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter admin password"
                        />
                        {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
