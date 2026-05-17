import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { db } from '../../../firebase';
import { Item } from '../types';
import { mockItems, mockCategories } from '../mockData';

import { ItemCard } from './ItemCard';
import { CategoryCard } from './CategoryCard';
import { TrendingUp } from 'lucide-react';

export function Home() {
  // Real items uploaded by users and saved in Firestore
  const [databaseItems, setDatabaseItems] = useState<Item[]>([]);

  // Shows loading only while Firebase is being checked
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatabaseItems = async () => {
      try {
        // Gets real uploaded items from Firestore, newest first
        const itemsQuery = query(
          collection(db, 'items'),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(itemsQuery);

        const fetchedItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Item[];

        setDatabaseItems(fetchedItems);
      } catch (error) {
        console.error('Error loading database items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatabaseItems();
  }, []);

  // Featured items stay as demo content so the homepage looks full
const featuredItems = mockItems.slice(0, 6);

// Recently added shows real uploaded items first, then demo items if needed
const recentItems = [...databaseItems, ...mockItems.slice(6)].slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-6 space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl mb-4">
            Buy & Sell Vintage Items in Nepal
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-6">
            Discover unique second-hand treasures from across Nepal. Give pre-loved items a new home.
          </p>

          <Link
            to="/sell"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-lg hover:bg-neutral-50 transition"
          >
            Start Selling Today
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl mb-6">Browse Categories</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {mockCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Real uploaded items appear here if database has listings */}
      {databaseItems.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">New Community Listings</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {databaseItems.slice(0, 6).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Items */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Featured Items</h2>
          <TrendingUp className="size-6 text-orange-500" />
        </div>

        {loading ? (
          <p className="text-neutral-600">Loading items...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {featuredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Listings */}
      <section>
        <h2 className="text-2xl mb-6">Recently Added</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-100 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl mb-4">
          Have something to sell?
        </h2>

        <p className="text-neutral-600 mb-6 max-w-xl mx-auto">
          Join thousands of sellers on Vintage Nepal. List your items for free and reach buyers across the country.
        </p>

        <Link
          to="/sell"
          className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
        >
          List Your Item
        </Link>
      </section>
    </div>
  );
}