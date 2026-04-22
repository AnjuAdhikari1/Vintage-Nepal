import { createContext, useContext, useState, ReactNode } from 'react';
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
  const [favorites, setFavorites] = useState<Item[]>([]);

  const addToFavorites = (item: Item) => {
    setFavorites((prev) => {
      // Check if already in favorites
      if (prev.some((fav) => fav.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFromFavorites = (itemId: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== itemId));
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
