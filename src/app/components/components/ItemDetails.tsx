import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../../../firebase';
import { Item } from '../types';
import { mockItems } from '../mockData';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageDisplay } from './common/ImageDisplay';
import {
  MapPin,
  Eye,
  Heart,
  MessageCircle,
  ArrowLeft,
  AlertCircle,
  ShoppingCart,
} from 'lucide-react';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { useCart } from '../CartContext';
import { useFavorites } from '../../FavoritesContext';
import { useAuth } from '../AuthContext';

export function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // This stores either a mock item or a real Firestore item
  const [item, setItem] = useState<Item | null>(null);

  // This is used while Firebase is checking for the item
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      // First check the demo/mock items
      const mockItem = mockItems.find((i) => i.id === id);

      if (mockItem) {
        setItem(mockItem);
        setLoading(false);
        return;
      }

      try {
        // If it is not in mock data, check Firestore database
        const itemRef = doc(db, 'items', id);
        const itemSnap = await getDoc(itemRef);

        if (itemSnap.exists()) {
          setItem({
            id: itemSnap.id,
            ...itemSnap.data(),
          } as Item);
        } else {
          setItem(null);
        }
      } catch (error) {
        console.error('Error loading item:', error);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-neutral-600">Loading item...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="size-12 text-neutral-400 mx-auto mb-4" />

        <h2 className="text-2xl mb-2">Item not found</h2>

        <p className="text-neutral-600 mb-6">
          The item you're looking for doesn't exist or has been removed.
        </p>

        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(item.id);

  const relatedItems = mockItems
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, 3);

  const handleFavoriteClick = () => {
    // Guests can view items, but must login before saving favorites
    if (!isLoggedIn) {
      toast.error('Please login to add items to your favorites');
      navigate('/login');
      return;
    }

    if (favorited) {
      removeFromFavorites(item.id);
      toast.success(`Removed "${item.title}" from favorites`);
    } else {
      addToFavorites(item);
      toast.success(`Added "${item.title}" to favorites`);
    }
  };

  const handleContact = () => {
    if (!isLoggedIn) {
      toast.error('Please login to contact the seller');
      navigate('/login');
      return;
    }

    toast.success('Message sent to seller');
  };

  const handleAddToCart = () => {
    // Guests can browse products, but must login before adding to cart
    if (!isLoggedIn) {
      toast.error('Please login to add items to your cart');
      navigate('/login');
      return;
    }

    addToCart(item);
    toast.success('Added to cart');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="size-4 mr-2" />
        Back
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Gallery - shows all uploaded item photos */}
<div className="space-y-4">
  <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100">
    <ImageDisplay
      src={item.images?.[0]}
      alt={item.title}
      className="size-full object-cover"
    />
  </div>

  {/* Small thumbnails for extra images */}
  {item.images && item.images.length > 1 && (
    <div className="grid grid-cols-4 gap-3">
      {item.images.map((image, index) => (
        <div
          key={index}
          className="aspect-square rounded-lg overflow-hidden bg-neutral-100 border"
        >
          <ImageDisplay
            src={image}
            alt={`${item.title} photo ${index + 1}`}
            className="size-full object-cover"
          />
        </div>
      ))}
    </div>
  )}
</div>

        {/* Item Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-3xl">{item.title}</h1>

              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleFavoriteClick}
                  className={favorited ? 'text-red-500' : ''}
                >
                  <Heart className={`size-5 ${favorited ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-neutral-600 mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                <span>{item.location}</span>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="size-4" />
                <span>{item.views || 0} views</span>
              </div>
            </div>

            <p className="text-4xl font-bold text-orange-600">
              NPR {item.price.toLocaleString()}
            </p>
          </div>

          <Separator />

          {/* Condition & Category */}
          <div className="flex gap-2">
            <Badge variant="secondary" className="capitalize">
              {item.condition}
            </Badge>

            <Badge variant="outline" className="capitalize">
              {item.category}
            </Badge>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-xl mb-3">Description</h2>

            <p className="text-neutral-700 whitespace-pre-line leading-relaxed">
              {item.description}
            </p>
          </div>

          <Separator />

          {/* Seller Info */}
          <div>
            <h2 className="text-xl mb-3">Seller Information</h2>

            <Link
              to={`/profile/${item.sellerId}`}
              className="flex items-center gap-3 p-4 border rounded-lg hover:border-orange-500 transition"
            >
              <ImageDisplay
                src={item.sellerAvatar}
                alt={item.sellerName}
                className="size-12 rounded-full object-cover"
              />

              <div>
                <p className="font-medium">{item.sellerName}</p>
                <p className="text-sm text-neutral-600">{item.location}</p>
              </div>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              size="lg"
              onClick={handleAddToCart}
              disabled={item.isSold}
            >
              <ShoppingCart className="size-5 mr-2" />
              {item.isSold ? 'Item Sold' : 'Add to Cart'}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleContact}
              disabled={item.isSold}
            >
              <MessageCircle className="size-5 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </div>

      {/* Related items still use mock data to keep the page full */}
      {relatedItems.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl mb-6">More in {item.category}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedItems.map((relatedItem) => (
              <Link
                key={relatedItem.id}
                to={`/item/${relatedItem.id}`}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="aspect-[4/3] bg-neutral-100">
                  <ImageDisplay
                    src={relatedItem.images[0]}
                    alt={relatedItem.title}
                    className="size-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <p className="font-medium line-clamp-2 mb-2">
                    {relatedItem.title}
                  </p>

                  <p className="text-lg font-bold text-orange-600">
                    NPR {relatedItem.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}