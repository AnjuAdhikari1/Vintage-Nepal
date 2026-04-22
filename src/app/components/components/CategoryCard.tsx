import { Link } from 'react-router';
import { Category } from '../types';
import { Card, CardContent } from './ui/card';
import * as LucideIcons from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = (LucideIcons as any)[category.icon] || LucideIcons.Package;

  return (
    <Link to={`/category/${category.name.toLowerCase()}`}>
      <Card className="hover:shadow-md hover:border-orange-500 transition cursor-pointer">
        <CardContent className="p-4 flex flex-col items-center text-center gap-2">
          <div className="size-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Icon className="size-6 text-orange-600" />
          </div>
          <div>
            <p className="font-medium text-sm">{category.name}</p>
            <p className="text-xs text-neutral-500">{category.count} items</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
