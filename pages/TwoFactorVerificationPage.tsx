
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { AnimatedBackground } from '../components/AnimatedBackground';

interface TwoFactorVerificationPageProps {
    user: firebase.User;
    onVerified: () => void;
    onCancel: () => void;
}

// Generate a random 6-digit code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Simple device fingerprint
const getDeviceFingerprint = () => {
    const nav = navigator;
    return btoa(`${nav.userAgent}-${nav.language}-${screen.width}x${screen.height}`).slice(0, 32);
};

export const TwoFactorVerificationPage: React.FC<TwoFactorVerificationPageProps> = ({
    user,
    onVerified,
    onCancel,
}) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(true);
    const [error, setError] = useState('');
    const [sentCode, setSentCode] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Send verification code on mount
        sendVerificationCode();
    }, []);

    useEffect(() => {
        // Resend cooldown timer
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const sendVerificationCode = async () => {
        setIsSending(true);
        setError('');

        try {
            const generatedCode = generateVerificationCode();
            setSentCode(generatedCode);

            // Store the code temporarily in Firestore (expires in 10 minutes)
            await db.collection('twoFactorCodes').doc(user.uid).set({
                code: generatedCode,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            });

            // In a real app, you'd send this via email using Firebase Functions or a backend
            // For demo purposes, we'll show it in console and a toast
            console.log(`2FA Code for ${user.email}: ${generatedCode}`);

            // Since we don't have a backend email service, we'll display the code
            // In production, remove this and send via actual email
            alert(`Demo Mode: Your verification code is ${generatedCode}\n\nIn production, this would be sent to ${user.email}`);

            setResendCooldown(60);
        } catch (err) {
            console.error('Error sending verification code:', err);
            setError('Failed to send verification code. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const handleCodeChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits are entered
        if (newCode.every(digit => digit) && index === 5) {
            verifyCode(newCode.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData.length === 6) {
            const newCode = pastedData.split('');
            setCode(newCode);
            verifyCode(pastedData);
        }
    };

    const verifyCode = async (enteredCode: string) => {
        setIsLoading(true);
        setError('');

        try {
            // Verify the code from Firestore
            const codeDoc = await db.collection('twoFactorCodes').doc(user.uid).get();

            if (!codeDoc.exists) {
                setError('Verification code expired. Please request a new one.');
                setCode(['', '', '', '', '', '']);
                return;
            }

            const codeData = codeDoc.data();

            if (codeData?.code !== enteredCode) {
                setError('Invalid verification code. Please try again.');
                setCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
                return;
            }

            // Check if expired
            if (codeData.expiresAt.toDate() < new Date()) {
                setError('Verification code expired. Please request a new one.');
                setCode(['', '', '', '', '', '']);
                return;
            }

            // Code is valid - delete it and mark device as verified
            await db.collection('twoFactorCodes').doc(user.uid).delete();

            // Add this device to verified devices
            const deviceFingerprint = getDeviceFingerprint();
            await db.collection('users').doc(user.uid).update({
                twoFactorVerifiedDevices: firebase.firestore.FieldValue.arrayUnion(deviceFingerprint)
            });

            onVerified();
        } catch (err) {
            console.error('Verification error:', err);
            setError('Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <AnimatedBackground variant="intense" />

            <div className="relative z-10 w-full max-w-md p-4">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl p-8 space-y-6">

                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="relative inline-flex">
                            <div className="w-16 h-16 bg-gradient-to-br from-aurora-500 via-rose-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                                <Icon name="security" className="text-3xl text-white" />
                            </div>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-aurora-500 to-rose-500 blur-xl opacity-40 -z-10" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Verify Your Identity
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                                Enter the 6-digit code sent to
                            </p>
                            <p className="text-aurora-600 dark:text-aurora-400 font-medium">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    {isSending ? (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <Spinner size="lg" />
                            <p className="text-slate-500">Sending verification code...</p>
                        </div>
                    ) : (
                        <>
                            {/* Code Input */}
                            <div className="flex justify-center gap-2" onPaste={handlePaste}>
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-xl font-bold bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-aurora-500 transition-all"
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm">
                                    <Icon name="error" className="text-lg flex-shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            {isLoading && (
                                <div className="flex justify-center">
                                    <Spinner size="md" />
                                </div>
                            )}

                            {/* Resend */}
                            <div className="text-center">
                                <p className="text-sm text-slate-500 mb-2">Didn't receive the code?</p>
                                <button
                                    onClick={sendVerificationCode}
                                    disabled={resendCooldown > 0 || isSending}
                                    className="text-sm font-semibold text-aurora-600 dark:text-aurora-400 hover:text-aurora-700 dark:hover:text-aurora-300 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                                </button>
                            </div>

                            {/* Cancel */}
                            <button
                                onClick={onCancel}
                                className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <Icon name="logout" />
                                Sign Out
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
