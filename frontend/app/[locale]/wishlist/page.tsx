'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Heart, X, ShoppingBasket } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Price from '@/components/Price';
import { useWishlistStore } from '@/lib/wishlistStore';
import { useCartStore } from '@/lib/cartStore';

export default function WishlistPage() {
  const locale = useLocale() as 'en' | 'ar';
  const { items, loading, fetchWishlist, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleAddToCart = (item: any) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: item.image_url,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-600">{locale === 'en' ? 'Loading wishlist...' : 'جاري تحميل قائمة الأمنيات...'}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            href={`/${locale}/account`}
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {locale === 'en' ? 'Back to Account' : 'العودة إلى الحساب'}
          </Link>

          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {locale === 'en' ? 'My Wishlist' : 'قائمة أمنياتي'}
            </h1>
            {items.length > 0 && (
              <p className="text-neutral-600">
                {items.length} {locale === 'en' ? 'items' : 'عنصر'}
              </p>
            )}
          </div>

          {items.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-semibold mb-2">
                {locale === 'en' ? 'Your wishlist is empty' : 'قائمة أمنياتك فارغة'}
              </h2>
              <p className="text-gray-600 mb-6">
                {locale === 'en' 
                  ? 'Save your favorite items for later'
                  : 'احفظ العناصر المفضلة لديك لوقت لاحق'}
              </p>
              <Link
                href={`/${locale}/products`}
                className="inline-block px-8 py-4 bg-black text-white hover:bg-gray-800 transition-all font-medium"
              >
                {locale === 'en' ? 'Browse Products' : 'تصفح المنتجات'}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.productId} className="bg-white border border-gray-200 overflow-hidden group relative">
                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                    title={locale === 'en' ? 'Remove from wishlist' : 'إزالة من قائمة الأمنيات'}
                  >
                    <X className="w-4 h-4 text-neutral-600 hover:text-red-600" />
                  </button>

                  {/* Product Image */}
                  <Link href={`/${locale}/products/${item.slug}`} className="block">
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Heart className="w-16 h-16 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link href={`/${locale}/products/${item.slug}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-neutral-600 transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <Price amount={item.price} className="text-xl font-bold mb-4" />
                    
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white hover:bg-gray-800 transition-colors font-medium"
                    >
                      <ShoppingBasket className="w-4 h-4" />
                      {locale === 'en' ? 'Add to Cart' : 'أضف إلى السلة'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
