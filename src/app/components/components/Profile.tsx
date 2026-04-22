import { useParams } from 'react-router';
import { mockUsers, mockItems } from '../mockData';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageDisplay } from './common/ImageDisplay';
import { MapPin, Calendar, Star, Package, AlertCircle } from 'lucide-react';
import { ItemCard } from './ItemCard';
import { Button } from './ui/button';
import { Link } from 'react-router';

export function Profile() {
  const { userId } = useParams();
  const user = mockUsers.find((u) => u.id === userId);
  const userItems = mockItems.filter((item) => item.sellerId === userId);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="size-12 text-neutral-400 mx-auto mb-4" />
        <h2 className="text-2xl mb-2">User not found</h2>
        <p className="text-neutral-600 mb-6">
          The user profile you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <ImageDisplay
              src={user.avatar}
              alt={user.name}
              className="size-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl mb-2">{user.name}</h1>
              
              <div className="flex flex-wrap gap-4 text-neutral-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  <span>Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Star className="size-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{user.rating.toFixed(1)}</span>
                  <span className="text-neutral-600">rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="size-5 text-orange-500" />
                  <span className="font-medium">{user.totalSales}</span>
                  <span className="text-neutral-600">items sold</span>
                </div>
              </div>

              {user.totalSales > 20 && (
                <div className="mt-4">
                  <Badge className="bg-orange-500">Top Seller</Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User's Listings */}
      <div>
        <h2 className="text-2xl mb-6">
          {user.name}'s Listings ({userItems.length})
        </h2>
        {userItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="size-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600">This user has no active listings.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
