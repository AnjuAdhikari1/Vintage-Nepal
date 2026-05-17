import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { db } from '../../../firebase';
import { mockUsers, mockItems } from '../mockData';
import { Item } from '../types';

import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageDisplay } from './common/ImageDisplay';
import {
  MapPin,
  Calendar,
  Star,
  Package,
  AlertCircle,
  Mail,
  Phone,
} from 'lucide-react';
import { ItemCard } from './ItemCard';
import { Button } from './ui/button';
import { useAuth } from '../AuthContext';

interface FirestoreUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  accountType: 'buyer' | 'seller';
  isVerifiedSeller: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'none';
  joinedDate: string;
}

export function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { user: loggedInUser, isLoggedIn, isAuthLoading } = useAuth();

  const isMyProfile = userId === 'me';

  // Real seller profile from Firestore
  const [firestoreUser, setFirestoreUser] = useState<FirestoreUser | null>(null);

  // Real seller listings from Firestore
  const [firestoreItems, setFirestoreItems] = useState<Item[]>([]);

  const [loadingFirestoreProfile, setLoadingFirestoreProfile] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && isMyProfile && !isLoggedIn) {
      navigate('/login');
    }
  }, [isAuthLoading, isMyProfile, isLoggedIn, navigate]);

  useEffect(() => {
    const fetchFirestoreProfile = async () => {
      if (!userId || isMyProfile) return;

      // First we let mock profiles work as before
      const mockUser = mockUsers.find((u) => u.id === userId);
      if (mockUser) return;

      try {
        setLoadingFirestoreProfile(true);

        // Check if this user exists in Firestore
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setFirestoreUser(null);
          setFirestoreItems([]);
          return;
        }

        const realUser = {
          id: userSnap.id,
          ...userSnap.data(),
        } as FirestoreUser;

        setFirestoreUser(realUser);

        // Get all items listed by this real seller
        const itemsQuery = query(
          collection(db, 'items'),
          where('sellerId', '==', userId)
        );

        const itemsSnap = await getDocs(itemsQuery);

        const realItems = itemsSnap.docs.map((itemDoc) => ({
          id: itemDoc.id,
          ...itemDoc.data(),
        })) as Item[];

        setFirestoreItems(realItems);
      } catch (error) {
        console.error('Error loading Firestore profile:', error);
      } finally {
        setLoadingFirestoreProfile(false);
      }
    };

    fetchFirestoreProfile();
  }, [userId, isMyProfile]);

  if (isAuthLoading && isMyProfile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-neutral-600">Loading profile...</p>
      </div>
    );
  }

  // Logged-in user's own profile
  if (isMyProfile) {
    if (!loggedInUser) return null;

    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <ImageDisplay
                src={loggedInUser.avatar}
                alt={loggedInUser.name}
                className="size-24 rounded-full object-cover"
              />

              <div className="flex-1">
                <h1 className="text-2xl mb-2">{loggedInUser.name}</h1>

                <div className="flex flex-wrap gap-4 text-neutral-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Mail className="size-4" />
                    <span>{loggedInUser.email}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Phone className="size-4" />
                    <span>{loggedInUser.phone}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    <span>
                      Joined{' '}
                      {new Date(loggedInUser.joinedDate).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="capitalize">
                    {loggedInUser.accountType}
                  </Badge>

                  {loggedInUser.accountType === 'seller' && (
                    <Badge
                      className={
                        loggedInUser.verificationStatus === 'approved'
                          ? 'bg-green-600'
                          : loggedInUser.verificationStatus === 'pending'
                          ? 'bg-yellow-500'
                          : 'bg-orange-500'
                      }
                    >
                      Seller Verification: {loggedInUser.verificationStatus}
                    </Badge>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  {loggedInUser.accountType === 'seller' && (
                    <Link to="/my-listings">
                      <Button>My Listings</Button>
                    </Link>
                  )}

                  {loggedInUser.accountType === 'buyer' && (
                    <Link to="/favorites">
                      <Button>My Favorites</Button>
                    </Link>
                  )}

                  <Link to="/sell">
                    <Button variant="outline">Sell Item</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-12 text-center">
            <Package className="size-12 text-neutral-400 mx-auto mb-4" />
            <h2 className="text-xl mb-2">Your account is connected</h2>
            <p className="text-neutral-600">
              This profile is now using your real Firebase account data.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loadingFirestoreProfile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-neutral-600">Loading seller profile...</p>
      </div>
    );
  }

  // Mock seller profiles still work for demo data
  const mockUser = mockUsers.find((u) => u.id === userId);
  const mockUserItems = mockItems.filter((item) => item.sellerId === userId);

  if (mockUser) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <ImageDisplay
                src={mockUser.avatar}
                alt={mockUser.name}
                className="size-24 rounded-full object-cover"
              />

              <div className="flex-1">
                <h1 className="text-2xl mb-2">{mockUser.name}</h1>

                <div className="flex flex-wrap gap-4 text-neutral-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="size-4" />
                    <span>{mockUser.location}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    <span>
                      Joined{' '}
                      {new Date(mockUser.joinedDate).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="size-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{mockUser.rating.toFixed(1)}</span>
                    <span className="text-neutral-600">rating</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Package className="size-5 text-orange-500" />
                    <span className="font-medium">{mockUser.totalSales}</span>
                    <span className="text-neutral-600">items sold</span>
                  </div>
                </div>

                {mockUser.totalSales > 20 && (
                  <div className="mt-4">
                    <Badge className="bg-orange-500">Top Seller</Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl mb-6">
            {mockUser.name}'s Listings ({mockUserItems.length})
          </h2>

          {mockUserItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {mockUserItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="size-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">
                  This user has no active listings.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Real Firestore seller profile
  if (firestoreUser) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <ImageDisplay
                src={firestoreUser.avatar}
                alt={firestoreUser.name}
                className="size-24 rounded-full object-cover"
              />

              <div className="flex-1">
                <h1 className="text-2xl mb-2">{firestoreUser.name}</h1>

                <div className="flex flex-wrap gap-4 text-neutral-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Mail className="size-4" />
                    <span>{firestoreUser.email}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    <span>
                      Joined{' '}
                      {new Date(firestoreUser.joinedDate).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="capitalize">
                    {firestoreUser.accountType}
                  </Badge>

                  {firestoreUser.accountType === 'seller' && (
                    <Badge
                      className={
                        firestoreUser.verificationStatus === 'approved'
                          ? 'bg-green-600'
                          : firestoreUser.verificationStatus === 'pending'
                          ? 'bg-yellow-500'
                          : 'bg-orange-500'
                      }
                    >
                      Seller Verification: {firestoreUser.verificationStatus}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl mb-6">
            {firestoreUser.name}'s Listings ({firestoreItems.length})
          </h2>

          {firestoreItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {firestoreItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="size-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">
                  This seller has no active listings yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Final fallback if neither mock nor Firestore user exists
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