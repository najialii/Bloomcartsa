'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { X, Upload, Calendar, Palette } from 'lucide-react';

interface Banner {
  id?: number;
  title_en: string;
  title_ar: string;
  description_en?: string;
  description_ar?: string;
  image_url?: string;
  mobile_image_url?: string;
  link_url?: string;
  link_text_en?: string;
  link_text_ar?: string;
  type: string;
  position: string;
  sort_order: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  background_color?: string;
  text_color?: string;
  text_alignment: string;
}

interface BannerFormProps {
  banner?: Banner | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (banner: Banner) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function BannerForm({ banner, isOpen, onClose, onSave }: BannerFormProps) {
  const locale = useLocale() as 'en' | 'ar';
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mobileImageFile, setMobileImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Banner>({
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    link_url: '',
    link_text_en: '',
    link_text_ar: '',
    type: 'hero_slider',
    position: 'center',
    sort_order: 0,
    is_active: true,
    background_color: '#ffffff',
    text_color: '#000000',
    text_alignment: 'center',
  });

  const bannerTypes = [
    { value: 'hero_slider', label: locale === 'en' ? 'Hero Slider' : 'شريط البطل' },
    { value: 'promotional', label: locale === 'en' ? 'Promotional' : 'ترويجي' },
    { value: 'category_banner', label: locale === 'en' ? 'Category Banner' : 'بانر الفئة' },
    { value: 'sidebar_banner', label: locale === 'en' ? 'Sidebar Banner' : 'بانر جانبي' },
    { value: 'footer_banner', label: locale === 'en' ? 'Footer Banner' : 'بانر التذييل' },
  ];

  const positions = [
    { value: 'top', label: locale === 'en' ? 'Top' : 'أعلى' },
    { value: 'middle', label: locale === 'en' ? 'Middle' : 'وسط' },
    { value: 'bottom', label: locale === 'en' ? 'Bottom' : 'أسفل' },
    { value: 'left', label: locale === 'en' ? 'Left' : 'يسار' },
    { value: 'right', label: locale === 'en' ? 'Right' : 'يمين' },
    { value: 'center', label: locale === 'en' ? 'Center' : 'وسط' },
  ];

  const alignments = [
    { value: 'left', label: locale === 'en' ? 'Left' : 'يسار' },
    { value: 'center', label: locale === 'en' ? 'Center' : 'وسط' },
    { value: 'right', label: locale === 'en' ? 'Right' : 'يمين' },
  ];

  useEffect(() => {
    if (banner) {
      setFormData(banner);
    } else {
      setFormData({
        title_en: '',
        title_ar: '',
        description_en: '',
        description_ar: '',
        link_url: '',
        link_text_en: '',
        link_text_ar: '',
        type: 'hero_slider',
        position: 'center',
        sort_order: 0,
        is_active: true,
        background_color: '#ffffff',
        text_color: '#000000',
        text_alignment: 'center',
      });
    }
    setImageFile(null);
    setMobileImageFile(null);
  }, [banner, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const formDataToSend = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formDataToSend.append(key, value.toString());
        }
      });

      // Add image files
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      if (mobileImageFile) {
        formDataToSend.append('mobile_image', mobileImageFile);
      }

      const url = banner 
        ? `${API_BASE_URL}/admin/banners/${banner.id}`
        : `${API_BASE_URL}/admin/banners`;
      
      const method = banner ? 'PUT' : 'POST';
      
      // For PUT requests with files, use POST with _method override
      if (banner) {
        formDataToSend.append('_method', 'PUT');
      }

      const response = await fetch(url, {
        method: banner ? 'POST' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.data);
        onClose();
      } else {
        const error = await response.json();
        console.error('Error saving banner:', error);
        alert('Error saving banner: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Error saving banner');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {banner 
              ? (locale === 'en' ? 'Edit Banner' : 'تعديل البانر')
              : (locale === 'en' ? 'Create New Banner' : 'إنشاء بانر جديد')
            }
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Title (English)' : 'العنوان (إنجليزي)'}
              </label>
              <input
                type="text"
                required
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Title (Arabic)' : 'العنوان (عربي)'}
              </label>
              <input
                type="text"
                required
                value={formData.title_ar}
                onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Description (English)' : 'الوصف (إنجليزي)'}
              </label>
              <textarea
                rows={3}
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Description (Arabic)' : 'الوصف (عربي)'}
              </label>
              <textarea
                rows={3}
                value={formData.description_ar}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Desktop Image' : 'صورة سطح المكتب'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
                {(formData.image_url && !imageFile) && (
                  <img
                    src={formData.image_url}
                    alt="Current banner"
                    className="mt-2 h-20 object-cover rounded"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Mobile Image (Optional)' : 'صورة الجوال (اختياري)'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMobileImageFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
                {(formData.mobile_image_url && !mobileImageFile) && (
                  <img
                    src={formData.mobile_image_url}
                    alt="Current mobile banner"
                    className="mt-2 h-20 object-cover rounded"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Link Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Link URL' : 'رابط URL'}
              </label>
              <input
                type="url"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Link Text (English)' : 'نص الرابط (إنجليزي)'}
              </label>
              <input
                type="text"
                value={formData.link_text_en}
                onChange={(e) => setFormData({ ...formData, link_text_en: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Link Text (Arabic)' : 'نص الرابط (عربي)'}
              </label>
              <input
                type="text"
                value={formData.link_text_ar}
                onChange={(e) => setFormData({ ...formData, link_text_ar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Banner Settings */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Type' : 'النوع'}
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {bannerTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Position' : 'الموضع'}
              </label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {positions.map(position => (
                  <option key={position.value} value={position.value}>{position.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Sort Order' : 'ترتيب الفرز'}
              </label>
              <input
                type="number"
                min="0"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Text Alignment' : 'محاذاة النص'}
              </label>
              <select
                value={formData.text_alignment}
                onChange={(e) => setFormData({ ...formData, text_alignment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {alignments.map(alignment => (
                  <option key={alignment.value} value={alignment.value}>{alignment.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Background Color' : 'لون الخلفية'}
              </label>
              <input
                type="color"
                value={formData.background_color}
                onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Text Color' : 'لون النص'}
              </label>
              <input
                type="color"
                value={formData.text_color}
                onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Start Date (Optional)' : 'تاريخ البداية (اختياري)'}
              </label>
              <input
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'End Date (Optional)' : 'تاريخ النهاية (اختياري)'}
              </label>
              <input
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                {locale === 'en' ? 'Active' : 'نشط'}
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {locale === 'en' ? 'Cancel' : 'إلغاء'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading 
                ? (locale === 'en' ? 'Saving...' : 'جاري الحفظ...')
                : (banner 
                  ? (locale === 'en' ? 'Update' : 'تحديث')
                  : (locale === 'en' ? 'Create' : 'إنشاء')
                )
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}