'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { ChevronRight, Star } from 'lucide-react';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { getFullImageUrl } from '@/lib/imageUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  status: string;
}

interface FeaturedSubcategory {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  description?: string;
  description_ar?: string;
  category_id: number;
  featured_sort_order: number;
  category: {
    id: number;
    name: string;
    name_ar: string;
  };
  products: Product[];
}

export default function FeaturedSubcategories() {
  const locale = useLocale() as 'en' | 'ar';
  const [featuredSubcategories, setFeaturedSubcategories] = useState<FeaturedSubcategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedSubcategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/subcategories/featured`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setFeaturedSubcategories(result.data);
          }
        }
      } catch (error) {
        console.error('Error fetching featured subcategories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSubcategories();
  }, []);

  if (loading) {
    // Don't show loading skeleton to prevent flash
    return null;
  }

  if (featuredSubcategories.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Main Section Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <h2 className="text-2xl font-bold text-neutral-900">
              {locale === 'en' ? 'Featured Collections' : 'المجموعات المميزة'}
            </h2>
          </div>
          <p className="text-neutral-600 text-sm max-w-xl mx-auto">
            {locale === 'en' 
              ? 'Discover our handpicked collections of premium products'
              : 'اكتشف مجموعاتنا المختارة بعناية من المنتجات المميزة'
            }
          </p>
        </div>

        {/* Featured Subcategories */}
        <div className="space-y-8">
          {featuredSubcategories.map((subcategory) => (
            <div key={subcategory.id} className="space-y-4">
              {/* Subcategory Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {locale === 'ar' ? subcategory.name_ar : subcategory.name}
                  </h3>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {locale === 'ar' ? subcategory.category.name_ar : subcategory.category.name}
                  </span>
                </div>
                
                <Link
                  href={`/${locale}/products?subcategory=${subcategory.slug}`}
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1"
                >
                  <span className="text-sm font-medium">
                    {locale === 'en' ? 'View All' : 'عرض الكل'}
                  </span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Products Grid - Enhanced Mobile-Friendly Cards */}
              {subcategory.products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-3 md:gap-4">
                  {subcategory.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        image_url: getFullImageUrl(product.image_url),
                        status: product.status,
                        // Add default values for ProductCard compatibility
                        description: '',
                        stock_quantity: product.stock_quantity || 10, // Default to 10 if not provided
                        sku: product.sku || '',
                        subcategory_id: subcategory.id,
                        created_at: '',
                        updated_at: '',
                        sale_price: product.sale_price,
                      }}
                      locale={locale}
                      size="small"
                      showRating={false}
                      translations={{
                        inStock: locale === 'en' ? 'In Stock' : 'متوفر',
                        outOfStock: locale === 'en' ? 'Out of Stock' : 'غير متوفر',
                        addToCart: locale === 'en' ? 'Add to Cart' : 'أضف للسلة',
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-white rounded-lg border border-neutral-200">
                  <p className="text-neutral-500 text-sm">
                    {locale === 'en' 
                      ? 'No products available in this subcategory yet'
                      : 'لا توجد منتجات متاحة في هذا القسم الفرعي بعد'
                    }
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}