import React, { useEffect, useState } from 'react';
import { config, lockoutRemainingMs, recordFailedLogin, resetLoginFailures } from '../lib/config';
import { Button, Card } from './ui';
import { api, SECURE_BACKEND } from '../lib/api';

interface AdminLoginViewProps {
    onLogin: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const [lockMs, setLockMs] = useState(lockoutRemainingMs());
    const configured = config.adminEnabled && SECURE_BACKEND;

    useEffect(() => {
        if (lockMs <= 0) return;
        const t = setInterval(() => setLockMs(lockoutRemainingMs()), 1000);
        return () => clearInterval(t);
    }, [lockMs > 0]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (lockoutRemainingMs() > 0) return;
        setBusy(true);
        let ok = false;
        const r = await api.login(password);
        ok = r.ok;
        if (!r.ok && r.error === 'locked') { setBusy(false); setPassword(''); setError(`Too many failed attempts. Try again in ${Math.ceil((r.retryAfterSeconds || 900) / 60)} min.`); return; }
        if (!r.ok && r.error !== 'invalid_credentials') { setBusy(false); setError('Could not reach the server. Try again.'); return; }
        setBusy(false);
        if (ok) { resetLoginFailures(); onLogin(); return; }
        setPassword('');
        const wait = recordFailedLogin();
        setLockMs(wait);
        setError(wait ? 'Too many failed attempts.' : 'Incorrect password');
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <Card className="w-full max-w-md text-center !p-8 md:!p-10">
                <img src="/logo.png" alt="Vegelo" className="mx-auto mb-5 w-16 h-16 object-contain" />
                <h1 className="font-display text-3xl font-semibold text-ink dark:text-white">Vegelo Admin</h1>
                <p className="text-sm text-muted dark:text-stone-400 mt-1 mb-8">Restricted area</p>

                {!configured ? (
                    <p className="text-sm text-muted dark:text-stone-400 bg-gray-50 dark:bg-slate-800 rounded-[10px] p-4 text-left">
                        Admin is not configured for this deployment. Set <code>VITE_ENABLE_ADMIN</code> and{' '}
                        <code>VITE_BACKEND_AUTH=true</code> in the environment and redeploy.
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
                        {lockMs > 0 && <p role="status" className="text-sm text-amber-700 dark:text-amber-300">Locked. Try again in {Math.ceil(lockMs / 1000)}s.</p>}
                        <Button type="submit" fullWidth size="lg" icon="lock" disabled={busy || !password || lockMs > 0}>
                            {busy ? 'Checking…' : 'Sign in'}
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
};
