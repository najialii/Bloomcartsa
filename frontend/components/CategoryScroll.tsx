'use client';

import { useEffect, useState, useRef } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { categoriesApi } from '@/lib/api';
import type { Category } from '@/lib/types';

export default function CategoryScroll() {
  const locale = useLocale() as 'en' | 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll(locale);
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Set empty array to show at least the "All Categories" button
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [locale]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex gap-2 sm:gap-3 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 w-28 sm:w-32 bg-neutral-200 animate-pulse flex-shrink-0 rounded-xl skeleton"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="relative group">
          {/* Left Arrow - Enhanced Design */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl text-neutral-600 hover:text-neutral-900 rounded-full items-center justify-center transition-all duration-300 hidden group-hover:flex hover:scale-110 border border-neutral-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Categories Scroll - Enhanced */}
          <div
            ref={scrollRef}
            className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* All Categories Link - Enhanced */}
            <Link
              href={`/${locale}/categories`}
              className="flex-shrink-0 px-6 py-3 sm:px-7 sm:py-3.5 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-xl transition-all duration-300 whitespace-nowrap text-sm font-semibold hover:from-neutral-800 hover:to-neutral-700 shadow-lg hover:shadow-xl hover:scale-105 border border-neutral-700"
            >
              {locale === 'en' ? 'All Categories' : 'جميع الفئات'}
            </Link>

            {/* Category Links - Enhanced */}
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${locale}/categories/${category.slug}`}
                  className="flex-shrink-0 px-6 py-3 sm:px-7 sm:py-3.5 bg-white text-neutral-700 hover:bg-gradient-to-r hover:from-neutral-900 hover:to-neutral-800 hover:text-white rounded-xl transition-all duration-300 whitespace-nowrap text-sm font-medium shadow-md hover:shadow-xl border border-neutral-100 hover:border-neutral-700 hover:scale-105 group/item"
                >
                  <span className="transition-colors duration-300">
                    {category.name}
                  </span>
                </Link>
              ))
            ) : (
              // Fallback categories with enhanced styling
              [
                { name: locale === 'en' ? 'Flowers' : 'الزهور', icon: '🌹' },
                { name: locale === 'en' ? 'Gifts' : 'الهدايا', icon: '🎁' },
                { name: locale === 'en' ? 'Chocolates' : 'الشوكولاتة', icon: '🍫' },
                { name: locale === 'en' ? 'Perfumes' : 'العطور', icon: '🌸' },
                { name: locale === 'en' ? 'Accessories' : 'الإكسسوارات', icon: '💎' }
              ].map((cat) => (
                <Link
                  key={cat.name}
                  href={`/${locale}/products`}
                  className="flex-shrink-0 px-6 py-3 sm:px-7 sm:py-3.5 bg-white text-neutral-700 hover:bg-gradient-to-r hover:from-neutral-900 hover:to-neutral-800 hover:text-white rounded-xl transition-all duration-300 whitespace-nowrap text-sm font-medium shadow-md hover:shadow-xl border border-neutral-100 hover:border-neutral-700 hover:scale-105 group/item flex items-center gap-2"
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="transition-colors duration-300">
                    {cat.name}
                  </span>
                </Link>
              ))
            )}
          </div>

          {/* Right Arrow - Enhanced Design */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl text-neutral-600 hover:text-neutral-900 rounded-full items-center justify-center transition-all duration-300 hidden group-hover:flex hover:scale-110 border border-neutral-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
