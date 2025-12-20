'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  ShoppingCart, 
  Gift, 
  MapPin, 
  CheckCircle, 
  UserPlus,
  Clock,
  Package,
  Calendar
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  data: any;
  created_at: string;
  icon: string;
  color: string;
}

interface TimelineData {
  customer: {
    id: number;
    name: string;
    email: string;
    created_at: string;
  };
  timeline: TimelineEvent[];
  stats: {
    total_events: number;
    orders_count: number;
    wishlist_count: number;
    cart_items_count: number;
  };
}

interface CustomerTimelineProps {
  customerId: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const iconMap = {
  'user-plus': UserPlus,
  'shopping-bag': ShoppingBag,
  'check-circle': CheckCircle,
  'heart': Heart,
  'shopping-cart': ShoppingCart,
  'gift': Gift,
  'map-pin': MapPin,
  'package': Package,
  'clock': Clock,
  'calendar': Calendar,
  'tag': Gift, // Using Gift icon for promo codes
  'x-circle': CheckCircle, // Will style differently for cancelled
};

const colorMap = {
  green: 'bg-green-100 text-green-600 border-green-200',
  blue: 'bg-blue-100 text-blue-600 border-blue-200',
  pink: 'bg-pink-100 text-pink-600 border-pink-200',
  orange: 'bg-orange-100 text-orange-600 border-orange-200',
  purple: 'bg-purple-100 text-purple-600 border-purple-200',
  indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
  red: 'bg-red-100 text-red-600 border-red-200',
};

export default function CustomerTimeline({ customerId }: CustomerTimelineProps) {
  const locale = useLocale() as 'en' | 'ar';
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchTimeline();
  }, [customerId]);

  const fetchTimeline = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/admin/customers/${customerId}/timeline`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTimelineData(data.data);
      }
    } catch (error) {
      console.error('Error fetching timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
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

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return locale === 'en' ? `${minutes}m ago` : `منذ ${minutes} دقيقة`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return locale === 'en' ? `${hours}h ago` : `منذ ${hours} ساعة`;
    } else if (diffInHours < 24 * 7) {
      const days = Math.floor(diffInHours / 24);
      return locale === 'en' ? `${days}d ago` : `منذ ${days} يوم`;
    } else {
      return formatDate(dateString);
    }
  };

  const filteredTimeline = timelineData?.timeline.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  }) || [];

  const filterOptions = [
    { value: 'all', label: locale === 'en' ? 'All Activities' : 'جميع الأنشطة' },
    { value: 'order_placed', label: locale === 'en' ? 'Orders Placed' : 'الطلبات المقدمة' },
    { value: 'order_status_change', label: locale === 'en' ? 'Order Updates' : 'تحديثات الطلبات' },
    { value: 'order_delivered', label: locale === 'en' ? 'Deliveries' : 'التسليم' },
    { value: 'wishlist_added', label: locale === 'en' ? 'Wishlist' : 'المفضلة' },
    { value: 'cart_updated', label: locale === 'en' ? 'Cart Updates' : 'تحديثات السلة' },
    { value: 'promo_code_used', label: locale === 'en' ? 'Promo Codes' : 'أكواد الخصم' },
    { value: 'account_created', label: locale === 'en' ? 'Account' : 'الحساب' },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!timelineData) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-600">
            {locale === 'en' ? 'No timeline data available' : 'لا توجد بيانات زمنية متاحة'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {locale === 'en' ? 'Customer Timeline' : 'الجدول الزمني للعميل'}
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            {locale === 'en' 
              ? `${timelineData.stats.total_events} activities since joining`
              : `${timelineData.stats.total_events} نشاط منذ الانضمام`
            }
          </p>
        </div>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
        >
          {filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-neutral-50 rounded-lg">
        <div className="text-center">
          <div className="text-xl font-bold text-neutral-900">{timelineData.stats.orders_count}</div>
          <div className="text-xs text-neutral-600">{locale === 'en' ? 'Orders' : 'طلبات'}</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-600">{formatCurrency(timelineData.stats.total_spent)}</div>
          <div className="text-xs text-neutral-600">{locale === 'en' ? 'Total Spent' : 'إجمالي الإنفاق'}</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-neutral-900">{timelineData.stats.wishlist_count}</div>
          <div className="text-xs text-neutral-600">{locale === 'en' ? 'Wishlist' : 'مفضلة'}</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600">{timelineData.stats.days_since_joined}</div>
          <div className="text-xs text-neutral-600">{locale === 'en' ? 'Days Active' : 'أيام النشاط'}</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-neutral-900">{timelineData.stats.total_events}</div>
          <div className="text-xs text-neutral-600">{locale === 'en' ? 'Total Events' : 'إجمالي الأحداث'}</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {filteredTimeline.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-neutral-600">
              {locale === 'en' ? 'No activities found for this filter' : 'لم يتم العثور على أنشطة لهذا المرشح'}
            </p>
          </div>
        ) : (
          filteredTimeline.map((event, index) => {
            const IconComponent = iconMap[event.icon as keyof typeof iconMap] || Clock;
            const colorClass = colorMap[event.color as keyof typeof colorMap] || colorMap.blue;

            return (
              <div key={event.id} className="flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${colorClass}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  {index < filteredTimeline.length - 1 && (
                    <div className="w-0.5 h-8 bg-neutral-200 mt-2"></div>
                  )}
                </div>

                {/* Event content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900">{event.title}</h3>
                      <p className="text-sm text-neutral-600 mt-1">{event.description}</p>
                      
                      {/* Event-specific data */}
                      {event.type === 'order_placed' && event.data && (
                        <div className="mt-2 p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-neutral-600">
                              {locale === 'en' ? 'Order #:' : 'رقم الطلب:'}
                            </span>
                            <span className="font-medium">{event.data.order_number}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-neutral-600">
                              {locale === 'en' ? 'Total:' : 'الإجمالي:'}
                            </span>
                            <span className="font-medium">{formatCurrency(event.data.total_amount)}</span>
                          </div>
                          {event.data.discount_amount > 0 && (
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-neutral-600">
                                {locale === 'en' ? 'Discount:' : 'الخصم:'}
                              </span>
                              <span className="font-medium text-green-600">-{formatCurrency(event.data.discount_amount)}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">
                              {locale === 'en' ? 'Status:' : 'الحالة:'}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              event.data.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              event.data.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              event.data.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                              event.data.status === 'shipped' ? 'bg-indigo-100 text-indigo-700' :
                              event.data.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {event.data.status}
                            </span>
                          </div>
                          {event.data.is_gift && (
                            <div className="mt-2 p-2 bg-pink-50 rounded text-sm">
                              <span className="text-pink-600 font-medium">🎁 Gift Order</span>
                              {event.data.recipient_name && (
                                <div className="text-pink-700 mt-1">
                                  {locale === 'en' ? 'For:' : 'إلى:'} {event.data.recipient_name}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {(event.type === 'order_status_change' || event.type === 'order_assigned' || event.type === 'order_shipped') && event.data && (
                        <div className="mt-2 p-3 bg-neutral-50 rounded-lg">
                          <div className="text-sm">
                            <span className="text-neutral-600">
                              {locale === 'en' ? 'Order #:' : 'رقم الطلب:'}
                            </span>
                            <span className="font-medium ml-2">{event.data.order_number}</span>
                          </div>
                          {event.data.delivery_person && (
                            <div className="text-sm mt-1">
                              <span className="text-neutral-600">
                                {locale === 'en' ? 'Delivery Person:' : 'مندوب التوصيل:'}
                              </span>
                              <span className="font-medium ml-2">{event.data.delivery_person}</span>
                            </div>
                          )}
                          {event.data.tracking_number && (
                            <div className="text-sm mt-1">
                              <span className="text-neutral-600">
                                {locale === 'en' ? 'Tracking:' : 'رقم التتبع:'}
                              </span>
                              <span className="font-medium ml-2">{event.data.tracking_number}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {event.type === 'order_delivered' && event.data && (
                        <div className="mt-2 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-green-600">
                              {locale === 'en' ? 'Order #:' : 'رقم الطلب:'}
                            </span>
                            <span className="font-medium">{event.data.order_number}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-600">
                              {locale === 'en' ? 'Total:' : 'الإجمالي:'}
                            </span>
                            <span className="font-medium">{formatCurrency(event.data.total_amount)}</span>
                          </div>
                          {event.data.delivery_notes && (
                            <div className="mt-2 text-sm text-green-700">
                              <span className="font-medium">{locale === 'en' ? 'Notes:' : 'ملاحظات:'}</span>
                              <div className="mt-1">{event.data.delivery_notes}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {event.type === 'order_cancelled' && event.data && (
                        <div className="mt-2 p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-red-600">
                              {locale === 'en' ? 'Order #:' : 'رقم الطلب:'}
                            </span>
                            <span className="font-medium">{event.data.order_number}</span>
                          </div>
                          {event.data.admin_notes && (
                            <div className="text-sm text-red-700">
                              <span className="font-medium">{locale === 'en' ? 'Reason:' : 'السبب:'}</span>
                              <div className="mt-1">{event.data.admin_notes}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {event.type === 'promo_code_used' && event.data && (
                        <div className="mt-2 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-green-600">
                              {locale === 'en' ? 'Code:' : 'الكود:'}
                            </span>
                            <span className="font-medium">{event.data.promo_code}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-600">
                              {locale === 'en' ? 'Discount:' : 'الخصم:'}
                            </span>
                            <span className="font-medium">{formatCurrency(event.data.discount_amount)}</span>
                          </div>
                          {event.data.order_number && (
                            <div className="text-sm mt-1 text-green-700">
                              {locale === 'en' ? 'Used in order:' : 'مستخدم في الطلب:'} #{event.data.order_number}
                            </div>
                          )}
                        </div>
                      )}

                      {event.type === 'wishlist_added' && event.data && (
                        <div className="mt-2 p-3 bg-neutral-50 rounded-lg">
                          <div className="text-sm">
                            <span className="text-neutral-600">
                              {locale === 'en' ? 'Product:' : 'المنتج:'}
                            </span>
                            <span className="font-medium ml-2">{event.data.product_name}</span>
                          </div>
                          <div className="text-sm mt-1">
                            <span className="text-neutral-600">
                              {locale === 'en' ? 'Price:' : 'السعر:'}
                            </span>
                            <span className="font-medium ml-2">{formatCurrency(event.data.product_price)}</span>
                          </div>
                        </div>
                      )}

                      {event.type === 'cart_updated' && event.data && (
                        <div className="mt-2 p-3 bg-neutral-50 rounded-lg">
                          <div className="text-sm">
                            <span className="text-neutral-600">
                              {locale === 'en' ? 'Product:' : 'المنتج:'}
                            </span>
                            <span className="font-medium ml-2">{event.data.product_name}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm mt-1">
                            <span className="text-neutral-600">
                              {locale === 'en' ? 'Quantity:' : 'الكمية:'}
                            </span>
                            <span className="font-medium">{event.data.quantity}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-xs text-neutral-500">{getRelativeTime(event.created_at)}</div>
                      <div className="text-xs text-neutral-400 mt-1">{formatDate(event.created_at)}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}