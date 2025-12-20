'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Calendar, Package, Star, TrendingUp } from 'lucide-react';
import Price from '@/components/Price';

export default function SubscriptionBox() {
  const locale = useLocale();

  const plans = [
    {
      name: locale === 'en' ? 'Weekly' : 'أسبوعي',
      price: '99',
      description: locale === 'en' ? 'Fresh flowers every week' : 'ورود طازجة كل أسبوع',
      features: [
        locale === 'en' ? 'Premium selection' : 'تشكيلة مميزة',
        locale === 'en' ? 'Free delivery' : 'توصيل مجاني',
        locale === 'en' ? 'Cancel anytime' : 'إلغاء في أي وقت',
      ],
    },
    {
      name: locale === 'en' ? 'Monthly' : 'شهري',
      price: '299',
      description: locale === 'en' ? 'Luxury bouquet monthly' : 'باقة فاخرة شهرياً',
      features: [
        locale === 'en' ? 'Designer arrangements' : 'تنسيقات مصممة',
        locale === 'en' ? 'Priority delivery' : 'توصيل أولوية',
        locale === 'en' ? 'Exclusive varieties' : 'أصناف حصرية',
      ],
      popular: true,
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 font-bold text-sm mb-4">
            <Star className="w-4 h-4" />
            {locale === 'en' ? 'NEW' : 'جديد'}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {locale === 'en' ? 'Flower Subscription' : 'اشتراك الورود'}
          </h2>
          <p className="text-neutral-300 text-lg max-w-2xl mx-auto">
            {locale === 'en' 
              ? 'Never run out of fresh flowers. Subscribe and save up to 20%' 
              : 'لا تنفد الورود الطازجة أبداً. اشترك ووفر حتى 20%'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white text-black p-8 border-4 ${
                plan.popular ? 'border-yellow-400' : 'border-white'
              } relative`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-6 py-1 font-bold text-sm">
                  {locale === 'en' ? 'MOST POPULAR' : 'الأكثر شعبية'}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <Price amount={Number(plan.price)} symbolClassName="w-8 h-8" className="text-4xl font-bold" showDecimals={false} />
                </div>
                <p className="text-sm text-neutral-600">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-black flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="font-semibold">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/subscription`}
                className={`block w-full text-center py-4 font-bold transition-all ${
                  plan.popular
                    ? 'bg-black text-white hover:bg-neutral-800'
                    : 'border-2 border-black hover:bg-black hover:text-white'
                }`}
              >
                {locale === 'en' ? 'Subscribe Now' : 'اشترك الآن'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
