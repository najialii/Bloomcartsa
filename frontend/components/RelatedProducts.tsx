'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ShoppingBasket, Heart } from 'lucide-react';
import { productsApi } from '@/lib/api';
import { useCartStore } from '@/lib/cartStore';
import { useWishlistStore } from '@/lib/wishlistStore';
import { getPlaceholderImageUrl } from '@/lib/imageUtils';
import type { Product } from '@/lib/types';
import Price from '@/components/Price';

interface RelatedProductsProps {
  productSlug: string;
}

export default function RelatedProducts({ productSlug }: RelatedProductsProps) {
  const locale = useLocale() as 'en' | 'ar';
  const t = useTranslations('product');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const data = await productsApi.getRelated(productSlug, locale);
        setRelatedProducts(data);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productSlug) {
      fetchRelatedProducts();
    }
  }, [productSlug, locale]);

  const handleAddToCart = (product: Product) => {
    if (product.stock_quantity === 0) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image_url: product.image_url,
      sku: product.sku,
      quantity: 1,
    });
  };

  const handleToggleWishlist = (product: Product) => {
    toggleItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image_url: product.image_url,
    });
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            {t('youMayAlsoLike')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!relatedProducts.length) {
    return null;
  }

  return (
    <div className="py-12 bg-neutral-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-neutral-900">
          {t('youMayAlsoLike')}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <div key={product.id} className="group w-full bg-white rounded-xl overflow-hidden border border-neutral-100 hover:shadow-xl transition-all duration-300 hover:border-neutral-200 relative">
              
              {/* Stock Badge */}
              {product.stock_quantity === 0 && (
                <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {locale === 'en' ? 'Out of Stock' : 'غير متوفر'}
                </div>
              )}

              {/* Product Image - Enhanced */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100">
                <Link href={`/${locale}/products/${product.slug}`}>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderImageUrl(product.name);
                    }}
                    loading="lazy"
                  />
                </Link>
                
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Wishlist Button - Enhanced */}
                <button
                  onClick={() => handleToggleWishlist(product)}
                  className={`absolute top-3 right-3 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm ${
                    isInWishlist(product.id) 
                      ? 'bg-red-500 text-white scale-110' 
                      : 'bg-white/90 text-neutral-600 hover:bg-red-50 hover:text-red-500 hover:scale-110'
                  }`}
                >
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </button>

                {/* Quick Add to Cart on Hover - Desktop Only */}
                <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:block">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock_quantity === 0}
                    className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white py-3 rounded-full font-medium transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBasket className="w-4 h-4" />
                    {locale === 'en' ? 'Quick Add' : 'إضافة سريعة'}
                  </button>
                </div>
              </div>

              {/* Product Info - Enhanced */}
              <div className="p-4 sm:p-5">
                <Link href={`/${locale}/products/${product.slug}`}>
                  <h3 className="font-medium text-neutral-900 mb-3 line-clamp-2 hover:text-neutral-700 transition-colors leading-tight">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between mb-4">
                  <Price amount={product.price} className="text-lg font-bold text-neutral-900" />
                  {product.category && (
                    <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
                      {product.category.name}
                    </span>
                  )}
                </div>

                {/* Mobile Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock_quantity === 0}
                  className="w-full sm:hidden flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-medium rounded-xl disabled:bg-neutral-300 disabled:cursor-not-allowed"
                >
                  <ShoppingBasket className="w-4 h-4" />
                  {locale === 'en' ? 'Add to Cart' : 'أضف إلى السلة'}
                </button>

                {/* Stock Status */}
                {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                  <div className="mt-2 text-xs text-orange-600 font-medium">
                    {locale === 'en' ? `Only ${product.stock_quantity} left` : `${product.stock_quantity} فقط متبقي`}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}