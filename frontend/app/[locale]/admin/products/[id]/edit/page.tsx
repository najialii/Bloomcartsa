'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SARSymbol from '@/components/SARSymbol';

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const productId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Luxury Rose Bouquet',
    description: 'A stunning arrangement of premium roses.',
    category: 'flowers',
    price: '450',
    stock: '25',
    sku: 'FLW-001',
    status: 'active',
  });

  // Log for debugging
  console.log('Product Edit Page - Product ID:', productId);

  // Validate product ID
  if (!productId) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-medium">Invalid product ID</p>
        <Link
          href={`/${locale}/admin/products`}
          className="text-black underline mt-4 inline-block"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Product updated successfully!');
      router.push(`/${locale}/admin/products/${productId}`);
    } catch (error) {
      alert('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/admin/products/${productId}`}
          className="p-2 hover:bg-neutral-100 transition-colors rounded"
          title="Back to product view"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-black">Edit Product</h1>
          <p className="text-neutral-600 mt-1">Update product information</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 border border-neutral-200 rounded">
            <h2 className="text-xl font-bold text-black mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-black"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-black"
                  placeholder="Enter product description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-black"
                  placeholder="Enter SKU"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white p-6 border border-neutral-200 rounded">
            <h2 className="text-xl font-bold text-black mb-4">
              Pricing & Inventory
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2 flex items-center gap-1">
                  Price <SARSymbol className="w-4 h-4" /> *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-black"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-black"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <div className="bg-white p-6 border border-neutral-200 rounded">
            <h2 className="text-xl font-bold text-black mb-4">Category</h2>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-black"
            >
              <option value="">Select category</option>
              <option value="flowers">Flowers</option>
              <option value="gift-boxes">Gift Boxes</option>
              <option value="chocolates">Chocolates</option>
            </select>
          </div>

          {/* Status */}
          <div className="bg-white p-6 border border-neutral-200 rounded">
            <h2 className="text-xl font-bold text-black mb-4">Status</h2>
            <select
              required
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-black"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          {/* Actions */}
          <div className="bg-white p-6 border border-neutral-200 rounded">
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white px-6 py-3 rounded hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Product'}
              </button>
              <Link
                href={`/${locale}/admin/products/${productId}`}
                className="block w-full text-center px-6 py-3 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
