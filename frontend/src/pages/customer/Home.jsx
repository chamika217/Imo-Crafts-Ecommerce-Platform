import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Phone } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../../components/ui/ProductCard';
import resin1 from '../../assets/resin1.jpg';
import resin2 from '../../assets/resin2.jpg';
import resin3 from '../../assets/resin3.jpg';

const API_URL = import.meta.env.VITE_API_URL;

const heroImages = [resin1, resin2, resin3];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/featured`);
        setFeaturedProducts(res.data.slice(0, 8));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { name: 'Handmade Gifts', emoji: '🎁', id: 'handmade-gifts' },
    { name: 'Event & Party', emoji: '🎉', id: 'event-crafts' },
    { name: 'Home Decor', emoji: '🏡', id: 'home-decor' },
    { name: 'Custom Orders', emoji: '✨', id: 'custom-orders' },
  ];

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 50%, #FFE0B2 100%)', width: '100%', padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px', alignItems: 'center' }}>

            {/* Left - Text */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '8px 16px', borderRadius: '999px', fontSize: '14px', fontWeight: '500', marginBottom: '24px' }}>
                <span>🎨</span> Handcrafted with Love in Sri Lanka
              </div>
              <h1 style={{ fontSize: '56px', fontWeight: '800', color: '#111827', lineHeight: '1.2', marginBottom: '24px' }}>
                Unique Handmade<br />
                <span style={{ color: '#8B4513' }}>Crafts & Gifts</span>
              </h1>
              <p style={{ fontSize: '18px', color: '#6B7280', maxWidth: '520px', marginBottom: '40px', lineHeight: '1.7' }}>
                Discover beautifully crafted handmade items, personalized gifts, and custom
                decorations for every special occasion. Made with love, delivered island-wide.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
                <Link
                  to="/shop"
                  style={{ background: 'linear-gradient(135deg, #8B4513, #A0522D)', color: 'white', padding: '14px 36px', borderRadius: '999px', fontWeight: '600', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', boxShadow: '0 4px 15px rgba(139,69,19,0.3)' }}
                >
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link
                  to="/custom-order"
                  style={{ border: '2px solid #8B4513', color: '#8B4513', padding: '14px 36px', borderRadius: '999px', fontWeight: '600', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', backgroundColor: 'transparent' }}
                >
                  Custom Order
                </Link>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
                {[
                  { value: '500+', label: 'Happy Customers' },
                  { value: '1000+', label: 'Orders Delivered' },
                  { value: '50+', label: 'Craft Designs' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#8B4513' }}>{stat.value}</div>
                    <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Image Carousel */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100%', height: '100%', background: 'linear-gradient(135deg, #D4A574, #8B4513)', borderRadius: '32px', opacity: 0.15, zIndex: 0 }} />
              <div style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(139,69,19,0.2)', aspectRatio: '4/5', backgroundColor: 'white' }}>
                {heroImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Resin art ${i + 1}`}
                    style={{
                      position: 'absolute',
                      top: 0, left: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      opacity: currentImage === i ? 1 : 0,
                      transition: 'opacity 1s ease-in-out',
                    }}
                  />
                ))}
              </div>
              {/* Dots */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '20px' }}>
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    style={{
                      width: currentImage === i ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '999px',
                      border: 'none',
                      backgroundColor: currentImage === i ? '#8B4513' : '#E5D5C5',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section style={{ borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', backgroundColor: 'white', padding: '24px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { icon: <Truck size={22} />, title: 'Island-wide Delivery', desc: 'We deliver across Sri Lanka' },
              { icon: <Shield size={22} />, title: 'Cash on Delivery', desc: 'Pay safely when you receive' },
              { icon: <Phone size={22} />, title: 'Custom Orders', desc: 'Personalized just for you' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFF3E0', color: '#8B4513', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1F2937', fontSize: '15px' }}>{f.title}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '2px' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '64px 0', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1F2937', marginBottom: '8px' }}>Shop by Category</h2>
            <p style={{ color: '#9CA3AF' }}>Find the perfect handmade item for every occasion</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {categories.map((cat, i) => (
              <Link key={i} to={`/shop?category=${cat.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #F3F4F6', transition: 'all 0.2s', cursor: 'pointer' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{cat.emoji}</div>
                  <div style={{ fontWeight: '600', color: '#1F2937', fontSize: '14px' }}>{cat.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '64px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' }}>Featured Products</h2>
              <p style={{ color: '#9CA3AF' }}>Our most loved handmade creations</p>
            </div>
            <Link to="/shop" style={{ color: '#8B4513', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', textDecoration: 'none' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ backgroundColor: '#F3F4F6', borderRadius: '16px', aspectRatio: '1', animation: 'pulse 2s infinite' }} />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', backgroundColor: '#F9FAFB', borderRadius: '24px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎨</div>
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Products Coming Soon!</p>
              <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>We're adding our beautiful handmade items</p>
              <Link to="/custom-order" style={{ backgroundColor: '#8B4513', color: 'white', padding: '12px 32px', borderRadius: '999px', fontWeight: '500', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Place a Custom Order <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '64px 0', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1F2937' }}>Why Choose Imo Crafts?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { emoji: '💝', title: 'Made with Love', desc: 'Every piece is handcrafted with care, passion, and attention to detail.' },
              { emoji: '⭐', title: 'Premium Quality', desc: 'We use high quality materials to ensure lasting beauty and durability.' },
              { emoji: '🎯', title: 'Fully Personalized', desc: 'Custom designs tailored specifically to your needs and preferences.' },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '32px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{item.emoji}</div>
                <h3 style={{ fontWeight: '700', color: '#1F2937', fontSize: '18px', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #8B4513, #A0522D)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '700', color: 'white', marginBottom: '16px' }}>Need Something Special?</h2>
          <p style={{ color: '#FDE68A', fontSize: '18px', marginBottom: '40px', lineHeight: '1.6' }}>
            We create personalized handmade crafts for birthdays, weddings,
            anniversaries, and all your special occasions.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/custom-order"
              style={{ backgroundColor: 'white', color: '#8B4513', padding: '14px 36px', borderRadius: '999px', fontWeight: '600', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
            >
              Request Custom Order <ArrowRight size={18} />
            </Link>
            <Link
              to="/shop"
              style={{ border: '2px solid white', color: 'white', padding: '14px 36px', borderRadius: '999px', fontWeight: '600', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;