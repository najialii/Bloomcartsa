'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Heart, Cake, Flower2, Award, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

export default function OccasionsSection() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const occasions = [
    {
      icon: Heart,
      title: locale === 'en' ? 'Romantic' : 'رومانسي',
      subtitle: locale === 'en' ? 'Love & Romance' : 'الحب والرومانسية',
      description: locale === 'en' ? 'Express your deepest feelings' : 'عبر عن أعمق مشاعرك',
      gradient: 'from-rose-500 to-pink-600',
      bgColor: 'bg-gradient-to-br from-rose-50 to-pink-50',
      iconBg: 'bg-gradient-to-br from-rose-100 to-pink-100',
      href: '/products?occasion=romantic',
      count: '50+ Items',
      countAr: '50+ منتج',
    },
    {
      icon: Cake,
      title: locale === 'en' ? 'Birthday' : 'عيد ميلاد',
      subtitle: locale === 'en' ? 'Celebrate Special Days' : 'احتفل بالأيام المميزة',
      description: locale === 'en' ? 'Make birthdays unforgettable' : 'اجعل أعياد الميلاد لا تُنسى',
      gradient: 'from-amber-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      iconBg: 'bg-gradient-to-br from-amber-100 to-orange-100',
      href: '/products?occasion=birthday',
      count: '75+ Items',
      countAr: '75+ منتج',
    },
    {
      icon: Flower2,
      title: locale === 'en' ? 'Congratulations' : 'تهنئة',
      subtitle: locale === 'en' ? 'Success & Achievements' : 'النجاح والإنجازات',
      description: locale === 'en' ? 'Celebrate their success' : 'احتفل بنجاحهم',
      gradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-100',
      href: '/products?occasion=congratulations',
      count: '40+ Items',
      countAr: '40+ منتج',
    },
    {
      icon: Award,
      title: locale === 'en' ? 'Corporate' : 'شركات',
      subtitle: locale === 'en' ? 'Business Gifts' : 'هدايا الأعمال',
      description: locale === 'en' ? 'Professional gift solutions' : 'حلول هدايا احترافية',
      gradient: 'from-slate-600 to-gray-700',
      bgColor: 'bg-gradient-to-br from-slate-50 to-gray-50',
      iconBg: 'bg-gradient-to-br from-slate-100 to-gray-100',
      href: '/products?occasion=corporate',
      count: '30+ Items',
      countAr: '30+ منتج',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-neutral-900 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-neutral-900 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-neutral-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-neutral-600" />
            <span className="text-sm font-medium text-neutral-700">
              {locale === 'en' ? 'Curated Collections' : 'مجموعات مختارة'}
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-neutral-900 leading-tight">
            {locale === 'en' ? (
              <>
                Shop by <span className="bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">Occasion</span>
              </>
            ) : (
              <>
                <span className="bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">تسوق حسب</span> المناسبة
              </>
            )}
          </h2>
          
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            {locale === 'en' 
              ? 'Discover the perfect gift for every special moment. Thoughtfully curated collections for life\'s most meaningful celebrations.'
              : 'اكتشف الهدية المثالية لكل لحظة مميزة. مجموعات مختارة بعناية لأهم احتفالات الحياة.'
            }
          </p>
        </div>

        {/* Occasions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {occasions.map((occasion, index) => {
            const Icon = occasion.icon;
            const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
            
            return (
              <Link
                key={index}
                href={`/${locale}${occasion.href}`}
                className="group relative block"
              >
                <div className={`
                  relative overflow-hidden rounded-2xl ${occasion.bgColor} 
                  border border-neutral-200/50 backdrop-blur-sm
                  transition-all duration-500 ease-out
                  hover:shadow-2xl hover:shadow-neutral-900/10
                  hover:-translate-y-2 hover:scale-[1.02]
                  transform-gpu
                `}>
                  {/* Gradient Overlay */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${occasion.gradient} 
                    opacity-0 group-hover:opacity-10 transition-opacity duration-500
                  `} />
                  
                  {/* Content */}
                  <div className="relative p-6 lg:p-8">
                    {/* Icon */}
                    <div className={`
                      w-16 h-16 ${occasion.iconBg} rounded-2xl 
                      flex items-center justify-center mb-6
                      group-hover:scale-110 transition-transform duration-300
                      shadow-sm group-hover:shadow-md
                    `}>
                      <Icon className="w-8 h-8 text-neutral-700 group-hover:text-neutral-900 transition-colors" />
                    </div>

                    {/* Text Content */}
                    <div className="space-y-3 mb-6">
                      <h3 className="text-xl lg:text-2xl font-bold text-neutral-900 group-hover:text-neutral-800 transition-colors">
                        {occasion.title}
                      </h3>
                      <p className="text-sm font-medium text-neutral-600 group-hover:text-neutral-700 transition-colors">
                        {occasion.subtitle}
                      </p>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {occasion.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-400 group-hover:text-neutral-500 transition-colors">
                        {locale === 'en' ? occasion.count : occasion.countAr}
                      </span>
                      
                      <div className="flex items-center gap-2 text-neutral-600 group-hover:text-neutral-900 transition-colors">
                        <span className="text-sm font-medium">
                          {locale === 'en' ? 'Explore' : 'استكشف'}
                        </span>
                        <ArrowIcon className={`
                          w-4 h-4 transition-transform duration-300
                          group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'}
                        `} />
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-neutral-200 transition-colors duration-300" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-neutral-800 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-900/25 group"
          >
            <span>{locale === 'en' ? 'View All Collections' : 'عرض جميع المجموعات'}</span>
            <ArrowRight className={`w-5 h-5 transition-transform group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </section>
  );
}
