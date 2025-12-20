'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, MapPinned, ArrowLeft, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUserStore } from '@/lib/userStore';

interface Address {
  id: number;
  type: 'home' | 'work' | 'other';
  label?: string;
  full_name: string;
  phone: string;
  street: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export default function AddressesPage() {
  const locale = useLocale() as 'en' | 'ar';
  const router = useRouter();
  const { isLoggedIn } = useUserStore();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    label: '',
    full_name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Saudi Arabia',
    is_default: false,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/${locale}/login`);
      return;
    }
    fetchAddresses();
  }, [isLoggedIn, locale, router]);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      
      const response = await fetch(`${apiUrl}/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        type: address.type,
        label: address.label || '',
        full_name: address.full_name,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state || '',
        postal_code: address.postal_code,
        country: address.country,
        is_default: address.is_default,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        type: 'home',
        label: '',
        full_name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Saudi Arabia',
        is_default: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('auth_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      
      const url = editingAddress 
        ? `${apiUrl}/addresses/${editingAddress.id}`
        : `${apiUrl}/addresses`;
      
      const method = editingAddress ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchAddresses();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      
      const response = await fetch(`${apiUrl}/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        await fetchAddresses();
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      
      const response = await fetch(`${apiUrl}/addresses/${id}/set-default`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        await fetchAddresses();
      }
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'work':
        return <Briefcase className="w-5 h-5" />;
      default:
        return <MapPinned className="w-5 h-5" />;
    }
  };

  const getTypeName = (type: string) => {
    const names: Record<string, { en: string; ar: string }> = {
      home: { en: 'Home', ar: 'المنزل' },
      work: { en: 'Work', ar: 'العمل' },
      other: { en: 'Other', ar: 'أخرى' },
    };
    return names[type]?.[locale] || type;
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 py-8 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button */}
          <Link
            href={`/${locale}/account`}
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-black transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">
              {locale === 'en' ? 'Back to Account' : 'العودة إلى الحساب'}
            </span>
          </Link>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                {locale === 'en' ? 'My Addresses' : 'عناويني'}
              </h1>
              <p className="text-neutral-600 text-lg">
                {locale === 'en' ? 'Manage your delivery addresses' : 'إدارة عناوين التسليم'}
              </p>
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 font-medium hover:bg-neutral-800 transition-colors whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              {locale === 'en' ? 'Add Address' : 'إضافة عنوان'}
            </button>
          </div>

          {/* Addresses Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-neutral-100 border border-neutral-200 p-6 animate-pulse h-64" />
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-16 bg-neutral-50 border border-neutral-200">
              <MapPin className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {locale === 'en' ? 'No addresses yet' : 'لا توجد عناوين بعد'}
              </h3>
              <p className="text-neutral-600 mb-6">
                {locale === 'en' ? 'Add your first delivery address' : 'أضف عنوان التسليم الأول'}
              </p>
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium hover:bg-neutral-800 transition-colors"
              >
                <Plus className="w-5 h-5" />
                {locale === 'en' ? 'Add Address' : 'إضافة عنوان'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-white border border-neutral-200 p-6 relative hover:border-neutral-400 transition-all"
                >
                  {address.is_default && (
                    <div className="absolute top-4 right-4 bg-black text-white text-xs px-3 py-1 font-medium">
                      {locale === 'en' ? 'DEFAULT' : 'افتراضي'}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center">
                      {getTypeIcon(address.type)}
                    </div>
                    <h3 className="text-lg font-semibold">
                      {address.label || getTypeName(address.type)}
                    </h3>
                  </div>

                  <div className="space-y-2 mb-6 text-sm">
                    <p className="font-semibold text-black">{address.full_name}</p>
                    <p className="text-neutral-600">{address.street}</p>
                    <p className="text-neutral-600">
                      {address.city}{address.state && `, ${address.state}`} {address.postal_code}
                    </p>
                    <p className="text-neutral-600">{address.country}</p>
                    <p className="text-neutral-600">{address.phone}</p>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleOpenModal(address)}
                      className="flex-1 flex items-center justify-center gap-2 border border-neutral-300 px-4 py-2 font-medium hover:border-neutral-400 hover:bg-neutral-50 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      {locale === 'en' ? 'Edit' : 'تعديل'}
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(address.id)}
                      className="flex items-center justify-center gap-2 border border-red-300 text-red-600 px-4 py-2 font-medium hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {!address.is_default && (
                    <button 
                      onClick={() => handleSetDefault(address.id)}
                      className="w-full mt-3 text-sm font-medium text-neutral-600 hover:text-black transition-colors"
                    >
                      {locale === 'en' ? 'Set as default' : 'تعيين كافتراضي'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold">
                {editingAddress 
                  ? (locale === 'en' ? 'Edit Address' : 'تعديل العنوان')
                  : (locale === 'en' ? 'Add New Address' : 'إضافة عنوان جديد')}
              </h3>
              <button onClick={handleCloseModal} className="text-neutral-400 hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {locale === 'en' ? 'Address Type' : 'نوع العنوان'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['home', 'work', 'other'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({...formData, type: type as any})}
                        className={`p-3 border font-medium transition-all ${
                          formData.type === type
                            ? 'border-black bg-black text-white'
                            : 'border-neutral-300 hover:border-neutral-400'
                        }`}
                      >
                        {getTypeName(type)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Label (optional) */}
                {formData.type === 'other' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {locale === 'en' ? 'Label (Optional)' : 'التسمية (اختياري)'}
                    </label>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) => setFormData({...formData, label: e.target.value})}
                      placeholder={locale === 'en' ? 'e.g., Parents House' : 'مثال: منزل الوالدين'}
                      className="w-full border border-neutral-300 p-3 focus:outline-none focus:border-black"
                    />
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {locale === 'en' ? 'Full Name' : 'الاسم الكامل'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full border border-neutral-300 p-3 focus:outline-none focus:border-black"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {locale === 'en' ? 'Phone Number' : 'رقم الهاتف'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-neutral-300 p-3 focus:outline-none focus:border-black"
                  />
                </div>

                {/* Street */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {locale === 'en' ? 'Street Address' : 'عنوان الشارع'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({...formData, street: e.target.value})}
                    className="w-full border border-neutral-300 p-3 focus:outline-none focus:border-black"
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {locale === 'en' ? 'City' : 'المدينة'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full border border-neutral-300 p-3 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {locale === 'en' ? 'State/Province' : 'الولاية/المحافظة'}
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="w-full border border-neutral-300 p-3 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* Postal Code & Country */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {locale === 'en' ? 'Postal Code' : 'الرمز البريدي'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postal_code}
                      onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                      className="w-full border border-neutral-300 p-3 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {locale === 'en' ? 'Country' : 'الدولة'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full border border-neutral-300 p-3 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* Set as Default */}
                <label className="flex items-center gap-3 cursor-pointer p-4 border border-neutral-200 hover:bg-neutral-50">
                  <input
                    type="checkbox"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
                    className="w-5 h-5 accent-black"
                  />
                  <span className="font-medium">
                    {locale === 'en' ? 'Set as default address' : 'تعيين كعنوان افتراضي'}
                  </span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 border border-neutral-300 py-3 font-medium hover:bg-neutral-50 transition-colors"
                >
                  {locale === 'en' ? 'Cancel' : 'إلغاء'}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 font-medium hover:bg-neutral-800 transition-colors"
                >
                  {editingAddress 
                    ? (locale === 'en' ? 'Update Address' : 'تحديث العنوان')
                    : (locale === 'en' ? 'Add Address' : 'إضافة عنوان')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4">
              {locale === 'en' ? 'Delete Address' : 'حذف العنوان'}
            </h3>
            <p className="text-neutral-700 mb-6">
              {locale === 'en' 
                ? 'Are you sure you want to delete this address? This action cannot be undone.' 
                : 'هل أنت متأكد أنك تريد حذف هذا العنوان؟ لا يمكن التراجع عن هذا الإجراء.'}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-neutral-300 py-3 font-medium hover:bg-neutral-50 transition-colors"
              >
                {locale === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 text-white py-3 font-medium hover:bg-red-700 transition-colors"
              >
                {locale === 'en' ? 'Delete' : 'حذف'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
