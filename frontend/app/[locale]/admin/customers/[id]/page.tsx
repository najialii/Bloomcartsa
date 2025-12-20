'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  ShoppingCart, 
  Package, 
  Clock,
  AlertCircle
} from 'lucide-react';
import CustomerTimeline from '@/components/CustomerTimeline';

interface Customer {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  orders_count?: number;
  total_spent?: number;
}

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  product_price: number;
  product_image_url: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

interface CartSummary {
  items: CartItem[];
  total_items: number;
  total_amount: number;
  updated_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function CustomerDetailPage() {
  const locale = useLocale() as 'en' | 'ar';
  const params = useParams();
  const customerId = params.id as string;
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline'>('overview');

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails();
      fetchCustomerCart();
    }
  }, [customerId]);

  const fetchCustomerDetails = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/admin/customers/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomer(data.data);
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerCart = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/admin/carts/customer/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartSummary(data.data.cart);
      }
    } catch (error) {
      console.error('Error fetching customer cart:', error);
    } finally {
      setCartLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const getCartAbandonmentStatus = () => {
    if (!cartSummary?.updated_at || cartSummary.items.length === 0) return null;
    
    const lastUpdated = new Date(cartSummary.updated_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      return {
        status: 'abandoned',
        message: locale === 'en' ? 'Abandoned Cart (24+ hours)' : 'سلة مهجورة (24+ ساعة)',
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: AlertCircle,
      };
    } else if (hoursDiff > 1) {
      return {
        status: 'inactive',
        message: locale === 'en' ? `Inactive for ${Math.floor(hoursDiff)} hours` : `غير نشط لمدة ${Math.floor(hoursDiff)} ساعة`,
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        icon: Clock,
      };
    }
    
    return {
      status: 'active',
      message: locale === 'en' ? 'Recently Active' : 'نشط مؤخراً',
      color: 'text-green-600 bg-green-50 border-green-200',
      icon: ShoppingCart,
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <User className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-600">
            {locale === 'en' ? 'Customer not found' : 'العميل غير موجود'}
          </p>
        </div>
      </div>
    );
  }

  const abandonmentStatus = getCartAbandonmentStatus();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/${locale}/admin/customers`}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {customer.name}
          </h1>
          <p className="text-neutral-600">
            {locale === 'en' ? 'Customer Details' : 'تفاصيل العميل'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          {locale === 'en' ? 'Overview' : 'نظرة عامة'}
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'timeline'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          {locale === 'en' ? 'Timeline' : 'الجدول الزمني'}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                {locale === 'en' ? 'Customer Information' : 'معلومات العميل'}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <div>
                    <div className="text-sm text-neutral-600">
                      {locale === 'en' ? 'Email' : 'البريد الإلكتروني'}
                    </div>
                    <div className="font-medium">{customer.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <div>
                    <div className="text-sm text-neutral-600">
                      {locale === 'en' ? 'Member Since' : 'عضو منذ'}
                    </div>
                    <div className="font-medium">{formatDate(customer.created_at)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-neutral-400" />
                  <div>
                    <div className="text-sm text-neutral-600">
                      {locale === 'en' ? 'Total Orders' : 'إجمالي الطلبات'}
                    </div>
                    <div className="font-medium">{customer.orders_count || 0}</div>
                  </div>
                </div>
                
                {customer.total_spent && (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 text-neutral-400">💰</div>
                    <div>
                      <div className="text-sm text-neutral-600">
                        {locale === 'en' ? 'Total Spent' : 'إجمالي المبلغ المنفق'}
                      </div>
                      <div className="font-medium">{formatCurrency(customer.total_spent)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cart Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {locale === 'en' ? 'Current Cart' : 'السلة الحالية'}
                </h2>
                
                {abandonmentStatus && (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${abandonmentStatus.color}`}>
                    <abandonmentStatus.icon className="w-4 h-4" />
                    {abandonmentStatus.message}
                  </div>
                )}
              </div>

              {cartLoading ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin mx-auto"></div>
                  <p className="text-neutral-600 mt-2 text-sm">
                    {locale === 'en' ? 'Loading cart...' : 'جاري تحميل السلة...'}
                  </p>
                </div>
              ) : !cartSummary || cartSummary.items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-600">
                    {locale === 'en' ? 'No items in cart' : 'لا توجد عناصر في السلة'}
                  </p>
                </div>
              ) : (
                <div>
                  {/* Cart Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-neutral-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-900">{cartSummary.total_items}</div>
                      <div className="text-sm text-neutral-600">
                        {locale === 'en' ? 'Items' : 'عنصر'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-900">
                        {formatCurrency(cartSummary.total_amount)}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {locale === 'en' ? 'Total Value' : 'القيمة الإجمالية'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-neutral-900">
                        {formatDate(cartSummary.updated_at)}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {locale === 'en' ? 'Last Updated' : 'آخر تحديث'}
                      </div>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cartSummary.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border border-neutral-200 rounded-lg">
                        <img
                          src={item.product_image_url}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg bg-neutral-100"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-product.jpg';
                          }}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-neutral-900 truncate">
                            {item.product_name}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {formatCurrency(item.product_price)} × {item.quantity}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-neutral-900">
                            {formatCurrency(item.product_price * item.quantity)}
                          </div>
                          <div className="text-sm text-neutral-600">
                            {locale === 'en' ? 'Qty' : 'الكمية'}: {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <CustomerTimeline customerId={customerId} />
      )}
    </div>
  );
}