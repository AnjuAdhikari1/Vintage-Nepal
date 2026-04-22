import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import { FavoritesProvider } from '../FavoritesContext';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <RouterProvider router={router} />
          <Toaster />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
    
  );
  
}
