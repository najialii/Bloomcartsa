'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Package, Truck, CheckCircle, MapPin, Calendar, 
  CreditCard, User, Mail, Phone, Edit, Save, X, Loader2, AlertCircle 
} from 'lucide-react';
import Price from '@/components/Price';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: string;
  product: {
    id: number;
    name: string;
    image_url?: string;
  };
}

interface Order {
  id: number;
  order_number: string;
  total_amount: string;
  status: string;
  created_at: string;
  shipping_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  items: OrderItem[];
  user_id?: number;
  is_gift?: boolean;
  gift_message?: string;
  recipient_name?: string;
  recipient_phone?: string;
  recipient_address?: string;
  sender_name?: string;
  tracking_number?: string;
  tracking_carrier?: string;
  admin_notes?: string;
  status_updated_at?: string;
}

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200' },
];

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingCarrier, setTrackingCarrier] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        router.push(`/${locale}/login`);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error('Failed to fetch order');
      }

      setOrder(data.data);
      setNewStatus(data.data.status);
      setTrackingNumber(data.data.tracking_number || '');
      setTrackingCarrier(data.data.tracking_carrier || '');
      setAdminNotes(data.data.admin_notes || '');
    } catch (err) {
      console.error('Order fetch error:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!order || newStatus === order.status) {
      setEditingStatus(false);
      return;
    }

    try {
      setUpdating(true);
      setError('');
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${API_BASE_URL}/admin/orders/${order.id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          tracking_number: trackingNumber,
          tracking_carrier: trackingCarrier,
          admin_notes: adminNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      setOrder({ 
        ...order, 
        status: newStatus,
        tracking_number: trackingNumber,
        tracking_carrier: trackingCarrier,
        admin_notes: adminNotes,
      });
      setEditingStatus(false);
      setSuccessMessage('Order status updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Status update error:', err);
      setError(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusObj = ORDER_STATUSES.find(s => s.value === status);
    return statusObj?.color || 'bg-neutral-100 text-neutral-700 border-neutral-200';
  };

  const getStatusLabel = (status: string) => {
    const statusObj = ORDER_STATUSES.find(s => s.value === status);
    return statusObj?.label || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-black animate-spin" />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.push(`/${locale}/admin/orders`)}
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>
        <div className="bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const subtotal = order.items.reduce((sum, item) => sum + (parseFloat(item.price_at_purchase) * item.quantity), 0);
  const shipping = 10.00;
  const total = parseFloat(order.total_amount);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/${locale}/admin/orders`)}
        className="inline-flex items-center gap-2 text-neutral-600 hover:text-black transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Orders</span>
      </button>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-green-900">Success</h3>
            <p className="text-sm text-green-700 mt-1">{successMessage}</p>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-green-600 hover:text-green-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Order Details</h1>
          <p className="text-neutral-600 mt-1">Order #{order.order_number}</p>
        </div>
        
        {/* Status Editor */}
        <div className="flex items-center gap-3">
          {!editingStatus && (
            <>
              <div className={`inline-flex items-center gap-2 px-4 py-2 border font-medium ${getStatusColor(order.status)}`}>
                <CheckCircle className="w-5 h-5" />
                <span>{getStatusLabel(order.status)}</span>
              </div>
              <button
                onClick={() => setEditingStatus(true)}
                className="flex items-center gap-2 px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Manage Order
              </button>
            </>
          )}
        </div>
      </div>

      {/* Status Editor Modal */}
      {editingStatus && (
        <div className="bg-white border border-neutral-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Update Order Status</h2>
            <button
              onClick={() => {
                setEditingStatus(false);
                setNewStatus(order.status);
                setTrackingNumber(order.tracking_number || '');
                setTrackingCarrier(order.tracking_carrier || '');
                setAdminNotes(order.admin_notes || '');
              }}
              disabled={updating}
              className="p-2 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Order Status *
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                disabled={updating}
              >
                {ORDER_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g., TRK-123456"
                className="w-full px-4 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                disabled={updating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Carrier / Shipping Company
              </label>
              <input
                type="text"
                value={trackingCarrier}
                onChange={(e) => setTrackingCarrier(e.target.value)}
                placeholder="e.g., DHL, FedEx, SMSA"
                className="w-full px-4 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                disabled={updating}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-2">
                Admin Notes (Internal)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes about this order..."
                rows={4}
                className="w-full px-4 py-2 border border-neutral-300 focus:outline-none focus:border-black resize-none"
                disabled={updating}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleStatusUpdate}
              disabled={updating}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {updating ? 'Updating...' : 'Update Order'}
            </button>
            <button
              onClick={() => {
                setEditingStatus(false);
                setNewStatus(order.status);
                setTrackingNumber(order.tracking_number || '');
                setTrackingCarrier(order.tracking_carrier || '');
                setAdminNotes(order.admin_notes || '');
              }}
              disabled={updating}
              className="px-6 py-3 border border-neutral-300 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white border border-neutral-200 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-neutral-100 last:border-0">
                  <div className="w-20 h-20 bg-neutral-100 flex-shrink-0 overflow-hidden">
                    {item.product?.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-neutral-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{item.product?.name || 'Product'}</h3>
                    <p className="text-sm text-neutral-600 mb-2">Quantity: {item.quantity}</p>
                    <Price amount={item.price_at_purchase} className="font-semibold" />
                  </div>
                  
                  <div className="text-right">
                    <Price amount={parseFloat(item.price_at_purchase) * item.quantity} className="font-bold" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white border border-neutral-200 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-neutral-600 mt-0.5" />
                <div>
                  <div className="text-sm text-neutral-600 mb-1">Name</div>
                  <div className="font-medium">{order.shipping_name}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-neutral-600 mt-0.5" />
                <div>
                  <div className="text-sm text-neutral-600 mb-1">Email</div>
                  <div className="font-medium">{order.shipping_email}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-neutral-600 mt-0.5" />
                <div>
                  <div className="text-sm text-neutral-600 mb-1">Phone</div>
                  <div className="font-medium">{order.shipping_phone}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-neutral-600 mt-0.5" />
                <div>
                  <div className="text-sm text-neutral-600 mb-1">Order Date</div>
                  <div className="font-medium">
                    {new Date(order.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Information */}
          {(order.tracking_number || order.tracking_carrier) && (
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Tracking Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.tracking_number && (
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Tracking Number</div>
                    <div className="font-mono font-semibold">{order.tracking_number}</div>
                  </div>
                )}
                
                {order.tracking_carrier && (
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Carrier</div>
                    <div className="font-semibold">{order.tracking_carrier}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admin Notes */}
          {order.admin_notes && (
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="text-xl font-bold mb-4">Admin Notes</h2>
              <div className="p-4 bg-neutral-50 border border-neutral-200 text-sm whitespace-pre-wrap">
                {order.admin_notes}
              </div>
            </div>
          )}

          {/* Gift Information */}
          {order.is_gift && (
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="text-xl font-bold mb-6">Gift Information</h2>
              
              <div className="space-y-4">
                {order.sender_name && (
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">From</div>
                    <div className="font-medium">{order.sender_name}</div>
                  </div>
                )}
                
                {order.recipient_name && (
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">To</div>
                    <div className="font-medium">{order.recipient_name}</div>
                  </div>
                )}
                
                {order.recipient_phone && (
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Recipient Phone</div>
                    <div className="font-medium">{order.recipient_phone}</div>
                  </div>
                )}
                
                {order.gift_message && (
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Gift Message</div>
                    <div className="p-4 bg-neutral-50 border border-neutral-200 italic">
                      "{order.gift_message}"
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-white border border-neutral-200 p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 pb-4 border-b border-neutral-200">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <Price amount={subtotal} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Shipping</span>
                <Price amount={shipping} />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <Price amount={total} className="text-2xl font-bold" />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-neutral-200 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h2>

            <div className="text-sm space-y-1">
              <div className="font-semibold">{order.shipping_name}</div>
              <div className="text-neutral-600">{order.shipping_address}</div>
              <div className="text-neutral-600">
                {order.shipping_city}, {order.shipping_postal_code}
              </div>
              <div className="text-neutral-600">{order.shipping_country}</div>
              <div className="text-neutral-600 pt-2">{order.shipping_phone}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full py-3 bg-black text-white font-medium hover:bg-neutral-800 transition-colors">
              Print Invoice
            </button>
            <button className="w-full py-3 border border-neutral-300 font-medium hover:bg-neutral-50 transition-colors">
              Send Email to Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
