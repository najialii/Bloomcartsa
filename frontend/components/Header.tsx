'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBasket, Heart, User, Menu, X, LayoutDashboard } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useCartStore } from '@/lib/cartStore';
import { useUserStore } from '@/lib/userStore';
import { useWishlistStore } from '@/lib/wishlistStore';
import { usePlatformSettings } from '@/contexts/PlatformSettingsContext';
import { usePlatformRefresh } from '@/hooks/usePlatformRefresh';
import { productsApi } from '@/lib/api';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import Price from './Price';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [mobileSuggestions, setMobileSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileSearching, setIsMobileSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { openCart, getTotalItems } = useCartStore();
  const { openWishlist, getTotalItems: getWishlistTotal } = useWishlistStore();
  const { profile, isLoggedIn } = useUserStore();
  const { getSetting } = usePlatformSettings();
  usePlatformRefresh(); // This will listen for settings updates
  const totalItems = getTotalItems();
  const wishlistTotal = getWishlistTotal();
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    setMounted(true);
    
    // Fetch wishlist from backend if user is logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
      useWishlistStore.getState().fetchWishlist();
    }
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch desktop search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await productsApi.getAll(locale as 'en' | 'ar');
        const filtered = results
          .filter((product: Product) => {
            const searchLower = searchQuery.toLowerCase();
            const nameMatch = product.name?.toLowerCase().includes(searchLower);
            const descMatch = product.description?.toLowerCase().includes(searchLower);
            const categoryMatch = product.category?.name?.toLowerCase().includes(searchLower);
            return nameMatch || descMatch || categoryMatch;
          })
          .slice(0, 5);
        
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, locale]);

  // Fetch mobile search suggestions
  useEffect(() => {
    const fetchMobileSuggestions = async () => {
      if (mobileSearchQuery.trim().length < 2) {
        setMobileSuggestions([]);
        return;
      }

      setIsMobileSearching(true);
      try {
        const results = await productsApi.getAll(locale as 'en' | 'ar');
        const filtered = results
          .filter((product: Product) => {
            const searchLower = mobileSearchQuery.toLowerCase();
            const nameMatch = product.name?.toLowerCase().includes(searchLower);
            const descMatch = product.description?.toLowerCase().includes(searchLower);
            const categoryMatch = product.category?.name?.toLowerCase().includes(searchLower);
            return nameMatch || descMatch || categoryMatch;
          })
          .slice(0, 5);
        
        setMobileSuggestions(filtered);
      } catch (error) {
        console.error('Error fetching mobile suggestions:', error);
        setMobileSuggestions([]);
      } finally {
        setIsMobileSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchMobileSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [mobileSearchQuery, locale]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productSlug: string) => {
    router.push(`/${locale}/products/${productSlug}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      router.push(`/${locale}/products?search=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileSearchQuery('');
      setIsMobileSearchOpen(false);
    }
  };

  const handleMobileSuggestionClick = (productSlug: string) => {
    router.push(`/${locale}/products/${productSlug}`);
    setMobileSearchQuery('');
    setIsMobileSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-neutral-100">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group flex-shrink-0">
            {getSetting('use_logo_instead_of_text') === 'true' && getSetting('platform_logo') ? (
              <img 
                src={getSetting('platform_logo')} 
                alt={locale === 'ar' ? getSetting('platform_name_ar', 'بلوم كارت') : getSetting('platform_name', 'BloomCart')}
                className="h-8 w-auto"
              />
            ) : (
              <div className="text-2xl font-semibold tracking-tight" style={{ color: getSetting('primary_color', '#1f2937') }}>
                {locale === 'ar' ? getSetting('platform_name_ar', 'بلوم كارت') : getSetting('platform_name', 'BloomCart')}
              </div>
            )}
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
                placeholder={locale === 'en' ? 'Search for products...' : 'ابحث عن المنتجات...'}
                className="w-full px-4 py-2 pr-10 bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent text-sm transition-all"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-neutral-400 hover:text-neutral-600 transition-colors" />
                )}
              </button>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden z-50">
                  {suggestions.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSuggestionClick(product.slug)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors text-left border-b border-neutral-100 last:border-b-0"
                    >
                      {product.image_url ? (
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-neutral-100 flex items-center justify-center">
                          <Search className="w-5 h-5 text-neutral-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {product.name}
                        </p>
                        {product.category?.name && (
                          <p className="text-xs text-neutral-500 truncate">
                            {product.category.name}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <Price amount={product.price} className="text-sm font-semibold" />
                      </div>
                    </button>
                  ))}
                  {searchQuery.trim() && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSearch(e as any);
                      }}
                      className="w-full px-4 py-3 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors text-center border-t border-neutral-200"
                    >
                      {locale === 'en' 
                        ? `View all results for "${searchQuery}"` 
                        : `عرض جميع النتائج لـ "${searchQuery}"`}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Desktop Navigation */}
   
          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* User Links (Desktop) */}
            <div className="hidden md:flex items-center gap-1 flex-shrink-0">
              {/* Cart Button - Opens Modal */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                title={t('cart')}
              >
                <ShoppingBasket className="w-5 h-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs w-5 h-5 flex items-center justify-center font-bold rounded-full shadow-md">
                    {totalItems}
                  </span>
                )}
                <span className="hidden lg:inline text-sm">{t('cart')}</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={openWishlist}
                className="relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                title={t('wishlist')}
              >
                <Heart className="w-5 h-5" />
                {mounted && wishlistTotal > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center font-bold rounded-full shadow-md">
                    {wishlistTotal}
                  </span>
                )}
                <span className="hidden lg:inline text-sm">{t('wishlist')}</span>
              </button>

              {/* Admin Dashboard (Admin Only) */}
              {mounted && isAdmin && (
                <Link
                  href={`/${locale}/admin`}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="hidden lg:inline text-sm">Admin</span>
                </Link>
              )}

              {/* Account or Sign In */}
              {mounted && isLoggedIn ? (
                <Link
                  href={`/${locale}/account`}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                  title={t('account')}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline text-sm">{t('account')}</span>
                </Link>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                  title={locale === 'en' ? 'Sign In' : 'تسجيل الدخول'}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline text-sm">{locale === 'en' ? 'Sign In' : 'دخول'}</span>
                </Link>
              )}
            </div>

            {/* Mobile Icons */}
            <div className="flex md:hidden items-center gap-1">
              {/* Mobile Search Icon */}
              <button
                onClick={() => setIsMobileSearchOpen(true)}
                className="p-2 hover:bg-neutral-50 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-neutral-700" />
              </button>

              {/* Mobile Cart Icon */}
              <button
                onClick={openCart}
                className="relative p-2 hover:bg-neutral-50 rounded-lg transition-colors"
                aria-label="Cart"
              >
                <ShoppingBasket className="w-5 h-5 text-neutral-700" />
                {mounted && totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-neutral-900 text-white text-xs w-4 h-4 flex items-center justify-center font-bold rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-neutral-700" />
              ) : (
                <Menu className="w-6 h-6 text-neutral-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Slide-in Menu */}
            <div className="absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
              {/* Menu Header */}
              <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-700" />
                </button>
              </div>

              {/* Menu Content */}
              <div className="px-6 py-6 space-y-6">
                {/* Quick Actions */}
                <div>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        openWishlist();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5" />
                        <span>{t('wishlist')}</span>
                      </div>
                      {mounted && wishlistTotal > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                          {wishlistTotal}
                        </span>
                      )}
                    </button>

                    {mounted && isAdmin && (
                      <Link
                        href={`/${locale}/admin`}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Account Section */}
                <div className="pt-4 border-t border-neutral-100">
                  {mounted && isLoggedIn ? (
                    <Link
                      href={`/${locale}/account`}
                      className="flex items-center gap-3 px-4 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{t('account')}</p>
                        <p className="text-xs text-neutral-300">{profile?.name || profile?.email}</p>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      href={`/${locale}/login`}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>{locale === 'en' ? 'Sign In' : 'تسجيل الدخول'}</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Search Overlay */}
        {isMobileSearchOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-white">
            {/* Search Header */}
            <div className="sticky top-0 bg-white border-b border-neutral-100 px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setMobileSearchQuery('');
                  setMobileSuggestions([]);
                }}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-700" />
              </button>
              <form onSubmit={handleMobileSearch} className="flex-1 relative">
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder={locale === 'en' ? 'Search products...' : 'ابحث عن المنتجات...'}
                  className="w-full px-4 py-2.5 pr-10 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent text-sm"
                  autoFocus
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isMobileSearching ? (
                    <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 text-neutral-400" />
                  )}
                </button>
              </form>
            </div>

            {/* Search Results */}
            <div className="overflow-y-auto h-full pb-20">
              {mobileSearchQuery.length >= 2 && mobileSuggestions.length > 0 ? (
                <div className="px-4 py-4 space-y-2">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                    {locale === 'en' ? 'Suggestions' : 'اقتراحات'}
                  </p>
                  {mobileSuggestions.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleMobileSuggestionClick(product.slug)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors text-left border border-neutral-100"
                    >
                      {product.image_url ? (
                        <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 flex-shrink-0 rounded-lg bg-neutral-100 flex items-center justify-center">
                          <Search className="w-5 h-5 text-neutral-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {product.name}
                        </p>
                        {product.category?.name && (
                          <p className="text-xs text-neutral-500 truncate mt-0.5">
                            {product.category.name}
                          </p>
                        )}
                        <Price amount={product.price} className="text-sm font-semibold mt-1" />
                      </div>
                    </button>
                  ))}
                  {mobileSearchQuery.trim() && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleMobileSearch(e as any);
                      }}
                      className="w-full px-4 py-3 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors text-center border border-neutral-200 rounded-lg mt-3"
                    >
                      {locale === 'en' 
                        ? `View all results for "${mobileSearchQuery}"` 
                        : `عرض جميع النتائج لـ "${mobileSearchQuery}"`}
                    </button>
                  )}
                </div>
              ) : mobileSearchQuery.length >= 2 && mobileSuggestions.length === 0 && !isMobileSearching ? (
                <div className="px-4 py-12 text-center">
                  <Search className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-500">
                    {locale === 'en' ? 'No products found' : 'لم يتم العثور على منتجات'}
                  </p>
                </div>
              ) : (
                <div className="px-4 py-12 text-center">
                  <Search className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-500">
                    {locale === 'en' ? 'Start typing to search...' : 'ابدأ الكتابة للبحث...'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
