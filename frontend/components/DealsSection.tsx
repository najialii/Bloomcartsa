'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Tag, TrendingUp, Zap } from 'lucide-react';

export default function DealsSection() {
  const locale = useLocale();

  const deals = [
    {
      icon: Tag,
      title: locale === 'en' ? 'Daily Deals' : 'عروض يومية',
      desc: locale === 'en' ? 'Up to 50% off' : 'خصم حتى 50%',
      color: 'bg-primary',
    },
    {
      icon: TrendingUp,
      title: locale === 'en' ? 'Best Sellers' : 'الأكثر مبيعاً',
      desc: locale === 'en' ? 'Top rated items' : 'منتجات عالية التقييم',
      color: 'bg-neutral-800',
    },
    {
      icon: Zap,
      title: locale === 'en' ? 'Flash Sale' : 'تخفيضات سريعة',
      desc: locale === 'en' ? 'Limited time' : 'وقت محدود',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="bg-white py-8 border-y border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deals.map((deal, index) => {
            const Icon = deal.icon;
            return (
              <Link
                key={index}
                href={`/${locale}/deals`}
                className="group relative overflow-hidden p-6 text-white hover:scale-105 transition-transform duration-300 shadow-md"
              >
                <div className={`absolute inset-0 ${deal.color}`} />
                <div className="relative flex items-center gap-4">
                  <div className="bg-white/20 p-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{deal.title}</h3>
                    <p className="text-sm opacity-90">{deal.desc}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
