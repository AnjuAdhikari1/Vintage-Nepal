import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './components/AuthContext';
import { Item } from './components/types';

interface FavoritesContextType {
  favorites: Item[];
  addToFavorites: (item: Item) => void;
  removeFromFavorites: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  getFavoritesCount: () => number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [favorites, setFavorites] = useState<Item[]>([]);

  // Loads the logged-in user's favorites from Firestore
  useEffect(() => {
    const loadFavorites = async () => {
      if (!isLoggedIn || !user) {
        setFavorites([]);
        return;
      }

      const userRef = doc(db, 'users', user.id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setFavorites(userSnap.data().favorites || []);
      }
    };

    loadFavorites();
  }, [user, isLoggedIn]);

  const saveFavorites = async (newFavorites: Item[]) => {
    if (!user) return;

    await setDoc(
      doc(db, 'users', user.id),
      { favorites: newFavorites },
      { merge: true }
    );
  };

  const addToFavorites = (item: Item) => {
    if (!user) return;

    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === item.id)) {
        return prev;
      }

      const newFavorites = [...prev, item];
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  const removeFromFavorites = (itemId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((item) => item.id !== itemId);
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  const isFavorite = (itemId: string): boolean => {
    return favorites.some((item) => item.id === itemId);
  };

  const getFavoritesCount = (): number => {
    return favorites.length;
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        getFavoritesCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }

  return context;
}