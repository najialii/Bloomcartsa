'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedSubcategories from '@/components/FeaturedSubcategories';
import FeaturedTags from '@/components/FeaturedTags';
import CategoryScroll from '@/components/CategoryScroll';
import { productsApi } from '@/lib/api';
import type { Product } from '@/lib/types';

export default function HomePage() {
  const locale = useLocale() as 'en' | 'ar';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products only (disable home sections for now)
        const productsData = await productsApi.getAll(locale);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-1">
        {loading ? (
          // Show minimal loading without skeleton to prevent flash
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          // Always render static default components (disable dynamic sections for now)
          <>
            {/* Hero Slider */}
            <div className="bg-neutral-50">
              <div className="container mx-auto px-4 py-6">
                <div className="relative h-[350px] md:h-[420px] overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-700">
                  <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-8 md:px-12">
                      <div className="max-w-xl space-y-4 text-left">
                        <p className="text-sm md:text-base font-medium uppercase tracking-wide opacity-90 text-white">
                          {locale === 'en' ? 'Premium Quality' : 'جودة مميزة'}
                        </p>
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                          {locale === 'en' ? 'Beautiful Flowers & Gifts' : 'زهور وهدايا جميلة'}
                        </h2>
                        <div className="pt-2">
                          <a
                            href={`/${locale}/products`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 hover:bg-neutral-100 transition-colors font-semibold text-sm rounded-lg"
                          >
                            {locale === 'en' ? 'Shop Now' : 'تسوق الآن'}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Scroll - Horizontal categories under hero */}
            <CategoryScroll />

            {/* Featured Tags - تسوق حسب المناسبة */}
            <FeaturedTags />

            {/* Featured Subcategories */}
            <FeaturedSubcategories />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}