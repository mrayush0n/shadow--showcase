
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// FIX: Switched to Firebase v9 compat API to resolve module export errors.
import firebase from 'firebase/compat/app';
import { auth, db } from '../firebase';
import type { UserProfile } from '../types';
import { isAdminEmail } from '../config/admin';

interface AuthContextType {
  user: firebase.User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, userProfile: null, loading: true, isAdmin: false });

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    // FIX: Switched from modular onAuthStateChanged(auth, ...) to compat auth.onAuthStateChanged(...) to resolve module export error.
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      // If user logs out, clear profile and stop loading
      if (!currentUser) {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    // If there's a user, listen for their profile changes
    if (user) {
      const userDocRef = db.collection('users').doc(user.uid);
      const unsubscribeProfile = userDocRef.onSnapshot((docSnap) => {
        if (docSnap.exists) {
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          // This case can happen briefly if the profile is being created
          setUserProfile(null);
        }
        setLoading(false);
      });
      return () => unsubscribeProfile();
    }
  }, [user]);

  // Check if user is admin based on email
  const isAdmin = isAdminEmail(user?.email);

  const value = {
    user,
    userProfile,
    loading,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
