'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Users, ShoppingCart, Heart, Package, Search, Filter } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  orders_count?: number;
  cart_items_count?: number;
  wishlist_count?: number;
  total_spent?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function CustomersPage() {
  const locale = useLocale() as 'en' | 'ar';
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchTerm]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: '20',
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/customers?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data.data || []);
        setTotalPages(data.last_page || 1);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <Users className="w-6 h-6" />
            {locale === 'en' ? 'Customers' : 'العملاء'}
          </h1>
          <p className="text-neutral-600 mt-1">
            {locale === 'en' ? 'Manage customer accounts and view their activity' : 'إدارة حسابات العملاء وعرض نشاطهم'}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder={locale === 'en' ? 'Search customers...' : 'البحث عن العملاء...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-neutral-600 mt-2">
              {locale === 'en' ? 'Loading customers...' : 'جاري تحميل العملاء...'}
            </p>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-600">
              {locale === 'en' ? 'No customers found' : 'لم يتم العثور على عملاء'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">
                    {locale === 'en' ? 'Customer' : 'العميل'}
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">
                    {locale === 'en' ? 'Email' : 'البريد الإلكتروني'}
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">
                    {locale === 'en' ? 'Orders' : 'الطلبات'}
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">
                    {locale === 'en' ? 'Cart' : 'السلة'}
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">
                    {locale === 'en' ? 'Joined' : 'تاريخ الانضمام'}
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">
                    {locale === 'en' ? 'Actions' : 'الإجراءات'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-neutral-900">{customer.name}</div>
                        <div className="text-sm text-neutral-500">ID: {customer.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Package className="w-4 h-4 text-neutral-400" />
                        <span>{customer.orders_count || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <ShoppingCart className="w-4 h-4 text-neutral-400" />
                        <span>{customer.cart_items_count || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {formatDate(customer.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/${locale}/admin/customers/${customer.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        {locale === 'en' ? 'View Details' : 'عرض التفاصيل'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
            <div className="text-sm text-neutral-600">
              {locale === 'en' ? `Page ${currentPage} of ${totalPages}` : `صفحة ${currentPage} من ${totalPages}`}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
              >
                {locale === 'en' ? 'Previous' : 'السابق'}
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
              >
                {locale === 'en' ? 'Next' : 'التالي'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}