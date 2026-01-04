
import React, { useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/Spinner';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Logo } from '../components/Logo';

interface AuthPageProps {
  onShowSignup?: () => void;
  onShowForgotPassword?: () => void;
  onShowAccountRecovery?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onShowSignup, onShowForgotPassword, onShowAccountRecovery }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err: any) {
      let errorMessage = "An unknown error occurred.";
      if (err.code) {
        switch (err.code) {
          case 'auth/invalid-email': errorMessage = 'Please enter a valid email address.'; break;
          case 'auth/user-not-found': case 'auth/wrong-password': errorMessage = 'Invalid credentials.'; break;
          case 'auth/operation-not-supported-in-this-environment':
            errorMessage = 'Security Error: Please run this app on a local server (http://localhost) instead of opening the file directly.';
            break;
          default: errorMessage = err.message;
        }
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await auth.signInWithPopup(googleProvider);
      const user = result.user;
      if (!user) throw new Error("Google Sign-In failed.");

      const userDocRef = db.collection('users').doc(user.uid);
      const docSnap = await userDocRef.get();

      if (!docSnap.exists) {
        const [first, ...last] = user.displayName?.split(' ') || ['', ''];
        await userDocRef.set({
          uid: user.uid,
          email: user.email,
          firstName: first,
          lastName: last.join(' '),
          photoURL: user.photoURL,
          profileComplete: false,
          receiveEmails: true,
          phone: '', dob: '', gender: '', address: '', city: '', state: '', country: '', bio: '', interests: ''
        });
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-supported-in-this-environment') {
        setError("Google Sign-In requires a secure environment (http/https). Please check your server setup.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in cancelled.");
      } else {
        setError("Failed to sign in with Google. " + (err.message || ""));
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Aurora Background */}
      <AnimatedBackground variant="intense" />

      {/* Auth Card Container */}
      <div className="relative z-10 w-full max-w-md p-4">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl p-8 space-y-8">

          {/* Logo & Header */}
          <div className="text-center space-y-4">
            {/* Logo */}
            <div className="relative inline-flex">
              <Logo className="w-16 h-16 rounded-2xl shadow-xl object-cover" />
              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-aurora-500 to-rose-500 blur-xl opacity-40 -z-10" />
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Welcome back
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Sign in to continue to Shadow Showcase
              </p>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-3 py-3 px-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-medium transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {isLoading ? <Spinner size="sm" /> : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-3 bg-white/80 dark:bg-slate-900/80 text-slate-500">or</span>
              </div>
            </div>
          </div>

          {/* Email Form */}
          <form className="space-y-4" onSubmit={handleEmailLogin}>
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
            />

            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-aurora-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onShowForgotPassword}
                className="text-sm text-aurora-600 dark:text-aurora-400 hover:text-aurora-700 dark:hover:text-aurora-300 font-medium transition-colors"
              >
                Forgot Password?
              </button>
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
              className="w-full py-3 px-4 bg-gradient-to-r from-aurora-600 to-rose-600 hover:from-aurora-500 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-aurora-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Spinner size="sm" /> : (
                <>
                  <Icon name="login" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Switch to Signup */}
          <div className="text-center">
            <button
              onClick={onShowSignup}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-aurora-600 dark:hover:text-aurora-400 transition-colors"
            >
              Don't have an account?{' '}
              <span className="font-semibold">Sign Up</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 mt-6">
          <button
            onClick={onShowAccountRecovery}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-aurora-600 dark:hover:text-aurora-400 transition-colors"
          >
            Forgot your email? <span className="font-semibold">Find your account</span>
          </button>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};
