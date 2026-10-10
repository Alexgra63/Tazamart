import React, { useState } from 'react';
import { config, verifyAdminPassword } from '../lib/config';
import { Button, Card } from './ui';

interface AdminLoginViewProps {
    onLogin: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const configured = config.adminEnabled && !!config.adminPasswordSha256;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);
        const ok = await verifyAdminPassword(password);
        setBusy(false);
        if (ok) onLogin();
        else setError('Incorrect password');
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <Card className="w-full max-w-md text-center !p-8 md:!p-10">
                <img src="/logo.svg" alt="Tazamart" className="mx-auto mb-5 w-16 h-16 object-contain" />
                <h1 className="font-display text-3xl font-semibold text-ink dark:text-white">Tazamart Admin</h1>
                <p className="text-sm text-muted dark:text-stone-400 mt-1 mb-8">Restricted area</p>

                {!configured ? (
                    <p className="text-sm text-muted dark:text-stone-400 bg-gray-50 dark:bg-slate-800 rounded-[10px] p-4 text-left">
                        Admin is not configured for this deployment. Set <code>VITE_ENABLE_ADMIN</code> and{' '}
                        <code>VITE_ADMIN_PASSWORD_SHA256</code> in the environment and redeploy.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="text-left space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-ink dark:text-stone-200 mb-1.5" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                className="w-full h-11 px-4 rounded-[10px] bg-white dark:bg-slate-800 border border-line focus:border-primary focus:ring-4 focus:ring-primary/15 outline-none text-sm"
                            />
                            {error && <p role="alert" className="text-red-600 text-sm mt-2">{error}</p>}
                        </div>
                        <Button type="submit" fullWidth size="lg" icon="lock" disabled={busy || !password}>
                            {busy ? 'Checking…' : 'Sign in'}
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
};
