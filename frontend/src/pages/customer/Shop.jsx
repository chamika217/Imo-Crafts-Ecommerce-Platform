import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Gift, PartyPopper, Home, Sparkles, Package } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../../components/ui/ProductCard';
import SEO from '../../components/SEO';

const API_URL = import.meta.env.VITE_API_URL;

const categories = [
  { id: '', name: 'All Products', icon: Package },
  { id: 'handmade-gifts', name: 'Handmade Gifts', icon: Gift },
  { id: 'event-crafts', name: 'Event & Party', icon: PartyPopper },
  { id: 'home-decor', name: 'Home & Decor', icon: Home },
  { id: 'custom-orders', name: 'Custom Orders', icon: Sparkles },
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
        const res = await axios.get(`${API_URL}/products`, { params });
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const filteredProducts = products
    .filter(p => searchQuery ? p.name?.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="w-full">
      <SEO
        title="Shop — Handmade Crafts & Gifts"
        description="Browse our full collection of handmade crafts, resin art, personalized gifts and home decor."
        url="/shop"
      />

      <section style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 100%)', padding: '48px 0' }}>
        <div className="page-container text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Our Products</h1>
          <p className="text-gray-500">Discover our beautiful collection of handmade crafts</p>
        </div>
      </section>

      <section className="py-10 bg-gray-50 min-h-[60vh]">
        <div className="page-container">

          {/* Search & Sort */}
          <div className="flex gap-3 mb-5 flex-wrap items-center">
            <div className="relative flex-1 min-w-[180px] max-w-xl">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text" placeholder="Search products..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-full text-sm outline-none bg-white focus:border-amber-400"
              />
            </div>
            <select
              value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-full text-sm outline-none bg-white cursor-pointer focus:border-amber-400"
            >
              <option value="latest">Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-7 flex-wrap">
            {categories.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  selectedCategory === id
                    ? 'bg-amber-700 text-white border-amber-700 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-700'
                }`}
              >
                <Icon size={14} />
                {name}
              </button>
            ))}
          </div>

          {/* Products */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl aspect-square animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <p className="text-sm text-gray-400 mb-5">{filteredProducts.length} products found</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Package size={56} className="mx-auto mb-4 text-gray-200" />
              <p className="text-xl font-semibold text-gray-700 mb-2">No products found</p>
              <p className="text-gray-400">Try a different search or category</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
