'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Package, 
  ShoppingBasket, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import SARSymbol from '@/components/SARSymbol';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Stats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  totalProducts: number;
  productsChange: number;
}

interface RecentOrder {
  id: number;
  order_number: string;
  shipping_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    totalCustomers: 0,
    customersChange: 0,
    totalProducts: 0,
    productsChange: 0,
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        router.push(`/${locale}/login`);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Fetch orders
      const ordersRes = await fetch(`${API_BASE_URL}/orders`, { headers });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const orders = ordersData.data || [];
        
        setRecentOrders(orders.slice(0, 5));
        
        // Calculate stats from orders
        const totalRevenue = orders.reduce((sum: number, order: any) => 
          sum + parseFloat(order.total_amount || 0), 0
        );
        
        setStats(prev => ({
          ...prev,
          totalOrders: orders.length,
          totalRevenue: totalRevenue,
        }));
      }

      // Fetch products count
      const productsRes = await fetch(`${API_BASE_URL}/admin/products?per_page=1`, { headers });
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setStats(prev => ({
          ...prev,
          totalProducts: productsData.pagination?.total || 0,
        }));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: (
        <span className="flex items-center gap-1">
          {stats.totalRevenue.toLocaleString()} <SARSymbol className="w-5 h-5" />
        </span>
      ),
      change: stats.revenueChange,
      icon: DollarSign,
      color: 'bg-black',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: stats.ordersChange,
      icon: ShoppingBasket,
      color: 'bg-neutral-800',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      change: stats.customersChange,
      icon: Users,
      color: 'bg-neutral-700',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      change: stats.productsChange,
      icon: Package,
      color: 'bg-neutral-600',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-black animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-neutral-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white p-6 border border-neutral-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-2">{stat.title}</p>
                <div className="text-2xl font-bold text-black">{stat.value}</div>
              </div>
              <div className={`${stat.color} p-3 text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {stat.change >= 0 ? (
                <>
                  <ArrowUpRight className="w-4 h-4 text-black" />
                  <span className="text-sm font-medium text-black">+{stat.change}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-500">{stat.change}%</span>
                </>
              )}
              <span className="text-sm text-neutral-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row - Stripe Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart - Professional Style */}
        <div className="bg-white p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Revenue Trends</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-black rounded-full"></div>
                <span className="text-neutral-700">This Year</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-neutral-400 rounded-full"></div>
                <span className="text-neutral-700">Last Year</span>
              </div>
            </div>
          </div>
          
          <div className="relative h-64 bg-neutral-50 rounded-lg p-4">
            {/* Grid Lines */}
            <div className="absolute inset-4 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="border-t border-neutral-200 w-full"></div>
              ))}
            </div>
            
            {/* Y-axis Labels */}
            <div className="absolute left-0 top-4 h-full flex flex-col justify-between text-xs text-neutral-600 -ml-12">
              <span>100K</span>
              <span>75K</span>
              <span>50K</span>
              <span>25K</span>
              <span>0</span>
            </div>
            
            {/* Chart Area */}
            <div className="relative h-full ml-4 mr-4">
              <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(0, 0, 0)" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="rgb(0, 0, 0)" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="lastYearGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(115, 115, 115)" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="rgb(115, 115, 115)" stopOpacity="0.03" />
                  </linearGradient>
                </defs>
                
                {/* Last Year Area */}
                <path
                  d="M 0 160 L 33 140 L 66 150 L 99 130 L 132 145 L 165 135 L 198 125 L 231 140 L 264 130 L 297 120 L 330 125 L 363 115 L 400 110 L 400 200 L 0 200 Z"
                  fill="url(#lastYearGradient)"
                />
                <path
                  d="M 0 160 L 33 140 L 66 150 L 99 130 L 132 145 L 165 135 L 198 125 L 231 140 L 264 130 L 297 120 L 330 125 L 363 115 L 400 110"
                  fill="none"
                  stroke="rgb(115, 115, 115)"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
                
                {/* This Year Area */}
                <path
                  d="M 0 150 L 33 170 L 66 120 L 99 140 L 132 80 L 165 100 L 198 60 L 231 90 L 264 70 L 297 50 L 330 65 L 363 45 L 400 40 L 400 200 L 0 200 Z"
                  fill="url(#revenueGradient)"
                />
                <path
                  d="M 0 150 L 33 170 L 66 120 L 99 140 L 132 80 L 165 100 L 198 60 L 231 90 L 264 70 L 297 50 L 330 65 L 363 45 L 400 40"
                  fill="none"
                  stroke="rgb(0, 0, 0)"
                  strokeWidth="3"
                />
                
                {/* Data Points */}
                {[
                  { x: 0, y: 150 }, { x: 33, y: 170 }, { x: 66, y: 120 }, { x: 99, y: 140 },
                  { x: 132, y: 80 }, { x: 165, y: 100 }, { x: 198, y: 60 }, { x: 231, y: 90 },
                  { x: 264, y: 70 }, { x: 297, y: 50 }, { x: 330, y: 65 }, { x: 363, y: 45 }, 
                  { x: 400, y: 40 }
                ].map((point, i) => (
                  <circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="white"
                    stroke="rgb(0, 0, 0)"
                    strokeWidth="2"
                    className="hover:r-6 transition-all cursor-pointer"
                  />
                ))}
              </svg>
            </div>
            
            {/* X-axis Labels */}
            <div className="absolute bottom-0 left-4 right-4 flex justify-between text-xs text-neutral-600 mt-4">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                <span key={month} className="flex-1 text-center">
                  {month}
                </span>
              ))}
            </div>
          </div>
          
          {/* Chart Summary */}
          <div className="mt-6 pt-4 border-t border-neutral-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <p className="text-2xl font-bold text-black">+24%</p>
                <p className="text-sm text-neutral-600">Growth</p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <p className="text-2xl font-bold text-black flex items-center justify-center gap-1">
                  847K <SARSymbol className="w-5 h-5" />
                </p>
                <p className="text-sm text-neutral-600">Total Revenue</p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <p className="text-2xl font-bold text-black">12</p>
                <p className="text-sm text-neutral-600">Months</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 border border-neutral-200">
          <h2 className="text-xl font-bold text-black mb-4">Top Products</h2>
          <div className="space-y-4">
            {[
              { name: 'Luxury Gift Box', sales: 245, revenue: 24500 },
              { name: 'Premium Flowers', sales: 189, revenue: 18900 },
              { name: 'Chocolate Collection', sales: 156, revenue: 15600 },
              { name: 'Custom Gift Set', sales: 134, revenue: 13400 },
              { name: 'Seasonal Bouquet', sales: 98, revenue: 9800 },
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-black">{product.name}</p>
                  <p className="text-sm text-neutral-500">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black flex items-center justify-end gap-1">
                    {product.revenue.toLocaleString()} <SARSymbol className="w-4 h-4" />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-black">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    No recent orders
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {order.shipping_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      <span className="flex items-center gap-1">
                        {parseFloat(order.total_amount.toString()).toLocaleString()} <SARSymbol className="w-4 h-4" />
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
