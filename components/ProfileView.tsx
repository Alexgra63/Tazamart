
import React, { useState } from 'react';
import { UserProfile, Language, Theme } from '../types';

interface ProfileViewProps {
    profile: UserProfile;
    onSave: (profile: UserProfile) => void;
    lang: Language;
    theme: Theme;
    setLanguage: (lang: Language) => void;
    setTheme: (theme: Theme) => void;
}

const translations = {
    [Language.EN]: {
        title: "Account Profile",
        sub: "Save details for faster checkout",
        name: "Full Name",
        phone: "Phone Number",
        address: "Home Address",
        save: "Save Information",
        saved: "Profile Saved!",
        settings: "App Settings",
        appearance: "Appearance",
        language: "Language",
        light: "Light",
        dark: "Dark",
        english: "English",
        urdu: "Urdu"
    },
    [Language.UR]: {
        title: "پروفائل",
        sub: "آرڈر کے لیے معلومات محفوظ کریں",
        name: "پورا نام",
        phone: "فون نمبر",
        address: "گھر کا پتہ",
        save: "محفوظ کریں",
        saved: "معلومات محفوظ ہوگئی!",
        settings: "ایپ کی ترتیبات",
        appearance: "ظاہری شکل",
        language: "زبان",
        light: "روشنی",
        dark: "اندھیرا",
        english: "انگریزی",
        urdu: "اردو"
    }
};

export const ProfileView: React.FC<ProfileViewProps> = ({ 
    profile, onSave, lang, theme, setLanguage, setTheme 
}) => {
    const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
    const [showSuccess, setShowSuccess] = useState(false);
    const t = translations[lang];
    const isUrdu = lang === Language.UR;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(localProfile);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    return (
        <div className={`container mx-auto px-6 py-8 pb-32 max-w-xl animate-in fade-in duration-300 ${isUrdu ? 'text-right' : 'text-left'}`} dir={isUrdu ? 'rtl' : 'ltr'}>
            <div className="mb-10">
                <h2 className="text-3xl font-black text-dark dark:text-white tracking-tight">{t.title}</h2>
                <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest mt-1">{t.sub}</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-premium border border-gray-50 dark:border-slate-800 space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">{t.name}</label>
                        <input 
                            required 
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/5 dark:text-white transition-all text-sm font-bold" 
                            value={localProfile.name} 
                            onChange={e => setLocalProfile({...localProfile, name: e.target.value})} 
                            placeholder="Ali Khan"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">{t.phone}</label>
                        <input 
                            required 
                            type="tel" 
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/5 dark:text-white transition-all text-sm font-bold" 
                            value={localProfile.phone} 
                            onChange={e => setLocalProfile({...localProfile, phone: e.target.value})} 
                            placeholder="0300-1234567"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">{t.address}</label>
                        <textarea 
                            required 
                            rows={3}
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/5 dark:text-white transition-all text-sm font-bold resize-none" 
                            value={localProfile.address} 
                            onChange={e => setLocalProfile({...localProfile, address: e.target.value})} 
                            placeholder="H# 123, St 4, Islamabad"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-premium hover:shadow-lg transform active:scale-[0.98] transition-all"
                >
                    {t.save}
                </button>
            </form>

            <div className="mt-12">
                <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">{t.settings}</h3>
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-premium border border-gray-50 dark:border-slate-800 overflow-hidden divide-y divide-gray-50 dark:divide-slate-800">
                    {/* Theme Preference */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className="material-symbols-rounded text-gray-400">palette</span>
                            <span className="text-sm font-bold text-dark dark:text-white">{t.appearance}</span>
                        </div>
                        <div className="flex bg-gray-50 dark:bg-slate-800 p-1 rounded-xl">
                            <button 
                                onClick={() => setTheme(Theme.Light)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${theme === Theme.Light ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-gray-400'}`}
                            >
                                {t.light}
                            </button>
                            <button 
                                onClick={() => setTheme(Theme.Dark)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${theme === Theme.Dark ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-gray-400'}`}
                            >
                                {t.dark}
                            </button>
                        </div>
                    </div>

                    {/* Language Preference */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className="material-symbols-rounded text-gray-400">translate</span>
                            <span className="text-sm font-bold text-dark dark:text-white">{t.language}</span>
                        </div>
                        <div className="flex bg-gray-50 dark:bg-slate-800 p-1 rounded-xl">
                            <button 
                                onClick={() => setLanguage(Language.EN)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${lang === Language.EN ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-gray-400'}`}
                            >
                                EN
                            </button>
                            <button 
                                onClick={() => setLanguage(Language.UR)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${lang === Language.UR ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-gray-400'}`}
                            >
                                اردو
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showSuccess && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-premium animate-in slide-in-from-bottom-4">
                    {t.saved}
                </div>
            )}
        </div>
    );
};
