import { useState } from 'react';
import { useNavigate } from 'react-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../AuthContext';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

//adding cloudinary constants for future use when real image upload is implemented
const CLOUD_NAME = 'dlsuczysy';
const UPLOAD_PRESET = 'vintage Nepal uploads';

export function SellItem() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // User must be logged in before listing an item
    if (!isLoggedIn || !user) {
      toast.error('Please login before listing an item');
      navigate('/login');
      return;
    }
// Only seller accounts can list items
if (user.accountType !== 'seller') {
  toast.error('Only seller accounts can list items. Please create a seller account.');
  navigate('/signup');
  return;
}
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.condition ||
      !formData.location
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    try {
      setIsSubmitting(true);

      // Saves the item into Firestore database
      await addDoc(collection(db, 'items'), {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        condition: formData.condition,
        location: formData.location,
        images,
        sellerId: user.id,
        sellerName: user.name,
        sellerEmail: user.email,
        sellerAvatar: user.avatar,
        sellerRating: 0,
        status: 'available',
        isSold: false,
        views: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Item listed successfully!');

      setTimeout(() => {
        navigate('/my-listings');
      }, 800);
    } catch (error) {
      console.error(error);
      toast.error('Could not list item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upload image to Cloudinary
const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // Maximum 4 images allowed
  if (images.length >= 4) {
    toast.error('You can upload up to 4 photos only');
    return;
  }

  // Form data for Cloudinary
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', UPLOAD_PRESET);

  try {
    toast.loading('Uploading image...');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: data,
      }
    );

    const uploadedImage = await response.json();

if (!response.ok) {
  throw new Error(uploadedImage.error?.message || 'Upload failed');
}

// Add uploaded image URL into state
setImages((prev) => [...prev, uploadedImage.secure_url]);

    toast.dismiss();
    toast.success('Photo uploaded successfully!');
  } catch (error) {
    toast.dismiss();
    toast.error('Image upload failed');
  }
};

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">List Your Item</CardTitle>
          <p className="text-neutral-600">
            Fill in the details below to list your item for sale
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>Photos *</Label>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100"
                  >
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="size-full object-cover"
                    />

                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 size-6 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}

                <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-orange-500 transition cursor-pointer">
  <Upload className="size-6 text-neutral-400" />
  <span className="text-xs text-neutral-500">Upload</span>

  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleImageUpload}
  />
</label>
              </div>

              <p className="text-xs text-neutral-500">
                You can upload up to 4 photos for each item.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Vintage Leather Jacket"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your item in detail..."
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (NPR) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="5000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="home-garden">Home & Garden</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="like-new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="worn">Worn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Thamel, Kathmandu"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Listing Item...' : 'List Item'}
              </Button>

              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}