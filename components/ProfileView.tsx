import React, { useEffect, useMemo, useState } from 'react';
import { UserProfile, Language, View, Theme } from '../types';
import { Badge, Button, Card, IconButton, cn } from './ui';

interface ProfileViewProps {
    profile: UserProfile;
    updateProfile: (profile: UserProfile) => void;
    lang: Language;
    setView: (view: View) => void;
    theme?: Theme;
    setTheme?: (t: Theme) => void;
    setLanguage?: (l: Language) => void;
    ordersCount?: number;
    favoritesCount?: number;
    onClearData?: () => void;
}

type SavedAddress = { id: string; label: string; address: string };
const ADDR_KEY = 'vegelo_addresses';
const loadAddresses = (): SavedAddress[] => { try { return JSON.parse(localStorage.getItem(ADDR_KEY) || '[]'); } catch { return []; } };

const sections = [
    { id: 'personal', label: 'Personal info', icon: 'badge' },
    { id: 'addresses', label: 'Delivery addresses', icon: 'location_on' },
    { id: 'preferences', label: 'Preferences', icon: 'tune' },
    { id: 'activity', label: 'Orders & saved', icon: 'receipt_long' },
    { id: 'help', label: 'Help & legal', icon: 'help' },
    { id: 'privacy', label: 'Privacy & data', icon: 'shield_person' },
] as const;

const inputCls = 'w-full h-12 px-4 rounded-[10px] bg-white dark:bg-slate-800 border border-line outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 text-base text-ink dark:text-white';
const labelCls = 'block text-sm font-semibold text-ink dark:text-stone-200 mb-1.5';

const SectionCard: React.FC<{ id: string; title: string; icon: string; description?: string; children: React.ReactNode }> = ({ id, title, icon, description, children }) => (
    <Card id={id} className="scroll-mt-24 !p-4 md:!p-6">
        <div className="flex items-start gap-3 mb-4">
            <span className="material-symbols-rounded text-primary bg-primary-soft rounded-[10px] p-2 text-[22px]">{icon}</span>
            <div>
                <h2 className="text-lg font-semibold text-ink dark:text-white">{title}</h2>
                {description && <p className="text-sm text-muted dark:text-stone-400">{description}</p>}
            </div>
        </div>
        {children}
    </Card>
);

const Row: React.FC<{ icon: string; label: string; hint?: string; onClick: () => void; trailing?: React.ReactNode }> = ({ icon, label, hint, onClick, trailing }) => (
    <button type="button" onClick={onClick} className="w-full min-h-14 flex items-center gap-3 px-2 -mx-2 rounded-[10px] text-left hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
        <span className="material-symbols-rounded text-muted dark:text-stone-400">{icon}</span>
        <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold text-ink dark:text-white">{label}</span>
            {hint && <span className="block text-xs text-muted dark:text-stone-400">{hint}</span>}
        </span>
        {trailing}
        <span className="material-symbols-rounded text-muted">chevron_right</span>
    </button>
);

export const ProfileView: React.FC<ProfileViewProps> = ({
    profile, updateProfile, setView, theme, setTheme, ordersCount = 0, favoritesCount = 0, onClearData,
}) => {
    const [formData, setFormData] = useState<UserProfile>(profile);
    const [isSaved, setIsSaved] = useState(false);
    const [addresses, setAddresses] = useState<SavedAddress[]>(loadAddresses);
    const [newLabel, setNewLabel] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [active, setActive] = useState<string>('personal');

    useEffect(() => { setFormData(profile); }, [profile]);
    useEffect(() => { try { localStorage.setItem(ADDR_KEY, JSON.stringify(addresses)); } catch { /* ignore */ } }, [addresses]);

    const dirty = useMemo(() => JSON.stringify(formData) !== JSON.stringify(profile), [formData, profile]);
    const initials = (formData.name || 'V').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();

    const save = (e?: React.FormEvent) => {
        e?.preventDefault();
        updateProfile(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
    };

    const addAddress = () => {
        if (!newAddress.trim()) return;
        setAddresses(a => [...a, { id: String(Date.now()), label: newLabel.trim() || `Address ${a.length + 1}`, address: newAddress.trim() }]);
        setNewLabel(''); setNewAddress('');
    };
    const makeDefault = (a: SavedAddress) => { const p = { ...formData, address: a.address }; setFormData(p); updateProfile(p); setIsSaved(true); setTimeout(() => setIsSaved(false), 2500); };

    const goTo = (id: string) => { setActive(id); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

    return (
        <div className="px-4 md:px-0 py-6 md:py-10 pb-36 md:pb-10 animate-in fade-in duration-300 text-left" dir="ltr">
            {/* Profile header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary text-white dark:text-stone-950 flex items-center justify-center text-xl font-bold shrink-0">{initials}</div>
                <div className="min-w-0">
                    <h1 className="font-display text-2xl md:text-4xl font-semibold text-ink dark:text-white truncate">{formData.name || 'Your account'}</h1>
                    <p className="text-sm text-muted dark:text-stone-400 truncate">{formData.phone || 'Add your details for faster checkout'}</p>
                </div>
            </div>

            <div className="md:grid md:grid-cols-[240px_1fr] md:gap-8 items-start">
                {/* Desktop side nav */}
                <nav className="hidden md:block sticky top-24" aria-label="Account sections">
                    <ul className="space-y-1">
                        {sections.map(s => (
                            <li key={s.id}>
                                <button onClick={() => goTo(s.id)} aria-current={active === s.id ? 'true' : undefined}
                                    className={cn('w-full h-11 px-3 rounded-[10px] flex items-center gap-3 text-sm font-semibold transition-colors',
                                        active === s.id ? 'bg-primary-soft text-primary-dark dark:text-primary' : 'text-muted dark:text-stone-300 hover:bg-gray-100 dark:hover:bg-slate-800')}>
                                    <span className="material-symbols-rounded text-[20px]">{s.icon}</span>{s.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="space-y-4 md:space-y-6 min-w-0">
                    {/* Personal info */}
                    <SectionCard id="personal" title="Personal info" icon="badge" description="Used to fill in checkout automatically.">
                        <form id="profile-form" onSubmit={save} className="grid md:grid-cols-2 gap-4">
                            <div><label className={labelCls} htmlFor="pf-name">Full name</label>
                                <input id="pf-name" autoComplete="name" className={inputCls} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                            <div><label className={labelCls} htmlFor="pf-phone">Phone</label>
                                <input id="pf-phone" type="tel" inputMode="tel" autoComplete="tel" className={inputCls} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="03xx-xxxxxxx" required /></div>
                            <div className="md:col-span-2"><label className={labelCls} htmlFor="pf-address">Default delivery address</label>
                                <textarea id="pf-address" autoComplete="street-address" className={cn(inputCls, '!h-24 py-3')} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required /></div>
                            <div className="hidden md:flex md:col-span-2 items-center justify-end gap-3">
                                {isSaved && <span role="status" className="text-sm font-semibold text-primary flex items-center gap-1"><span className="material-symbols-rounded text-[18px]">check_circle</span>Saved</span>}
                                <Button type="submit" icon="save" disabled={!dirty}>Save changes</Button>
                            </div>
                        </form>
                    </SectionCard>

                    {/* Addresses */}
                    <SectionCard id="addresses" title="Delivery addresses" icon="location_on" description="Save home, work or family addresses.">
                        <ul className="space-y-2 mb-4">
                            {addresses.length === 0 && <li className="text-sm text-muted dark:text-stone-400">No saved addresses yet.</li>}
                            {addresses.map(a => {
                                const isDefault = a.address === profile.address;
                                return (
                                    <li key={a.id} className="flex items-start gap-3 p-3 rounded-[10px] border border-line">
                                        <span className="material-symbols-rounded text-primary mt-0.5">home_pin</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-ink dark:text-white flex items-center gap-2">{a.label}{isDefault && <Badge tone="green">Default</Badge>}</p>
                                            <p className="text-sm text-muted dark:text-stone-400 break-words">{a.address}</p>
                                            {!isDefault && <button onClick={() => makeDefault(a)} className="mt-1 min-h-9 text-sm font-semibold text-primary">Set as default</button>}
                                        </div>
                                        <IconButton icon="delete" label={`Remove ${a.label}`} className="text-muted hover:!text-red-600" onClick={() => setAddresses(x => x.filter(y => y.id !== a.id))} />
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="grid sm:grid-cols-[160px_1fr_auto] gap-2">
                            <input className={inputCls} placeholder="Label (Home)" value={newLabel} onChange={e => setNewLabel(e.target.value)} aria-label="Address label" />
                            <input className={inputCls} placeholder="House, street, sector" value={newAddress} onChange={e => setNewAddress(e.target.value)} aria-label="Address" />
                            <Button variant="outline" icon="add" className="!h-12" onClick={addAddress} disabled={!newAddress.trim()}>Add</Button>
                        </div>
                    </SectionCard>

                    {/* Preferences */}
                    <SectionCard id="preferences" title="Preferences" icon="tune">
                        <div className="divide-y divide-line">
                            {setTheme && (
                                <div className="flex items-center justify-between gap-3 min-h-14">
                                    <div><p className="text-sm font-semibold text-ink dark:text-white">Dark mode</p><p className="text-xs text-muted dark:text-stone-400">Easier on the eyes at night</p></div>
                                    <button role="switch" aria-checked={theme === Theme.Dark} onClick={() => setTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark)}
                                        className={cn('relative h-8 w-14 rounded-full transition-colors shrink-0', theme === Theme.Dark ? 'bg-primary' : 'bg-gray-200 dark:bg-slate-700')}>
                                        <span className={cn('absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all', theme === Theme.Dark ? 'left-7' : 'left-1')} />
                                        <span className="sr-only">Dark mode</span>
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center justify-between gap-3 min-h-14">
                                <div><p className="text-sm font-semibold text-ink dark:text-white">Language</p><p className="text-xs text-muted dark:text-stone-400">Search also understands Urdu</p></div>
                                <select className="h-11 px-3 rounded-[10px] border border-line bg-white dark:bg-slate-800 text-sm" value="English" disabled aria-label="Language">
                                    <option>English</option>
                                </select>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Activity shortcuts */}
                    <SectionCard id="activity" title="Orders & saved" icon="receipt_long">
                        <div className="divide-y divide-line">
                            <Row icon="receipt_long" label="My orders" hint="Track status and see past orders" onClick={() => setView(View.OrderHistory)} trailing={ordersCount ? <Badge>{ordersCount}</Badge> : undefined} />
                            <Row icon="favorite" label="Saved items" hint="Products you’ve liked" onClick={() => setView(View.Favorites)} trailing={favoritesCount ? <Badge>{favoritesCount}</Badge> : undefined} />
                            <Row icon="shopping_basket" label="Basket" onClick={() => setView(View.Cart)} />
                        </div>
                    </SectionCard>

                    {/* Help */}
                    <SectionCard id="help" title="Help & legal" icon="help">
                        <div className="divide-y divide-line">
                            <Row icon="info" label="About us" onClick={() => setView(View.AboutUs)} />
                            <Row icon="support_agent" label="Contact us" onClick={() => setView(View.ContactUs)} />
                            <Row icon="assignment_return" label="Return policy" onClick={() => setView(View.ReturnPolicy)} />
                            <Row icon="description" label="Terms & conditions" onClick={() => setView(View.Terms)} />
                        </div>
                    </SectionCard>

                    {/* Privacy */}
                    {onClearData && (
                        <SectionCard id="privacy" title="Privacy & data" icon="shield_person" description="Your details are stored only on this device.">
                            <Button variant="outline" icon="delete_forever" className="!text-red-600 !border-red-200 dark:!border-red-900"
                                onClick={() => { if (window.confirm('Remove your profile, saved addresses, basket and order history from this device?')) onClearData(); }}>
                                Clear my data on this device
                            </Button>
                        </SectionCard>
                    )}
                </div>
            </div>

            {/* Mobile sticky save */}
            {(dirty || isSaved) && (
                <div className="md:hidden fixed bottom-16 inset-x-0 z-40 px-4 pb-3 pt-3 bg-gradient-to-t from-light dark:from-dark via-light/95 dark:via-dark/95 to-transparent">
                    <Button type="submit" form="profile-form" size="lg" fullWidth icon={isSaved ? 'check_circle' : 'save'} disabled={!dirty && isSaved}>
                        {isSaved && !dirty ? 'Saved' : 'Save changes'}
                    </Button>
                </div>
            )}
        </div>
    );
};
