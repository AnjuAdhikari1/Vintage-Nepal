import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';
import { Item } from './types';

interface CartItem extends Item {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Item) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // Loads the logged-in user's cart from Firestore
  useEffect(() => {
    const loadCart = async () => {
      if (!isLoggedIn || !user) {
        setItems([]);
        return;
      }

      const userRef = doc(db, 'users', user.id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setItems(userSnap.data().cart || []);
      }
    };

    loadCart();
  }, [user, isLoggedIn]);

  const saveCart = async (newItems: CartItem[]) => {
    if (!user) return;

    await setDoc(
      doc(db, 'users', user.id),
      { cart: newItems },
      { merge: true }
    );
  };

  const addToCart = (item: Item) => {
    if (!user) return;

    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);

      const newItems = existingItem
        ? prevItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prevItems, { ...item, quantity: 1 }];

      saveCart(newItems);
      return newItems;
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((i) => i.id !== itemId);
      saveCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems((prevItems) => {
      const newItems = prevItems.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      );

      saveCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    saveCart([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
}