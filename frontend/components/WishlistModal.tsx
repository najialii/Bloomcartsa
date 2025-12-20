'use client';

import { X, Heart, ShoppingBasket } from 'lucide-react';
import { useWishlistStore } from '@/lib/wishlistStore';
import { useCartStore } from '@/lib/cartStore';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Price from '@/components/Price';
import Image from 'next/image';

export default function WishlistModal() {
  const locale = useLocale() as 'en' | 'ar';
  const { items, isOpen, closeWishlist, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  if (!isOpen) return null;

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      price: item.price,
      image_url: item.image_url,
      sku: '',
      quantity: 1,
    });
    removeItem(item.productId);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={closeWishlist}
      />

      {/* Modal */}
      <div className={`fixed top-0 ${locale === 'ar' ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-neutral-900">
            <Heart className="w-5 h-5 " />
            {locale === 'en' ? 'My Wishlist' : 'قائمة الأمنيات'}
          </h2>
          <button
            onClick={closeWishlist}
            className="p-2 hover:bg-neutral-50 rounded-lg transition-colors"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-14 h-14 mx-auto mb-3 text-neutral-300" />
              <p className="text-neutral-500 text-base">
                {locale === 'en' ? 'Your wishlist is empty' : 'قائمة الأمنيات فارغة'}
              </p>
              <p className="text-neutral-400 text-sm mt-2">
                {locale === 'en' 
                  ? 'Add items you love to your wishlist' 
                  : 'أضف المنتجات التي تحبها إلى قائمة الأمنيات'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 border border-neutral-100 rounded-lg p-3 hover:shadow-md transition-shadow">
                  {/* Product Image */}
                  <Link
                    href={`/${locale}/products/${item.slug}`}
                    onClick={closeWishlist}
                    className="relative w-20 h-20 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/80x80/f5f5f5/737373/?text=${encodeURIComponent(item.name.substring(0, 10))}`;
                      }}
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${locale}/products/${item.slug}`}
                      onClick={closeWishlist}
                      className="font-medium text-sm hover:text-neutral-600 transition-colors block line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-1">
                      <Price amount={item.price} className="text-sm font-semibold" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors"
                      >
                        <ShoppingBasket className="w-3.5 h-3.5" />
                        <span>{locale === 'en' ? 'Add to Cart' : 'أضف للسلة'}</span>
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title={locale === 'en' ? 'Remove' : 'إزالة'}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-neutral-100 p-5 space-y-3">
            <div className="text-sm text-neutral-600 text-center">
              {items.length} {locale === 'en' ? 'item(s) in your wishlist' : 'منتج في قائمة الأمنيات'}
            </div>
            <button
              onClick={closeWishlist}
              className="block w-full py-3 border border-neutral-200 text-center text-sm font-medium hover:bg-neutral-50 transition-colors text-neutral-700 rounded-lg"
            >
              {locale === 'en' ? 'Continue Shopping' : 'متابعة التسوق'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
