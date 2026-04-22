import { useState } from 'react';
import { mockItems } from '../mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ItemCard } from './ItemCard';
import { Card, CardContent } from './ui/card';
import { Package } from 'lucide-react';

export function MyListings() {
  const [activeTab, setActiveTab] = useState('active');
  
  // Mock user's items (filter by sellerId = '1')
  const userItems = mockItems.filter((item) => item.sellerId === '1');
  const activeItems = userItems.filter((item) => !item.isSold);
  const soldItems = userItems.filter((item) => item.isSold);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">My Listings</h1>
        <p className="text-neutral-600">
          Manage your listed items
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="active">
            Active ({activeItems.length})
          </TabsTrigger>
          <TabsTrigger value="sold">
            Sold ({soldItems.length})
          </TabsTrigger>
          <TabsTrigger value="favorites">
            Favorites (0)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="size-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-xl mb-2">No active listings</h3>
                <p className="text-neutral-600">
                  You don't have any active listings yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sold">
          {soldItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {soldItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="size-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-xl mb-2">No sold items</h3>
                <p className="text-neutral-600">
                  You haven't sold any items yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="size-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl mb-2">No favorites</h3>
              <p className="text-neutral-600">
                You haven't favorited any items yet.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
