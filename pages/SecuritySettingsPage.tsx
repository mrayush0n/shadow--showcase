
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebase';
import firebase from 'firebase/compat/app';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { GlassCard } from '../components/GlassCard';

// Generate a random 6-digit code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Simple device fingerprint
const getDeviceFingerprint = () => {
    const nav = navigator;
    return btoa(`${nav.userAgent}-${nav.language}-${screen.width}x${screen.height}`).slice(0, 32);
};

export const SecuritySettingsPage: React.FC = () => {
    const { user, userProfile } = useAuth();

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Email change state
    const [newEmail, setNewEmail] = useState('');
    const [emailPassword, setEmailPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailSuccess, setEmailSuccess] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);

    // Recovery phone state
    const [recoveryPhone, setRecoveryPhone] = useState('');
    const [phoneLoading, setPhoneLoading] = useState(false);
    const [phoneSuccess, setPhoneSuccess] = useState(false);

    // 2FA state
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [twoFactorLoading, setTwoFactorLoading] = useState(false);
    const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
    const [twoFactorPassword, setTwoFactorPassword] = useState('');
    const [twoFactorError, setTwoFactorError] = useState('');

    useEffect(() => {
        if (userProfile) {
            setRecoveryPhone(userProfile.phoneForRecovery || userProfile.phone || '');
            setTwoFactorEnabled(userProfile.twoFactorEnabled || false);
        }
    }, [userProfile]);

    // Password strength checker
    const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z\d]/.test(password)) score++;

        if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
        if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-500' };
        if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-500' };
        if (score <= 4) return { score, label: 'Strong', color: 'bg-green-500' };
        return { score, label: 'Very Strong', color: 'bg-emerald-500' };
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess(false);

        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters.');
            return;
        }

        setPasswordLoading(true);

        try {
            const currentUser = auth.currentUser;
            if (!currentUser || !currentUser.email) throw new Error('Not authenticated');

            // Reauthenticate
            const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, currentPassword);
            await currentUser.reauthenticateWithCredential(credential);

            // Update password
            await currentUser.updatePassword(newPassword);

            // Update last password change timestamp
            await db.collection('users').doc(currentUser.uid).update({
                lastPasswordChange: new Date().toISOString()
            });

            setPasswordSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            if (err.code === 'auth/wrong-password') {
                setPasswordError('Current password is incorrect.');
            } else if (err.code === 'auth/weak-password') {
                setPasswordError('New password is too weak.');
            } else {
                setPasswordError(err.message || 'Failed to change password.');
            }
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleChangeEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError('');
        setEmailSuccess(false);

        if (!newEmail.includes('@')) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        setEmailLoading(true);

        try {
            const currentUser = auth.currentUser;
            if (!currentUser || !currentUser.email) throw new Error('Not authenticated');

            // Reauthenticate
            const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, emailPassword);
            await currentUser.reauthenticateWithCredential(credential);

            // Update email
            await currentUser.updateEmail(newEmail);

            // Send verification to new email
            await currentUser.sendEmailVerification();

            // Update Firestore
            await db.collection('users').doc(currentUser.uid).update({
                email: newEmail,
                lastEmailChange: new Date().toISOString()
            });

            setEmailSuccess(true);
            setNewEmail('');
            setEmailPassword('');
        } catch (err: any) {
            if (err.code === 'auth/wrong-password') {
                setEmailError('Password is incorrect.');
            } else if (err.code === 'auth/email-already-in-use') {
                setEmailError('This email is already in use.');
            } else if (err.code === 'auth/invalid-email') {
                setEmailError('Please enter a valid email address.');
            } else {
                setEmailError(err.message || 'Failed to change email.');
            }
        } finally {
            setEmailLoading(false);
        }
    };

    const handleSaveRecoveryPhone = async () => {
        if (!user) return;
        setPhoneLoading(true);

        try {
            await db.collection('users').doc(user.uid).update({
                phoneForRecovery: recoveryPhone.replace(/[^\d+]/g, '')
            });
            setPhoneSuccess(true);
            setTimeout(() => setPhoneSuccess(false), 3000);
        } catch (err) {
            console.error('Error saving recovery phone:', err);
        } finally {
            setPhoneLoading(false);
        }
    };

    const handleToggleTwoFactor = async () => {
        if (!user) return;

        if (twoFactorEnabled) {
            // Disable 2FA
            setTwoFactorLoading(true);
            try {
                await db.collection('users').doc(user.uid).update({
                    twoFactorEnabled: false,
                    twoFactorMethod: null,
                    twoFactorVerifiedDevices: []
                });
                setTwoFactorEnabled(false);
            } catch (err) {
                console.error('Error disabling 2FA:', err);
            } finally {
                setTwoFactorLoading(false);
            }
        } else {
            // Show setup dialog
            setShowTwoFactorSetup(true);
        }
    };

    const handleEnableTwoFactor = async (e: React.FormEvent) => {
        e.preventDefault();
        setTwoFactorError('');

        if (!user || !user.email) return;

        setTwoFactorLoading(true);

        try {
            // Reauthenticate first
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, twoFactorPassword);
            await auth.currentUser?.reauthenticateWithCredential(credential);

            // Enable 2FA
            const deviceFingerprint = getDeviceFingerprint();
            await db.collection('users').doc(user.uid).update({
                twoFactorEnabled: true,
                twoFactorMethod: 'email',
                twoFactorVerifiedDevices: firebase.firestore.FieldValue.arrayUnion(deviceFingerprint)
            });

            setTwoFactorEnabled(true);
            setShowTwoFactorSetup(false);
            setTwoFactorPassword('');
        } catch (err: any) {
            if (err.code === 'auth/wrong-password') {
                setTwoFactorError('Password is incorrect.');
            } else {
                setTwoFactorError(err.message || 'Failed to enable 2FA.');
            }
        } finally {
            setTwoFactorLoading(false);
        }
    };

    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <div className="max-w-4xl mx-auto pb-10 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-aurora-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon name="shield" className="text-white text-2xl" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Security Settings</h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage your account security</p>
                </div>
            </div>

            {/* Change Password */}
            <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                        <Icon name="password" className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Change Password</h3>
                        <p className="text-sm text-slate-500">Update your password regularly for security</p>
                    </div>
                </div>

                {passwordSuccess && (
                    <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl text-green-600 dark:text-green-400 text-sm">
                        <Icon name="check_circle" />
                        Password changed successfully!
                    </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent"
                        />
                        {newPassword && (
                            <div className="mt-2 space-y-1">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full ${i <= passwordStrength.score ? passwordStrength.color : 'bg-slate-200 dark:bg-slate-700'}`}
                                        />
                                    ))}
                                </div>
                                <p className={`text-xs ${passwordStrength.color.replace('bg-', 'text-')}`}>
                                    {passwordStrength.label}
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent"
                        />
                    </div>

                    {passwordError && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm">
                            <Icon name="error" />
                            {passwordError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {passwordLoading ? <Spinner size="sm" /> : <Icon name="lock_reset" />}
                        Update Password
                    </button>
                </form>
            </GlassCard>

            {/* Change Email */}
            <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <Icon name="mail" className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Change Email</h3>
                        <p className="text-sm text-slate-500">
                            Current: <span className="font-mono text-aurora-600 dark:text-aurora-400">{user?.email}</span>
                        </p>
                    </div>
                </div>

                {emailSuccess && (
                    <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl text-green-600 dark:text-green-400 text-sm">
                        <Icon name="check_circle" />
                        Email changed! Check your inbox for verification.
                    </div>
                )}

                <form onSubmit={handleChangeEmail} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                            New Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="newemail@example.com"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                            Current Password (to confirm)
                        </label>
                        <input
                            type="password"
                            required
                            value={emailPassword}
                            onChange={(e) => setEmailPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent"
                        />
                    </div>

                    {emailError && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm">
                            <Icon name="error" />
                            {emailError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={emailLoading}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {emailLoading ? <Spinner size="sm" /> : <Icon name="mail" />}
                        Update Email
                    </button>
                </form>
            </GlassCard>

            {/* Recovery Phone */}
            <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                        <Icon name="phone" className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Recovery Phone</h3>
                        <p className="text-sm text-slate-500">Used to recover your account if you forget your email</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <input
                        type="tel"
                        value={recoveryPhone}
                        onChange={(e) => setRecoveryPhone(e.target.value)}
                        placeholder="+1 234 567 8900"
                        className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent"
                    />
                    <button
                        onClick={handleSaveRecoveryPhone}
                        disabled={phoneLoading}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {phoneLoading ? <Spinner size="sm" /> : phoneSuccess ? <Icon name="check" /> : <Icon name="save" />}
                        {phoneSuccess ? 'Saved!' : 'Save'}
                    </button>
                </div>
            </GlassCard>

            {/* Two-Factor Authentication */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${twoFactorEnabled ? 'bg-aurora-100 dark:bg-aurora-900/30' : 'bg-slate-100 dark:bg-slate-800'} rounded-xl flex items-center justify-center`}>
                            <Icon name="security" className={twoFactorEnabled ? 'text-aurora-600 dark:text-aurora-400' : 'text-slate-500'} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</h3>
                            <p className="text-sm text-slate-500">
                                {twoFactorEnabled
                                    ? 'Your account is protected with email verification'
                                    : 'Add an extra layer of security to your account'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleToggleTwoFactor}
                        disabled={twoFactorLoading}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${twoFactorEnabled ? 'bg-aurora-500' : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                    >
                        <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>

                {twoFactorEnabled && (
                    <div className="mt-4 p-4 bg-aurora-50 dark:bg-aurora-900/20 border border-aurora-200 dark:border-aurora-800/50 rounded-xl">
                        <p className="text-sm text-aurora-700 dark:text-aurora-300 flex items-center gap-2">
                            <Icon name="verified_user" />
                            Two-factor authentication is enabled. You'll receive a verification code via email when signing in from a new device.
                        </p>
                    </div>
                )}

                {/* 2FA Setup Modal */}
                {showTwoFactorSetup && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-aurora-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Icon name="security" className="text-white text-3xl" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enable Two-Factor Authentication</h3>
                                <p className="text-sm text-slate-500 mt-2">
                                    Enter your password to enable email-based two-factor authentication.
                                </p>
                            </div>

                            <form onSubmit={handleEnableTwoFactor} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                        Your Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={twoFactorPassword}
                                        onChange={(e) => setTwoFactorPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent"
                                    />
                                </div>

                                {twoFactorError && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm">
                                        <Icon name="error" />
                                        {twoFactorError}
                                    </div>
                                )}

                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        <Icon name="info" className="inline mr-1 text-aurora-500" />
                                        When enabled, you'll receive a 6-digit code via email whenever you sign in from a new device.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowTwoFactorSetup(false);
                                            setTwoFactorPassword('');
                                            setTwoFactorError('');
                                        }}
                                        className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={twoFactorLoading}
                                        className="flex-1 py-3 px-4 bg-gradient-to-r from-aurora-600 to-rose-600 hover:from-aurora-500 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-aurora-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {twoFactorLoading ? <Spinner size="sm" /> : <Icon name="security" />}
                                        Enable
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </GlassCard>

            {/* Security Info */}
            <GlassCard className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Icon name="info" className="text-slate-500" />
                    Security Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <p className="text-slate-500">Last Password Change</p>
                        <p className="font-medium text-slate-900 dark:text-white">
                            {userProfile?.lastPasswordChange
                                ? new Date(userProfile.lastPasswordChange).toLocaleDateString()
                                : 'Never'}
                        </p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <p className="text-slate-500">Last Email Change</p>
                        <p className="font-medium text-slate-900 dark:text-white">
                            {userProfile?.lastEmailChange
                                ? new Date(userProfile.lastEmailChange).toLocaleDateString()
                                : 'Never'}
                        </p>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};
