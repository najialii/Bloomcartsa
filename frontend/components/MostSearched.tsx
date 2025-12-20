'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function MostSearched() {
  const locale = useLocale();

  const tags = [
    'Red Roses',
    'White Roses',
    'Pink Roses',
    'Yellow Roses',
    'Mixed Bouquet',
    'Birthday Flowers',
    'Anniversary Gifts',
    'Chocolate Box',
    'Teddy Bear',
    'Gift Basket',
    'Orchids',
    'Lilies',
    'Sunflowers',
    'Tulips',
    'Carnations',
  ];

  return (
    <div className="bg-white py-6 border-b border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-semibold text-neutral-700">
            {locale === 'en' ? 'Most Searched' : 'الأكثر بحثاً'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/${locale}/search?q=${encodeURIComponent(tag)}`}
              className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-neutral-800 text-xs font-medium transition-colors uppercase"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
