
import React, { useState } from 'react';
import { db } from '../firebase';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { AnimatedBackground } from '../components/AnimatedBackground';

interface AccountRecoveryPageProps {
    onBack: () => void;
}

export const AccountRecoveryPage: React.FC<AccountRecoveryPageProps> = ({ onBack }) => {
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [foundEmail, setFoundEmail] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setFoundEmail(null);

        try {
            // Clean up phone number - remove spaces, dashes, etc.
            const cleanPhone = phone.replace(/[^\d+]/g, '');

            // Search for user by phone number
            const usersRef = db.collection('users');
            const snapshot = await usersRef.where('phoneForRecovery', '==', cleanPhone).limit(1).get();

            if (snapshot.empty) {
                // Also try searching in the phone field
                const phoneSnapshot = await usersRef.where('phone', '==', cleanPhone).limit(1).get();

                if (phoneSnapshot.empty) {
                    setError('No account found with this phone number. Please contact support if you need help.');
                } else {
                    const userData = phoneSnapshot.docs[0].data();
                    // Mask the email for privacy
                    const email = userData.email;
                    const maskedEmail = maskEmail(email);
                    setFoundEmail(maskedEmail);
                }
            } else {
                const userData = snapshot.docs[0].data();
                const maskedEmail = maskEmail(userData.email);
                setFoundEmail(maskedEmail);
            }
        } catch (err: any) {
            console.error('Account recovery error:', err);
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const maskEmail = (email: string): string => {
        const [local, domain] = email.split('@');
        if (local.length <= 2) {
            return `${local[0]}***@${domain}`;
        }
        return `${local[0]}${local[1]}${'*'.repeat(Math.min(local.length - 2, 6))}@${domain}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <AnimatedBackground variant="intense" />

            <div className="relative z-10 w-full max-w-md p-4">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl p-8 space-y-6">

                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-aurora-600 dark:hover:text-aurora-400 transition-colors text-sm font-medium"
                    >
                        <Icon name="arrow_back" className="text-lg" />
                        Back to Login
                    </button>

                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="relative inline-flex">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                                <Icon name="person_search" className="text-3xl text-white" />
                            </div>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 blur-xl opacity-40 -z-10" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Find Your Account
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                                Enter your phone number to find your email
                            </p>
                        </div>
                    </div>

                    {foundEmail ? (
                        /* Found Email */
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl text-green-600 dark:text-green-400">
                                <Icon name="check_circle" className="text-2xl flex-shrink-0" />
                                <div>
                                    <p className="font-semibold">Account Found!</p>
                                    <p className="text-sm opacity-80">Your email address is:</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
                                <p className="text-lg font-mono font-semibold text-aurora-600 dark:text-aurora-400">
                                    {foundEmail}
                                </p>
                                <p className="text-xs text-slate-500 mt-2">
                                    Email partially hidden for security
                                </p>
                            </div>

                            <button
                                onClick={onBack}
                                className="w-full py-3 px-4 bg-gradient-to-r from-aurora-600 to-rose-600 hover:from-aurora-500 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-aurora-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <Icon name="login" />
                                Go to Login
                            </button>
                        </div>
                    ) : (
                        /* Search Form */
                        <form className="space-y-4" onSubmit={handleSearch}>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="+1 234 567 8900"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    Enter the phone number linked to your account
                                </p>
                            </div>

                            {error && (
                                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm">
                                    <Icon name="error" className="text-lg flex-shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <>
                                        <Icon name="search" />
                                        Find Account
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Contact Support */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Icon name="support_agent" className="text-aurora-500" />
                                Need more help?
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                If you can't recover your account, please contact our support team for assistance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
