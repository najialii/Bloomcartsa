'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, Search, Edit, Trash2, Eye, X, ChevronLeft, ChevronRight, 
  Package, AlertCircle, Loader2
} from 'lucide-react';
import { adminApi, Product, ProductFilters, PaginatedResponse } from '@/lib/adminApi';
import SARSymbol from '@/components/SARSymbol';

export default function ProductsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'draft' | 'out-of-stock'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Temporarily skip authentication check for testing
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        console.warn('No auth token found - using public API for testing');
        // Don't return here, continue with public API
      }

      const filters: ProductFilters = {
        page: currentPage,
        per_page: itemsPerPage,
      };

      if (searchQuery) {
        filters.search = searchQuery;
      }

      if (selectedStatus !== 'all') {
        filters.status = selectedStatus;
      }

      // Note: Category filtering will be implemented in task 7
      // For now, we're just fetching with basic filters

      const response: PaginatedResponse<Product> = await adminApi.getProducts(filters);
      
      setProducts(response.data);
      setTotalPages(response.last_page);
      setTotalProducts(response.total);
      setCurrentPage(response.current_page);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      
      // Handle authentication errors
      if (err.status === 401 || err.message?.includes('Unauthenticated')) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('auth_token');
        router.push(`/${locale}/login`);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load products on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, itemsPerPage, searchQuery, selectedStatus]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
      case 'draft':
        return 'bg-amber-100 text-amber-800 border border-amber-300';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };
  
  const getStockColor = (quantity: number) => {
    if (quantity === 0) return 'text-red-600 font-semibold';
    if (quantity < 10) return 'text-amber-600 font-semibold';
    return 'text-emerald-600 font-semibold';
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Actions
  const handleView = (productId: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log('Navigating to view product:', productId);
    router.push(`/${locale}/admin/products/${productId}`);
  };

  const handleEdit = (productId: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log('Navigating to edit product:', productId);
    router.push(`/${locale}/admin/products/${productId}/edit`);
  };

  const handleDelete = (product: Product, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log('Opening delete modal for product:', product.id);
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      setDeleting(true);
      setError(null);
      setDeletingProductId(selectedProduct.id);
      
      // Optimistic update: remove product from UI immediately
      setProducts(prevProducts => prevProducts.filter(p => p.id !== selectedProduct.id));
      
      // Close modal
      setShowDeleteModal(false);
      
      const response = await adminApi.deleteProduct(selectedProduct.id);
      
      // Show success message
      setSuccessMessage(`Product "${selectedProduct.name}" deleted successfully`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
      
      setSelectedProduct(null);
      setDeletingProductId(null);
      
      // Refresh the product list to ensure consistency
      await fetchProducts();
      
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      
      // Revert optimistic update on error
      await fetchProducts();
      
      setShowDeleteModal(false);
      setSelectedProduct(null);
      setDeletingProductId(null);
    } finally {
      setDeleting(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Products</h1>
          <p className="text-neutral-600 mt-1">Manage your product inventory</p>
        </div>
        <Link
          href={`/${locale}/admin/products/add`}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 p-4 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-green-900">Success</h3>
            <p className="text-sm text-green-700 mt-1">{successMessage}</p>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-600 hover:text-green-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 border border-neutral-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 focus:outline-none focus:border-black"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-neutral-300 focus:outline-none focus:border-black"
          >
            <option value="all">All Categories</option>
            <option value="Flowers">Flowers</option>
            <option value="Gift Boxes">Gift Boxes</option>
            <option value="Chocolates">Chocolates</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as 'all' | 'active' | 'draft' | 'out-of-stock');
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-neutral-300 focus:outline-none focus:border-black"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors"
          >
            <X className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all') && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-neutral-600">Active filters:</span>
            {searchQuery && (
              <span className="px-3 py-1 bg-neutral-100 text-sm">
                Search: "{searchQuery}"
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-3 py-1 bg-neutral-100 text-sm">
                Category: {selectedCategory}
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="px-3 py-1 bg-neutral-100 text-sm">
                Status: {selectedStatus}
              </span>
            )}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="mt-4 flex items-center gap-2 text-neutral-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading products...</span>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-12 h-12 text-neutral-300 mx-auto mb-3 animate-spin" />
                    <p className="text-neutral-600 font-medium">Loading products...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-600 font-medium">No products found</p>
                    <p className="text-sm text-neutral-500 mt-1">Try adjusting your filters or add a new product</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                <tr 
                  key={product.id} 
                  className={`hover:bg-neutral-50 transition-colors ${
                    deletingProductId === product.id ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-md"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<svg class="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                              }
                            }}
                          />
                        ) : (
                          <Package className="w-7 h-7 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {product.subcategory?.category?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center gap-1 text-sm font-bold text-gray-900">
                      {Number(product.price).toFixed(2)} <SARSymbol className="w-4 h-4" />
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${getStockColor(product.stock_quantity)}`}>
                      {product.stock_quantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(product.status)}`}>
                      {product.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleView(product.id, e)}
                        className="group relative p-2.5 text-blue-600 hover:bg-blue-50 transition-all rounded-lg border border-transparent hover:border-blue-200"
                        title="View Product"
                        type="button"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          View
                        </span>
                      </button>
                      <button
                        onClick={(e) => handleEdit(product.id, e)}
                        className="group relative p-2.5 text-emerald-600 hover:bg-emerald-50 transition-all rounded-lg border border-transparent hover:border-emerald-200"
                        title="Edit Product"
                        type="button"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          Edit
                        </span>
                      </button>
                      <button
                        onClick={(e) => handleDelete(product, e)}
                        className="group relative p-2.5 text-red-600 hover:bg-red-50 transition-all rounded-lg border border-transparent hover:border-red-200"
                        title="Delete Product"
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          Delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalProducts > 0 && (
          <div className="px-6 py-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-4 py-2 transition-colors ${
                          currentPage === page
                            ? 'bg-black text-white'
                            : 'border border-neutral-300 hover:bg-neutral-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 py-2 text-neutral-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-black mb-4">Delete Product</h3>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to delete "{selectedProduct.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
