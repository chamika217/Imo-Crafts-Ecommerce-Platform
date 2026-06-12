import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../../components/ui/ProductCard';

const API_URL = import.meta.env.VITE_API_URL;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('latest');

  const categories = [
    { id: '', name: 'All Products' },
    { id: 'handmade-gifts', name: '🎁 Handmade Gifts' },
    { id: 'event-crafts', name: '🎉 Event & Party' },
    { id: 'home-decor', name: '🏡 Home & Decor' },
    { id: 'custom-orders', name: '✨ Custom Orders' },
  ];

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
    <div style={{ width: '100%', overflowX: 'hidden' }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 100%)', padding: '48px 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>Our Products</h1>
          <p style={{ fontSize: '16px', color: '#6B7280' }}>Discover our beautiful collection of handmade crafts</p>
        </div>
      </section>

      <section style={{ padding: '40px 0', backgroundColor: '#F9FAFB', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

          {/* Search & Sort */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                type="text" placeholder="Search products..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 44px', border: '1.5px solid #E5E7EB', borderRadius: '999px', fontSize: '14px', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}
              />
            </div>
            <select
              value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '12px 20px', border: '1.5px solid #E5E7EB', borderRadius: '999px', fontSize: '14px', outline: 'none', backgroundColor: 'white', cursor: 'pointer' }}
            >
              <option value="latest">Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Categories */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                style={{ padding: '10px 20px', borderRadius: '999px', fontSize: '14px', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: selectedCategory === cat.id ? '#8B4513' : 'white', color: selectedCategory === cat.id ? 'white' : '#374151', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Products */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ backgroundColor: '#E5E7EB', borderRadius: '16px', aspectRatio: '1' }} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px' }}>{filteredProducts.length} products found</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>No products found</p>
              <p style={{ color: '#9CA3AF' }}>Try a different search or category</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
// chore: update 71 - 2026-06-10T23:11:42

// chore: update 140 - 2026-06-12T18:26:04
