import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, getCategories } from '../../slices/productSlice';
import { addToCart } from '../../slices/cartSlice';
import {
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiPackage,
  FiStar,
  FiHeart,
  FiShoppingCart,
  FiChevronDown,
  FiX,
  FiSliders,
  FiCheck,
} from 'react-icons/fi';

// ============================================================================
// ENTERPRISE CATALOG PAGE - Clean SaaS Design
// ============================================================================

// Skeleton Components
const ProductCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
    <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
      <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-gray-100 rounded animate-pulse w-20" />
        <div className="h-8 bg-gray-100 rounded animate-pulse w-16" />
      </div>
    </div>
  </div>
);

const ProductRowSkeleton = () => (
  <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
    <div className="w-20 h-20 bg-gray-100 rounded-lg animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
      <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
    </div>
    <div className="h-8 bg-gray-100 rounded animate-pulse w-24" />
  </div>
);

// Format currency in INR
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Dummy Products
const dummyProducts = [
  {
    _id: '1',
    name: 'Sony A7 IV Camera',
    description: 'Professional mirrorless camera with 33MP full-frame sensor',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'],
    pricing: { daily: 2500, weekly: 15000, monthly: 50000 },
    ratings: { average: 4.9, count: 128 },
    category: 'Cameras',
    condition: 'Like New',
    availability: true,
  },
  {
    _id: '2',
    name: 'MacBook Pro 16"',
    description: 'M3 Pro chip, 18GB RAM, 512GB SSD - Perfect for professionals',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
    pricing: { daily: 3500, weekly: 20000, monthly: 70000 },
    ratings: { average: 4.8, count: 96 },
    category: 'Electronics',
    condition: 'Excellent',
    availability: true,
  },
  {
    _id: '3',
    name: 'DJI Mavic 3 Pro',
    description: 'Professional drone with 4/3 CMOS Hasselblad camera',
    images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400'],
    pricing: { daily: 4500, weekly: 25000, monthly: 90000 },
    ratings: { average: 4.9, count: 74 },
    category: 'Electronics',
    condition: 'New',
    availability: true,
  },
  {
    _id: '4',
    name: 'Canon RF 70-200mm f/2.8L',
    description: 'Professional telephoto lens IS USM',
    images: ['https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400'],
    pricing: { daily: 1800, weekly: 10000, monthly: 35000 },
    ratings: { average: 4.7, count: 52 },
    category: 'Cameras',
    condition: 'Excellent',
    availability: false,
  },
  {
    _id: '5',
    name: 'JBL PartyBox 710',
    description: 'Powerful party speaker with 800W output and LED lights',
    images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400'],
    pricing: { daily: 2000, weekly: 12000, monthly: 40000 },
    ratings: { average: 4.6, count: 89 },
    category: 'Audio',
    condition: 'Good',
    availability: true,
  },
  {
    _id: '6',
    name: 'Bosch Power Drill Set',
    description: 'Professional cordless drill with 50+ accessories',
    images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400'],
    pricing: { daily: 500, weekly: 3000, monthly: 10000 },
    ratings: { average: 4.5, count: 145 },
    category: 'Tools',
    condition: 'Good',
    availability: true,
  },
  {
    _id: '7',
    name: 'Herman Miller Aeron Chair',
    description: 'Ergonomic office chair with full adjustability',
    images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400'],
    pricing: { daily: 800, weekly: 5000, monthly: 18000 },
    ratings: { average: 4.8, count: 67 },
    category: 'Furniture',
    condition: 'Excellent',
    availability: true,
  },
  {
    _id: '8',
    name: 'GoPro Hero 12 Black',
    description: 'Waterproof action camera with 5.3K video recording',
    images: ['https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=400'],
    pricing: { daily: 1200, weekly: 7000, monthly: 25000 },
    ratings: { average: 4.7, count: 203 },
    category: 'Cameras',
    condition: 'Like New',
    availability: true,
  },
  {
    _id: '9',
    name: 'Sony PlayStation 5',
    description: 'Next-gen gaming console with DualSense controller',
    images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400'],
    pricing: { daily: 1500, weekly: 8000, monthly: 28000 },
    ratings: { average: 4.9, count: 312 },
    category: 'Electronics',
    condition: 'Excellent',
    availability: true,
  },
  {
    _id: '10',
    name: 'Projector Epson Pro',
    description: '4K projector with 3000 lumens, perfect for events',
    images: ['https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400'],
    pricing: { daily: 2200, weekly: 13000, monthly: 45000 },
    ratings: { average: 4.6, count: 78 },
    category: 'Electronics',
    condition: 'Good',
    availability: true,
  },
  {
    _id: '11',
    name: 'Camping Tent 6-Person',
    description: 'Waterproof family tent with easy setup',
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400'],
    pricing: { daily: 600, weekly: 3500, monthly: 12000 },
    ratings: { average: 4.4, count: 156 },
    category: 'Outdoor',
    condition: 'Good',
    availability: true,
  },
  {
    _id: '12',
    name: 'Electric Scooter',
    description: 'Foldable e-scooter with 40km range',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    pricing: { daily: 700, weekly: 4000, monthly: 14000 },
    ratings: { average: 4.5, count: 89 },
    category: 'Transport',
    condition: 'Like New',
    availability: false,
  },
];

// Categories
const categories = [
  'All Categories',
  'Electronics',
  'Cameras',
  'Audio',
  'Tools',
  'Furniture',
  'Outdoor',
  'Transport',
];

// Conditions
const conditions = ['All Conditions', 'New', 'Like New', 'Excellent', 'Good'];

// Sort Options
const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
];

// Product Card Component
const ProductCard = ({ product, onAddToCart }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all duration-200">
      {/* Image Container */}
      <Link to={`/customer/products/${product._id}`} className="block relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {!imageError && product.images?.[0] ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
            <img
              src={product.images[0]}
              alt={product.name}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiPackage className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* Availability Badge */}
        {!product.availability && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-3 py-1 bg-white text-gray-900 text-xs font-medium rounded-full">
              Currently Unavailable
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isLiked
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Category & Condition */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="px-2 py-1 text-xs font-medium bg-white/90 text-gray-700 rounded">
            {product.category}
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-gray-900/80 text-white rounded">
            {product.condition}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/customer/products/${product._id}`}>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 hover:text-gray-700">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <FiStar className="w-3.5 h-3.5 text-amber-400 fill-current" />
          <span className="text-xs font-medium text-gray-700">
            {product.ratings?.average?.toFixed(1) || '4.5'}
          </span>
          <span className="text-xs text-gray-400">
            ({product.ratings?.count || 0} reviews)
          </span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div>
            <span className="text-base font-bold text-gray-900">
              {formatCurrency(product.pricing?.daily || 0)}
            </span>
            <span className="text-xs text-gray-500">/day</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.availability || isAdding}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              isAdding
                ? 'bg-emerald-100 text-emerald-700'
                : product.availability
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isAdding ? (
              <>
                <FiCheck className="w-3.5 h-3.5" />
                Added
              </>
            ) : (
              <>
                <FiShoppingCart className="w-3.5 h-3.5" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Product Row Component (List View)
const ProductRow = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all">
      {/* Image */}
      <Link to={`/customer/products/${product._id}`} className="flex-shrink-0">
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-gray-300" />
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link to={`/customer/products/${product._id}`}>
              <h3 className="text-sm font-semibold text-gray-900 hover:text-gray-700">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
              {product.description}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                <FiStar className="w-3 h-3 text-amber-400 fill-current" />
                <span className="text-xs text-gray-600">
                  {product.ratings?.average?.toFixed(1)}
                </span>
              </div>
              {!product.availability && (
                <span className="text-xs text-red-600">Unavailable</span>
              )}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-base font-bold text-gray-900">
              {formatCurrency(product.pricing?.daily || 0)}
              <span className="text-xs text-gray-500 font-normal">/day</span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.availability || isAdding}
              className={`mt-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                isAdding
                  ? 'bg-emerald-100 text-emerald-700'
                  : product.availability
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isAdding ? (
                <>
                  <FiCheck className="w-3.5 h-3.5" />
                  Added
                </>
              ) : (
                <>
                  <FiShoppingCart className="w-3.5 h-3.5" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Chip Component
const FilterChip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
    {label}
    <button onClick={onRemove} className="hover:text-gray-900">
      <FiX className="w-3 h-3" />
    </button>
  </span>
);

// Helper to capitalize first letter
const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Main Products Component
const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: storeProducts, pagination, isLoading } = useSelector((state) => state.products);

  // Get category from URL and convert to proper format
  const urlCategory = searchParams.get('category');
  const initialCategory = urlCategory ? capitalizeFirst(urlCategory) : 'All Categories';

  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: initialCategory,
    condition: searchParams.get('condition') || 'All Conditions',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    availability: searchParams.get('availability') !== 'false',
  });
  const [sortBy, setSortBy] = useState('relevance');

  // Update filters when URL changes
  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat) {
      setFilters(prev => ({ ...prev, category: capitalizeFirst(urlCat) }));
    }
  }, [searchParams]);

  useEffect(() => {
    dispatch(getProducts({ limit: 12 }));
    dispatch(getCategories());
  }, [dispatch]);

  // Use store products or dummy products
  const products = storeProducts?.length > 0 ? storeProducts : dummyProducts;

  // Apply filters and sorting
  const filteredProducts = products.filter((product) => {
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    // Case-insensitive category matching
    if (filters.category !== 'All Categories' && 
        product.category?.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }
    if (filters.condition !== 'All Conditions' && product.condition !== filters.condition) {
      return false;
    }
    if (filters.minPrice && product.pricing?.daily < Number(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && product.pricing?.daily > Number(filters.maxPrice)) {
      return false;
    }
    if (filters.availability && !product.availability) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.pricing?.daily || 0) - (b.pricing?.daily || 0);
      case 'price-high':
        return (b.pricing?.daily || 0) - (a.pricing?.daily || 0);
      case 'rating':
        return (b.ratings?.average || 0) - (a.ratings?.average || 0);
      default:
        return 0;
    }
  });

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1, duration: 1 }));
  };

  const clearFilter = (key) => {
    if (key === 'category') {
      setFilters({ ...filters, category: 'All Categories' });
    } else if (key === 'condition') {
      setFilters({ ...filters, condition: 'All Conditions' });
    } else {
      setFilters({ ...filters, [key]: '' });
    }
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      category: 'All Categories',
      condition: 'All Conditions',
      minPrice: '',
      maxPrice: '',
      availability: true,
    });
  };

  const activeFilters = [];
  if (filters.category !== 'All Categories') activeFilters.push({ key: 'category', label: filters.category });
  if (filters.condition !== 'All Conditions') activeFilters.push({ key: 'condition', label: filters.condition });
  if (filters.minPrice) activeFilters.push({ key: 'minPrice', label: `Min: ${formatCurrency(filters.minPrice)}` });
  if (filters.maxPrice) activeFilters.push({ key: 'maxPrice', label: `Max: ${formatCurrency(filters.maxPrice)}` });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Product Catalog</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filteredProducts.length} products available for rent
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 lg:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search products..."
              className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-lg 
                placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 h-10 px-4 text-sm font-medium rounded-lg border transition-colors ${
              showFilters || activeFilters.length > 0
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <FiSliders className="w-4 h-4" />
            Filters
            {activeFilters.length > 0 && (
              <span className="flex items-center justify-center w-5 h-5 text-xs bg-white text-gray-900 rounded-full">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 pl-3 pr-8 text-sm bg-white border border-gray-200 rounded-lg 
                appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Filter Products</h3>
            {activeFilters.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-medium text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full h-9 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Condition</label>
              <select
                value={filters.condition}
                onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                className="w-full h-9 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Min Price (₹)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                placeholder="0"
                className="w-full h-9 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Max Price (₹)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                placeholder="Any"
                className="w-full h-9 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Availability</label>
              <label className="flex items-center gap-2 h-9 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.availability}
                  onChange={(e) => setFilters({ ...filters, availability: e.target.checked })}
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
                <span className="text-sm text-gray-700">Available only</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Active filters:</span>
          {activeFilters.map((filter) => (
            <FilterChip
              key={filter.key}
              label={filter.label}
              onRemove={() => clearFilter(filter.key)}
            />
          ))}
        </div>
      )}

      {/* Products Grid/List */}
      {isLoading ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-2 lg:grid-cols-4 gap-4' 
          : 'space-y-3'
        }>
          {Array(8).fill(0).map((_, i) => 
            viewMode === 'grid' ? <ProductCardSkeleton key={i} /> : <ProductRowSkeleton key={i} />
          )}
        </div>
      ) : filteredProducts.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <ProductRow
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-lg">
          <FiPackage className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-base font-medium text-gray-900 mb-1">No products found</h3>
          <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or search term</p>
          {activeFilters.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-9 h-9 text-sm font-medium rounded-md transition-colors ${
                  page === 1
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
