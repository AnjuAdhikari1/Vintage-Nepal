import { useParams, Link, useNavigate } from 'react-router';
import { mockItems } from '../mockData';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageDisplay } from './common/ImageDisplay';
import { MapPin, Eye, Heart, Share2, MessageCircle, ArrowLeft, AlertCircle, ShoppingCart } from 'lucide-react';
import { Separator } from './ui/separator';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '../CartContext';

export function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const item = mockItems.find((i) => i.id === id);
  const [isFavorited, setIsFavorited] = useState(false);

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

  const relatedItems = mockItems
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, 3);

  const handleContact = () => {
    toast.success('Message sent to seller');
  };

  const handleShare = () => {
    toast.success('Link copied to clipboard');
  };

  const handleAddToCart = () => {
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
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100">
            <ImageDisplay
              src={item.images[0]}
              alt={item.title}
              className="size-full object-cover"
            />
          </div>
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
                  onClick={() => {
                    setIsFavorited(!isFavorited);
                    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
                  }}
                  className={isFavorited ? 'text-red-500' : ''}
                >
                  <Heart className={`size-5 ${isFavorited ? 'fill-current' : ''}`} />
                </Button>
                <Button size="icon" variant="outline" onClick={handleShare}>
                  <Share2 className="size-5" />
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
                <span>{item.views} views</span>
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
            <Badge variant="outline">{item.category}</Badge>
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

      {/* Related Items */}
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