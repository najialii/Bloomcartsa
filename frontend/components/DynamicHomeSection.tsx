'use client';

import { useLocale } from 'next-intl';
import HeroSlider from './HeroGrid';
import Banner from './Banner';
import ProductRow from './ProductRow';
import FeaturedTags from './FeaturedTags';
import CategoryScroll from './CategoryScroll';
import FeaturedSubcategories from './FeaturedSubcategories';

interface HomeSectionProps {
  section: {
    id: number;
    name: string;
    type: string;
    title_en: string;
    title_ar: string;
    description_en?: string;
    description_ar?: string;
    settings: any;
    sort_order: number;
    is_active: boolean;
  };
  products?: any[];
}

export default function DynamicHomeSection({ section, products = [] }: HomeSectionProps) {
  const locale = useLocale() as 'en' | 'ar';

  if (!section.is_active) {
    return null;
  }

  const title = locale === 'ar' ? section.title_ar : section.title_en;
  const description = locale === 'ar' ? section.description_ar : section.description_en;

  switch (section.type) {
    case 'hero_slider':
      return <HeroSlider />;

    case 'banner':
      const bannerType = section.settings?.banner_type || 'promotional';
      const position = section.settings?.position || 'top';
      const layout = section.settings?.layout || 'grid';
      const columns = section.settings?.columns || 2;
      
      return (
        <div className="container mx-auto px-4 py-6">
          <Banner 
            type={bannerType}
            position={position}
            className={layout === 'grid' ? `grid grid-cols-1 md:grid-cols-${Math.min(columns, 4)} gap-4` : ''}
          />
        </div>
      );

    case 'product_row':
      const categoryFilter = section.settings?.category_filter;
      const productCount = section.settings?.product_count || 4;
      
      // Filter products based on category if specified
      let filteredProducts = products;
      if (categoryFilter && categoryFilter !== 'featured') {
        filteredProducts = products.filter(p => 
          p.category?.slug?.includes(categoryFilter) || 
          p.subcategory?.slug?.includes(categoryFilter)
        );
      }
      
      // Limit to specified count
      filteredProducts = filteredProducts.slice(0, productCount);

      if (filteredProducts.length === 0) {
        return null;
      }

      return (
        <ProductRow
          title={title}
          titleAr={locale === 'ar' ? title : section.title_ar}
          products={filteredProducts}
          categorySlug={categoryFilter || 'featured'}
        />
      );

    case 'featured_tags':
      return <FeaturedTags />;

    case 'featured_subcategories':
      return <FeaturedSubcategories />;

    case 'custom':
      // Handle custom sections based on name
      if (section.name === 'category_scroll') {
        return <CategoryScroll />;
      }
      
      // Default custom section rendering
      return (
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            {description && (
              <p className="text-gray-600 mb-4">{description}</p>
            )}
            <div className="bg-gray-100 rounded-lg p-8">
              <p className="text-gray-500">
                {locale === 'en' 
                  ? 'Custom section content will be implemented here'
                  : 'سيتم تنفيذ محتوى القسم المخصص هنا'
                }
              </p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}