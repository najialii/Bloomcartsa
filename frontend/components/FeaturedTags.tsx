'use client';

import { useEffect, useState, useRef } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { 
  Heart, 
  Cake, 
  Flower2, 
  Shirt, 
  UserRound, 
  User, 
  Crown, 
  UserCheck, 
  UserPlus, 
  Users, 
  Baby, 
  Sparkles, 
  HeartHandshake, 
  Zap, 
  Diamond, 
  Flower, 
  Sun, 
  Leaf, 
  Snowflake,
  Gem,
  GraduationCap,
  Church,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Tag {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
  type: string;
  color: string;
  icon?: string;
  is_active: boolean;
  is_featured: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Icon mapping for better performance and type safety
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Heart,
  Cake,
  Flower2,
  Shirt,
  UserRound,
  User,
  Crown,
  UserCheck,
  UserPlus,
  Users,
  Baby,
  Sparkles,
  HeartHandshake,
  Zap,
  Diamond,
  Flower,
  Sun,
  Leaf,
  Snowflake,
  Gem,
  GraduationCap,
  Church,
};

export default function FeaturedTags() {
  const locale = useLocale() as 'en' | 'ar';
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeaturedTags = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tags/featured`, {
          headers: {
            'Accept-Language': locale,
          },
        });
        if (response.ok) {
          const result = await response.json();
          setTags(result.data || []);
        } else {
          console.error('Failed to fetch featured tags:', response.status);
        }
      } catch (error) {
        console.error('Error fetching featured tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTags();
  }, []);

  useEffect(() => {
    const checkScrollButtons = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [tags]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return <Heart className="w-5 h-5" />; // Default fallback
    
    const IconComponent = iconMap[iconName];
    
    if (IconComponent) {
      return <IconComponent className="w-5 h-5" />;
    }
    
    // Fallback to Heart icon if not found
    return <Heart className="w-5 h-5" />;
  };

  if (loading) {
    // Don't show loading skeleton to prevent flash
    return null;
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            {locale === 'en' ? 'Shop by Occasion' : 'تسوق حسب المناسبة'}
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            {locale === 'en' 
              ? 'Find the perfect gift for every special moment and person in your life'
              : 'اعثر على الهدية المثالية لكل لحظة مميزة وشخص في حياتك'
            }
          </p>
        </div>

        {/* Tags Container with Navigation */}
        <div className="relative mb-12">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-neutral-50 transition-colors"
              aria-label={locale === 'en' ? 'Scroll left' : 'التمرير لليسار'}
            >
              <ChevronLeft className="w-5 h-5 text-neutral-600" />
            </button>
          )}

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-neutral-50 transition-colors"
              aria-label={locale === 'en' ? 'Scroll right' : 'التمرير لليمين'}
            >
              <ChevronRight className="w-5 h-5 text-neutral-600" />
            </button>
          )}

          {/* Scrollable Tags Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          >
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/${locale}/products?tag=${tag.slug}`}
                className="group block flex-shrink-0"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-neutral-200 w-32">
                  <div 
                    className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: tag.color }}
                  >
                    {getIconComponent(tag.icon)}
                  </div>
                  
                  <h3 className="font-semibold text-neutral-900 text-sm mb-1 text-center leading-tight">
                    {locale === 'ar' ? tag.name_ar : tag.name_en}
                  </h3>
                  
                  <div className="text-xs text-neutral-500 text-center capitalize">
                    {tag.type === 'occasion' ? (locale === 'en' ? 'occasion' : 'مناسبة') : 
                     tag.type === 'giftee' ? (locale === 'en' ? 'giftee' : 'المهدى إليه') : 
                     tag.type.replace('_', ' ')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View All Products Button */}
        <div className="text-center">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center px-8 py-4 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-medium"
          >
            {locale === 'en' ? 'View All Products' : 'عرض جميع المنتجات'}
            <ArrowRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${
              locale === 'ar' ? 'mr-2 rotate-180' : 'ml-2'
            }`} />
          </Link>
        </div>
      </div>
    </section>
  );
}