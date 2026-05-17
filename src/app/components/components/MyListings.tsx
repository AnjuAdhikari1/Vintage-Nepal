import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { db } from '../../../firebase';
import { useAuth } from '../AuthContext';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ItemCard } from './ItemCard';
import { Card, CardContent } from './ui/card';
import { Package } from 'lucide-react';

import { Item } from '../types';

export function MyListings() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('active');

  // Stores items from Firebase
  const [items, setItems] = useState<Item[]>([]);

  // Loading state while fetching data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user is not logged in, stop here
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUserItems = async () => {
      try {
        // Gets only the logged in user's items
        const itemsQuery = query(
          collection(db, 'items'),
          where('sellerId', '==', user.id)
        );

        const querySnapshot = await getDocs(itemsQuery);

        const fetchedItems = querySnapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
})) as Item[];
        setItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, [user]);

  // Separate active and sold items
  const activeItems = items.filter((item) => !item.isSold);
  const soldItems = items.filter((item) => item.isSold);

  // Loading screen
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading your listings...</p>
      </div>
    );
  }

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

        {/* ACTIVE ITEMS */}
        <TabsContent value="active">
          {activeItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {activeItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="size-12 text-neutral-400 mx-auto mb-4" />

                <h3 className="text-xl mb-2">
                  No active listings
                </h3>

                <p className="text-neutral-600">
                  You don't have any active listings yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* SOLD ITEMS */}
        <TabsContent value="sold">
          {soldItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {soldItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="size-12 text-neutral-400 mx-auto mb-4" />

                <h3 className="text-xl mb-2">
                  No sold items
                </h3>

                <p className="text-neutral-600">
                  You haven't sold any items yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* FAVORITES */}
        <TabsContent value="favorites">
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="size-12 text-neutral-400 mx-auto mb-4" />

              <h3 className="text-xl mb-2">
                No favorites
              </h3>

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