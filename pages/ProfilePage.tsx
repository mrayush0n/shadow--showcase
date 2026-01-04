
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { GlassCard } from '../components/GlassCard';
import { AnimatedBackground } from '../components/AnimatedBackground';
import type { UserProfile } from '../types';
import { aiService } from '../services/ai';
import { fileToBase64 } from '../utils/fileUtils';

export const ProfilePage: React.FC<{ isSetupMode?: boolean }> = ({ isSetupMode = false }) => {
    const { user, userProfile, loading } = useAuth();
    const [userData, setUserData] = useState<Partial<UserProfile>>({});
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [photoAnalysis, setPhotoAnalysis] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const debounceTimeout = useRef<number | null>(null);

    useEffect(() => {
        if (userProfile) setUserData(userProfile);
        else if (user && !loading) setUserData({ email: user.email || '', firstName: user.displayName?.split(' ')[0] || '', lastName: user.displayName?.split(' ')[1] || '', photoURL: user.photoURL || null });
    }, [user, userProfile, loading]);

    const saveUserData = useCallback(async (data: Partial<UserProfile>) => {
        if (!user) return;
        try {
            await db.collection('users').doc(user.uid).set(data, { merge: true });
            setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (e) { console.error(e); }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        const newData = { ...userData, [name]: val };
        setUserData(newData);
        if (isSetupMode) return;
        setSaveStatus('saving');
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = window.setTimeout(() => saveUserData(newData), 1500);
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        setSaveStatus('saving');
        try {
            const refSto = ref(storage, `profile_pictures/${user.uid}`);
            await uploadBytes(refSto, file);
            const url = await getDownloadURL(refSto);
            setUserData(p => ({ ...p, photoURL: url }));
            await saveUserData({ ...userData, photoURL: url });

            // Analyze
            const b64 = await fileToBase64(file);
            // Call Backend API
            const response = await aiService.analyzeImage(b64, file.type, "Give a 1 sentence compliment on this profile picture.");
            setPhotoAnalysis(response.result);
        } catch (e) { console.error(e); } finally { setSaveStatus('idle'); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner size="lg" />
            </div>
        );
    }

    // Setup mode wrapper
    if (isSetupMode) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <AnimatedBackground variant="minimal" />
                <GlassCard className="max-w-2xl w-full p-8 relative z-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-aurora-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Icon name="person" className="text-white text-3xl" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Complete Your Profile</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">Just a few more details to get you started</p>
                    </div>

                    <div className="space-y-6">
                        {/* Photo Upload */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-2xl bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                    {userData.photoURL ? (
                                        <img src={userData.photoURL} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400">
                                            {userData.firstName?.[0] || '?'}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-1 -right-1 p-2 bg-aurora-500 rounded-full text-white shadow-lg hover:bg-aurora-600 transition-colors"
                                >
                                    <Icon name="camera_alt" className="text-xs" />
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900 dark:text-white">Profile Photo</p>
                                <p className="text-sm text-slate-500">Click to upload</p>
                            </div>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">First Name</label>
                                <input
                                    name="firstName"
                                    value={userData.firstName || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-aurora-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Last Name</label>
                                <input
                                    name="lastName"
                                    value={userData.lastName || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-aurora-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Bio</label>
                            <textarea
                                name="bio"
                                value={userData.bio || ''}
                                onChange={handleChange}
                                placeholder="Tell us about yourself..."
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-aurora-500 focus:border-transparent outline-none resize-none"
                            />
                        </div>

                        {/* Complete Button */}
                        <button
                            onClick={(e) => { e.preventDefault(); saveUserData({ ...userData, profileComplete: true }); }}
                            className="w-full py-4 bg-gradient-to-r from-aurora-600 to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-aurora-500/25 hover:from-aurora-500 hover:to-rose-500 transition-all active:scale-[0.98]"
                        >
                            Complete Setup
                        </button>
                    </div>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-10 space-y-6">
            {/* Banner */}
            <div className="h-40 sm:h-48 bg-gradient-to-r from-aurora-600 via-rose-600 to-aurora-600 rounded-2xl relative overflow-hidden">
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                }} />

                {/* Profile Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-4">
                    <div className="relative">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-xl">
                            {userData.photoURL ? (
                                <img src={userData.photoURL} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">
                                    {userData.firstName?.[0]}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-1 right-1 p-2 bg-aurora-500 rounded-full text-white shadow-lg hover:bg-aurora-600 transition-colors"
                        >
                            <Icon name="camera_alt" className="text-sm" />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                    </div>
                    <div className="flex-1 mb-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                            {userData.firstName} {userData.lastName}
                        </h1>
                        <p className="text-white/80 text-sm font-medium">{userData.email}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-xs font-semibold text-white">
                        {saveStatus === 'saving' && <Spinner size="sm" />}
                        <Icon name={saveStatus === 'saved' ? 'check' : saveStatus === 'saving' ? 'sync' : 'edit'} className="text-sm" />
                        {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Editable'}
                    </div>
                </div>
            </div>

            {/* AI Feedback */}
            {photoAnalysis && (
                <div className="bg-gradient-to-r from-aurora-500 to-rose-500 p-4 rounded-2xl shadow-lg text-white relative">
                    <button onClick={() => setPhotoAnalysis(null)} className="absolute top-2 right-2 opacity-60 hover:opacity-100">
                        <Icon name="close" className="text-sm" />
                    </button>
                    <div className="flex items-center gap-2 text-sm font-semibold opacity-90 mb-1">
                        <Icon name="auto_awesome" /> AI Feedback
                    </div>
                    <p className="text-sm">"{photoAnalysis}"</p>
                </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <GlassCard className="p-6">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Identity</h3>
                    <div className="space-y-4">
                        <input
                            name="firstName"
                            value={userData.firstName || ''}
                            onChange={handleChange}
                            placeholder="First Name"
                            className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 py-2 focus:border-aurora-500 outline-none transition-colors"
                        />
                        <input
                            name="lastName"
                            value={userData.lastName || ''}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 py-2 focus:border-aurora-500 outline-none transition-colors"
                        />
                        <input
                            name="phone"
                            value={userData.phone || ''}
                            onChange={handleChange}
                            placeholder="Phone"
                            className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 py-2 focus:border-aurora-500 outline-none transition-colors"
                        />
                        <input
                            type="date"
                            name="dob"
                            value={userData.dob || ''}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 py-2 focus:border-aurora-500 outline-none transition-colors"
                        />
                    </div>
                </GlassCard>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="p-6">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">About</h3>
                        <textarea
                            name="bio"
                            value={userData.bio || ''}
                            onChange={handleChange}
                            placeholder="Tell us about yourself..."
                            rows={4}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-aurora-500 outline-none resize-none"
                        />
                        <div className="mt-4">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Interests</label>
                            <input
                                name="interests"
                                value={userData.interests || ''}
                                onChange={handleChange}
                                placeholder="Coding, Design, AI..."
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-aurora-500 outline-none"
                            />
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Location</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                name="city"
                                value={userData.city || ''}
                                onChange={handleChange}
                                placeholder="City"
                                className="bg-transparent border-b border-slate-300 dark:border-slate-700 py-2 focus:border-aurora-500 outline-none"
                            />
                            <input
                                name="country"
                                value={userData.country || ''}
                                onChange={handleChange}
                                placeholder="Country"
                                className="bg-transparent border-b border-slate-300 dark:border-slate-700 py-2 focus:border-aurora-500 outline-none"
                            />
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};
