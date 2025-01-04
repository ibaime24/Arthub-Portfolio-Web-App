'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

/**
 * Interface defining the shape of the AuthContext value.
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

/**
 * Create the AuthContext with a default value.
 */
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

/**
 * Custom hook to use the AuthContext.
 * @returns {AuthContextType} The current auth context value.
 */
export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider component that wraps the app and provides authentication state.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to wrap.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up an observer on the Auth object to watch for changes in the user's sign-in state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Clean up the observer when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

