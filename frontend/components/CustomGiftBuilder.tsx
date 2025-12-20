'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function CustomGiftBuilder() {
  const locale = useLocale();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-gray-900 mb-4">
            {locale === 'en' ? 'Create Your Custom Bouquet' : 'أنشئ باقتك المخصصة'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {locale === 'en' 
              ? 'Design a personalized bouquet that perfectly captures your sentiment'
              : 'صمم باقة شخصية تعبر عن مشاعرك بشكل مثالي'
            }
          </p>
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}/custom-bouquet`}
            className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            <span>{locale === 'en' ? 'Start Creating' : 'ابدأ الإنشاء'}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}