'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingBasket, Heart, Minus, Plus, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RelatedProducts from '@/components/RelatedProducts';
import { productsApi } from '@/lib/api';
import { useCartStore } from '@/lib/cartStore';
import { useWishlistStore } from '@/lib/wishlistStore';
import type { Product } from '@/lib/types';
import Price from '@/components/Price';

export default function ProductDetailPage() {
  const params = useParams();
  const locale = useLocale() as 'en' | 'ar';
  const t = useTranslations('product');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const { addItem, items, updateQuantity: updateCartQuantity } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const slug = params.slug as string;
        const data = await productsApi.getBySlug(slug, locale);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug, locale]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-gray-200 h-96 lg:h-[600px]"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 w-3/4"></div>
                <div className="h-6 bg-gray-200 w-1/4"></div>
                <div className="h-24 bg-gray-200"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('notFound')}</h1>
            <p className="text-neutral-600">{t('notFoundDesc')}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const cartItem = items.find((item) => item.productId === product.id);
  const quantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (product.stock_quantity === 0) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image_url: product.image_url,
      sku: product.sku,
      quantity: quantity,
    });
  };

  const handleToggleWishlist = () => {
    toggleItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image_url: product.image_url,
    });

    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Product Image */}
          <div className="relative bg-white rounded-lg overflow-hidden border border-neutral-100">
            <div className="aspect-square relative bg-neutral-50 p-6">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/800x800/f5f5f5/cccccc/?text=${encodeURIComponent(product.name)}`;
                }}
              />
              {/* Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                className={`absolute top-10 right-10 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  inWishlist 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-neutral-600 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                <Heart 
                  className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''} ${isHeartAnimating ? 'animate-heart-beat' : ''}`} 
                />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold mb-3 text-neutral-900 leading-tight">
                {product.name}
              </h1>
              <div className="text-3xl md:text-4xl font-bold text-neutral-900">
                <Price amount={product.price} className="text-3xl md:text-4xl" />
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock_quantity > 0 ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-neutral-600">
                    {locale === 'en' ? 'In Stock' : 'متوفر'} ({product.stock_quantity} {locale === 'en' ? 'available' : 'متاح'})
                  </p>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-sm text-red-600">{locale === 'en' ? 'Out of Stock' : 'غير متوفر'}</p>
                </>
              )}
            </div>

            {/* Description */}
            <div className="py-4 border-y border-neutral-100">
              <p className="text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            {product.stock_quantity > 0 && quantityInCart === 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-neutral-700">{locale === 'en' ? 'Quantity' : 'الكمية'}:</span>
                <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-neutral-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 border-x border-neutral-200 min-w-[60px] text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="p-3 hover:bg-neutral-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              {quantityInCart > 0 ? (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">
                      {locale === 'en' ? `${quantityInCart} in cart` : `${quantityInCart} في السلة`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => cartItem && updateCartQuantity(cartItem.id, quantityInCart - 1)}
                      className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => cartItem && quantityInCart < product.stock_quantity && updateCartQuantity(cartItem.id, quantityInCart + 1)}
                      disabled={quantityInCart >= product.stock_quantity}
                      className="p-2 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-medium rounded-lg disabled:bg-neutral-300 disabled:cursor-not-allowed"
                >
                  <ShoppingBasket className="w-5 h-5" />
                  {locale === 'en' ? 'Add to Cart' : 'أضف إلى السلة'}
                </button>
              )}
            </div>

            {/* Product Meta */}
            <div className="pt-4 border-t border-neutral-100 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">{locale === 'en' ? 'SKU' : 'رمز المنتج'}:</span>
                <span className="font-medium text-neutral-900">{product.sku}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">{locale === 'en' ? 'Category' : 'الفئة'}:</span>
                <span className="font-medium text-neutral-900">{product.category?.name || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Related Products Section */}
      <RelatedProducts productSlug={params.slug as string} />

      <Footer />
    </div>
  );
}
