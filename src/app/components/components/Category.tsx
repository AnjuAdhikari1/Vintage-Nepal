import { useParams } from 'react-router';
import { mockItems } from '../mockData';
import { ItemCard } from './ItemCard';
import { Card, CardContent } from './ui/card';
import { Package } from 'lucide-react';

export function Category() {
  const { categoryName } = useParams();
  const categoryTitle = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : '';

  const categoryItems = mockItems.filter(
    (item) => item.category.toLowerCase() === categoryName?.toLowerCase()
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">{categoryTitle}</h1>
        <p className="text-neutral-600">
          {categoryItems.length} items available
        </p>
      </div>

      {categoryItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="size-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl mb-2">No items in this category</h3>
            <p className="text-neutral-600">
              Check back later for new listings.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
