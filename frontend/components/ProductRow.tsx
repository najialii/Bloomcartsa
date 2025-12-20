'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, ShoppingBasket, Heart, Plus, Minus } from 'lucide-react';
import Price from '@/components/Price';
import { useCartStore } from '@/lib/cartStore';
import { useWishlistStore } from '@/lib/wishlistStore';
import { getPlaceholderImageUrl } from '@/lib/imageUtils';
import type { Product } from '@/lib/types';

interface ProductRowProps {
  title: string;
  titleAr: string;
  products: Product[];
  categorySlug: string;
}

export default function ProductRow({ title, titleAr, products, categorySlug }: ProductRowProps) {
  const locale = useLocale();
  const { addItem, items, updateQuantity } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    });
  };

  const handleIncrement = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartItem = items.find(item => item.productId === productId);
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartItem = items.find(item => item.productId === productId);
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(cartItem.id, cartItem.quantity - 1);
      } else {
        updateQuantity(cartItem.id, 0);
      }
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image_url: product.image_url,
    });
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-medium text-neutral-800">
            {locale === 'en' ? title : titleAr}
          </h2>
          <Link
            href={`/${locale}/products?category=${categorySlug}`}
            className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1 group"
          >
            {locale === 'en' ? 'View All' : 'عرض الكل'}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Products Grid - Enhanced Mobile-Friendly Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-3 md:gap-4">
          {products.slice(0, 4).map((product) => {
            const inWishlist = isInWishlist(product.id);
            const cartItem = items.find(item => item.productId === product.id);
            const quantityInCart = cartItem?.quantity || 0;
            
            return (
              <div key={product.id} className="group w-full">
                <Link href={`/${locale}/products/${product.slug}`}>
                  <div className="bg-white hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden border border-neutral-100 hover:border-neutral-200 relative">
                    
                    {/* Stock Badge */}
                    {product.stock_quantity === 0 && (
                      <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        {locale === 'en' ? 'Out of Stock' : 'غير متوفر'}
                      </div>
                    )}

                    {/* Product Image - Enhanced */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = getPlaceholderImageUrl(product.name);
                        }}
                        loading="lazy"
                      />
                      
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Wishlist Button - Enhanced */}
                      <button
                        onClick={(e) => handleToggleWishlist(e, product)}
                        className={`absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm ${
                          inWishlist 
                            ? 'bg-red-500 text-white scale-110' 
                            : 'bg-white/90 text-neutral-600 hover:bg-red-50 hover:text-red-500 hover:scale-110'
                        }`}
                        title={locale === 'en' ? 'Add to wishlist' : 'أضف للمفضلة'}
                      >
                        <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${inWishlist ? 'fill-current' : ''}`} />
                      </button>

                      {/* Quick Add to Cart on Hover - Desktop Only */}
                      <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:block">
                        {quantityInCart > 0 ? (
                          <div className="flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
                            <button
                              onClick={(e) => handleDecrement(e, product.id)}
                              className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-semibold text-neutral-900 min-w-[20px] text-center text-sm">
                              {quantityInCart}
                            </span>
                            <button
                              onClick={(e) => handleIncrement(e, product.id)}
                              disabled={quantityInCart >= product.stock_quantity}
                              className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={product.stock_quantity === 0}
                            className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white py-2.5 rounded-full font-medium transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            <ShoppingBasket className="w-3.5 h-3.5" />
                            {locale === 'en' ? 'Quick Add' : 'إضافة سريعة'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Product Info - Enhanced */}
                    <div className="p-3 sm:p-4 bg-white">
                      <h3 className="text-xs sm:text-sm font-medium text-neutral-800 mb-3 line-clamp-2 group-hover:text-neutral-900 transition-colors leading-tight">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm sm:text-base font-bold text-neutral-900">
                          <Price amount={product.price} symbolClassName="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>

                        {/* Mobile Add to Cart / Quantity Controls */}
                        <div className="sm:hidden">
                          {quantityInCart > 0 ? (
                            <div className="flex items-center gap-1 bg-neutral-900 text-white rounded-full px-2 py-1">
                              <button
                                onClick={(e) => handleDecrement(e, product.id)}
                                className="hover:bg-neutral-700 rounded-full p-0.5 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-semibold min-w-[20px] text-center">
                                {quantityInCart}
                              </span>
                              <button
                                onClick={(e) => handleIncrement(e, product.id)}
                                disabled={quantityInCart >= product.stock_quantity}
                                className="hover:bg-neutral-700 rounded-full p-0.5 transition-colors disabled:opacity-50"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => handleAddToCart(e, product)}
                              disabled={product.stock_quantity === 0}
                              className="flex items-center justify-center w-8 h-8 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ShoppingBasket className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Stock Status */}
                      {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                        <div className="mt-2 text-xs text-orange-600 font-medium">
                          {locale === 'en' ? `Only ${product.stock_quantity} left` : `${product.stock_quantity} فقط متبقي`}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
