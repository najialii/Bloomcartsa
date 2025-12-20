'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import Price from './Price';

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export interface FilterState {
  categories: string[];
  priceRange: { min: number; max: number };
  colors: string[];
  occasions: string[];
  sortBy: string;
  inStock: boolean;
}

export default function ProductFilters({ onFilterChange, onClose, isMobile = false }: FilterProps) {
  const locale = useLocale();
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: { min: 0, max: 1000 },
    colors: [],
    occasions: [],
    sortBy: 'newest',
    inStock: false,
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    color: false,
    occasion: false,
  });

  const categories = [
    { id: 'roses', name: locale === 'en' ? 'Roses' : 'ورود' },
    { id: 'tulips', name: locale === 'en' ? 'Tulips' : 'توليب' },
    { id: 'orchids', name: locale === 'en' ? 'Orchids' : 'أوركيد' },
    { id: 'bouquets', name: locale === 'en' ? 'Bouquets' : 'باقات' },
    { id: 'gift-boxes', name: locale === 'en' ? 'Gift Boxes' : 'صناديق هدايا' },
    { id: 'chocolates', name: locale === 'en' ? 'Chocolates' : 'شوكولاتة' },
  ];

  const colors = [
    { id: 'red', name: locale === 'en' ? 'Red' : 'أحمر', hex: '#EF4444' },
    { id: 'pink', name: locale === 'en' ? 'Pink' : 'وردي', hex: '#EC4899' },
    { id: 'white', name: locale === 'en' ? 'White' : 'أبيض', hex: '#FFFFFF' },
    { id: 'yellow', name: locale === 'en' ? 'Yellow' : 'أصفر', hex: '#FBBF24' },
    { id: 'purple', name: locale === 'en' ? 'Purple' : 'بنفسجي', hex: '#A855F7' },
    { id: 'mixed', name: locale === 'en' ? 'Mixed' : 'مختلط', hex: 'linear-gradient(45deg, #EF4444, #EC4899, #A855F7)' },
  ];

  const occasions = [
    { id: 'birthday', name: locale === 'en' ? 'Birthday' : 'عيد ميلاد' },
    { id: 'anniversary', name: locale === 'en' ? 'Anniversary' : 'ذكرى سنوية' },
    { id: 'wedding', name: locale === 'en' ? 'Wedding' : 'زفاف' },
    { id: 'congratulations', name: locale === 'en' ? 'Congratulations' : 'تهنئة' },
    { id: 'sympathy', name: locale === 'en' ? 'Sympathy' : 'تعازي' },
    { id: 'romantic', name: locale === 'en' ? 'Romantic' : 'رومانسي' },
  ];

  const sortOptions = [
    { id: 'newest', name: locale === 'en' ? 'Newest First' : 'الأحدث أولاً' },
    { id: 'price-low', name: locale === 'en' ? 'Price: Low to High' : 'السعر: من الأقل للأعلى' },
    { id: 'price-high', name: locale === 'en' ? 'Price: High to Low' : 'السعر: من الأعلى للأقل' },
    { id: 'popular', name: locale === 'en' ? 'Most Popular' : 'الأكثر شعبية' },
    { id: 'rating', name: locale === 'en' ? 'Highest Rated' : 'الأعلى تقييماً' },
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId];
    
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleColorChange = (colorId: string) => {
    const newColors = filters.colors.includes(colorId)
      ? filters.colors.filter(c => c !== colorId)
      : [...filters.colors, colorId];
    
    const newFilters = { ...filters, colors: newColors };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleOccasionChange = (occasionId: string) => {
    const newOccasions = filters.occasions.includes(occasionId)
      ? filters.occasions.filter(o => o !== occasionId)
      : [...filters.occasions, occasionId];
    
    const newFilters = { ...filters, occasions: newOccasions };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    const newFilters = {
      ...filters,
      priceRange: { ...filters.priceRange, [type]: value }
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleInStockChange = () => {
    const newFilters = { ...filters, inStock: !filters.inStock };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const newFilters: FilterState = {
      categories: [],
      priceRange: { min: 0, max: 1000 },
      colors: [],
      occasions: [],
      sortBy: 'newest',
      inStock: false,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.colors.length + 
    filters.occasions.length + 
    (filters.inStock ? 1 : 0);

  return (
    <div className={`bg-white ${isMobile ? 'h-full overflow-y-auto' : 'rounded-lg border border-neutral-200'}`}>
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-neutral-600" />
          <h3 className="font-semibold text-neutral-900">
            {locale === 'en' ? 'Filters' : 'التصفية'}
          </h3>
          {activeFiltersCount > 0 && (
            <span className="bg-neutral-900 text-white text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {locale === 'en' ? 'Clear All' : 'مسح الكل'}
            </button>
          )}
          {isMobile && onClose && (
            <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-3">
            {locale === 'en' ? 'Sort By' : 'ترتيب حسب'}
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>

        {/* In Stock Only */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={handleInStockChange}
              className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-300"
            />
            <span className="text-sm font-medium text-neutral-700">
              {locale === 'en' ? 'In Stock Only' : 'المتوفر فقط'}
            </span>
          </label>
        </div>

        {/* Categories */}
        <div>
          <button
            onClick={() => toggleSection('category')}
            className="w-full flex items-center justify-between mb-3"
          >
            <span className="text-sm font-semibold text-neutral-900">
              {locale === 'en' ? 'Categories' : 'الفئات'}
            </span>
            {expandedSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.category && (
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-300"
                  />
                  <span className="text-sm text-neutral-700">{category.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between mb-3"
          >
            <span className="text-sm font-semibold text-neutral-900">
              {locale === 'en' ? 'Price Range' : 'نطاق السعر'}
            </span>
            {expandedSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.price && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
                />
                <span className="text-neutral-500">-</span>
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </div>
              <div className="text-xs text-neutral-500 flex items-center gap-1">
                <Price amount={filters.priceRange.min} showDecimals={false} symbolClassName="w-3 h-3" />
                {' - '}
                <Price amount={filters.priceRange.max} showDecimals={false} symbolClassName="w-3 h-3" />
              </div>
            </div>
          )}
        </div>

        {/* Colors */}
        <div>
          <button
            onClick={() => toggleSection('color')}
            className="w-full flex items-center justify-between mb-3"
          >
            <span className="text-sm font-semibold text-neutral-900">
              {locale === 'en' ? 'Colors' : 'الألوان'}
            </span>
            {expandedSections.color ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.color && (
            <div className="grid grid-cols-3 gap-2">
              {colors.map(color => (
                <button
                  key={color.id}
                  onClick={() => handleColorChange(color.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                    filters.colors.includes(color.id)
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full border border-neutral-200"
                    style={{ background: color.hex }}
                  />
                  <span className="text-xs text-neutral-700">{color.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Occasions */}
        <div>
          <button
            onClick={() => toggleSection('occasion')}
            className="w-full flex items-center justify-between mb-3"
          >
            <span className="text-sm font-semibold text-neutral-900">
              {locale === 'en' ? 'Occasions' : 'المناسبات'}
            </span>
            {expandedSections.occasion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.occasion && (
            <div className="space-y-2">
              {occasions.map(occasion => (
                <label key={occasion.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.occasions.includes(occasion.id)}
                    onChange={() => handleOccasionChange(occasion.id)}
                    className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-300"
                  />
                  <span className="text-sm text-neutral-700">{occasion.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
