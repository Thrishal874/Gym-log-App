import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

interface AuthResult {
    success: boolean;
    error?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    register: (email: string, password: string) => Promise<AuthResult>;
    login: (email: string, password: string) => Promise<AuthResult>;
    logout: () => Promise<AuthResult>;
    setError: (error: string | null) => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = (): AuthContextType => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('Setting up auth state listener...');
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log('Auth state changed:', currentUser ? currentUser.email : 'No user');
            setUser(currentUser);
            setLoading(false);
        }, (error) => {
            console.error('Auth state error:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const register = async (email: string, password: string): Promise<AuthResult> => {
        try {
            setError(null);
            console.log('Registering user:', email);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Registration successful:', userCredential.user.email);
            // User state will be updated by onAuthStateChanged listener
            return { success: true };
        } catch (err: any) {
            console.error('Registration error:', err);
            const errorMessage = getErrorMessage(err.code);
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const login = async (email: string, password: string): Promise<AuthResult> => {
        try {
            setError(null);
            console.log('Logging in user:', email);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Login successful:', userCredential.user.email);
            // User state will be updated by onAuthStateChanged listener
            return { success: true };
        } catch (err: any) {
            console.error('Login error:', err);
            const errorMessage = getErrorMessage(err.code);
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = async (): Promise<AuthResult> => {
        try {
            setError(null);
            console.log('Logging out...');
            await signOut(auth);
            console.log('Logout successful');
            // User state will be updated by onAuthStateChanged listener
            return { success: true };
        } catch (err: any) {
            console.error('Logout error:', err);
            const errorMessage = getErrorMessage(err.code);
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const getErrorMessage = (code: string): string => {
        switch (code) {
            case 'auth/email-already-in-use':
                return 'This email is already registered';
            case 'auth/invalid-email':
                return 'Invalid email address';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters';
            case 'auth/user-not-found':
                return 'No account found with this email';
            case 'auth/wrong-password':
                return 'Incorrect password';
            case 'auth/invalid-credential':
                return 'Invalid email or password';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please try again later';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection';
            default:
                return 'An error occurred. Please try again';
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        setError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
