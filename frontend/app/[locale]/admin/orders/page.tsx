'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Search, Filter, Download, Eye, Package, Loader2, 
  CheckSquare, Square, Truck, X, Save, AlertCircle, User, MessageCircle 
} from 'lucide-react';
import SARSymbol from '@/components/SARSymbol';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Order {
  id: number;
  order_number: string;
  shipping_name: string;
  shipping_email: string;
  total_amount: number;
  status: string;
  items: any[];
  created_at: string;
  delivery_person?: {
    id: number;
    name: string;
    phone: string;
  };
  assigned_at?: string;
}

interface DeliveryPerson {
  id: number;
  name: string;
  phone: string;
  telegram_chat_id: string | null;
  telegram_username: string | null;
  is_active: boolean;
  pending_orders_count: number;
}

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function OrdersPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Delivery assignment states
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<Order | null>(null);
  const [deliveryPersonnel, setDeliveryPersonnel] = useState<DeliveryPerson[]>([]);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [assigningDelivery, setAssigningDelivery] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchDeliveryPersonnel();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        router.push(`/${locale}/login`);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
      } else if (response.status === 401) {
        router.push(`/${locale}/login`);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryPersonnel = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/admin/delivery-personnel/active/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDeliveryPersonnel(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching delivery personnel:', error);
    }
  };

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedOrders.length === 0) {
      setErrorMessage('Please select at least one order');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    setBulkAction(action);
    setShowBulkModal(true);
  };

  const executeBulkAction = async () => {
    if (!bulkAction || selectedOrders.length === 0) return;

    try {
      setBulkUpdating(true);
      setErrorMessage('');
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${API_BASE_URL}/admin/orders/bulk-update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_ids: selectedOrders,
          status: bulkAction,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update orders');
      }

      setSuccessMessage(`Successfully updated ${selectedOrders.length} order(s) to ${bulkAction}`);
      setTimeout(() => setSuccessMessage(''), 5000);
      
      setShowBulkModal(false);
      setSelectedOrders([]);
      setBulkAction('');
      
      // Refresh orders
      await fetchOrders();
    } catch (err: any) {
      console.error('Bulk update error:', err);
      setErrorMessage(err.message || 'Failed to update orders');
    } finally {
      setBulkUpdating(false);
    }
  };



  const bulkAssignDelivery = async () => {
    if (!selectedDeliveryPerson || selectedOrders.length === 0) return;

    try {
      setAssigningDelivery(true);
      setErrorMessage('');
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${API_BASE_URL}/admin/orders/bulk-notify-delivery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_ids: selectedOrders,
          delivery_person_id: selectedDeliveryPerson,
          delivery_notes: deliveryNotes,
          expires_in_minutes: 15
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send bulk delivery notifications');
      }

      setSuccessMessage(`Sent ${data.data.success_count} delivery notifications! ${data.data.failed_count > 0 ? `${data.data.failed_count} failed.` : ''}`);
      setTimeout(() => setSuccessMessage(''), 5000);
      
      setShowDeliveryModal(false);
      setSelectedOrders([]);
      setSelectedDeliveryPerson('');
      setDeliveryNotes('');
      
      // Refresh orders
      await fetchOrders();
    } catch (err: any) {
      console.error('Bulk delivery notification error:', err);
      setErrorMessage(err.message || 'Failed to send bulk delivery notifications');
    } finally {
      setAssigningDelivery(false);
    }
  };

  const openDeliveryModal = (order: Order) => {
    setSelectedOrderForDelivery(order);
    setSelectedDeliveryPerson('');
    setDeliveryNotes('');
    setShowDeliveryModal(true);
  };

  const assignDeliveryPerson = async () => {
    if (!selectedOrderForDelivery || !selectedDeliveryPerson) return;

    try {
      setAssigningDelivery(true);
      setErrorMessage('');
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${API_BASE_URL}/admin/orders/${selectedOrderForDelivery.id}/notify-delivery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          delivery_person_id: selectedDeliveryPerson,
          delivery_notes: deliveryNotes,
          expires_in_minutes: 15
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send delivery notification');
      }

      setSuccessMessage(`Delivery notification sent to delivery person! ${data.telegram_sent ? 'They will receive a Telegram message to accept or decline.' : 'Telegram notification failed.'}`);
      setTimeout(() => setSuccessMessage(''), 5000);
      
      setShowDeliveryModal(false);
      setSelectedOrderForDelivery(null);
      
      // Refresh orders
      await fetchOrders();
    } catch (err: any) {
      console.error('Delivery notification error:', err);
      setErrorMessage(err.message || 'Failed to send delivery notification');
    } finally {
      setAssigningDelivery(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'shipped':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border border-neutral-200';
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-black animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Orders</h1>
          <p className="text-neutral-600 mt-1">
            {selectedOrders.length > 0 
              ? `${selectedOrders.length} order(s) selected` 
              : 'Manage and track all orders'}
          </p>
        </div>
        <div className="flex gap-3">
          {selectedOrders.length > 0 && (
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkAction('processing')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Package className="w-4 h-4" />
                Mark Processing
              </button>
              <button 
                onClick={() => handleBulkAction('shipped')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                <Truck className="w-4 h-4" />
                Mark Shipped
              </button>
              <button 
                onClick={() => handleBulkAction('delivered')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <CheckSquare className="w-4 h-4" />
                Mark Delivered
              </button>
              <button 
                onClick={() => setShowDeliveryModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 transition-colors"
              >
                <User className="w-4 h-4" />
                Assign Delivery
              </button>
            </div>
          )}
          <button className="flex items-center gap-2 bg-black text-white px-6 py-3 hover:bg-neutral-800 transition-colors">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 p-4 flex items-start gap-3">
          <CheckSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
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
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-red-600 hover:text-red-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Status Tabs */}
      <div className="bg-white border border-neutral-200">
        <div className="flex overflow-x-auto">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`flex-1 min-w-[120px] px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                selectedStatus === status
                  ? 'border-black text-black'
                  : 'border-transparent text-neutral-600 hover:text-black'
              }`}
            >
              <div className="capitalize">{status.replace('-', ' ')}</div>
              <div className="text-lg font-bold mt-1">{count}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 border border-neutral-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 focus:outline-none focus:border-black"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-neutral-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={toggleSelectAll}
                    className="p-1 hover:bg-neutral-200 transition-colors rounded"
                  >
                    {selectedOrders.length === filteredOrders.length && filteredOrders.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-black" />
                    ) : (
                      <Square className="w-5 h-5 text-neutral-600" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Delivery Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-neutral-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className={`hover:bg-neutral-50 transition-colors ${
                      selectedOrders.includes(order.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleOrderSelection(order.id)}
                        className="p-1 hover:bg-neutral-200 transition-colors rounded"
                      >
                        {selectedOrders.includes(order.id) ? (
                          <CheckSquare className="w-5 h-5 text-black" />
                        ) : (
                          <Square className="w-5 h-5 text-neutral-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-black">{order.shipping_name}</p>
                        <p className="text-xs text-neutral-500">{order.shipping_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      <span className="flex items-center gap-1">
                        {parseFloat(order.total_amount.toString()).toLocaleString()} <SARSymbol className="w-4 h-4" />
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      N/A
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.delivery_person ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <CheckSquare className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Assigned</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-black">{order.delivery_person.name}</p>
                            <p className="text-xs text-neutral-500">{order.delivery_person.phone}</p>
                            {order.assigned_at && (
                              <p className="text-xs text-neutral-400">
                                {new Date(order.assigned_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            <span className="text-xs text-orange-600 font-medium">Unassigned</span>
                          </div>
                          <button
                            onClick={() => openDeliveryModal(order)}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors rounded"
                            disabled={order.status === 'delivered' || order.status === 'cancelled'}
                          >
                            <User className="w-3 h-3" />
                            Assign
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => router.push(`/${locale}/admin/orders/${order.id}`)}
                          className="p-2 hover:bg-neutral-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!order.delivery_person && (order.status === 'pending' || order.status === 'processing') && (
                          <button
                            onClick={() => openDeliveryModal(order)}
                            className="p-2 hover:bg-neutral-100 transition-colors text-orange-600"
                            title="Assign Delivery Person"
                          >
                            <User className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-black text-white">1</button>
            <button className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-black mb-4">Confirm Bulk Action</h3>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to update {selectedOrders.length} order(s) to status: 
              <span className="font-bold"> {bulkAction}</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkAction('');
                }}
                disabled={bulkUpdating}
                className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeBulkAction}
                disabled={bulkUpdating}
                className="px-4 py-2 bg-black text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {bulkUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                {bulkUpdating ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Assignment Modal */}
      {showDeliveryModal && (selectedOrderForDelivery || selectedOrders.length > 0) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-black mb-4">
              {selectedOrderForDelivery ? 'Assign Delivery Person' : `Bulk Assign Delivery (${selectedOrders.length} orders)`}
            </h3>
            
            {/* Order Info */}
            {selectedOrderForDelivery ? (
              <div className="bg-neutral-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-black mb-2">Order Details</h4>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium">Order #:</span> {selectedOrderForDelivery.order_number}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium">Customer:</span> {selectedOrderForDelivery.shipping_name}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium">Total:</span> {parseFloat(selectedOrderForDelivery.total_amount.toString()).toLocaleString()} SAR
                </p>
              </div>
            ) : (
              <div className="bg-neutral-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-black mb-2">Bulk Assignment</h4>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium">Selected Orders:</span> {selectedOrders.length}
                </p>
                <p className="text-sm text-neutral-600">
                  Delivery notifications will be sent to the selected delivery person for all orders.
                </p>
              </div>
            )}

            {/* Delivery Person Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-2">
                Select Delivery Person
              </label>
              <select
                value={selectedDeliveryPerson}
                onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                required
              >
                <option value="">Choose delivery person...</option>
                {deliveryPersonnel.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name} - {person.phone} 
                    {person.pending_orders_count > 0 && ` (${person.pending_orders_count} pending)`}
                    {person.telegram_chat_id && ' 📱'}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-2">
                Delivery Notes (Optional)
              </label>
              <textarea
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                rows={3}
                placeholder="Special delivery instructions..."
              />
            </div>

            {/* Selected Person Info */}
            {selectedDeliveryPerson && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                {(() => {
                  const person = deliveryPersonnel.find(p => p.id.toString() === selectedDeliveryPerson);
                  return person ? (
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {person.name}
                      </h4>
                      <p className="text-sm text-blue-700">📞 {person.phone}</p>
                      {person.telegram_chat_id && (
                        <p className="text-sm text-blue-700 flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          Telegram notification will be sent
                        </p>
                      )}
                      <p className="text-sm text-blue-700">
                        Current workload: {person.pending_orders_count} pending orders
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeliveryModal(false);
                  setSelectedOrderForDelivery(null);
                  setSelectedDeliveryPerson('');
                  setDeliveryNotes('');
                }}
                disabled={assigningDelivery}
                className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={selectedOrderForDelivery ? assignDeliveryPerson : bulkAssignDelivery}
                disabled={assigningDelivery || !selectedDeliveryPerson}
                className="px-4 py-2 bg-black text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {assigningDelivery && <Loader2 className="w-4 h-4 animate-spin" />}
                {assigningDelivery 
                  ? 'Sending...' 
                  : selectedOrderForDelivery 
                    ? 'Send Request' 
                    : `Send ${selectedOrders.length} Requests`
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
