'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Eye,
  ToggleLeft,
  ToggleRight,
  Percent,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Gift,
  Copy,
  Check
} from 'lucide-react';

interface PromoCode {
  id: number;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimum_amount: number | null;
  maximum_discount: number | null;
  usage_limit: number | null;
  usage_count: number;
  usage_limit_per_user: number | null;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  auto_apply: boolean;
  applicable_products: number[] | null;
  applicable_categories: number[] | null;
  created_at: string;
  usages_count: number;
}

interface PromoCodeStats {
  total_codes: number;
  active_codes: number;
  expired_codes: number;
  auto_apply_codes: number;
  total_usage: number;
  total_discount_given: number;
}

export default function PromoCodesPage() {
  const locale = useLocale() as 'en' | 'ar';
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [stats, setStats] = useState<PromoCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    minimum_amount: '',
    maximum_discount: '',
    usage_limit: '',
    usage_limit_per_user: '',
    starts_at: '',
    expires_at: '',
    is_active: true,
    auto_apply: false
  });

  useEffect(() => {
    fetchPromoCodes();
    fetchStats();
  }, [searchTerm, statusFilter, typeFilter]);

  const fetchPromoCodes = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/promo-codes?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPromoCodes(data.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/promo-codes-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('auth_token');
      const url = editingPromoCode 
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/promo-codes/${editingPromoCode.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/promo-codes`;
      
      const method = editingPromoCode ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        value: parseFloat(formData.value) || 0,
        minimum_amount: formData.minimum_amount ? parseFloat(formData.minimum_amount) : null,
        maximum_discount: formData.maximum_discount ? parseFloat(formData.maximum_discount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        usage_limit_per_user: formData.usage_limit_per_user ? parseInt(formData.usage_limit_per_user) : null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchPromoCodes();
        fetchStats();
        resetForm();
        setShowAddModal(false);
        setEditingPromoCode(null);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to save promo code');
      }
    } catch (error) {
      console.error('Error saving promo code:', error);
      alert('Failed to save promo code');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(locale === 'en' ? 'Are you sure you want to delete this promo code?' : 'هل أنت متأكد من حذف هذا الرمز الترويجي؟')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/promo-codes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchPromoCodes();
        fetchStats();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete promo code');
      }
    } catch (error) {
      console.error('Error deleting promo code:', error);
      alert('Failed to delete promo code');
    }
  };

  const toggleStatus = async (promoCode: PromoCode) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/promo-codes/${promoCode.id}/toggle-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchPromoCodes();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const generateCode = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/promo-codes/generate-code`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({...formData, code: data.code});
      }
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: '',
      minimum_amount: '',
      maximum_discount: '',
      usage_limit: '',
      usage_limit_per_user: '',
      starts_at: '',
      expires_at: '',
      is_active: true,
      auto_apply: false
    });
  };

  const openEditModal = (promoCode: PromoCode) => {
    setEditingPromoCode(promoCode);
    setFormData({
      code: promoCode.code,
      name: promoCode.name,
      description: promoCode.description || '',
      type: promoCode.type,
      value: promoCode.value.toString(),
      minimum_amount: promoCode.minimum_amount?.toString() || '',
      maximum_discount: promoCode.maximum_discount?.toString() || '',
      usage_limit: promoCode.usage_limit?.toString() || '',
      usage_limit_per_user: promoCode.usage_limit_per_user?.toString() || '',
      starts_at: promoCode.starts_at ? promoCode.starts_at.split('T')[0] : '',
      expires_at: promoCode.expires_at ? promoCode.expires_at.split('T')[0] : '',
      is_active: promoCode.is_active,
      auto_apply: promoCode.auto_apply
    });
    setShowAddModal(true);
  };

  const getStatusColor = (promoCode: PromoCode) => {
    if (!promoCode.is_active) return 'bg-gray-100 text-gray-800';
    if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) return 'bg-red-100 text-red-800';
    if (promoCode.usage_limit && promoCode.usage_count >= promoCode.usage_limit) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (promoCode: PromoCode) => {
    if (!promoCode.is_active) return locale === 'en' ? 'Inactive' : 'غير نشط';
    if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) return locale === 'en' ? 'Expired' : 'منتهي الصلاحية';
    if (promoCode.usage_limit && promoCode.usage_count >= promoCode.usage_limit) return locale === 'en' ? 'Used Up' : 'مستنفد';
    return locale === 'en' ? 'Active' : 'نشط';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-neutral-600">
            {locale === 'en' ? 'Loading promo codes...' : 'جاري تحميل الرموز الترويجية...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">
            {locale === 'en' ? 'Promo Codes' : 'الرموز الترويجية'}
          </h1>
          <p className="text-neutral-600 mt-1">
            {locale === 'en' ? 'Manage discount codes and promotions' : 'إدارة رموز الخصم والعروض الترويجية'}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingPromoCode(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {locale === 'en' ? 'Add Promo Code' : 'إضافة رمز ترويجي'}
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white p-4 border border-neutral-200">
            <div className="flex items-center gap-2">
              <Gift className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-xs text-neutral-600">{locale === 'en' ? 'Total Codes' : 'إجمالي الرموز'}</p>
                <p className="text-xl font-bold">{stats.total_codes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 border border-neutral-200">
            <div className="flex items-center gap-2">
              <ToggleRight className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-xs text-neutral-600">{locale === 'en' ? 'Active' : 'نشط'}</p>
                <p className="text-xl font-bold">{stats.active_codes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 border border-neutral-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-red-500" />
              <div>
                <p className="text-xs text-neutral-600">{locale === 'en' ? 'Expired' : 'منتهي الصلاحية'}</p>
                <p className="text-xl font-bold">{stats.expired_codes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 border border-neutral-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-500" />
              <div>
                <p className="text-xs text-neutral-600">{locale === 'en' ? 'Auto Apply' : 'تطبيق تلقائي'}</p>
                <p className="text-xl font-bold">{stats.auto_apply_codes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 border border-neutral-200">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-orange-500" />
              <div>
                <p className="text-xs text-neutral-600">{locale === 'en' ? 'Total Usage' : 'إجمالي الاستخدام'}</p>
                <p className="text-xl font-bold">{stats.total_usage}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 border border-neutral-200">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-xs text-neutral-600">{locale === 'en' ? 'Total Discount' : 'إجمالي الخصم'}</p>
                <p className="text-xl font-bold">{stats.total_discount_given} {locale === 'en' ? 'SAR' : 'ريال'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder={locale === 'en' ? 'Search promo codes...' : 'البحث في الرموز الترويجية...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
        >
          <option value="all">{locale === 'en' ? 'All Status' : 'جميع الحالات'}</option>
          <option value="active">{locale === 'en' ? 'Active' : 'نشط'}</option>
          <option value="inactive">{locale === 'en' ? 'Inactive' : 'غير نشط'}</option>
          <option value="expired">{locale === 'en' ? 'Expired' : 'منتهي الصلاحية'}</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
        >
          <option value="all">{locale === 'en' ? 'All Types' : 'جميع الأنواع'}</option>
          <option value="percentage">{locale === 'en' ? 'Percentage' : 'نسبة مئوية'}</option>
          <option value="fixed">{locale === 'en' ? 'Fixed Amount' : 'مبلغ ثابت'}</option>
        </select>
      </div>

      {/* Promo Codes List */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  {locale === 'en' ? 'Code' : 'الرمز'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  {locale === 'en' ? 'Name' : 'الاسم'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  {locale === 'en' ? 'Type' : 'النوع'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  {locale === 'en' ? 'Value' : 'القيمة'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  {locale === 'en' ? 'Usage' : 'الاستخدام'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  {locale === 'en' ? 'Status' : 'الحالة'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  {locale === 'en' ? 'Actions' : 'الإجراءات'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {promoCodes.map((promoCode) => (
                <tr key={promoCode.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="bg-neutral-100 px-2 py-1 rounded text-sm font-mono">
                        {promoCode.code}
                      </code>
                      <button
                        onClick={() => copyCode(promoCode.code)}
                        className="p-1 text-neutral-400 hover:text-neutral-600"
                        title={locale === 'en' ? 'Copy code' : 'نسخ الرمز'}
                      >
                        {copiedCode === promoCode.code ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {promoCode.auto_apply && (
                      <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        {locale === 'en' ? 'Auto Apply' : 'تطبيق تلقائي'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{promoCode.name}</p>
                      {promoCode.description && (
                        <p className="text-sm text-neutral-600">{promoCode.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {promoCode.type === 'percentage' ? (
                        <Percent className="w-4 h-4 text-blue-500" />
                      ) : (
                        <DollarSign className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-sm">
                        {locale === 'en' 
                          ? (promoCode.type === 'percentage' ? 'Percentage' : 'Fixed Amount')
                          : (promoCode.type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت')
                        }
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">
                      {promoCode.type === 'percentage' 
                        ? `${promoCode.value}%` 
                        : `${promoCode.value} ${locale === 'en' ? 'SAR' : 'ريال'}`
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <span className="font-medium">{promoCode.usage_count}</span>
                      {promoCode.usage_limit && (
                        <span className="text-neutral-500"> / {promoCode.usage_limit}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(promoCode)}`}>
                      {getStatusText(promoCode)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(promoCode)}
                        className="p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                        title={locale === 'en' ? 'Edit' : 'تعديل'}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => toggleStatus(promoCode)}
                        className="p-2 text-orange-600 hover:bg-orange-50 transition-colors"
                        title={locale === 'en' ? 'Toggle Status' : 'تغيير الحالة'}
                      >
                        {promoCode.is_active ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleDelete(promoCode.id)}
                        className="p-2 text-red-600 hover:bg-red-50 transition-colors"
                        title={locale === 'en' ? 'Delete' : 'حذف'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingPromoCode 
                  ? (locale === 'en' ? 'Edit Promo Code' : 'تعديل الرمز الترويجي')
                  : (locale === 'en' ? 'Add Promo Code' : 'إضافة رمز ترويجي')
                }
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {locale === 'en' ? 'Code' : 'الرمز'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                        className="flex-1 px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                        placeholder="PROMO2024"
                        required
                      />
                      <button
                        type="button"
                        onClick={generateCode}
                        className="px-3 py-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                      >
                        {locale === 'en' ? 'Generate' : 'توليد'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {locale === 'en' ? 'Name' : 'الاسم'}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {locale === 'en' ? 'Description' : 'الوصف'}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {locale === 'en' ? 'Type' : 'النوع'}
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as 'percentage' | 'fixed'})}
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                    >
                      <option value="percentage">{locale === 'en' ? 'Percentage' : 'نسبة مئوية'}</option>
                      <option value="fixed">{locale === 'en' ? 'Fixed Amount' : 'مبلغ ثابت'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {locale === 'en' ? 'Value' : 'القيمة'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.value}
                        onChange={(e) => setFormData({...formData, value: e.target.value})}
                        className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                        required
                      />
                      <span className="absolute right-3 top-2 text-neutral-500">
                        {formData.type === 'percentage' ? '%' : 'SAR'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {locale === 'en' ? 'Minimum Amount' : 'الحد الأدنى للمبلغ'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.minimum_amount}
                      onChange={(e) => setFormData({...formData, minimum_amount: e.target.value})}
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                      placeholder="0.00"
                    />
                  </div>

                  {formData.type === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {locale === 'en' ? 'Maximum Discount' : 'الحد الأقصى للخصم'}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.maximum_discount}
                        onChange={(e) => setFormData({...formData, maximum_discount: e.target.value})}
                        className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {locale === 'en' ? 'Usage Limit' : 'حد الاستخدام'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.usage_limit}
                      onChange={(e) => setFormData({...formData, usage_limit: e.target.value})}
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                      placeholder={locale === 'en' ? 'Unlimited' : 'غير محدود'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {locale === 'en' ? 'Per User Limit' : 'حد الاستخدام لكل مستخدم'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.usage_limit_per_user}
                      onChange={(e) => setFormData({...formData, usage_limit_per_user: e.target.value})}
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                      placeholder={locale === 'en' ? 'Unlimited' : 'غير محدود'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {locale === 'en' ? 'Start Date' : 'تاريخ البداية'}
                    </label>
                    <input
                      type="date"
                      value={formData.starts_at}
                      onChange={(e) => setFormData({...formData, starts_at: e.target.value})}
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {locale === 'en' ? 'End Date' : 'تاريخ الانتهاء'}
                    </label>
                    <input
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm">{locale === 'en' ? 'Active' : 'نشط'}</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.auto_apply}
                      onChange={(e) => setFormData({...formData, auto_apply: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm">{locale === 'en' ? 'Auto Apply' : 'تطبيق تلقائي'}</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-black text-white hover:bg-neutral-800 transition-colors"
                  >
                    {editingPromoCode 
                      ? (locale === 'en' ? 'Update' : 'تحديث')
                      : (locale === 'en' ? 'Create' : 'إنشاء')
                    }
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingPromoCode(null);
                      resetForm();
                    }}
                    className="flex-1 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    {locale === 'en' ? 'Cancel' : 'إلغاء'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}