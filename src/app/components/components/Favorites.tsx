import { Link } from 'react-router';
import { useFavorites } from '../../FavoritesContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ImageDisplay } from './common/ImageDisplay';
import { Heart, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export function Favorites() {
  const { favorites, removeFromFavorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="size-16 text-neutral-400 mx-auto mb-4" />
            <h2 className="text-2xl mb-2">No Favorites Yet</h2>
            <p className="text-neutral-600 mb-6">
              Start adding items to your favorites to see them here.
            </p>
            <Link to="/">
              <Button>Browse Items</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRemove = (itemId: string, itemTitle: string) => {
    removeFromFavorites(itemId);
    toast.success(`Removed "${itemTitle}" from favorites`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl">My Favorites</h1>
          <p className="text-neutral-600">{favorites.length} items saved</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {favorites.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition group">
            <Link to={`/item/${item.id}`}>
              <div className="aspect-[4/3] bg-neutral-100 relative">
                <ImageDisplay
                  src={item.images[0]}
                  alt={item.title}
                  className="size-full object-cover"
                />
                {item.isSold && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium">
                      SOLD
                    </span>
                  </div>
                )}
              </div>
            </Link>

            <CardContent className="p-4">
              <Link to={`/item/${item.id}`}>
                <h3 className="font-medium line-clamp-2 mb-2 hover:text-orange-500 transition">
                  {item.title}
                </h3>
              </Link>

              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-bold text-orange-600">
                  NPR {item.price.toLocaleString()}
                </p>
                <span className="text-sm text-neutral-600 capitalize">{item.condition}</span>
              </div>

              <p className="text-sm text-neutral-600 mb-3 flex items-center gap-1">
                <span>📍</span>
                {item.location}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleRemove(item.id, item.title)}
                >
                  <Heart className="size-4 mr-2 fill-current text-red-500" />
                  Remove
                </Button>
                <Link to={`/item/${item.id}`} className="flex-1">
                  <Button size="sm" className="w-full" disabled={item.isSold}>
                    <ShoppingBag className="size-4 mr-2" />
                    {item.isSold ? 'Sold' : 'View'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
