
import React, { useState } from 'react';
import { auth } from '../firebase';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { AnimatedBackground } from '../components/AnimatedBackground';

interface ForgotPasswordPageProps {
    onBack: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await auth.sendPasswordResetEmail(email);
            setSuccess(true);
        } catch (err: any) {
            let errorMessage = 'An error occurred. Please try again.';
            if (err.code) {
                switch (err.code) {
                    case 'auth/invalid-email':
                        errorMessage = 'Please enter a valid email address.';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'No account found with this email address.';
                        break;
                    default:
                        errorMessage = err.message;
                }
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
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
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl">
                                <Icon name="lock_reset" className="text-3xl text-white" />
                            </div>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500 to-red-500 blur-xl opacity-40 -z-10" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Reset Password
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                                Enter your email and we'll send you a reset link
                            </p>
                        </div>
                    </div>

                    {success ? (
                        /* Success Message */
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl text-green-600 dark:text-green-400">
                                <Icon name="check_circle" className="text-2xl flex-shrink-0" />
                                <div>
                                    <p className="font-semibold">Email Sent!</p>
                                    <p className="text-sm opacity-80">Check your inbox for the password reset link.</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    <Icon name="info" className="inline mr-1 text-aurora-500" />
                                    Didn't receive the email?
                                </p>
                                <ul className="text-xs text-slate-500 space-y-1 ml-5">
                                    <li>• Check your spam folder</li>
                                    <li>• Make sure you entered the correct email</li>
                                    <li>• Wait a few minutes and try again</li>
                                </ul>
                            </div>

                            <button
                                onClick={() => setSuccess(false)}
                                className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors"
                            >
                                Send Another Email
                            </button>
                        </div>
                    ) : (
                        /* Email Form */
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm">
                                    <Icon name="error" className="text-lg flex-shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <>
                                        <Icon name="send" />
                                        Send Reset Link
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
