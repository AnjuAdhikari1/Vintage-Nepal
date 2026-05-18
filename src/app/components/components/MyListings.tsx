import { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '../../../firebase';
import { useAuth } from '../AuthContext';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ItemCard } from './ItemCard';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Package, Pencil, Trash2, X, Save } from 'lucide-react';

import { Item } from '../types';

export function MyListings() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('active');

  // Stores this seller's real Firestore listings
  const [items, setItems] = useState<Item[]>([]);

  // Shows loading while Firestore is fetching listings
  const [loading, setLoading] = useState(true);

  // Stores the item currently being edited
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Stores form values while editing listing details
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
  });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchUserItems();
  }, [user]);

  const fetchUserItems = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Gets only listings created by the logged-in seller
      const itemsQuery = query(
        collection(db, 'items'),
        where('sellerId', '==', user.id)
      );

      const querySnapshot = await getDocs(itemsQuery);

      const fetchedItems = querySnapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Item[];

      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this listing?'
    );

    if (!confirmDelete) return;

    try {
      // Deletes the listing from Firestore
      await deleteDoc(doc(db, 'items', itemId));

      // Removes it from the page immediately without refresh
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Could not delete listing. Please try again.');
    }
  };

  const startEditing = (item: Item) => {
    setEditingItem(item);

    // Pre-fills the edit form using the selected listing
    setEditForm({
      title: item.title,
      description: item.description,
      price: String(item.price),
      location: item.location,
    });
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditForm({
      title: '',
      description: '',
      price: '',
      location: '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    if (
      !editForm.title ||
      !editForm.description ||
      !editForm.price ||
      !editForm.location
    ) {
      alert('Please fill in all fields before saving.');
      return;
    }

    try {
      // Updates listing details in Firestore
      await updateDoc(doc(db, 'items', editingItem.id), {
        title: editForm.title,
        description: editForm.description,
        price: Number(editForm.price),
        location: editForm.location,
        updatedAt: new Date(),
      });

      // Updates the listing on screen immediately
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                title: editForm.title,
                description: editForm.description,
                price: Number(editForm.price),
                location: editForm.location,
              }
            : item
        )
      );

      cancelEditing();
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('Could not update listing. Please try again.');
    }
  };

  const activeItems = items.filter((item) => !item.isSold);
  const soldItems = items.filter((item) => item.isSold);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading your listings...</p>
      </div>
    );
  }

  const renderListingGrid = (listingItems: Item[]) => {
    if (listingItems.length === 0) {
      return (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="size-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl mb-2">No listings found</h3>
            <p className="text-neutral-600">
              You do not have any listings in this section yet.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {listingItems.map((item) => (
          <div key={item.id} className="space-y-3">
            <ItemCard item={item} />

            {/* Seller controls only appear inside My Listings */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => startEditing(item)}
              >
                <Pencil className="size-4 mr-2" />
                Edit
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="size-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">My Listings</h1>

        <p className="text-neutral-600">
          Manage your listed items
        </p>
      </div>

      {/* Simple edit form appears above tabs when seller clicks Edit */}
      {editingItem && (
        <Card className="mb-6">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl">Edit Listing</h2>

              <Button variant="ghost" size="icon" onClick={cancelEditing}>
                <X className="size-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Price</label>
                <Input
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                rows={4}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSaveEdit}>
                <Save className="size-4 mr-2" />
                Save Changes
              </Button>

              <Button variant="outline" onClick={cancelEditing}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="active">
            Active ({activeItems.length})
          </TabsTrigger>

          <TabsTrigger value="sold">
            Sold ({soldItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {renderListingGrid(activeItems)}
        </TabsContent>

        <TabsContent value="sold">
          {renderListingGrid(soldItems)}
        </TabsContent>
      </Tabs>
    </div>
  );
}