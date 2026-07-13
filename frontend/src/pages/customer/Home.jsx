import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Phone, Star, Gift, PartyPopper, Home as HomeIcon, Sparkles } from 'lucide-react';
import axios from 'axios';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import ProductCard from '../../components/ui/ProductCard';
import SEO from '../../components/SEO';
import resin1 from '../../assets/resin1.jpg';
import resin2 from '../../assets/resin2.jpg';
import resin3 from '../../assets/resin3.jpg';
import handmadeGifts from '../../assets/handmade-gifts.jpg';
import eventParty from '../../assets/event-party.jpg';
import homeDecor from '../../assets/home-decor.jpg';
import customOrders from '../../assets/custom-orders.jpg';

const API_URL = import.meta.env.VITE_API_URL;
const heroImages = [resin1, resin2, resin3, handmadeGifts, eventParty, homeDecor];

const TestimonialsSection = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(
          collection(db, 'reviews'),
          where('approved', '==', true)
        );
        const snap = await getDocs(q);
        const data = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setReviews(data);
      } catch (e) { console.error('Testimonials fetch:', e); }
    };
    fetch();
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="animate-fade-in" style={{ padding: '64px 0', backgroundColor: 'white' }}>
      <div className="page-container">
        <div className="reviews-section-header">
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' }}>What Customers Say</h2>
            <p style={{ color: '#9CA3AF', margin: 0 }}>Real reviews from our happy customers</p>
          </div>
          <Link
            to="/reviews"
            className="hover-lift"
            style={{ color: '#8B4513', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '500', textDecoration: 'none', alignSelf: 'flex-start' }}
          >
            All Reviews <ArrowRight size={16} />
          </Link>
        </div>
        <div className="reviews-grid-home">
          {reviews.map((review) => (
            <div key={review.id} className="review-card" style={{ backgroundColor: '#FFFBF7', border: '1px solid #F3E8DC' }}>
              <div className="review-card-stars" style={{ justifyContent: 'flex-start', marginBottom: '16px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={s <= review.rating ? '#F59E0B' : 'none'}
                    stroke={s <= review.rating ? '#F59E0B' : '#E5E7EB'}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              {review.title && (
                <h3 className="review-card-title" style={{ marginBottom: '10px' }}>{review.title}</h3>
              )}
              <p className="review-card-quote">&ldquo;{review.review}&rdquo;</p>
              <div className="review-card-footer">
                <div className="review-card-avatar" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                  {review.customerName?.[0]?.toUpperCase() || 'A'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: '600', color: '#1F2937', fontSize: '14px' }}>{review.customerName}</div>
                  {review.productName && (
                    <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{review.productName}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // Cursor-following tilt effect for category cards
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleTilt = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const resetTilt = (e) => {
      const card = e.currentTarget;
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    // Add tilt effect to category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('mousemove', handleTilt);
      card.addEventListener('mouseleave', resetTilt);
    });

    // Add mouse tracking for promo banners
    const promoBanners = document.querySelectorAll('.promo-banner');
    promoBanners.forEach(banner => {
      banner.addEventListener('mousemove', (e) => {
        const rect = banner.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        banner.style.setProperty('--mouse-x', `${x}%`);
        banner.style.setProperty('--mouse-y', `${y}%`);
      });
    });

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      categoryCards.forEach(card => {
        card.removeEventListener('mousemove', handleTilt);
        card.removeEventListener('mouseleave', resetTilt);
      });
      promoBanners.forEach(banner => {
        banner.removeEventListener('mousemove', () => {});
      });
    };
  }, []);

  const categories = [
    { 
      name: 'Handmade Gifts', 
      icon: Gift, 
      id: 'handmade-gifts',
      image: handmadeGifts,
      subtitle: 'Personalized & Unique',
      badge: 'Popular'
    },
    { 
      name: 'Event & Party', 
      icon: PartyPopper, 
      id: 'event-crafts',
      image: eventParty,
      subtitle: 'Celebration Essentials',
      badge: 'New'
    },
    { 
      name: 'Home Decor', 
      icon: HomeIcon, 
      id: 'home-decor',
      image: homeDecor,
      subtitle: 'Beautiful & Artistic',
      badge: 'Trending'
    },
    { 
      name: 'Custom Orders', 
      icon: Sparkles, 
      id: 'custom-orders',
      image: customOrders,
      subtitle: 'Made Just for You',
      badge: 'Special'
    },
  ];

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <SEO
        title="Home — Shop Handmade Crafts"
        description="Shop handmade resin art, personalized gifts, home decor and custom crafts. Browse our featured collection and place your order online."
        url="/home"
      />

      {/* Hero Section */}
      <section className="hero-gradient-bg" style={{ width: '100%', padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Floating decorative elements */}
        <div className="hero-floating-element" style={{ width: '300px', height: '300px', top: '-100px', right: '-100px', animationDelay: '0s' }} />
        <div className="hero-floating-element" style={{ width: '200px', height: '200px', bottom: '-50px', left: '-50px', animationDelay: '2s' }} />
        <div className="hero-floating-element" style={{ width: '150px', height: '150px', top: '50%', right: '10%', animationDelay: '4s' }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          <div className="grid-hero">

            {/* Left - Text */}
            <div className="animate-fade-in-up">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(139, 69, 19, 0.1)', color: '#8B4513', padding: '8px 16px', borderRadius: '999px', fontSize: '14px', fontWeight: '600', marginBottom: '24px', backdropFilter: 'blur(10px)', border: '1px solid rgba(139, 69, 19, 0.2)' }}>
                <Sparkles size={14} /> Handcrafted with Love in Sri Lanka
              </div>
              <h1 className="hero-title animate-fade-in-up-delay1" style={{ marginBottom: '24px' }}>
                Unique Handmade<br />
                Crafts & Gifts
              </h1>
              <p className="animate-fade-in-up-delay2" style={{ fontSize: '18px', color: '#6B7280', maxWidth: '520px', marginBottom: '40px', lineHeight: '1.7' }}>
                Discover beautifully crafted handmade items, personalized gifts, and custom
                decorations for every special occasion. Made with love, delivered island wide.
              </p>
              <div className="animate-fade-in-up-delay3" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
                <Link
                  to="/shop"
                  className="hover-lift"
                  style={{ background: 'linear-gradient(135deg, #8B4513, #A0522D)', color: 'white', padding: '14px 36px', borderRadius: '999px', fontWeight: '600', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', boxShadow: '0 8px 25px rgba(139,69,19,0.4)' }}
                >
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link
                  to="/custom-order"
                  style={{ border: '2px solid #8B4513', color: '#8B4513', padding: '14px 36px', borderRadius: '999px', fontWeight: '600', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}
                >
                  Custom Order
                </Link>
              </div>

              {/* Stats */}
              <div className="animate-fade-in-up-delay4" style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
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
            <div className="animate-scale-in animate-float-slow" style={{ position: 'relative' }}>
              <div className="animate-float-medium" style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100%', height: '100%', background: 'linear-gradient(135deg, #D4A574, #8B4513)', borderRadius: '32px', opacity: 0.15, zIndex: 0 }} />
              <div className="hero-image-wrapper" style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 80px rgba(139,69,19,0.3)', aspectRatio: '4/5', backgroundColor: 'white' }}>
                {heroImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Handmade craft ${i + 1}`}
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
      <section style={{ borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', backgroundColor: 'white', padding: '32px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div className="grid-3-col" style={{ gap: '20px' }}>
            {[
              { icon: <Truck size={24} />, title: 'Island-wide Delivery', desc: 'We deliver across Sri Lanka' },
              { icon: <Shield size={24} />, title: 'Cash on Delivery', desc: 'Pay safely when you receive' },
              { icon: <Phone size={24} />, title: 'Custom Orders', desc: 'Personalized just for you' },
            ].map((f, i) => (
              <div key={i} className="feature-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '20px', backgroundColor: '#FFFBF7', border: '1px solid #F3E8DC' }}>
                <div className="feature-card-icon-wrapper" style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#FFF3E0', color: '#8B4513', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: '#1F2937', fontSize: '16px' }}>{f.title}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '80px 0', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#1F2937', marginBottom: '12px' }}>Shop by Category</h2>
            <p style={{ fontSize: '16px', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto' }}>Find the perfect handmade item for every occasion</p>
          </div>
          <div className="grid-4-col" style={{ gap: '24px' }}>
            {categories.map((cat, i) => (
              <Link key={i} to={`/shop?category=${cat.id}`} className="category-card-link">
                <div className="category-card">
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="category-card-image"
                  />
                  <div className="category-card-overlay" />
                  <div className="category-card-icon">
                    <cat.icon size={28} />
                  </div>
                  <div className="category-card-badge">{cat.badge}</div>
                  <div className="category-card-content">
                    <div className="category-card-label">{cat.name}</div>
                    <div className="category-card-subtitle">{cat.subtitle}</div>
                  </div>
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
            <div className="grid-4-col">
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ backgroundColor: '#F3F4F6', borderRadius: '16px', aspectRatio: '1' }} />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid-4-col items-stretch" style={{ gap: '16px' }}>
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', backgroundColor: '#F9FAFB', borderRadius: '24px' }}>
              <Sparkles size={48} style={{ margin: '0 auto 16px', color: '#D1D5DB' }} />
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
      <section style={{ padding: '80px 0', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#1F2937', marginBottom: '12px' }}>Why Choose Imo Crafts?</h2>
            <p style={{ fontSize: '16px', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto' }}>Experience the difference of truly handcrafted quality</p>
          </div>
          <div className="grid-3-col" style={{ gap: '32px' }}>
            {[
              { icon: <Truck size={28} />, title: 'Made with Love', desc: 'Every piece is handcrafted with care, passion, and attention to detail.' },
              { icon: <Star size={28} />, title: 'Premium Quality', desc: 'We use high quality materials to ensure lasting beauty and durability.' },
              { icon: <Sparkles size={28} />, title: 'Fully Personalized', desc: 'Custom designs tailored specifically to your needs and preferences.' },
            ].map((item, i) => (
              <div key={i} className="why-choose-card" style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px 32px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                <div className="feature-card-icon-wrapper" style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#FFF3E0', color: '#8B4513', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: '700', color: '#1F2937', fontSize: '20px', marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.7' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Promotional Banner */}
      <section style={{ padding: '64px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

            {/* Banner 1 - Custom Orders */}
            <div className="promo-banner" style={{ background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="promo-banner-shimmer" />
              <div className="animate-float-slow" style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
              <div className="animate-float-medium" style={{ position: 'absolute', bottom: '-40px', right: '40px', width: '120px', height: '120px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
              <div style={{ position: 'relative', zIndex: 3 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', marginBottom: '16px', backdropFilter: 'blur(10px)' }}>
                  <Sparkles size={12} /> Special Order
                </div>
                <h3 style={{ color: 'white', fontSize: '24px', fontWeight: '700', lineHeight: '1.3', marginBottom: '10px' }}>
                  Custom Crafts<br />Just for You
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', lineHeight: '1.6' }}>
                  Tell us your vision, we'll create it
                </p>
              </div>
              <Link to="/custom-order" style={{ position: 'relative', zIndex: 3, display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'white', color: '#8B4513', padding: '12px 24px', borderRadius: '999px', fontWeight: '600', fontSize: '14px', textDecoration: 'none', alignSelf: 'flex-start', marginTop: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                Order Now <ArrowRight size={14} />
              </Link>
            </div>

            {/* Banner 2 - Free delivery */}
            <div className="promo-banner" style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE8CC 50%, #FFE0B2 100%)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #FFD5A0' }}>
              <div className="promo-banner-shimmer" />
              <div className="animate-float-slow" style={{ position: 'absolute', top: '-20px', right: '-20px', width: '140px', height: '140px', backgroundColor: 'rgba(139,69,19,0.08)', borderRadius: '50%' }} />
              <div style={{ position: 'relative', zIndex: 3 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', marginBottom: '16px', border: '1px solid rgba(146, 64, 14, 0.2)' }}>
                  <Truck size={12} /> Delivery
                </div>
                <h3 style={{ color: '#1F2937', fontSize: '24px', fontWeight: '700', lineHeight: '1.3', marginBottom: '10px' }}>
                  Island-wide<br />Delivery
                </h3>
                <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>
                  Cash on delivery — pay when you receive
                </p>
              </div>
              <Link to="/shop" style={{ position: 'relative', zIndex: 3, display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #8B4513, #A0522D)', color: 'white', padding: '12px 24px', borderRadius: '999px', fontWeight: '600', fontSize: '14px', textDecoration: 'none', alignSelf: 'flex-start', marginTop: '16px', boxShadow: '0 4px 15px rgba(139,69,19,0.3)' }}>
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 0', background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)', backgroundSize: '200% 200%', animation: 'heroGradientShift 10s ease infinite', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative elements */}
        <div className="hero-floating-element" style={{ width: '400px', height: '400px', top: '-200px', left: '-100px', animationDelay: '1s', opacity: 0.1 }} />
        <div className="hero-floating-element" style={{ width: '300px', height: '300px', bottom: '-150px', right: '-100px', animationDelay: '3s', opacity: 0.1 }} />
        
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: '42px', fontWeight: '800', color: 'white', marginBottom: '20px', lineHeight: '1.2' }}>Need Something Special?</h2>
          <p style={{ color: '#FDE68A', fontSize: '18px', marginBottom: '48px', lineHeight: '1.7', maxWidth: '700px', margin: '0 auto 48px' }}>
            We create personalized handmade crafts for birthdays, weddings,
            anniversaries, and all your special occasions.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/custom-order"
              className="hover-lift"
              style={{ backgroundColor: 'white', color: '#8B4513', padding: '16px 40px', borderRadius: '999px', fontWeight: '700', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', boxShadow: '0 8px 25px rgba(0,0,0,0.2)' }}
            >
              Request Custom Order <ArrowRight size={18} />
            </Link>
            <Link
              to="/shop"
              className="hover-lift"
              style={{ border: '2px solid white', color: 'white', padding: '16px 40px', borderRadius: '999px', fontWeight: '700', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
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