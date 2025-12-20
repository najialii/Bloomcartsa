'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { productsApi } from '@/lib/api';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const locale = useLocale() as 'en' | 'ar';
  const t = useTranslations('product');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getAll(locale);
        // Show only first 12 products as featured
        setProducts(data.slice(0, 12));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [locale]);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-neutral-200 rounded-lg w-48 skeleton"></div>
            <div className="h-6 bg-neutral-200 rounded-lg w-20 skeleton"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden border border-neutral-100 skeleton"
              >
                <div className="w-full aspect-[3/4] bg-neutral-200"></div>
                <div className="p-3 sm:p-4">
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2 mb-3"></div>
                  <div className="h-6 bg-neutral-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 text-rendering-optimized">
            {locale === 'en' ? 'Featured Products' : 'المنتجات المميزة'}
          </h2>
          <Link
            href={`/${locale}/products`}
            className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1 group focus-ring rounded-lg px-2 py-1"
          >
            {locale === 'en' ? 'View All' : 'عرض الكل'}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Products Grid - Enhanced Mobile Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              size="small"
              showRating={false}
              translations={{
                inStock: t('inStock'),
                outOfStock: t('outOfStock'),
                addToCart: t('addToCart'),
              }}
            />
          ))}
        </div>

        {/* Show More Button for Mobile */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors focus-ring"
          >
            {locale === 'en' ? 'View All Products' : 'عرض جميع المنتجات'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
