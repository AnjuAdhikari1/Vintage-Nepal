import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  accountType: 'buyer' | 'seller';
  isVerifiedSeller: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'none';
  joinedDate: string;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  accountType: 'buyer' | 'seller';
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateVerificationStatus: (status: 'pending' | 'approved' | 'rejected') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultAvatar =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setIsAuthLoading(false);
          return;
        }

        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser(userSnap.data() as User);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state error:', error);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signup = async (data: SignupData): Promise<boolean> => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const newUser: User = {
      id: credential.user.uid,
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: defaultAvatar,
      accountType: data.accountType,
      isVerifiedSeller: data.accountType === 'buyer',
      verificationStatus: data.accountType === 'seller' ? 'none' : 'approved',
      joinedDate: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', credential.user.uid), newUser);
    setUser(newUser);

    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    const userRef = doc(db, 'users', credential.user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error('User profile not found');
    }

    setUser(userSnap.data() as User);
    return true;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateVerificationStatus = async (
    status: 'pending' | 'approved' | 'rejected'
  ) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      verificationStatus: status,
      isVerifiedSeller: status === 'approved',
    };

    await updateDoc(doc(db, 'users', user.id), {
      verificationStatus: status,
      isVerifiedSeller: status === 'approved',
    });

    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAuthLoading,
        login,
        signup,
        logout,
        updateVerificationStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}