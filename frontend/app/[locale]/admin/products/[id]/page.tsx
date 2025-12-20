'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Calendar,
  Tag,
  DollarSign,
  Box,
  AlertCircle,
} from 'lucide-react';
import { adminApi, Product } from '@/lib/adminApi';
import SARSymbol from '@/components/SARSymbol';

export default function ProductViewPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const productIdParam = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Parse product ID as number
  const productId = parseInt(productIdParam, 10);

  // Validate product ID
  const isValidId = !isNaN(productId) && productId > 0;

  // Fetch product data
  useEffect(() => {
    if (!isValidId) {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Temporarily skip authentication check for testing
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (!token) {
          console.warn('No auth token found - using public API for testing');
          // Don't return here, continue with public API
        }

        console.log('Fetching product:', productId);
        const data = await adminApi.getProduct(productId);
        console.log('Product data received:', data);
        setProduct(data);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        
        // Handle authentication errors
        if (err.status === 401 || err.message?.includes('Unauthenticated')) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('auth_token');
          router.push(`/${locale}/login`);
        } else if (err.status === 404) {
          setError('Product not found');
        } else {
          setError(err.message || 'Failed to load product');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, isValidId, router, locale]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-black text-white';
      case 'draft':
        return 'bg-neutral-200 text-neutral-900';
      case 'out-of-stock':
        return 'bg-neutral-400 text-white';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await adminApi.deleteProduct(productId);
      router.push(`/${locale}/admin/products`);
    } catch (err: any) {
      console.error('Error deleting product:', err);
      alert(err.message || 'Failed to delete product');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-neutral-200 rounded"></div>
            <div>
              <div className="h-8 w-64 bg-neutral-200 rounded mb-2"></div>
              <div className="h-4 w-32 bg-neutral-200 rounded"></div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-20 bg-neutral-200 rounded"></div>
            <div className="h-10 w-24 bg-neutral-200 rounded"></div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 border border-neutral-200 rounded">
              <div className="h-6 w-32 bg-neutral-200 rounded mb-4"></div>
              <div className="w-full h-96 bg-neutral-100 rounded"></div>
            </div>
            <div className="bg-white p-6 border border-neutral-200 rounded">
              <div className="h-6 w-32 bg-neutral-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-neutral-200 rounded"></div>
                <div className="h-4 w-full bg-neutral-200 rounded"></div>
                <div className="h-4 w-3/4 bg-neutral-200 rounded"></div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 border border-neutral-200 rounded">
              <div className="h-6 w-24 bg-neutral-200 rounded mb-4"></div>
              <div className="h-8 w-32 bg-neutral-200 rounded"></div>
            </div>
            <div className="bg-white p-6 border border-neutral-200 rounded">
              <div className="h-6 w-24 bg-neutral-200 rounded mb-4"></div>
              <div className="h-12 w-full bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-black mb-2">
          {error === 'Product not found' ? 'Product Not Found' : 'Error Loading Product'}
        </h2>
        <p className="text-neutral-600 mb-6">
          {error || 'An unexpected error occurred'}
        </p>
        <Link
          href={`/${locale}/admin/products`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}/admin/products`}
            className="p-2 hover:bg-neutral-100 transition-colors rounded"
            title="Back to products"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-black">{product.name}</h1>
            <p className="text-neutral-600 mt-1">Product ID: {product.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/${locale}/admin/products/${product.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors rounded"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 transition-colors rounded"
            type="button"
            disabled={deleting}
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Image */}
          <div className="bg-white p-6 border border-neutral-200 rounded">
            <h2 className="text-xl font-bold text-black mb-4">Product Image</h2>
            {product.image_url ? (
              <div className="w-full h-96 relative border border-neutral-200 rounded overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <>
                <div className="w-full h-96 bg-neutral-100 flex items-center justify-center border border-neutral-200 rounded">
                  <Package className="w-24 h-24 text-neutral-300" />
                </div>
                <p className="text-sm text-neutral-500 mt-2">No image uploaded</p>
              </>
            )}
          </div>

          {/* Description */}
          <div className="bg-white p-6 border border-neutral-200 rounded">
            <h2 className="text-xl font-bold text-black mb-4">Description</h2>
            <p className="text-neutral-700 leading-relaxed">
              {product.description || 'No description available'}
            </p>
          </div>

          {/* Product Details */}
          <div className="bg-white p-6 border border-neutral-200 rounded">
            <h2 className="text-xl font-bold text-black mb-4">
              Product Details
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-neutral-600 mb-1 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  SKU
                </p>
                <p className="font-medium text-black">{product.sku}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Category
                </p>
                <p className="font-medium text-black">
                  {product.subcategory?.category?.name || 'N/A'}
                  {product.subcategory?.name && ` / ${product.subcategory.name}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1 flex items-center gap-2">
                  <Box className="w-4 h-4" />
                  Subcategory ID
                </p>
                <p className="font-medium text-black">{product.subcategory_id}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Slug
                </p>
                <p className="font-medium text-black">{product.slug}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white p-6 border border-neutral-200 rounded">
            <h2 className="text-xl font-bold text-black mb-4">Status</h2>
            <span
              className={`inline-block px-4 py-2 text-sm font-medium rounded ${getStatusColor(
                product.status
              )}`}
            >
              {product.status.toUpperCase().replace('-', ' ')}
            </span>
          </div>

          {/* Pricing */}
          <div className="bg-white p-6 border border-neutral-200 rounded">
            <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Pricing
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Current Price</p>
                <p className="text-3xl font-bold text-black flex items-center gap-2">
                  {Number(product.price).toFixed(2)} <SARSymbol className="w-7 h-7" />
                </p>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white p-6 border border-neutral-200 rounded">
            <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
              <Box className="w-5 h-5" />
              Inventory
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Stock Quantity</p>
                <p className="text-3xl font-bold text-black">
                  {product.stock_quantity} units
                </p>
              </div>
              {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                  <p className="text-sm text-orange-700 font-medium">
                    ⚠️ Low stock warning
                  </p>
                </div>
              )}
              {product.stock_quantity === 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-700 font-medium">
                    ❌ Out of stock
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white p-6 border border-neutral-200 rounded">
            <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Timestamps
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Created</p>
                <p className="text-sm font-medium text-black">
                  {formatDate(product.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Last Updated</p>
                <p className="text-sm font-medium text-black">
                  {formatDate(product.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-6 rounded">
            <h3 className="text-xl font-bold text-black mb-4">
              Delete Product
            </h3>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to delete "{product.name}"? This action
              cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors rounded"
                type="button"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
