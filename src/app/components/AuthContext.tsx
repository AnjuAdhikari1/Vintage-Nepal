import { createContext, useContext, useState, ReactNode } from 'react';

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

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  updateVerificationStatus: (status: 'pending' | 'approved' | 'rejected') => void;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  accountType: 'buyer' | 'seller';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate successful login
    if (email && password.length >= 6) {
      const mockUser: User = {
        id: '1',
        name: 'Ramesh Shrestha',
        email: email,
        phone: '9812345678',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        accountType: 'seller',
        isVerifiedSeller: true,
        verificationStatus: 'approved',
        joinedDate: new Date().toISOString(),
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    // Mock signup - in real app, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      accountType: data.accountType,
      isVerifiedSeller: data.accountType === 'buyer' ? true : false,
      verificationStatus: data.accountType === 'seller' ? 'none' : 'approved',
      joinedDate: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateVerificationStatus = (status: 'pending' | 'approved' | 'rejected') => {
    if (user) {
      const updatedUser = {
        ...user,
        verificationStatus: status,
        isVerifiedSeller: status === 'approved',
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
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
