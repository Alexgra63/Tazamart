
import React, { useState } from 'react';
import { UserProfile, Language, View } from '../types';

interface ProfileViewProps {
    profile: UserProfile;
    updateProfile: (profile: UserProfile) => void;
    lang: Language;
    setView: (view: View) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, updateProfile, lang, setView }) => {
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

            {/* Support Pages Section */}
            <div className="mt-12 space-y-4">
                <h3 className="text-[10px] font-black uppercase text-gray-400 dark:text-slate-600 tracking-widest mb-4 ml-4">Support & Information</h3>
                <div className="grid grid-cols-1 gap-3">
                    {[
                        { title: 'About Us', view: View.AboutUs, icon: 'info' },
                        { title: 'Contact Us', view: View.ContactUs, icon: 'alternate_email' },
                        { title: 'Return Policy', view: View.ReturnPolicy, icon: 'keyboard_return' },
                        { title: 'Terms & Conditions', view: View.Terms, icon: 'description' }
                    ].map((item) => (
                        <button 
                            key={item.title}
                            onClick={() => setView(item.view)}
                            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 flex items-center justify-between group hover:border-primary transition-colors text-left"
                        >
                            <div className="flex items-center">
                                <span className="material-symbols-rounded text-gray-400 group-hover:text-primary transition-colors mr-4">{item.icon}</span>
                                <span className="text-sm font-black text-dark dark:text-white">{item.title}</span>
                            </div>
                            <span className="material-symbols-rounded text-gray-300 dark:text-slate-700 transition-transform group-hover:translate-x-1">chevron_right</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
