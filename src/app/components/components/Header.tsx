import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Plus, Heart, User, Menu, ShoppingCart, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { useFavorites } from '../../FavoritesContext';
import { Badge } from './ui/badge';
import { mockItems } from '../mockData';
import { ImageDisplay } from './common/ImageDisplay';

export function Header() {
  const navigate = useNavigate();
  const { getItemCount } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const { getFavoritesCount } = useFavorites();
  const itemCount = getItemCount();
  const favoritesCount = getFavoritesCount();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockItems>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = mockItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const handleSearchSelect = (itemId: string) => {
    navigate(`/item/${itemId}`);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">VN</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">Vintage Nepal</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl" ref={searchRef}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
              <Input
                placeholder="Search for vintage items..."
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              />
              
              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSearchSelect(item.id)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 transition border-b last:border-b-0"
                    >
                      <div className="size-12 rounded overflow-hidden bg-neutral-100 flex-shrink-0">
                        <ImageDisplay
                          src={item.images[0]}
                          alt={item.title}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium line-clamp-1">{item.title}</p>
                        <p className="text-sm text-orange-600">NPR {item.price.toLocaleString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showResults && searchResults.length === 0 && searchQuery.length >= 2 && (
                <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg p-4 text-center text-neutral-600 z-50">
                  No items found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/sell">
              <Button>
                <Plus className="size-4 mr-2" />
                Sell Item
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="size-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link to="/favorites">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="size-5" />
                {favoritesCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs">
                    {favoritesCount}
                  </Badge>
                )}
              </Button>
            </Link>
            {isLoggedIn ? (
              <>
                {/* Opens the logged-in user's real Firebase profile */}
<Link to="/profile/me">
  <Button variant="ghost" size="icon" title={user?.name}>
    <User className="size-5" />
  </Button>
</Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="size-5" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon">
                  <User className="size-5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="size-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link to="/favorites">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="size-5" />
                {favoritesCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs">
                    {favoritesCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8 bg-white z-50 shadow-lg">
                  <Link to="/sell">
                    <Button variant="ghost" className="w-full justify-start">
                      <Plus className="size-4 mr-2" />
                      Sell Item
                    </Button>
                  </Link>
                  <Link to="/my-listings">
                    <Button variant="ghost" className="w-full justify-start">
                      <Heart className="size-4 mr-2" />
                      My Listings
                    </Button>
                  </Link>
                  {isLoggedIn ? (
                    <>
                      {/* Opens the logged-in user's real Firebase profile on mobile */}
<Link to="/profile/me">
  <Button variant="ghost" className="w-full justify-start">
    <User className="size-4 mr-2" />
    Profile
  </Button>
</Link>
                      <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="size-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link to="/login">
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="size-4 mr-2" />
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-3" ref={searchRef}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              placeholder="Search for vintage items..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            />
            
            {/* Mobile Search Results */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSearchSelect(item.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 transition border-b last:border-b-0"
                  >
                    <div className="size-12 rounded overflow-hidden bg-neutral-100 flex-shrink-0">
                      <ImageDisplay
                        src={item.images[0]}
                        alt={item.title}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium line-clamp-1 text-sm">{item.title}</p>
                      <p className="text-sm text-orange-600">NPR {item.price.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showResults && searchResults.length === 0 && searchQuery.length >= 2 && (
              <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg p-4 text-center text-neutral-600 text-sm z-50">
                No items found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
