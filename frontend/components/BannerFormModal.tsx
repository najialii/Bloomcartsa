'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Link as LinkIcon, Palette } from 'lucide-react';

interface Banner {
  id: number;
  title_en: string;
  title_ar: string;
  description_en?: string;
  description_ar?: string;
  image_url: string;
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

interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  banner?: Banner | null;
  locale: 'en' | 'ar';
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function BannerFormModal({ isOpen, onClose, onSuccess, banner, locale }: BannerFormModalProps) {
  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    link_url: '',
    link_text_en: '',
    link_text_ar: '',
    type: 'promotional',
    position: 'top',
    sort_order: 0,
    is_active: true,
    start_date: '',
    end_date: '',
    background_color: '#ffffff',
    text_color: '#000000',
    text_alignment: 'center',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mobileImageFile, setMobileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [mobileImagePreview, setMobileImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

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

  const textAlignments = [
    { value: 'left', label: locale === 'en' ? 'Left' : 'يسار' },
    { value: 'center', label: locale === 'en' ? 'Center' : 'وسط' },
    { value: 'right', label: locale === 'en' ? 'Right' : 'يمين' },
  ];

  useEffect(() => {
    if (banner) {
      setFormData({
        title_en: banner.title_en || '',
        title_ar: banner.title_ar || '',
        description_en: banner.description_en || '',
        description_ar: banner.description_ar || '',
        link_url: banner.link_url || '',
        link_text_en: banner.link_text_en || '',
        link_text_ar: banner.link_text_ar || '',
        type: banner.type || 'promotional',
        position: banner.position || 'top',
        sort_order: banner.sort_order || 0,
        is_active: banner.is_active ?? true,
        start_date: banner.start_date || '',
        end_date: banner.end_date || '',
        background_color: banner.background_color || '#ffffff',
        text_color: banner.text_color || '#000000',
        text_alignment: banner.text_alignment || 'center',
      });
      
      if (banner.image_url) {
        setImagePreview(banner.image_url.startsWith('/') ? `http://localhost:8000${banner.image_url}` : banner.image_url);
      }
      
      if (banner.mobile_image_url) {
        setMobileImagePreview(banner.mobile_image_url.startsWith('/') ? `http://localhost:8000${banner.mobile_image_url}` : banner.mobile_image_url);
      }
    } else {
      // Reset form for new banner
      setFormData({
        title_en: '',
        title_ar: '',
        description_en: '',
        description_ar: '',
        link_url: '',
        link_text_en: '',
        link_text_ar: '',
        type: 'promotional',
        position: 'top',
        sort_order: 0,
        is_active: true,
        start_date: '',
        end_date: '',
        background_color: '#ffffff',
        text_color: '#000000',
        text_alignment: 'center',
      });
      setImagePreview('');
      setMobileImagePreview('');
      setImageFile(null);
      setMobileImageFile(null);
    }
    setErrors({});
  }, [banner]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isMobile = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isMobile) {
        setMobileImageFile(file);
        setMobileImagePreview(URL.createObjectURL(file));
      } else {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem('auth_token');
      const formDataToSend = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
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

      const result = await response.json();

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          console.error('Error:', result.message);
        }
      }
    } catch (error) {
      console.error('Error submitting banner:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                name="title_en"
                value={formData.title_en}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {errors.title_en && (
                <p className="text-red-500 text-sm mt-1">{errors.title_en[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Title (Arabic)' : 'العنوان (عربي)'}
              </label>
              <input
                type="text"
                name="title_ar"
                value={formData.title_ar}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {errors.title_ar && (
                <p className="text-red-500 text-sm mt-1">{errors.title_ar[0]}</p>
              )}
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Description (English)' : 'الوصف (إنجليزي)'}
              </label>
              <textarea
                name="description_en"
                value={formData.description_en}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Description (Arabic)' : 'الوصف (عربي)'}
              </label>
              <textarea
                name="description_ar"
                value={formData.description_ar}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Main Image' : 'الصورة الرئيسية'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      {locale === 'en' ? 'Upload main image' : 'رفع الصورة الرئيسية'}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, false)}
                      className="hidden"
                      id="main-image"
                    />
                    <label
                      htmlFor="main-image"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {locale === 'en' ? 'Choose File' : 'اختر ملف'}
                    </label>
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Mobile Image (Optional)' : 'صورة الجوال (اختياري)'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {mobileImagePreview ? (
                  <div className="relative">
                    <img
                      src={mobileImagePreview}
                      alt="Mobile Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMobileImagePreview('');
                        setMobileImageFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      {locale === 'en' ? 'Upload mobile image' : 'رفع صورة الجوال'}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, true)}
                      className="hidden"
                      id="mobile-image"
                    />
                    <label
                      htmlFor="mobile-image"
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer inline-flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {locale === 'en' ? 'Choose File' : 'اختر ملف'}
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Banner Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Banner Type' : 'نوع البانر'}
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
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
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {positions.map(position => (
                  <option key={position.value} value={position.value}>{position.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Sort Order' : 'ترتيب العرض'}
              </label>
              <input
                type="number"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Link Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <LinkIcon className="w-4 h-4 inline mr-1" />
                {locale === 'en' ? 'Link URL' : 'رابط URL'}
              </label>
              <input
                type="url"
                name="link_url"
                value={formData.link_url}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Link Text (English)' : 'نص الرابط (إنجليزي)'}
              </label>
              <input
                type="text"
                name="link_text_en"
                value={formData.link_text_en}
                onChange={handleInputChange}
                placeholder="Shop Now"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Link Text (Arabic)' : 'نص الرابط (عربي)'}
              </label>
              <input
                type="text"
                name="link_text_ar"
                value={formData.link_text_ar}
                onChange={handleInputChange}
                placeholder="تسوق الآن"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Styling */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Palette className="w-4 h-4 inline mr-1" />
                {locale === 'en' ? 'Background Color' : 'لون الخلفية'}
              </label>
              <input
                type="color"
                name="background_color"
                value={formData.background_color}
                onChange={handleInputChange}
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Text Color' : 'لون النص'}
              </label>
              <input
                type="color"
                name="text_color"
                value={formData.text_color}
                onChange={handleInputChange}
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Text Alignment' : 'محاذاة النص'}
              </label>
              <select
                name="text_alignment"
                value={formData.text_alignment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {textAlignments.map(alignment => (
                  <option key={alignment.value} value={alignment.value}>{alignment.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Start Date (Optional)' : 'تاريخ البداية (اختياري)'}
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'End Date (Optional)' : 'تاريخ النهاية (اختياري)'}
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              {locale === 'en' ? 'Active (visible on website)' : 'نشط (مرئي على الموقع)'}
            </label>
          </div>

          {/* Form Actions */}
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading 
                ? (locale === 'en' ? 'Saving...' : 'جاري الحفظ...')
                : banner 
                  ? (locale === 'en' ? 'Update Banner' : 'تحديث البانر')
                  : (locale === 'en' ? 'Create Banner' : 'إنشاء البانر')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}