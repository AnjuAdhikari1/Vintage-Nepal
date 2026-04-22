import { Link, useNavigate } from 'react-router';
import { useCart } from '../CartContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ImageDisplay } from './common/ImageDisplay';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Separator } from './ui/separator';

export function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingBag className="size-16 text-neutral-400 mx-auto mb-4" />
            <h2 className="text-2xl mb-2">Your cart is empty</h2>
            <p className="text-neutral-600 mb-6">
              Start adding items to your cart to see them here.
            </p>
            <Link to="/">
              <Button>Browse Items</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Link to={`/item/${item.id}`} className="flex-shrink-0">
                    <div className="size-24 rounded-lg overflow-hidden bg-neutral-100">
                      <ImageDisplay
                        src={item.images[0]}
                        alt={item.title}
                        className="size-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/item/${item.id}`}>
                      <h3 className="font-medium line-clamp-2 hover:text-orange-500 transition mb-1">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-neutral-600 mb-2">{item.location}</p>
                    <p className="text-lg font-bold text-orange-600">
                      NPR {item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-400 hover:text-red-500"
                    >
                      <Trash2 className="size-4" />
                    </Button>

                    <div className="flex items-center gap-2 border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span>NPR {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg">
                <span>Total</span>
                <span className="font-bold text-orange-600">
                  NPR {total.toLocaleString()}
                </span>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>

              <Link to="/">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
