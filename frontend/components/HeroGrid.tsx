'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  mobile_image_url?: string;
  link_url?: string;
  link_text?: string;
  background_color?: string;
  text_color?: string;
  text_alignment: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function HeroSlider() {
  const locale = useLocale();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback slides if no banners are available
  const fallbackSlides = [
    {
      title: locale === 'en' ? 'Premium Flowers' : 'زهور فاخرة',
      subtitle: locale === 'en' ? 'Fresh blooms for every occasion' : 'زهور طازجة لكل مناسبة',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
      link: '/products',
    },
    {
      title: locale === 'en' ? 'Luxury Gifts' : 'هدايا فاخرة',
      subtitle: locale === 'en' ? 'Curated for special moments' : 'منسقة للحظات الخاصة',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=80',
      link: '/products',
    },
    {
      title: locale === 'en' ? 'Elegant Bouquets' : 'باقات أنيقة',
      subtitle: locale === 'en' ? 'Handcrafted with care' : 'مصنوعة بعناية',
      image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&q=80',
      link: '/products',
    },
  ];

  useEffect(() => {
    const fetchHeroBanners = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/banners/type/hero_slider`, {
          headers: {
            'Accept-Language': locale,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data.length > 0) {
            setBanners(result.data);
          }
        }
      } catch (error) {
        console.error('Error fetching hero banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroBanners();
  }, [locale]);

  const slides = banners.length > 0 ? banners : fallbackSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="bg-neutral-50 py-6">
      <div className="container mx-auto px-4">
        <div className="relative h-[350px] md:h-[420px] overflow-hidden">
          {slides.map((slide, index) => {
            // Handle both banner objects and fallback slide objects
            const isBanner = 'id' in slide;
            const title = isBanner ? slide.title : slide.title;
            const description = isBanner ? slide.description : slide.subtitle;
            const image = isBanner ? slide.image_url : slide.image;
            const linkUrl = isBanner ? slide.link_url : `/${locale}${slide.link}`;
            const linkText = isBanner ? slide.link_text : (locale === 'en' ? 'Shop Now' : 'تسوق الآن');
            const textColor = isBanner ? slide.text_color : '#ffffff';
            const backgroundColor = isBanner ? slide.background_color : null;
            const textAlignment = isBanner ? slide.text_alignment : 'left';

            return (
              <div
                key={isBanner ? slide.id : index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={backgroundColor ? { backgroundColor } : undefined}
              >
                {/* Background Image */}
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80';
                  }}
                />
                
                {/* Overlay - only show if no custom background color */}
                {!backgroundColor && (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                )}
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-8 md:px-12">
                    <div 
                      className={`max-w-xl space-y-4 ${
                        textAlignment === 'center' ? 'text-center mx-auto' : 
                        textAlignment === 'right' ? 'text-right ml-auto' : 
                        'text-left'
                      }`}
                    >
                      {description && (
                        <p 
                          className="text-sm md:text-base font-medium uppercase tracking-wide opacity-90"
                          style={{ color: textColor || '#ffffff' }}
                        >
                          {description}
                        </p>
                      )}
                      <h2 
                        className="text-4xl md:text-5xl font-bold leading-tight"
                        style={{ color: textColor || '#ffffff' }}
                      >
                        {title}
                      </h2>
                      {linkUrl && linkText && (
                        <div className="pt-2">
                          <Link
                            href={linkUrl}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 hover:bg-neutral-100 transition-colors font-semibold text-sm group"
                          >
                            {linkText}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1 transition-all ${
                  index === currentSlide ? 'w-10 bg-white' : 'w-6 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
