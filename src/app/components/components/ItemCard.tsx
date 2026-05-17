import { Link, useNavigate } from 'react-router';
import { Item } from '../types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Eye, Heart } from 'lucide-react';
import { ImageDisplay } from './common/ImageDisplay';
import { Button } from './ui/button';
import { useFavorites } from '../../FavoritesContext';
import { useAuth } from '../AuthContext';
import { toast } from 'sonner';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const navigate = useNavigate();

  // Checks whether the user is logged in before saving favourites
  const { isLoggedIn } = useAuth();

  // Favourite functions come from the global favourites context
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const favorited = isFavorite(item.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Guests can browse items, but they must login before saving favourites
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

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition">
      <Link to={`/item/${item.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          <ImageDisplay
            src={item.images[0]}
            alt={item.title}
            className="object-cover size-full group-hover:scale-105 transition duration-300"
          />

          {item.isSold && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge className="bg-white text-black">SOLD</Badge>
            </div>
          )}

          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-2 right-2 size-8 rounded-full bg-white/90 hover:bg-white ${
              favorited ? 'text-red-500' : 'text-neutral-600'
            }`}
            onClick={handleFavoriteClick}
          >
            <Heart className={`size-4 ${favorited ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4 space-y-2">
        <Link to={`/item/${item.id}`}>
          <h3 className="font-medium line-clamp-2 hover:text-orange-500 transition">
            {item.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-orange-600">
            NPR {item.price.toLocaleString()}
          </p>

          <Badge variant="outline" className="capitalize">
            {item.condition}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <div className="flex items-center gap-1">
            <MapPin className="size-3" />
            <span className="line-clamp-1">{item.location}</span>
          </div>

          <div className="flex items-center gap-1">
            <Eye className="size-3" />
            <span>{item.views || 0}</span>
          </div>
        </div>

        <Link
          to={`/profile/${item.sellerId}`}
          className="flex items-center gap-2 pt-2 border-t"
        >
          <ImageDisplay
            src={item.sellerAvatar}
            alt={item.sellerName}
            className="size-6 rounded-full object-cover"
          />

          <span className="text-sm text-neutral-600 hover:text-orange-500 transition">
            {item.sellerName}
          </span>
        </Link>
      </CardContent>
    </Card>
  );
}