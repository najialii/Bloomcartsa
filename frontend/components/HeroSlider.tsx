'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Slide {
  id: number;
  title: { en: string; ar: string };
  subtitle: { en: string; ar: string };
  cta: { en: string; ar: string };
  link: string;
  image: string;
  textColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: { en: 'Beautiful Flowers', ar: 'زهور جميلة' },
    subtitle: { en: 'Fresh blooms for every occasion', ar: 'زهور طازجة لكل المناسبات' },
    cta: { en: 'Shop Flowers', ar: 'تسوق الزهور' },
    link: '/categories/flowers',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&h=600&fit=crop',
    textColor: 'text-white',
  },
  {
    id: 2,
    title: { en: 'Elegant Gifts', ar: 'هدايا أنيقة' },
    subtitle: { en: 'Thoughtful presents that make memories', ar: 'هدايا مميزة تصنع الذكريات' },
    cta: { en: 'Explore Gifts', ar: 'استكشف الهدايا' },
    link: '/categories/gifts',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1920&h=600&fit=crop',
    textColor: 'text-white',
  },
  {
    id: 3,
    title: { en: 'Special Occasions', ar: 'مناسبات خاصة' },
    subtitle: { en: 'Celebrate life\'s precious moments', ar: 'احتفل باللحظات الثمينة' },
    cta: { en: 'Shop Now', ar: 'تسوق الآن' },
    link: '/products',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1920&h=600&fit=crop',
    textColor: 'text-white',
  },
];

export default function HeroSlider({ locale = 'en' }: { locale?: string }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 translate-x-0'
                : index < currentSlide
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
          >
            <div className="relative h-full flex items-center justify-center">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40" />
              </div>
              
              {/* Content */}
              <div className="relative container mx-auto px-4 z-10">
                    href={`/${locale}${slide.link}`}
                    className={`group inline-flex items-center gap-2 px-8 py-4 ${
                      slide.textColor === 'text-white'
                        ? 'bg-white text-neutral-900 hover:bg-neutral-100'
                        : 'bg-neutral-900 text-white hover:bg-neutral-800'
                    } transition-all font-medium`}
                  >
                    {locale === 'ar' ? slide.cta.ar : slide.cta.en}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-neutral-900 flex items-center justify-center transition-all z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-neutral-900 flex items-center justify-center transition-all z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
