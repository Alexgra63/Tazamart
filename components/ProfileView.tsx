
import React, { useState } from 'react';
import { UserProfile, Language } from '../types';

interface ProfileViewProps {
    profile: UserProfile;
    updateProfile: (profile: UserProfile) => void;
    lang: Language;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, updateProfile, lang }) => {
    const [formData, setFormData] = useState<UserProfile>(profile);
    const [isSaved, setIsSaved] = useState(false);

    const t = {
        title: "Account Settings",
        name: "Name",
        phone: "Phone",
        address: "Address",
        save: "Save Changes",
        saved: "Profile updated!"
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="container mx-auto px-4 py-8 pb-32 max-w-2xl ltr text-left">
            <h2 className="text-3xl font-black text-dark dark:text-white mb-8 tracking-tight">{t.title}</h2>
            
            <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-800 space-y-6">
                <div>
                    <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">{t.name}</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 dark:text-white border-none outline-none focus:ring-4 focus:ring-primary/5 font-bold transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">{t.phone}</label>
                    <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 dark:text-white border-none outline-none focus:ring-4 focus:ring-primary/5 font-bold transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">{t.address}</label>
                    <input 
                        type="text" 
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 dark:text-white border-none outline-none focus:ring-4 focus:ring-primary/5 font-bold transition-all"
                        required
                    />
                </div>

                <div className="pt-4">
                    <button 
                        type="submit"
                        className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-premium hover:shadow-lg active:scale-[0.98] transition-all"
                    >
                        {t.save}
                    </button>
                </div>

                {isSaved && (
                    <div className="text-center animate-in fade-in zoom-in">
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{t.saved}</span>
                    </div>
                )}
            </form>
        </div>
    );
};
