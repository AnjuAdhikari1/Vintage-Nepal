export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'like-new' | 'good' | 'fair' | 'worn';
  location: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  createdAt: string;
  views: number;
  isSold: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  location: string;
  joinedDate: string;
  rating: number;
  totalSales: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}
